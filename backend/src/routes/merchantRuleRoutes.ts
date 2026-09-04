import { Router } from 'express';
import { MerchantRuleController } from '../controllers/merchantRuleController';
import { authenticate } from '../middleware/authMiddleware';
import { authorize } from '../middleware/roleMiddleware';

const router = Router();

router.use(authenticate, authorize(['MERCHANT', 'ADMIN']));

router.get('/', MerchantRuleController.getRules);
router.put('/', MerchantRuleController.updateRules);

export default router;
