import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { ProductService } from '../services/productService';
import { sendSuccess, sendError } from '../utils/response';
import { createProductSchema, updateProductSchema } from '../validators/productSchemas';

export class ProductController {
  static async searchProducts(req: AuthenticatedRequest, res: Response) {
    try {
      const { query, category, minPrice, maxPrice, merchantId, limit } = req.query;
      const products = await ProductService.searchProducts({
        query: query as string,
        category: category as string,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        merchantId: merchantId as string,
        limit: limit ? Number(limit) : undefined,
      });
      return sendSuccess(res, { count: products.length, products });
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to search products', 'SEARCH_ERROR', 400);
    }
  }

  static async getProductById(req: AuthenticatedRequest, res: Response) {
    try {
      const id = req.params.id as string;
      const product = await ProductService.getProductById(id);
      return sendSuccess(res, product);
    } catch (error: any) {
      return sendError(res, error.message || 'Product not found', 'NOT_FOUND', 404);
    }
  }

  static async createProduct(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.merchantId) return sendError(res, 'Merchant context required', 'FORBIDDEN', 403);
      const validated = createProductSchema.parse(req.body);
      const product = await ProductService.createProduct(req.user.merchantId, validated);
      return sendSuccess(res, product, 'Product created successfully', 201);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to create product', 'CREATE_ERROR', 400);
    }
  }

  static async updateProduct(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.merchantId) return sendError(res, 'Merchant context required', 'FORBIDDEN', 403);
      const id = req.params.id as string;
      const validated = updateProductSchema.parse(req.body);
      const product = await ProductService.updateProduct(id, req.user.merchantId, validated);
      return sendSuccess(res, product, 'Product updated successfully');
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to update product', 'UPDATE_ERROR', 400);
    }
  }

  static async deleteProduct(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.merchantId) return sendError(res, 'Merchant context required', 'FORBIDDEN', 403);
      const id = req.params.id as string;
      await ProductService.deleteProduct(id, req.user.merchantId);
      return sendSuccess(res, null, 'Product deleted successfully');
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to delete product', 'DELETE_ERROR', 400);
    }
  }
}
