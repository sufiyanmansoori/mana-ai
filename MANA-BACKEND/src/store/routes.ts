import { Router } from 'express';
import { z } from 'zod';
import { CACHE_TTLS_SECONDS } from '../constants/cache-keys.js';
import { REGEX } from '../constants/regex.js';
import { ApiError } from '../errors.js';
import type { CatalogRepository } from './catalog-repository.js';

const ListProductsQuerySchema = z.object({
  q: z.string().trim().max(120).optional(),
  category: z.string().regex(REGEX.slug).optional(),
  sort: z.enum(['popular', 'price_asc', 'price_desc', 'newest']).default('popular'),
  page: z.coerce.number().int().min(1).max(1000).default(1),
  limit: z.coerce.number().int().min(1).max(48).default(24),
}).strict();

const ProductSlugSchema = z.string().regex(REGEX.slug);

export function createStoreRouter(repository: CatalogRepository): Router {
  const router = Router();
  router.get('/categories', async (_request, response, next) => {
    try {
      const data = await repository.listCategories();
      response.set(
        'cache-control',
        `public, max-age=${CACHE_TTLS_SECONDS.productCategories}, stale-while-revalidate=${CACHE_TTLS_SECONDS.productCategoriesStaleWhileRevalidate}`,
      );
      response.json({ data });
    } catch (error) {
      next(error);
    }
  });

  router.get('/products', async (request, response, next) => {
    try {
      const filters = ListProductsQuerySchema.parse(request.query);
      const result = await repository.listProducts({
        ...(filters.q ? { query: filters.q } : {}),
        ...(filters.category ? { category: filters.category } : {}),
        sort: filters.sort,
        page: filters.page,
        limit: filters.limit,
      });
      response.set(
        'cache-control',
        `public, max-age=${CACHE_TTLS_SECONDS.products}, stale-while-revalidate=${CACHE_TTLS_SECONDS.productsStaleWhileRevalidate}`,
      );
      response.json({
        data: result.data,
        pagination: {
          page: filters.page,
          limit: filters.limit,
          total: result.total,
          total_pages: Math.ceil(result.total / filters.limit),
        },
      });
    } catch (error) {
      next(error);
    }
  });

  router.get('/products/:slug', async (request, response, next) => {
    try {
      const slug = ProductSlugSchema.parse(request.params.slug);
      const product = await repository.getProduct(slug);
      if (!product) {
        throw new ApiError(404, 'product_not_found', 'The requested product was not found.');
      }
      response.set(
        'cache-control',
        `public, max-age=${CACHE_TTLS_SECONDS.products}, stale-while-revalidate=${CACHE_TTLS_SECONDS.productsStaleWhileRevalidate}`,
      );
      response.json({ data: product });
    } catch (error) {
      next(error);
    }
  });
  return router;
}
