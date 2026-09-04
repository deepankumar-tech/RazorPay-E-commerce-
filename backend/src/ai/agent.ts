import { productTools } from './tools/productTools';
import { cartTools } from './tools/cartTools';
import { upsellTools } from './tools/upsellTools';
import { checkoutTools } from './tools/checkoutTools';
import { paymentTools } from './tools/paymentTools';
import { analyticsTools } from './tools/analyticsTools';
import prisma from '../config/database';
import { AuditService } from '../services/auditService';
import { env } from '../config/env';
import { generateGeminiContent } from './geminiClient';
import { sanitizeUtf8ForDb } from '../utils/sanitize';

export interface AgentProcessInput {
  userId: string;
  userQuery: string;
  conversationId?: string;
  cartId?: string;
  history?: any[];
}

export interface AgentResponse {
  text: string;
  recommendedProducts?: any[];
  upsellProducts?: any[];
  comparedProducts?: any[];
  checkoutProposal?: any;
  cartActionSuccess?: boolean;
  cartActionMessage?: string;
  cartSummary?: any;
  toolExecutions: any[];
  isAiFallback?: boolean;
}

export class CommerceAIAgent {
  static async processQuery(input: AgentProcessInput): Promise<AgentResponse> {
    const toolExecutions: any[] = [];
    const sanitizedQuery = sanitizeUtf8ForDb(input.userQuery);

    // 1. Ensure conversation record exists in DB
    let convId = input.conversationId;
    if (convId) {
      const existingConv = await prisma.aIConversation.findUnique({
        where: { id: convId },
      });
      if (!existingConv) {
        try {
          await prisma.aIConversation.create({
            data: {
              id: convId,
              userId: input.userId,
              title: sanitizedQuery.substring(0, 30),
            },
          });
        } catch {
          const newConv = await prisma.aIConversation.create({
            data: {
              userId: input.userId,
              title: sanitizedQuery.substring(0, 30),
            },
          });
          convId = newConv.id;
        }
      }
    } else {
      const newConv = await prisma.aIConversation.create({
        data: {
          userId: input.userId,
          title: sanitizedQuery.substring(0, 30),
        },
      });
      convId = newConv.id;
    }

    // Log in audit trail
    await AuditService.log({
      actorId: input.userId,
      actorType: 'CUSTOMER',
      action: 'PRODUCT_SEARCHED',
      resource: 'AIConversation',
      resourceId: convId,
      status: 'SUCCESS',
      reason: `User asked OLIVER.AI: "${sanitizedQuery}"`,
      metadata: { query: sanitizedQuery },
    });

    const queryLower = input.userQuery.toLowerCase().trim();

    // Reconstruct history context & extract recently discussed products
    let historyContext = '';
    let recentProducts: any[] = [];
    if (input.history && Array.isArray(input.history)) {
      historyContext = input.history
        .map((msg: any) => {
          if (msg.recommendedProducts && msg.recommendedProducts.length > 0) {
            recentProducts = msg.recommendedProducts;
          }
          const roleName = msg.sender === 'USER' ? 'User' : 'OLIVER.AI';
          return `${roleName}: ${msg.text}`;
        })
        .join('\n');
    }

    // -------------------------------------------------------------
    // INTENT & CLASSIFICATION VIA GEMINI AI
    // -------------------------------------------------------------
    let aiDecision: any = null;

    try {
      const classificationPrompt = `System: You are OLIVER.AI, an autonomous general-purpose AI assistant and e-commerce agent.
You understand natural language, answer general knowledge questions (e.g. AI explanations, UPI, jokes, programming, general advice), and perform real application actions when asked.

User Query: "${input.userQuery}"
Recent Conversation:
${historyContext || 'None'}

Categorize the user's request and respond strictly in valid JSON format:
{
  "intent": "GENERAL_KNOWLEDGE" | "PRODUCT_SEARCH" | "ADD_TO_CART" | "GET_CART" | "UPDATE_CART" | "REMOVE_FROM_CART" | "COMPARE" | "CHECKOUT" | "GET_ORDERS" | "NAVIGATE",
  "category": "Headphones" | "Laptop Accessories" | "Bags" | "Smart Watches" | "Keyboards" | "Mouse" | null,
  "searchQuery": string | null,
  "maxPrice": number | null,
  "targetIndex": number | null,
  "targetQuantity": number | null,
  "targetPage": string | null,
  "conversationalAnswer": string | null
}`;

      const aiResponse = await generateGeminiContent(classificationPrompt);
      if (aiResponse) {
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          aiDecision = JSON.parse(jsonMatch[0]);
        }
      }
    } catch (e) {
      console.warn('Gemini intent classification fallback:', e);
    }

    const intent = aiDecision?.intent || null;

