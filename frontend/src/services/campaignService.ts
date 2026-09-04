import api from './api';

export const campaignService = {
  getCampaigns: async () => {
    const res = await api.get('/campaigns');
    return res.data;
  },
  generateProposal: async (data: any) => {
    const res = await api.post('/campaigns/generate', data);
    return res.data;
  },
  reviewCampaign: async (campaignId: string, action: 'APPROVED' | 'REJECTED', comment?: string) => {
    const res = await api.post(`/campaigns/${campaignId}/review`, { action, comment });
    return res.data;
  },
};
