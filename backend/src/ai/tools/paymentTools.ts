import { PaymentService } from '../../payment/paymentService';
import prisma from '../../config/database';

export const paymentTools = {
  create_razorpay_order: async (args: { userId: string; cartId: string; customerConfirmed: boolean; paymentMethod?: string }) => {
    if (!args.customerConfirmed) {
      return {
        success: false,
        error: 'EXPLICIT_CUSTOMER_CONFIRMATION_REQUIRED',
        message: 'Payment order creation failed: Customer must explicitly click [CONFIRM & PAY].',
      };
    }

    const orderResult = await PaymentService.createOrderAndRazorpayOrder({
      userId: args.userId,
      cartId: args.cartId,
      customerConfirmed: args.customerConfirmed,
      paymentMethod: args.paymentMethod,
    });

    return {
      success: true,
      razorpayOrderId: orderResult.razorpayOrderId,
      orderNumber: orderResult.orderNumber,
      amount: orderResult.amount,
      currency: orderResult.currency,
      keyId: orderResult.keyId,
    };
  },

  get_payment_status: async (args: { orderId: string }) => {
    const order = await prisma.order.findUnique({
      where: { id: args.orderId },
      include: { payments: true },
    });

    if (!order) {
      return { found: false, message: 'Order not found' };
    }

    return {
      found: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      razorpayOrderId: order.razorpayOrderId,
      razorpayPaymentId: order.razorpayPaymentId,
      paymentsCount: order.payments.length,
      latestPaymentStatus: order.payments[order.payments.length - 1]?.status || 'UNKNOWN',
    };
  },
};
