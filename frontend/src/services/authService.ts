import api from './api';

export const authService = {
  register: async (data: any) => {
    const res = await api.post('/auth/register', data);
    return res.data;
  },
  login: async (data: any) => {
    const res = await api.post('/auth/login', data);
    return res.data;
  },
  logout: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    const res = await api.post('/auth/logout', { refreshToken });
    return res.data;
  },
  getProfile: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
  updateProfile: async (data: { name?: string; email?: string; password?: string }) => {
    const res = await api.put('/auth/profile', data);
    return res.data;
  },
};
