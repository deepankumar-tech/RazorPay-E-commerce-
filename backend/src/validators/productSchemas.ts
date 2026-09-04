import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  category: z.string().min(2, 'Category is required'),
  price: z.number().positive('Price must be greater than 0'),
  sku: z.string().min(2, 'SKU is required'),
  inventory: z.number().int().nonnegative().default(50),
  tags: z.array(z.string()).default([]),
  features: z.array(z.string()).default([]),
});

export const updateProductSchema = createProductSchema.partial();
