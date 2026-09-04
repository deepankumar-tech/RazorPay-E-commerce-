import api from './api';

export const productService = {
  searchProducts: async (params?: any) => {
    const res = await api.get('/products', { params });
    return res.data;
  },
  getProductById: async (id: string) => {
    const res = await api.get(`/products/${id}`);
    return res.data;
  },
  getAgentCatalog: async (merchantId?: string) => {
    const res = await api.get('/catalog/agent', { params: { merchantId } });
    return res.data;
  },
  createProduct: async (data: any) => {
    const res = await api.post('/products', data);
    return res.data;
  },
  updateProduct: async (id: string, data: any) => {
    const res = await api.put(`/products/${id}`, data);
    return res.data;
  },
  deleteProduct: async (id: string) => {
    const res = await api.delete(`/products/${id}`);
    return res.data;
  },
};