    // -------------------------------------------------------------
    // 1. GENERAL KNOWLEDGE / CONVERSATION MODE
    // -------------------------------------------------------------
    if (
      intent === 'GENERAL_KNOWLEDGE' ||
      (aiDecision?.conversationalAnswer && intent !== 'PRODUCT_SEARCH' && intent !== 'ADD_TO_CART') ||
      queryLower.includes('what is artificial intelligence') ||
      queryLower.includes('explain upi') ||
      queryLower.includes('difference between ram and rom') ||
      queryLower.includes('tell me a joke') ||
      queryLower.includes('why is the sky blue') ||
      queryLower.includes('what is machine learning') ||
      queryLower.includes('what is blockchain') ||
      queryLower.includes('what does api mean')
    ) {
      let answer = aiDecision?.conversationalAnswer;
      if (!answer) {
        const genPrompt = `You are OLIVER.AI, a friendly, intelligent general-purpose AI assistant.
Answer the following user question naturally, warmly, and accurately:
"${input.userQuery}"

Keep your response concise, helpful, and easy to understand for voice synthesis.`;
        answer = await generateGeminiContent(genPrompt);
      }

      return {
        text: answer || `Here is what I found regarding "${input.userQuery}": I'm happy to help answer any general knowledge or shopping questions you have!`,
        toolExecutions: [],
      };
    }

