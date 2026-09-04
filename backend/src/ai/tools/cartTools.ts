import { CartService } from '../../services/cartService';

export const cartTools = {
  get_cart: async (args: { userId: string }) => {
    const cart = await CartService.getOrCreateCart(args.userId);
    return {
      cartId: cart.id,
      itemCount: cart.items.length,
      totalAmount: cart.totalAmount,
      discountAmount: cart.discountAmount,
      finalAmount: cart.finalAmount,
      items: cart.items.map((i) => ({
        id: i.id,
        productId: i.productId,
        name: i.product.name,
        price: i.price,
        quantity: i.quantity,
        imageUrl: i.product.imageUrl,
        category: i.product.category,
        isUpsell: !!i.upsellSourceId,
      })),
    };
  },

  calculate_cart_total: async (args: { userId: string }) => {
    const cart = await CartService.getOrCreateCart(args.userId);
    return {
      cartId: cart.id,
      itemCount: cart.items.length,
      totalAmount: cart.totalAmount,
      discountAmount: cart.discountAmount,
      finalAmount: cart.finalAmount,
      items: cart.items.map((i) => ({
        id: i.id,
        productId: i.productId,
        name: i.product.name,
        price: i.price,
        quantity: i.quantity,
        isUpsell: !!i.upsellSourceId,
      })),
    };
  },

  add_to_cart: async (args: { userId: string; productId: string; quantity?: number; upsellSourceId?: string }) => {
    const quantity = args.quantity && args.quantity > 0 ? args.quantity : 1;
    const updatedCart = await CartService.addItemToCart(args.userId, args.productId, quantity, args.upsellSourceId);
    const addedItem = updatedCart?.items.find((i: any) => i.productId === args.productId);
    return {
      success: true,
      message: `Added ${quantity} x ${addedItem?.product?.name || 'product'} to cart successfully.`,
      productName: addedItem?.product?.name || 'Product',
      quantity,
      cartTotal: updatedCart?.finalAmount || 0,
      itemCount: updatedCart?.items.length || 0,
      cart: updatedCart,
    };
  },

  update_cart: async (args: { userId: string; itemId: string; quantity: number }) => {
    const updatedCart = await CartService.updateItemQuantity(args.userId, args.itemId, args.quantity);
    return {
      success: true,
      message: `Updated cart item quantity to ${args.quantity}.`,
      cartTotal: updatedCart?.finalAmount || 0,
      itemCount: updatedCart?.items.length || 0,
      cart: updatedCart,
    };
  },

  remove_from_cart: async (args: { userId: string; itemId: string }) => {
    const updatedCart = await CartService.removeItemFromCart(args.userId, args.itemId);
    return {
      success: true,
      message: `Removed item from cart.`,
      cartTotal: updatedCart?.finalAmount || 0,
      itemCount: updatedCart?.items.length || 0,
      cart: updatedCart,
    };
  },

  apply_allowed_discount: async (args: { userId: string; discountPercent: number }) => {
    const cart = await CartService.getOrCreateCart(args.userId);
    const maxAllowedPercent = 10; // Default limit check
    const appliedPercent = Math.min(args.discountPercent, maxAllowedPercent);

    const discountAmount = Math.round((cart.totalAmount * appliedPercent) / 100);
    const finalAmount = Math.max(0, cart.totalAmount - discountAmount);

    return {
      cartId: cart.id,
      originalTotal: cart.totalAmount,
      requestedDiscountPercent: args.discountPercent,
      appliedDiscountPercent: appliedPercent,
      discountAmount,
      finalAmount,
      message: appliedPercent < args.discountPercent
        ? `Discount capped at merchant maximum of ${maxAllowedPercent}%.`
        : `Applied ${appliedPercent}% discount successfully.`,
    };
  },
};

