import prisma from '../config/database';
import { OrderStatus } from '@prisma/client';
import { notifyOrderStatusUpdate } from '../socket/socketServer';

export class OrderService {
  static async getOrdersForUser(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      include: {
        merchant: { select: { id: true, name: true, supportEmail: true } },
        items: {
          include: {
            product: { select: { id: true, name: true, category: true, sku: true } },
          },
        },
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getOrdersForMerchant(merchantId: string) {
    const where: any = merchantId ? { OR: [{ merchantId }, { merchantId: null }] } : {};
    return prisma.order.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: {
          include: {
            product: { select: { id: true, name: true, category: true, sku: true } },
          },
        },
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getOrderById(orderId: string) {
    return prisma.order.findUnique({
      where: { id: orderId },
      include: {
        merchant: { select: { id: true, name: true, supportEmail: true } },
        user: { select: { id: true, name: true, email: true } },
        items: {
          include: {
            product: true,
          },
        },
        payments: true,
      },
    });
  }

  static async updateOrderStatus(orderId: string, status: OrderStatus) {
    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    notifyOrderStatusUpdate(updated.id, updated.status, updated.userId, updated.merchantId);
    return updated;
  }
}
