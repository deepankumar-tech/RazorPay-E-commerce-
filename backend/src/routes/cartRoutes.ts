import { Router } from 'express';
import { CartController } from '../controllers/cartController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);

router.get('/', CartController.getCart);
router.post('/items', CartController.addItem);
router.put('/items/:itemId', CartController.updateQuantity);
router.delete('/items/:itemId', CartController.removeItem);

export default router;
