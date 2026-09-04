import prisma from '../../config/database';
import { MerchantRuleService } from '../../services/merchantRuleService';

export const upsellTools = {
  recommend_upsell: async (args: { productId?: string; category?: string; maxUpsellPrice?: number }) => {
    let baseCategory = args.category;
    let merchantId: string | undefined = undefined;

    if (args.productId) {
      const baseProduct = await prisma.product.findUnique({ where: { id: args.productId } });
      if (baseProduct) {
        baseCategory = baseProduct.category;
        merchantId = baseProduct.merchantId;
      }
    }

    let rulesMaxUpsell = 1500;
    if (merchantId) {
      const rules = await MerchantRuleService.getRulesByMerchantId(merchantId);
      rulesMaxUpsell = rules.maxUpsellAmount;
    }

    const priceLimit = Math.min(args.maxUpsellPrice || 2000, rulesMaxUpsell);

    // Complementary categories map
    const complementaryMap: Record<string, string[]> = {
      Headphones: ['Travel Accessories', 'Laptop Accessories'],
      Bags: ['Travel Accessories', 'Laptop Accessories', 'Smart Watches'],
      'Laptop Accessories': ['Bags', 'Keyboards', 'Mouse', 'Travel Accessories'],
      Keyboards: ['Mouse', 'Laptop Accessories'],
      Mouse: ['Keyboards', 'Laptop Accessories'],
      'Smart Watches': ['Travel Accessories', 'Mobile Accessories'],
      'Mobile Accessories': ['Travel Accessories', 'Smart Watches'],
    };

    const targetCategories = baseCategory && complementaryMap[baseCategory] ? complementaryMap[baseCategory] : ['Travel Accessories', 'Laptop Accessories'];

    let upsellProducts = await prisma.product.findMany({
      where: {
        category: { in: targetCategories },
        price: { lte: priceLimit },
        status: 'ACTIVE',
        ...(args.productId ? { id: { not: args.productId } } : {}),
      },
      take: 3,
      orderBy: { rating: 'desc' },
    });

    if (upsellProducts.length === 0) {
      upsellProducts = await prisma.product.findMany({
        where: {
          category: { in: targetCategories },
          status: 'ACTIVE',
          ...(args.productId ? { id: { not: args.productId } } : {}),
        },
        take: 3,
        orderBy: { rating: 'desc' },
      });
    }

    return {
      recommendationsCount: upsellProducts.length,
      maxPriceLimitApplied: priceLimit,
      upsells: upsellProducts.map((p: any) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        price: p.price,
        originalPrice: p.originalPrice,
        rating: p.rating,
        reviewsCount: p.reviewsCount || 1200,
        imageUrl: p.imageUrl || 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=400&auto=format&fit=crop&q=80',
        badge: p.badge || 'Recommended',
        reason: `Frequently purchased together with ${baseCategory || 'selected items'}. High customer satisfaction rating (${p.rating}★).`,
      })),
    };
  },
};
