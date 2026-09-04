import prisma from '../config/database';

export class CartService {
  static async getOrCreateCart(userId: string) {
    let cart = await prisma.cart.findFirst({
      where: { userId, status: 'ACTIVE' },
      include: {
        items: {
          include: {
            product: {
              include: { merchant: { select: { id: true, name: true } } },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId, status: 'ACTIVE' },
        include: {
          items: {
            include: {
              product: {
                include: { merchant: { select: { id: true, name: true } } },
              },
            },
          },
        },
      });
    }

    return cart;
  }

  static async addItemToCart(userId: string, productId: string, quantity: number = 1, upsellSourceId?: string) {
    const cart = await this.getOrCreateCart(userId);
    const product = await prisma.product.findUnique({ where: { id: productId } });

    if (!product || product.status !== 'ACTIVE') {
      throw { statusCode: 404, message: 'Product not available', code: 'PRODUCT_UNAVAILABLE' };
    }

    if (product.inventory < quantity) {
      throw { statusCode: 400, message: 'Insufficient stock available', code: 'OUT_OF_STOCK' };
    }

    const existingItem = cart.items.find((item) => item.productId === productId);

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
          price: product.price,
        },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
          price: product.price,
          upsellSourceId,
        },
      });
    }

    return this.recalculateCart(cart.id);
  }

  static async updateItemQuantity(userId: string, itemId: string, quantity: number) {
    const cart = await this.getOrCreateCart(userId);
    const item = await prisma.cartItem.findUnique({ where: { id: itemId } });

    if (!item || item.cartId !== cart.id) {
      throw { statusCode: 404, message: 'Cart item not found', code: 'NOT_FOUND' };
    }

    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: itemId } });
    } else {
      await prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity },
      });
    }

    return this.recalculateCart(cart.id);
  }

  static async removeItemFromCart(userId: string, itemId: string) {
    const cart = await this.getOrCreateCart(userId);
    await prisma.cartItem.deleteMany({
      where: { id: itemId, cartId: cart.id },
    });
    return this.recalculateCart(cart.id);
  }

  static async recalculateCart(cartId: string) {
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: { items: { include: { product: true } } },
    });

    if (!cart) return null;

    const totalAmount = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const finalAmount = Math.max(0, totalAmount - cart.discountAmount);

    const updatedCart = await prisma.cart.update({
      where: { id: cartId },
      data: {
        totalAmount,
        finalAmount,
      },
      include: {
        items: {
          include: {
            product: {
              include: { merchant: { select: { id: true, name: true } } },
            },
          },
        },
      },
    });

    return updatedCart;
  }
}