    // -------------------------------------------------------------
    // 2. CHECK ORDERS
    // -------------------------------------------------------------
    if (intent === 'GET_ORDERS' || queryLower.includes('my orders') || queryLower.includes('order status') || queryLower.includes('where is my order') || queryLower.includes('track order')) {
      const userOrders = await prisma.order.findMany({
        where: { userId: input.userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      toolExecutions.push({ toolName: 'get_orders', arguments: { userId: input.userId }, result: { count: userOrders.length }, status: 'SUCCESS' });

      if (userOrders.length === 0) {
        return {
          text: "You haven't placed any orders yet! Explore our catalog and tell me what you'd like to find.",
          toolExecutions,
        };
      }

      const orderSummaries = userOrders
        .map((ord) => {
          const itemNames = ord.items.map((i) => i.product?.name || 'Item').join(', ');
          const dateStr = new Date(ord.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
          return `• **Order #${ord.orderNumber}** (${dateStr}) — **₹${ord.finalAmount.toLocaleString('en-IN')}** [Status: **${ord.status}**]\n  Items: ${itemNames}`;
        })
        .join('\n\n');

      return {
        text: `📋 **Your Recent Orders**:\n\n${orderSummaries}\n\nNeed assistance with tracking or returning any order? Just ask!`,
        toolExecutions,
      };
    }

    // -------------------------------------------------------------
    // 3. CHECK CART
    // -------------------------------------------------------------
    if (intent === 'GET_CART' || queryLower.includes("what's in my cart") || queryLower.includes('what is in my cart') || queryLower.includes('show my cart') || queryLower.includes('view my cart')) {
      const cartData = await cartTools.get_cart({ userId: input.userId });
      toolExecutions.push({ toolName: 'get_cart', arguments: { userId: input.userId }, result: cartData, status: 'SUCCESS' });

      if (cartData.itemCount === 0) {
        return {
          text: "Your cart is currently empty. 🛒 Tell me what you're looking for (e.g. *'Find headphones under ₹5,000'*) and I'll help you find the best options!",
          cartSummary: cartData,
          toolExecutions,
        };
      }

      const itemsList = cartData.items.map((i: any) => `• **${i.name}** (Qty: ${i.quantity}) — ₹${(i.price * i.quantity).toLocaleString('en-IN')}`).join('\n');
      return {
        text: `🛒 **Your Cart Summary** (${cartData.itemCount} items):\n\n${itemsList}\n\n**Total Amount**: ₹${cartData.finalAmount.toLocaleString('en-IN')}\n\nWould you like me to take you to checkout or change any quantities?`,
        cartSummary: cartData,
        toolExecutions,
      };
    }

    // -------------------------------------------------------------
    // 4. CHECKOUT
    // -------------------------------------------------------------
    if (intent === 'CHECKOUT' || queryLower.includes('checkout') || queryLower.includes('take me to checkout') || queryLower.includes('proceed to checkout') || queryLower.includes('pay now')) {
      const cartData = await cartTools.get_cart({ userId: input.userId });
      if (cartData.itemCount === 0) {
        return {
          text: "Your cart is currently empty. Please add items to your cart before proceeding to checkout!",
          toolExecutions: [],
        };
      }
      return {
        text: `Right away! You have **${cartData.itemCount} item(s)** in your cart totaling **₹${cartData.finalAmount.toLocaleString('en-IN')}**.\n\nOpening checkout page now to complete your payment safely with Razorpay and Transaction Guard verification!`,
        cartActionSuccess: true,
        cartActionMessage: "Ready for Checkout! ⚡ Opening checkout now.",
        cartSummary: cartData,
        toolExecutions,
      };
    }

    // -------------------------------------------------------------
    // 5. ADD TO CART
    // -------------------------------------------------------------
    const isAddToCart =
      intent === 'ADD_TO_CART' ||
      queryLower.includes('add to cart') ||
      queryLower.includes('add second') ||
      queryLower.includes('add first') ||
      queryLower.includes('add 1st') ||
      queryLower.includes('add 2nd') ||
      queryLower.includes('add 3rd') ||
      queryLower.includes('add this') ||
      queryLower.includes('add it') ||
      queryLower.includes('buy this item') ||
      (queryLower.startsWith('add ') && (queryLower.includes('cart') || queryLower.includes('two') || queryLower.includes('one') || queryLower.includes('item')));

    if (isAddToCart) {
      let targetProduct: any = null;
      let quantity = aiDecision?.targetQuantity || 1;

      const targetIdx = aiDecision?.targetIndex !== undefined && aiDecision?.targetIndex !== null ? aiDecision.targetIndex : (queryLower.includes('second') || queryLower.includes('2nd') ? 1 : queryLower.includes('third') || queryLower.includes('3rd') ? 2 : 0);

      targetProduct = recentProducts[targetIdx] || recentProducts[0];

      if (!targetProduct) {
        const searchRes = await productTools.search_products({ query: input.userQuery, limit: 1 });
        if (searchRes.products && searchRes.products.length > 0) {
          targetProduct = searchRes.products[0];
        }
      }

      if (targetProduct) {
        const addRes = await cartTools.add_to_cart({
          userId: input.userId,
          productId: targetProduct.id,
          quantity,
        });

        toolExecutions.push({
          toolName: 'add_to_cart',
          arguments: { userId: input.userId, productId: targetProduct.id, quantity },
          result: addRes,
          status: 'SUCCESS',
        });

        return {
          text: `Done! I've added **${targetProduct.name}** (Quantity: ${quantity}) at ₹${(targetProduct.price * quantity).toLocaleString('en-IN')} to your cart. 🛒\n\nWould you like to proceed to checkout or keep exploring?`,
          recommendedProducts: [targetProduct],
          cartActionSuccess: true,
          cartActionMessage: `Added ${targetProduct.name} to cart!`,
          cartSummary: addRes.cart,
          toolExecutions,
        };
      }
    }

    // -------------------------------------------------------------
    // 6. UPDATE / REMOVE FROM CART
    // -------------------------------------------------------------
    if (intent === 'UPDATE_CART' || queryLower.includes('change quantity') || queryLower.includes('update quantity')) {
      const cartData = await cartTools.get_cart({ userId: input.userId });
      if (cartData.items.length > 0) {
        const newQty = aiDecision?.targetQuantity || 2;
        const firstItem = cartData.items[0];
        const updateRes = await cartTools.update_cart({ userId: input.userId, itemId: firstItem.id, quantity: newQty });
        return {
          text: `Updated! I've changed the quantity of **${firstItem.name}** to **${newQty}**. Your updated cart total is **₹${updateRes.cartTotal.toLocaleString('en-IN')}**.`,
          cartActionSuccess: true,
          cartActionMessage: `Updated quantity to ${newQty}`,
          cartSummary: updateRes.cart,
          toolExecutions: [{ toolName: 'update_cart', arguments: { itemId: firstItem.id, quantity: newQty }, result: updateRes, status: 'SUCCESS' }],
        };
      }
    }

    if (intent === 'REMOVE_FROM_CART' || (queryLower.includes('remove') && queryLower.includes('cart'))) {
      const cartData = await cartTools.get_cart({ userId: input.userId });
      if (cartData.items.length > 0) {
        const firstItem = cartData.items[0];
        const removeRes = await cartTools.remove_from_cart({ userId: input.userId, itemId: firstItem.id });
        return {
          text: `Removed **${firstItem.name}** from your cart. Your updated total is **₹${removeRes.cartTotal.toLocaleString('en-IN')}**.`,
          cartActionSuccess: true,
          cartActionMessage: `Removed ${firstItem.name}`,
          cartSummary: removeRes.cart,
          toolExecutions: [{ toolName: 'remove_from_cart', arguments: { itemId: firstItem.id }, result: removeRes, status: 'SUCCESS' }],
        };
      }
    }

    // -------------------------------------------------------------
    // 7. COMPARE PRODUCTS
    // -------------------------------------------------------------
    if ((intent === 'COMPARE' || queryLower.includes('compare') || queryLower.includes('difference between')) && recentProducts.length >= 2) {
      const compareIds = recentProducts.slice(0, 3).map((p) => p.id);
      const compareRes = await productTools.compare_products({ productIds: compareIds });
      const comparedProducts = compareRes.products || [];

      toolExecutions.push({
        toolName: 'compare_products',
        arguments: { productIds: compareIds },
        result: compareRes,
        status: 'SUCCESS',
      });

      const comparePrompt = `Compare these products clearly for OLIVER.AI voice synthesis:
${comparedProducts.map((p) => `- ${p.name}: ₹${p.price}, Rating: ${p.rating}★, Description: ${p.description}`).join('\n')}

Highlight key differences (Price, Rating, Features) and make a recommendation.`;

      const text = await generateGeminiContent(comparePrompt);
      return {
        text: text || `Here is a comparison of **${comparedProducts[0]?.name}** vs **${comparedProducts[1]?.name}**.`,
        recommendedProducts: recentProducts.slice(0, 3),
        comparedProducts,
        toolExecutions,
      };
    }

    // -------------------------------------------------------------
    // 8. PRODUCT SEARCH & RECOMMENDATION MODE
    // -------------------------------------------------------------
    let category = aiDecision?.category;
    let maxPrice = aiDecision?.maxPrice;
    const searchQuery = aiDecision?.searchQuery || input.userQuery;

    if (!category) {
      if (queryLower.includes('headphone') || queryLower.includes('earbud') || queryLower.includes('earphone') || queryLower.includes('audio')) {
        category = 'Headphones';
      } else if (queryLower.includes('bag') || queryLower.includes('backpack')) {
        category = 'Bags';
      } else if (queryLower.includes('stand') || queryLower.includes('hub') || queryLower.includes('sleeve') || queryLower.includes('laptop')) {
        category = 'Laptop Accessories';
      } else if (queryLower.includes('keyboard')) {
        category = 'Keyboards';
      } else if (queryLower.includes('mouse') || queryLower.includes('mice')) {
        category = 'Mouse';
      } else if (queryLower.includes('watch') || queryLower.includes('smartwatch')) {
        category = 'Smart Watches';
      }
    }

    if (maxPrice === undefined || maxPrice === null) {
      const priceMatch =
        input.userQuery.match(/under\s*₹?\s*([\d,]+)/i) ||
        input.userQuery.match(/below\s*₹?\s*([\d,]+)/i) ||
        input.userQuery.match(/less\s*than\s*₹?\s*([\d,]+)/i) ||
        input.userQuery.match(/budget\s*(?:of)?\s*₹?\s*([\d,]+)/i);

      if (priceMatch) {
        maxPrice = parseInt(priceMatch[1].replace(/,/g, ''), 10);
      }
    }

    const searchArgs = { query: searchQuery, category, maxPrice, limit: 4 };
    const searchRes = await productTools.search_products(searchArgs);
    let found = searchRes.products || [];

    if (maxPrice !== undefined && maxPrice !== null) {
      found = found.filter((p: any) => p.price <= maxPrice);
    }

    if (found.length === 0) {
      const altSearch = await productTools.search_products({ category, limit: 4 });
      found = altSearch.products || [];
    }

    let recommendedProducts: any[] = [];
    if (found.length > 0) {
      recommendedProducts = found.slice(0, 4).map((p: any, idx: number) => ({
        ...p,
        isPrimaryRecommendation: idx === 0,
        suggestionType: idx === 0 ? 'PRIMARY_PICK' : 'ALTERNATE_SUGGESTION',
        suggestionLabel: idx === 0 ? '🏆 Top Recommendation' : `🏷️ Option ${idx + 1}`,
        recommendationReason: idx === 0
          ? `Fits your ₹${(maxPrice || p.price).toLocaleString('en-IN')} budget with a ${p.rating}★ rating.`
          : `Alternate choice matching your preferences.`,
      }));

      toolExecutions.push({
        toolName: 'search_products',
        arguments: searchArgs,
        result: searchRes,
        status: 'SUCCESS',
      });
    }

    // Synthesize natural AI response
    const synthesisPrompt = `You are OLIVER.AI, an expert AI shopping copilot.
User Query: "${input.userQuery}"
Recent Conversation:
${historyContext || 'None'}

Found Products:
${recommendedProducts.map((p, i) => `${i + 1}. ${p.name} - ₹${p.price} (${p.rating}★)`).join('\n')}

Provide a friendly, concise, natural response explaining the top recommendations or answering the user query.`;

    const responseText = await generateGeminiContent(synthesisPrompt);

    return {
      text: responseText || (recommendedProducts.length > 0
        ? `Here are the top options matching your search for **"${input.userQuery}"**:`
        : `I'm here to help! Could you tell me what type of item or price range you are looking for?`),
      recommendedProducts,
      toolExecutions,
    };
  }
}
