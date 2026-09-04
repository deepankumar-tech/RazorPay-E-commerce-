import { Router } from 'express';
import { AnalyticsController } from '../controllers/analyticsController';
import { authenticate } from '../middleware/authMiddleware';
import { authorize } from '../middleware/roleMiddleware';

const router = Router();

router.use(authenticate, authorize(['MERCHANT', 'ADMIN']));

router.get('/', AnalyticsController.getMerchantAnalytics);

export default router;
