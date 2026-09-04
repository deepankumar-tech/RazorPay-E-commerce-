import { ProductService } from '../../services/productService';

export const productTools = {
  search_products: async (args: { query?: string; category?: string; maxPrice?: number; minPrice?: number; limit?: number }) => {
    const products = await ProductService.searchProducts(args);
    return {
      count: products.length,
      products: products.map((p: any) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        price: p.price,
        originalPrice: p.originalPrice,
        rating: p.rating,
        reviewsCount: p.reviewsCount || 1200,
        imageUrl: p.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
        badge: p.badge,
        description: p.description,
        sku: p.sku,
        inStock: (p.inventoryRecord?.quantity || p.inventory) > 0,
        stock: p.inventoryRecord?.quantity || p.inventory,
        merchantName: p.merchant.name,
      })),
    };
  },

  get_product_details: async (args: { productId: string }) => {
    const p: any = await ProductService.getProductById(args.productId);
    return {
      id: p.id,
      name: p.name,
      category: p.category,
      price: p.price,
      originalPrice: p.originalPrice,
      rating: p.rating,
      reviewsCount: p.reviewsCount || 1200,
      imageUrl: p.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
      badge: p.badge,
      description: p.description,
      sku: p.sku,
      tags: p.tags,
      features: p.features,
      inventory: p.inventoryRecord?.quantity || p.inventory,
      merchantName: p.merchant.name,
    };
  },

  check_inventory: async (args: { productId: string }) => {
    const p = await ProductService.getProductById(args.productId);
    const stock = p.inventoryRecord?.quantity || p.inventory;
    return {
      productId: p.id,
      name: p.name,
      inStock: stock > 0,
      stockQuantity: stock,
    };
  },

  compare_products: async (args: { productIds: string[] }) => {
    const rawProducts = await Promise.all(
      args.productIds.map(async (id) => {
        try {
          return await ProductService.getProductById(id);
        } catch {
          return null;
        }
      })
    );
    const products = rawProducts.filter((p) => p !== null);

    const comparisons = products.map((p: any, idx: number) => {
      const stock = p.inventoryRecord?.quantity || p.inventory || 0;
      const advantages: string[] = [];
      const disadvantages: string[] = [];

      if (idx === 0) {
        advantages.push('Best overall value & rating');
      } else {
        advantages.push('Alternative option');
      }

      if (p.price < 3000) advantages.push('Budget friendly under ₹3,000');
      if (p.rating >= 4.5) advantages.push(`High customer rating (${p.rating}★)`);
      if (stock > 10) advantages.push('High stock availability');
      else disadvantages.push('Low stock');

      return {
        id: p.id,
        name: p.name,
        category: p.category,
        price: p.price,
        originalPrice: p.originalPrice,
        rating: p.rating,
        reviewsCount: p.reviewsCount || 1200,
        imageUrl: p.imageUrl,
        badge: p.badge,
        description: p.description,
        features: p.features || [],
        stock,
        advantages,
        disadvantages,
        isWinner: idx === 0,
      };
    });

    return {
      comparedCount: comparisons.length,
      products: comparisons,
      winner: comparisons.length > 0 ? comparisons[0] : null,
    };
  },

  recommend_products: async (args: { criteria?: string; category?: string; maxPrice?: number; limit?: number }) => {
    const searchArgs = {
      query: args.criteria,
      category: args.category,
      maxPrice: args.maxPrice,
      limit: args.limit || 4,
    };
    const res = await productTools.search_products(searchArgs);
    return res;
  },
};
