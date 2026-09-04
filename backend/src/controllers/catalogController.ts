import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { ProductService } from '../services/productService';
import { sendSuccess, sendError } from '../utils/response';

export class CatalogController {
  static async getAgentCatalog(req: AuthenticatedRequest, res: Response) {
    try {
      const { merchantId } = req.query;
      const catalog = await ProductService.getAgentCatalog(merchantId as string);
      return sendSuccess(res, catalog, 'Agent-readable catalog fetched successfully');
    } catch (error: any) {
      return sendError(res, 'Failed to fetch agent catalog', 'CATALOG_ERROR', 500);
    }
  }
}
