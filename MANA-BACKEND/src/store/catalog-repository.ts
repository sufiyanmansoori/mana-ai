import type { Pool } from 'pg';

export interface CatalogCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  image_url: string | null;
  product_count: number;
}

export interface CatalogProduct {
  id: string;
  sku: string;
  slug: string;
  name: string;
  brand: string;
  description: string;
  price_paise: number;
  mrp_paise: number;
  currency: 'INR';
  stock_quantity: number;
  image_url: string | null;
  rating: number;
  rating_count: number;
  category_slug: string;
  category_name: string;
  created_at: Date;
  updated_at: Date;
}

export interface CatalogProductFilters {
  query?: string;
  category?: string;
  sort: 'popular' | 'price_asc' | 'price_desc' | 'newest';
  page: number;
  limit: number;
}

export class CatalogRepository {
  constructor(private readonly pool: Pool) {}

  async listCategories(): Promise<CatalogCategory[]> {
    const result = await this.pool.query<CatalogCategory>(
      `SELECT c.id, c.slug, c.name, c.description, c.image_url,
              COUNT(p.id)::int AS product_count
       FROM store_categories c
       LEFT JOIN store_products p
         ON p.category_id = c.id AND p.status = 'active' AND p.stock_quantity > 0
       WHERE c.is_active
       GROUP BY c.id
       ORDER BY c.display_order, lower(c.name), c.id`,
    );
    return result.rows;
  }

  async listProducts(
    filters: CatalogProductFilters,
  ): Promise<{ data: CatalogProduct[]; total: number }> {
    const conditions = ["p.status = 'active'", 'p.stock_quantity > 0', 'c.is_active'];
    const values: Array<string | number> = [];
    if (filters.category) {
      values.push(filters.category);
      conditions.push(`c.slug = $${values.length}`);
    }
    if (filters.query) {
      const escapedQuery = filters.query.replace(/[\\%_]/g, '\\$&');
      values.push(`%${escapedQuery}%`);
      const parameter = `$${values.length}`;
      conditions.push(
        `(p.name ILIKE ${parameter} ESCAPE '\\'
          OR p.brand ILIKE ${parameter} ESCAPE '\\'
          OR p.description ILIKE ${parameter} ESCAPE '\\')`,
      );
    }
    const whereClause = conditions.join(' AND ');
    const count = await this.pool.query<{ total: number }>(
      `SELECT COUNT(*)::int AS total
       FROM store_products p
       JOIN store_categories c ON c.id = p.category_id
       WHERE ${whereClause}`,
      values,
    );
    const ordering = {
      popular: 'p.rating_count DESC, p.rating DESC, p.display_order, p.id',
      price_asc: 'p.price_paise ASC, p.id',
      price_desc: 'p.price_paise DESC, p.id',
      newest: 'p.created_at DESC, p.id DESC',
    } satisfies Record<CatalogProductFilters['sort'], string>;
    const pageValues = [...values, filters.limit, (filters.page - 1) * filters.limit];
    const result = await this.pool.query<CatalogProduct>(
      `SELECT p.id, p.sku, p.slug, p.name, p.brand, p.description,
              p.price_paise, p.mrp_paise, p.currency, p.stock_quantity,
              p.image_url, p.rating::float8 AS rating, p.rating_count,
              c.slug AS category_slug, c.name AS category_name,
              p.created_at, p.updated_at
       FROM store_products p
       JOIN store_categories c ON c.id = p.category_id
       WHERE ${whereClause}
       ORDER BY ${ordering[filters.sort]}
       LIMIT $${pageValues.length - 1} OFFSET $${pageValues.length}`,
      pageValues,
    );
    return { data: result.rows, total: count.rows[0]?.total ?? 0 };
  }

  async getProduct(slug: string): Promise<CatalogProduct | undefined> {
    const result = await this.pool.query<CatalogProduct>(
      `SELECT p.id, p.sku, p.slug, p.name, p.brand, p.description,
              p.price_paise, p.mrp_paise, p.currency, p.stock_quantity,
              p.image_url, p.rating::float8 AS rating, p.rating_count,
              c.slug AS category_slug, c.name AS category_name,
              p.created_at, p.updated_at
       FROM store_products p
       JOIN store_categories c ON c.id = p.category_id
       WHERE p.slug = $1 AND p.status = 'active'
         AND p.stock_quantity > 0 AND c.is_active`,
      [slug],
    );
    return result.rows[0];
  }
}
