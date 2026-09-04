import { Router } from 'express';
import { TransactionController } from '../controllers/transactionController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);

router.post('/validate', TransactionController.validate);
router.post('/:id/approve', TransactionController.approve);
router.post('/:id/reject', TransactionController.reject);

export default router;
