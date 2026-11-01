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
export declare class CatalogRepository {
    private readonly pool;
    constructor(pool: Pool);
    listCategories(): Promise<CatalogCategory[]>;
    listProducts(filters: CatalogProductFilters): Promise<{
        data: CatalogProduct[];
        total: number;
    }>;
    getProduct(slug: string): Promise<CatalogProduct | undefined>;
}
