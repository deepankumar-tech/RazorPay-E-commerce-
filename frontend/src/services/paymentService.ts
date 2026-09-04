import api from './api';

export const paymentService = {
  createRazorpayOrder: async (cartId: string, customerConfirmed: boolean, discountPercentApplied?: number, paymentMethod?: string) => {
    const res = await api.post('/payments/create-razorpay-order', {
      cartId,
      customerConfirmed,
      discountPercentApplied,
      paymentMethod,
    });
    return res.data;
  },
  verifyPayment: async (data: { razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string }) => {
    const res = await api.post('/payments/verify-payment', data);
    return res.data;
  },
  handleFailure: async (razorpayOrderId: string, failureReason?: string) => {
    const res = await api.post('/payments/handle-failure', { razorpayOrderId, failureReason });
    return res.data;
  },
};
