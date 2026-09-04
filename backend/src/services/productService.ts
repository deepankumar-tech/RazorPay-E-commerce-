import prisma from '../config/database';

export class ProductService {
  static async searchProducts(params: {
    query?: string;
    category?: string;
    badge?: string;
    minPrice?: number;
    maxPrice?: number;
    merchantId?: string;
    limit?: number;
  }) {
    const where: any = { status: { not: 'INACTIVE' } };

    if (params.category && params.category !== 'All') {
      where.category = { equals: params.category, mode: 'insensitive' };
    }

    if (params.merchantId) {
      where.merchantId = params.merchantId;
    }

    if (params.badge) {
      where.badge = { not: null };
    }

    if (params.minPrice !== undefined || params.maxPrice !== undefined) {
      where.price = {};
      if (params.minPrice !== undefined) where.price.gte = Number(params.minPrice);
      if (params.maxPrice !== undefined) where.price.lte = Number(params.maxPrice);
    }

    // Stop words to strip out (only conversational grammatical filler words, NOT product features like wireless or bluetooth)
    const stopWords = new Set([
      'show', 'me', 'find', 'get', 'give', 'look', 'for', 'search', 'recommend', 'suggest',
      'buy', 'purchase', 'order', 'please', 'i', 'want', 'need', 'a', 'an', 'the',
      'under', 'below', 'less', 'than', 'price', 'budget', 'best', 'cheap', 'top',
      'options', 'products', 'items', 'with', 'some', 'any', 'can', 'you', 'display',
      'list', 'browse', 'catalog', 'good'
    ]);

    let searchWords: string[] = [];
    if (params.query && params.query.trim()) {
      const rawWords = params.query.trim().toLowerCase().split(/\s+/).filter(Boolean);
      searchWords = rawWords.filter((w) => !stopWords.has(w) && w.length > 1);

      if (searchWords.length === 0) {
        searchWords = rawWords.filter((w) => !['show', 'me', 'the', 'a', 'an', 'please', 'can', 'you', 'i', 'want'].includes(w));
      }
    }

    if (searchWords.length > 0) {
      where.OR = searchWords.map((word) => ({
        OR: [
          { name: { contains: word, mode: 'insensitive' } },
          { description: { contains: word, mode: 'insensitive' } },
          { category: { contains: word, mode: 'insensitive' } },
          { tags: { has: word } },
        ],
      }));
    }

    let products = await prisma.product.findMany({
      where,
      take: params.limit || 100,
      include: {
        merchant: { select: { id: true, name: true } },
        inventoryRecord: true,
      },
      orderBy: { rating: 'desc' },
    });

    // If search with category & query yielded 0 results, retry without strict category filter
    if (products.length === 0 && params.category && searchWords.length > 0) {
      const fallbackWhere: any = {
        status: 'ACTIVE',
        OR: searchWords.map((word) => ({
          OR: [
            { name: { contains: word, mode: 'insensitive' } },
            { description: { contains: word, mode: 'insensitive' } },
            { category: { contains: word, mode: 'insensitive' } },
            { tags: { has: word } },
          ],
        })),
      };
      if (params.maxPrice !== undefined) {
        fallbackWhere.price = { lte: Number(params.maxPrice) };
      }
      products = await prisma.product.findMany({
        where: fallbackWhere,
        take: params.limit || 100,
        include: {
          merchant: { select: { id: true, name: true } },
          inventoryRecord: true,
        },
        orderBy: { rating: 'desc' },
      });
    }

    // Final fallback if no keyword matches exist at all: return products matching category or general active products
    if (products.length === 0) {
      const categoryWhere: any = { status: 'ACTIVE' };
      if (params.category && params.category !== 'All') {
        categoryWhere.category = { equals: params.category, mode: 'insensitive' };
      }
      if (params.maxPrice !== undefined) {
        categoryWhere.price = { lte: Number(params.maxPrice) };
      }
      products = await prisma.product.findMany({
        where: categoryWhere,
        take: params.limit || 12,
        include: {
          merchant: { select: { id: true, name: true } },
          inventoryRecord: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    return products;
  }

  static async getProductById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        merchant: { select: { id: true, name: true, supportEmail: true } },
        inventoryRecord: true,
      },
    });

    if (!product) {
      throw { statusCode: 404, message: 'Product not found', code: 'PRODUCT_NOT_FOUND' };
    }

    return product;
  }

  static async getAgentCatalog(merchantId?: string) {
    const where: any = { status: 'ACTIVE' };
    if (merchantId) where.merchantId = merchantId;

    const products = await prisma.product.findMany({
      where,
      include: {
        merchant: { select: { id: true, name: true } },
        inventoryRecord: true,
      },
    });

    const agentCatalog = products.map((p) => ({
      product_id: p.id,
      name: p.name,
      category: p.category,
      description: p.description,
      price: p.price,
      currency: p.currency,
      rating: p.rating,
      availability: (p.inventoryRecord?.quantity || p.inventory) > 0,
      stock_quantity: p.inventoryRecord?.quantity || p.inventory,
      tags: p.tags,
      features: p.features,
      merchant: p.merchant.name,
      merchant_id: p.merchantId,
    }));

    return {
      total_products: agentCatalog.length,
      categories: Array.from(new Set(products.map((p) => p.category))),
      catalog: agentCatalog,
    };
  }

  static async createProduct(merchantId: string, data: any) {
    const product = await prisma.product.create({
      data: {
        ...data,
        merchantId,
      },
    });

    await prisma.inventory.create({
      data: {
        productId: product.id,
        quantity: data.inventory || 50,
        lowStockThreshold: 10,
      },
    });

    return product;
  }

  static async updateProduct(productId: string, merchantId: string, data: any) {
    const existing = await prisma.product.findUnique({ where: { id: productId } });
    if (!existing || existing.merchantId !== merchantId) {
      throw { statusCode: 404, message: 'Product not found or unauthorized', code: 'NOT_FOUND' };
    }

    const updated = await prisma.product.update({
      where: { id: productId },
      data,
    });

    if (data.inventory !== undefined) {
      await prisma.inventory.upsert({
        where: { productId },
        update: { quantity: data.inventory },
        create: { productId, quantity: data.inventory },
      });
    }

    return updated;
  }

  static async deleteProduct(productId: string, merchantId: string) {
    const existing = await prisma.product.findUnique({
      where: { id: productId },
      include: { orderItems: { take: 1 } },
    });
    if (!existing || existing.merchantId !== merchantId) {
      throw { statusCode: 404, message: 'Product not found or unauthorized', code: 'NOT_FOUND' };
    }

    if (existing.orderItems.length > 0) {
      // Soft delete / archive to preserve historical order integrity
      await prisma.product.update({
        where: { id: productId },
        data: { status: 'INACTIVE' },
      });
    } else {
      // Safe to hard delete if never purchased
      await prisma.inventory.deleteMany({ where: { productId } });
      await prisma.product.delete({ where: { id: productId } });
    }
    return true;
  }
}
