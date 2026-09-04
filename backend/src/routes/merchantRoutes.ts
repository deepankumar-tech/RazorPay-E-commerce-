import { Router } from 'express';
import { MerchantController } from '../controllers/merchantController';
import { authenticate } from '../middleware/authMiddleware';
import { authorize } from '../middleware/roleMiddleware';

const router = Router();

// Secure all merchant endpoints with authentication & MERCHANT or ADMIN role authorization
router.use(authenticate, authorize(['MERCHANT', 'ADMIN']));

router.get('/dashboard', MerchantController.getDashboard);
router.post('/ai-copilot', MerchantController.processAiCopilot);
router.get('/ai-catalog', MerchantController.getAiCatalogHealth);
router.get('/agentic-commerce', MerchantController.getAgenticCommerce);
router.get('/policies', MerchantController.getPolicies);
router.put('/policies', MerchantController.updatePolicies);
router.post('/test-failure', MerchantController.testFailureScenario);
router.get('/audit', MerchantController.getAuditTrail);
router.get('/failure-center', MerchantController.getFailureCenter);

export default router;
