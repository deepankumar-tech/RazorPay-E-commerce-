import api from './api';

export const aiService = {
  chat: async (userQuery: string, conversationId?: string, cartId?: string, history?: any[]) => {
    const res = await api.post('/ai/chat', { userQuery, conversationId, cartId, history });
    return res.data;
  },
};
