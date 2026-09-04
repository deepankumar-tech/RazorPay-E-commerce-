import { Router } from 'express';
import { AdminController } from '../controllers/adminController';
import { authenticate } from '../middleware/authMiddleware';
import { authorize } from '../middleware/roleMiddleware';

const router = Router();

// Strictly require ADMIN role
router.use(authenticate, authorize(['ADMIN']));

router.get('/stats', AdminController.getPlatformStats);
router.get('/dashboard', AdminController.getPlatformStats);
router.get('/users', AdminController.getUsers);
router.get('/merchants', AdminController.getMerchants);
router.get('/payments', AdminController.getPayments);
router.get('/ai-activity', AdminController.getAiActivity);
router.get('/audit-logs', AdminController.getAuditLogs);

export default router;
