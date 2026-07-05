-- ============================================================
-- 001_initial_schema.sql
-- ATX 티타늄 주름관 Admin 초기 스키마
-- ============================================================

-- updated_at 자동 갱신 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- products 테이블
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             TEXT UNIQUE NOT NULL,
  name             TEXT NOT NULL,
  name_en          TEXT NOT NULL DEFAULT '',
  tagline          TEXT NOT NULL DEFAULT '',
  description      TEXT NOT NULL DEFAULT '',
  long_description TEXT NOT NULL DEFAULT '',
  price            INTEGER NOT NULL DEFAULT 0,
  images           JSONB NOT NULL DEFAULT '[]',
  specs            JSONB NOT NULL DEFAULT '[]',
  external_url     TEXT,
  is_new           BOOLEAN NOT NULL DEFAULT FALSE,
  is_bestseller    BOOLEAN NOT NULL DEFAULT FALSE,
  is_active        BOOLEAN NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- inventory 테이블
-- ============================================================
CREATE TABLE IF NOT EXISTS inventory (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size       TEXT NOT NULL,
  quantity   INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(product_id, size)
);

CREATE TRIGGER inventory_updated_at
  BEFORE UPDATE ON inventory
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- orders 테이블
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id   TEXT UNIQUE NOT NULL,
  buyer_name   TEXT NOT NULL,
  buyer_email  TEXT,
  buyer_phone  TEXT,
  shipping_address TEXT,
  product_id   UUID REFERENCES products(id),
  product_name TEXT NOT NULL,
  product_slug TEXT,
  size         TEXT,
  quantity     INTEGER NOT NULL DEFAULT 1,
  amount       INTEGER NOT NULL DEFAULT 0,
  status       TEXT NOT NULL DEFAULT 'paid'
               CHECK (status IN ('paid','preparing','shipped','delivered','cancelled')),
  memo         TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- RLS 설정
-- ============================================================

-- products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "products_public_read" ON products
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "products_service_all" ON products
  FOR ALL USING (auth.role() = 'service_role');

-- inventory
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "inventory_public_read" ON inventory
  FOR SELECT USING (TRUE);

CREATE POLICY "inventory_service_all" ON inventory
  FOR ALL USING (auth.role() = 'service_role');

-- orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "orders_service_all" ON orders
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================================
-- Storage 버킷
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS
CREATE POLICY "product_images_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "product_images_service_write" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'product-images' AND auth.role() = 'service_role'
  );

CREATE POLICY "product_images_service_update" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'product-images' AND auth.role() = 'service_role'
  );

CREATE POLICY "product_images_service_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'product-images' AND auth.role() = 'service_role'
  );

-- ============================================================
-- 인덱스
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_inventory_product_id ON inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
