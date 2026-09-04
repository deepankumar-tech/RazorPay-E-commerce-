import { Router } from 'express';
import { CampaignController } from '../controllers/campaignController';
import { authenticate } from '../middleware/authMiddleware';
import { authorize } from '../middleware/roleMiddleware';

const router = Router();

router.use(authenticate, authorize(['MERCHANT', 'ADMIN']));

router.get('/', CampaignController.getMerchantCampaigns);
router.post('/generate', CampaignController.generateCampaignProposal);
router.post('/:campaignId/review', CampaignController.reviewCampaign);

export default router;
