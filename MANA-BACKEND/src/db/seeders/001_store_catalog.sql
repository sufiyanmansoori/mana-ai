INSERT INTO store_categories (id, slug, name, description, display_order)
VALUES
  ('10000000-0000-4000-8000-000000000001', 'mobiles', 'Mobiles', 'Smartphones and everyday mobile essentials.', 1),
  ('10000000-0000-4000-8000-000000000002', 'electronics', 'Electronics', 'Audio, wearables, cameras and useful gadgets.', 2),
  ('10000000-0000-4000-8000-000000000003', 'computers', 'Computers', 'Laptops and accessories for work and study.', 3),
  ('10000000-0000-4000-8000-000000000004', 'fashion', 'Fashion', 'Comfortable styles for everyday life.', 4),
  ('10000000-0000-4000-8000-000000000005', 'home', 'Home', 'Thoughtful furniture and essentials for your home.', 5),
  ('10000000-0000-4000-8000-000000000006', 'appliances', 'Appliances', 'Reliable appliances for a more comfortable home.', 6)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  display_order = EXCLUDED.display_order,
  is_active = true,
  updated_at = now();

INSERT INTO store_products (
  id, category_id, sku, slug, name, brand, description,
  price_paise, mrp_paise, stock_quantity, image_url, rating, rating_count,
  display_order, status
)
VALUES
  ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'MANA-MOB-001', 'everyday-5g-smartphone', 'Everyday 5G Smartphone', 'Mana Select', 'A bright display, dependable battery and smooth performance for everyday calls, photos and entertainment.', 1499900, 1799900, 32, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=85', 4.4, 128, 1, 'active'),
  ('20000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', 'MANA-MOB-002', 'compact-camera-smartphone', 'Compact Camera Smartphone', 'Mana Select', 'A pocket-friendly smartphone with a clear screen, capable camera and all-day battery life.', 999900, 1299900, 24, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=85', 4.2, 86, 2, 'active'),
  ('20000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000002', 'MANA-AUD-001', 'wireless-over-ear-headphones', 'Wireless Over-Ear Headphones', 'Soundwave', 'Comfortable over-ear headphones with rich sound, a foldable design and long-lasting wireless playback.', 349900, 499900, 41, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85', 4.6, 214, 1, 'active'),
  ('20000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000002', 'MANA-WAT-001', 'active-smart-watch', 'Active Smart Watch', 'Pulse', 'Track everyday activity and see notifications at a glance with a bright display and comfortable strap.', 229900, 329900, 18, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85', 4.1, 63, 2, 'active'),
  ('20000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000003', 'MANA-CMP-001', 'lightweight-work-laptop', 'Lightweight Work Laptop', 'Northstar', 'A lightweight laptop designed for study, office work and everyday browsing. Includes a one-year limited warranty.', 5299900, 5999900, 9, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=85', 4.5, 97, 1, 'active'),
  ('20000000-0000-4000-8000-000000000006', '10000000-0000-4000-8000-000000000004', 'MANA-FAS-001', 'everyday-running-shoes', 'Everyday Running Shoes', 'Stride', 'Lightweight everyday shoes with a cushioned sole for walks, commutes and casual outings.', 189900, 279900, 56, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85', 4.3, 302, 1, 'active'),
  ('20000000-0000-4000-8000-000000000007', '10000000-0000-4000-8000-000000000005', 'MANA-HOM-001', 'modern-reading-chair', 'Modern Reading Chair', 'Casa Living', 'A compact accent chair with a supportive seat, made for reading corners and relaxed evenings.', 849900, 1099900, 7, 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=900&q=85', 4.0, 38, 1, 'active'),
  ('20000000-0000-4000-8000-000000000008', '10000000-0000-4000-8000-000000000006', 'MANA-APP-001', 'compact-kitchen-blender', 'Compact Kitchen Blender', 'Daily Home', 'A compact blender for smoothies, chutneys and daily kitchen prep. Easy-to-clean jar and simple controls.', 159900, 219900, 15, 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=900&q=85', 4.2, 52, 1, 'active'),
  ('20000000-0000-4000-8000-000000000009', '10000000-0000-4000-8000-000000000002', 'MANA-CAM-001', 'travel-digital-camera', 'Travel Digital Camera', 'Focus', 'A versatile compact camera for travel photos, family moments and creative projects.', 2899900, 3299900, 6, 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=85', 4.3, 41, 3, 'active'),
  ('20000000-0000-4000-8000-000000000010', '10000000-0000-4000-8000-000000000002', 'MANA-WEA-001', 'classic-analog-watch', 'Classic Analog Watch', 'Meridian', 'A timeless everyday watch with a clear face, comfortable strap and understated styling.', 279900, 399900, 22, 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=900&q=85', 4.4, 119, 4, 'active')
ON CONFLICT (sku) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  slug = EXCLUDED.slug,
  name = EXCLUDED.name,
  brand = EXCLUDED.brand,
  description = EXCLUDED.description,
  price_paise = EXCLUDED.price_paise,
  mrp_paise = EXCLUDED.mrp_paise,
  stock_quantity = EXCLUDED.stock_quantity,
  image_url = EXCLUDED.image_url,
  rating = EXCLUDED.rating,
  rating_count = EXCLUDED.rating_count,
  display_order = EXCLUDED.display_order,
  status = EXCLUDED.status,
  updated_at = now();
