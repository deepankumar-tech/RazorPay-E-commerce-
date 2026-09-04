import api from './api';

export const cartService = {
  getCart: async () => {
    const res = await api.get('/cart');
    return res.data;
  },
  addItem: async (productId: string, quantity: number = 1, upsellSourceId?: string) => {
    const res = await api.post('/cart/items', { productId, quantity, upsellSourceId });
    return res.data;
  },
  updateQuantity: async (itemId: string, quantity: number) => {
    const res = await api.put(`/cart/items/${itemId}`, { quantity });
    return res.data;
  },
  removeItem: async (itemId: string) => {
    const res = await api.delete(`/cart/items/${itemId}`);
    return res.data;
  },
};
