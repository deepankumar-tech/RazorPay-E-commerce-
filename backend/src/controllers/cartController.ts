import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { CartService } from '../services/cartService';
import { sendSuccess, sendError } from '../utils/response';

export class CartController {
  static async getCart(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return sendError(res, 'User context missing', 'UNAUTHORIZED', 401);
      const cart = await CartService.getOrCreateCart(req.user.userId);
      return sendSuccess(res, cart);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to fetch cart', 'CART_ERROR', 400);
    }
  }

  static async addItem(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return sendError(res, 'User context missing', 'UNAUTHORIZED', 401);
      const { productId, quantity, upsellSourceId } = req.body;
      const cart = await CartService.addItemToCart(req.user.userId, productId, quantity || 1, upsellSourceId);
      return sendSuccess(res, cart, 'Item added to cart');
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to add item to cart', 'ADD_ITEM_ERROR', 400);
    }
  }

  static async updateQuantity(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return sendError(res, 'User context missing', 'UNAUTHORIZED', 401);
      const itemId = req.params.itemId as string;
      const { quantity } = req.body;
      const cart = await CartService.updateItemQuantity(req.user.userId, itemId, quantity);
      return sendSuccess(res, cart, 'Cart updated successfully');
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to update item quantity', 'UPDATE_ITEM_ERROR', 400);
    }
  }

  static async removeItem(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return sendError(res, 'User context missing', 'UNAUTHORIZED', 401);
      const itemId = req.params.itemId as string;
      const cart = await CartService.removeItemFromCart(req.user.userId, itemId);
      return sendSuccess(res, cart, 'Item removed from cart');
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to remove item', 'REMOVE_ITEM_ERROR', 400);
    }
  }
}
