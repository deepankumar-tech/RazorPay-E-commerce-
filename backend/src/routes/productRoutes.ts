import { Router } from 'express';
import { ProductController } from '../controllers/productController';
import { authenticate } from '../middleware/authMiddleware';
import { authorize } from '../middleware/roleMiddleware';

const router = Router();

router.get('/', ProductController.searchProducts);
router.get('/:id', ProductController.getProductById);
router.post('/', authenticate, authorize(['MERCHANT', 'ADMIN']), ProductController.createProduct);
router.put('/:id', authenticate, authorize(['MERCHANT', 'ADMIN']), ProductController.updateProduct);
router.delete('/:id', authenticate, authorize(['MERCHANT', 'ADMIN']), ProductController.deleteProduct);

export default router;
