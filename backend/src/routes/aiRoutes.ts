import { Router } from 'express';
import { AIController } from '../controllers/aiController';
import { CampaignController } from '../controllers/campaignController';
import { AnalyticsController } from '../controllers/analyticsController';
import { authenticate } from '../middleware/authMiddleware';
import { aiRateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.use(authenticate);

router.post('/chat', aiRateLimiter, AIController.chat);
router.post('/recommend', aiRateLimiter, AIController.chat);
router.post('/growth-insights', aiRateLimiter, AnalyticsController.getMerchantAnalytics);
router.post('/campaign', aiRateLimiter, CampaignController.generateCampaignProposal);

export default router;
