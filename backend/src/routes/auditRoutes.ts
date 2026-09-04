import { Router } from 'express';
import { AuditController } from '../controllers/auditController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);

router.get('/', AuditController.getAuditLogs);

export default router;
