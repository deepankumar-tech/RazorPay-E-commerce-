import api from './api';

export const merchantService = {
  getDashboard: async () => {
    const res = await api.get('/merchant/dashboard');
    return res.data;
  },

  processAiCopilot: async (query: string, history: any[] = []) => {
    const res = await api.post('/merchant/ai-copilot', { query, history });
    return res.data;
  },

  getAiCatalogHealth: async () => {
    const res = await api.get('/merchant/ai-catalog');
    return res.data;
  },

  getAgenticCommerce: async () => {
    const res = await api.get('/merchant/agentic-commerce');
    return res.data;
  },

  getPolicies: async () => {
    const res = await api.get('/merchant/policies');
    return res.data;
  },

  updatePolicies: async (policiesData: any) => {
    const res = await api.put('/merchant/policies', policiesData);
    return res.data;
  },

  testFailureScenario: async (amount: number = 25000) => {
    const res = await api.post('/merchant/test-failure', { amount });
    return res.data;
  },

  getAuditTrail: async (moneyOnly: boolean = false) => {
    const res = await api.get(`/merchant/audit?moneyOnly=${moneyOnly}`);
    return res.data;
  },

  getFailureCenter: async () => {
    const res = await api.get('/merchant/failure-center');
    return res.data;
  },
};
