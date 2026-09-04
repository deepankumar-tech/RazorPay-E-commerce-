import { Router } from 'express';
import { CatalogController } from '../controllers/catalogController';

const router = Router();

// Machine-readable agent catalog endpoint
router.get('/agent', CatalogController.getAgentCatalog);

export default router;
