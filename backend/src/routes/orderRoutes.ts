import { Router } from 'express';
import { OrderController } from '../controllers/orderController';
import { authenticate } from '../middleware/authMiddleware';
import { authorize } from '../middleware/roleMiddleware';

const router = Router();

router.use(authenticate);

router.get('/my-orders', OrderController.getMyOrders);
router.get('/merchant-orders', authorize(['MERCHANT', 'ADMIN']), OrderController.getMerchantOrders);
router.get('/:id', OrderController.getOrderById);

export default router;
