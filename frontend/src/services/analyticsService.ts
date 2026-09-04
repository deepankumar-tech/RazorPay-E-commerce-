import api from './api';

export const analyticsService = {
  getAnalytics: async () => {
    const res = await api.get('/analytics');
    return res.data;
  },
};

export const auditService = {
  getAuditLogs: async (params?: any) => {
    const res = await api.get('/audit', { params });
    return res.data;
  },
};

export const merchantRuleService = {
  getRules: async () => {
    const res = await api.get('/merchant-rules');
    return res.data;
  },
  updateRules: async (data: any) => {
    const res = await api.put('/merchant-rules', data);
    return res.data;
  },
};
