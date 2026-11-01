CREATE TABLE IF NOT EXISTS store_categories (
  id uuid PRIMARY KEY,
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 80),
  description text NOT NULL DEFAULT '',
  image_url text CHECK (image_url IS NULL OR image_url ~ '^https://[^[:space:]]+$'),
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS store_products (
  id uuid PRIMARY KEY,
  category_id uuid NOT NULL REFERENCES store_categories(id) ON DELETE RESTRICT,
  sku text NOT NULL UNIQUE CHECK (char_length(sku) BETWEEN 1 AND 64),
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 180),
  brand text NOT NULL CHECK (char_length(brand) BETWEEN 1 AND 100),
  description text NOT NULL CHECK (char_length(description) BETWEEN 1 AND 10000),
  price_paise integer NOT NULL CHECK (price_paise > 0),
  mrp_paise integer NOT NULL CHECK (mrp_paise >= price_paise),
  currency char(3) NOT NULL DEFAULT 'INR' CHECK (currency = 'INR'),
  stock_quantity integer NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  image_url text CHECK (image_url IS NULL OR image_url ~ '^https://[^[:space:]]+$'),
  rating numeric(2, 1) NOT NULL DEFAULT 0 CHECK (rating BETWEEN 0 AND 5),
  rating_count integer NOT NULL DEFAULT 0 CHECK (rating_count >= 0),
  display_order integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS store_categories_active_order_idx
  ON store_categories (display_order, name, id)
  WHERE is_active;

CREATE INDEX IF NOT EXISTS store_products_active_category_order_idx
  ON store_products (category_id, display_order, id)
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS store_products_active_price_idx
  ON store_products (price_paise, id)
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS store_products_active_updated_idx
  ON store_products (updated_at DESC, id DESC)
  WHERE status = 'active';
