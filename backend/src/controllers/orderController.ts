import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { OrderService } from '../services/orderService';
import { sendSuccess, sendError } from '../utils/response';
import prisma from '../config/database';

export class OrderController {
  static async getMyOrders(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return sendError(res, 'User context missing', 'UNAUTHORIZED', 401);
      const orders = await OrderService.getOrdersForUser(req.user.userId);
      return sendSuccess(res, { count: orders.length, orders });
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to fetch customer orders', 'ORDERS_ERROR', 400);
    }
  }

  static async getMerchantOrders(req: AuthenticatedRequest, res: Response) {
    try {
      let merchantId = req.user?.merchantId;
      if (!merchantId) {
        const firstMerchant = await prisma.merchant.findFirst();
        merchantId = firstMerchant?.id;
      }
      const orders = await OrderService.getOrdersForMerchant(merchantId || '');
      return sendSuccess(res, { count: orders.length, orders });
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to fetch merchant orders', 'MERCHANT_ORDERS_ERROR', 400);
    }
  }

  static async getOrderById(req: AuthenticatedRequest, res: Response) {
    try {
      const orderId = req.params.id as string;
      const order = await OrderService.getOrderById(orderId);
      if (!order) return sendError(res, 'Order not found', 'NOT_FOUND', 404);
      return sendSuccess(res, order);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to fetch order', 'ORDER_ERROR', 400);
    }
  }
}
