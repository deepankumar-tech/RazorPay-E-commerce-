import api from './api';

export const orderService = {
  getMyOrders: async () => {
    const res = await api.get('/orders/my-orders');
    return res.data;
  },
  getMerchantOrders: async () => {
    const res = await api.get('/orders/merchant-orders');
    return res.data;
  },
  getOrderById: async (id: string) => {
    const res = await api.get(`/orders/${id}`);
    return res.data;
  },
};
