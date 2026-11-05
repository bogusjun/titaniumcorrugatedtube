-- ============================================================
-- ATX 티타늄 주름관 온라인 구매 (표준품·소켓 결제 · 재고 차감 · 주문 관리)
--
-- 주름관 전용 새 Supabase 프로젝트의 SQL Editor 에 이 파일 전체를 붙여넣어 실행하세요.
-- 이 파일 하나로 필요한 표·함수가 모두 만들어지고, 여러 번 실행해도 안전합니다.
-- 자세한 순서: docs/SHOP_SETUP.md
--
-- 구조: 판매 단위(SKU) 하나가 shop_items 한 줄 — 가격·재고를 함께 가진다.
--       제품 소개 문구·사진은 그대로 src/data/products.json 에 있고, product_slug 로 연결한다.
-- ============================================================

CREATE OR REPLACE FUNCTION shop_touch_updated_at() RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ------------------------------------------------------------
-- 1. 판매 품목 (SKU 별 가격·재고)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS shop_items (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku               TEXT UNIQUE NOT NULL CHECK (sku ~ '^[A-Z0-9][A-Z0-9-]{1,39}$'),
  product_slug      TEXT NOT NULL,                 -- products.json 의 slug (tube-standard, socket)
  name              TEXT NOT NULL,                 -- 주문서·메일에 쓰는 이름
  option_label      TEXT NOT NULL,                 -- 선택지 이름 (300mm, 티타늄 · 10A 등)
  price             INTEGER NOT NULL DEFAULT 0 CHECK (price >= 0),   -- 부가세 포함 판매가(원)
  compare_at_price  INTEGER CHECK (compare_at_price IS NULL OR compare_at_price >= 0),
  stock             INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  is_active         BOOLEAN NOT NULL DEFAULT false, -- 판매 중 표시. 가격·재고를 넣은 뒤 켠다
  sort_order        INTEGER NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS shop_items_product_idx ON shop_items (product_slug, sort_order);

CREATE OR REPLACE TRIGGER shop_items_updated_at
  BEFORE UPDATE ON shop_items
  FOR EACH ROW EXECUTE FUNCTION shop_touch_updated_at();

-- ------------------------------------------------------------
-- 2. 주문 / 주문 품목
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_no           TEXT UNIQUE NOT NULL,          -- 포트원 paymentId 로도 사용
  status             TEXT NOT NULL DEFAULT 'pending'
                     CHECK (status IN ('pending','paid','preparing','shipped','delivered','cancelled','expired','failed')),
  stock_reserved     BOOLEAN NOT NULL DEFAULT true, -- 이 주문이 재고를 점유 중인지
  buyer_name         TEXT NOT NULL,
  buyer_email        TEXT NOT NULL,
  buyer_phone        TEXT NOT NULL,                 -- 숫자만 저장
  buyer_company      TEXT NOT NULL DEFAULT '',      -- 회사명(선택)
  recipient_name     TEXT NOT NULL,
  recipient_phone    TEXT NOT NULL,
  postcode           TEXT NOT NULL,
  address1           TEXT NOT NULL,
  address2           TEXT NOT NULL DEFAULT '',
  delivery_memo      TEXT NOT NULL DEFAULT '',
  items_total        INTEGER NOT NULL DEFAULT 0,
  shipping_fee       INTEGER NOT NULL DEFAULT 0,
  total_amount       INTEGER NOT NULL DEFAULT 0,
  pay_method         TEXT,
  paid_at            TIMESTAMPTZ,
  courier            TEXT,
  tracking_number    TEXT,
  shipped_at         TIMESTAMPTZ,
  cancelled_at       TIMESTAMPTZ,
  cancel_reason      TEXT,
  admin_memo         TEXT NOT NULL DEFAULT '',
  client_key         TEXT,                          -- 요청자 IP 를 서버 비밀키로 HMAC 한 값(원본 IP 는 저장하지 않음)
  expires_at         TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '30 minutes'),
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS orders_status_created_idx ON orders (status, created_at DESC);
CREATE INDEX IF NOT EXISTS orders_pending_expiry_idx ON orders (expires_at) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS orders_client_created_idx ON orders (client_key, created_at DESC) WHERE client_key IS NOT NULL;

CREATE TABLE IF NOT EXISTS order_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id      UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  item_id       UUID REFERENCES shop_items(id) ON DELETE SET NULL,
  sku           TEXT NOT NULL,
  product_slug  TEXT NOT NULL,
  item_name     TEXT NOT NULL,
  option_label  TEXT NOT NULL,
  unit_price    INTEGER NOT NULL,
  quantity      INTEGER NOT NULL CHECK (quantity > 0),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS order_items_order_idx ON order_items (order_id);

CREATE OR REPLACE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION shop_touch_updated_at();

-- 모든 표는 서버(service role)에서만 접근한다. 정책을 만들지 않으면 공개(anon) 키로는 읽기·쓰기 모두 불가.
ALTER TABLE shop_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------
-- 3. 재고 함수 (모두 한 트랜잭션 안에서 원자적으로 동작)
-- ------------------------------------------------------------

-- 주문이 점유한 재고를 되돌리고 상태를 바꾼다.
-- expired/failed 는 pending 에서만, cancelled 는 끝나지 않은 모든 상태에서 가능하다.
CREATE OR REPLACE FUNCTION shop_release_order(
  p_order_id UUID,
  p_new_status TEXT,
  p_restock BOOLEAN DEFAULT true,
  p_reason TEXT DEFAULT NULL
) RETURNS BOOLEAN
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_order orders;
BEGIN
  IF p_new_status NOT IN ('cancelled', 'expired', 'failed') THEN
    RAISE EXCEPTION 'INVALID_STATUS';
  END IF;

  SELECT * INTO v_order FROM orders WHERE id = p_order_id FOR UPDATE;
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  IF v_order.status IN ('cancelled', 'expired', 'failed') THEN
    RETURN false;
  END IF;
  IF p_new_status <> 'cancelled' AND v_order.status <> 'pending' THEN
    RETURN false;
  END IF;

  IF p_restock AND v_order.stock_reserved THEN
    UPDATE shop_items s
       SET stock = s.stock + oi.quantity
      FROM order_items oi
     WHERE oi.order_id = v_order.id
       AND oi.item_id = s.id;
  END IF;

  UPDATE orders
     SET status = p_new_status,
         stock_reserved = false,
         cancelled_at = CASE WHEN p_new_status = 'cancelled' THEN now() ELSE cancelled_at END,
         cancel_reason = COALESCE(p_reason, cancel_reason)
   WHERE id = v_order.id;

  RETURN true;
END;
$$;

-- 결제 대기 시간이 지난 주문의 재고를 풀어 준다.
-- 함께, 결제가 끝나지 않은 주문(expired·failed)은 1년이 지나면 지운다 — 개인정보처리방침의 보유 기간.
CREATE OR REPLACE FUNCTION shop_release_expired_orders() RETURNS INTEGER
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  r RECORD;
  n INTEGER := 0;
BEGIN
  FOR r IN
    SELECT id FROM orders
     WHERE status = 'pending' AND expires_at < now()
     FOR UPDATE SKIP LOCKED
  LOOP
    IF shop_release_order(r.id, 'expired', true, NULL) THEN
      n := n + 1;
    END IF;
  END LOOP;

  DELETE FROM orders
   WHERE status IN ('expired', 'failed') AND created_at < now() - interval '1 year';

  RETURN n;
END;
$$;

-- 주문 생성 + 재고 점유. 가격은 요청 값이 아니라 DB 의 판매가로 계산한다.
-- p_items: [{"sku": "TS-300", "quantity": 2}, ...]
-- p_client_key 가 있으면 같은 요청자에게 아래 제한을 적용한다(결제창만 반복해 열어 재고를 묶어 두는 남용 방지).
--   결제 대기 주문 수 < p_max_pending_orders, 결제 대기 수량 합 <= p_max_pending_units,
--   최근 1시간 주문 생성 수 < p_max_orders_per_hour
CREATE OR REPLACE FUNCTION shop_create_order(
  p_order_no TEXT,
  p_customer JSONB,
  p_items JSONB,
  p_shipping_fee INTEGER,
  p_free_shipping_threshold INTEGER,
  p_ttl_minutes INTEGER DEFAULT 30,
  p_client_key TEXT DEFAULT NULL,
  p_max_pending_orders INTEGER DEFAULT 2,
  p_max_pending_units INTEGER DEFAULT 100,
  p_max_orders_per_hour INTEGER DEFAULT 10,
  p_max_qty_per_line INTEGER DEFAULT 50
) RETURNS orders
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_order orders;
  v_entry JSONB;
  v_item shop_items;
  v_qty INTEGER;
  v_total INTEGER := 0;
  v_fee INTEGER;
  v_units INTEGER;
  v_recent INTEGER;
  v_pending INTEGER;
  v_pending_units INTEGER;
BEGIN
  PERFORM shop_release_expired_orders();

  IF jsonb_typeof(p_items) IS DISTINCT FROM 'array' OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'EMPTY_CART';
  END IF;

  IF p_client_key IS NOT NULL THEN
    -- 같은 요청자의 동시 요청을 줄 세워 제한이 정확히 적용되게 한다.
    PERFORM pg_advisory_xact_lock(hashtext('shop_create_order:' || p_client_key));

    SELECT count(*) INTO v_recent FROM orders
     WHERE client_key = p_client_key AND created_at > now() - interval '1 hour';
    IF v_recent >= p_max_orders_per_hour THEN
      RAISE EXCEPTION 'RATE_LIMITED';
    END IF;

    SELECT count(DISTINCT o.id), COALESCE(sum(oi.quantity), 0) INTO v_pending, v_pending_units
      FROM orders o LEFT JOIN order_items oi ON oi.order_id = o.id
     WHERE o.client_key = p_client_key AND o.status = 'pending' AND o.expires_at > now();
    IF v_pending >= p_max_pending_orders THEN
      RAISE EXCEPTION 'TOO_MANY_PENDING';
    END IF;

    SELECT COALESCE(sum((e->>'quantity')::INTEGER), 0) INTO v_units FROM jsonb_array_elements(p_items) e;
    IF v_pending_units + v_units > p_max_pending_units THEN
      RAISE EXCEPTION 'TOO_MANY_UNITS';
    END IF;
  END IF;

  INSERT INTO orders (
    order_no, status, stock_reserved,
    buyer_name, buyer_email, buyer_phone, buyer_company,
    recipient_name, recipient_phone, postcode, address1, address2, delivery_memo,
    expires_at, client_key
  ) VALUES (
    p_order_no, 'pending', true,
    p_customer->>'buyer_name', p_customer->>'buyer_email', p_customer->>'buyer_phone',
    COALESCE(p_customer->>'buyer_company', ''),
    p_customer->>'recipient_name', p_customer->>'recipient_phone', p_customer->>'postcode',
    p_customer->>'address1', COALESCE(p_customer->>'address2', ''), COALESCE(p_customer->>'delivery_memo', ''),
    now() + make_interval(mins => p_ttl_minutes), p_client_key
  ) RETURNING * INTO v_order;

  FOR v_entry IN SELECT * FROM jsonb_array_elements(p_items) LOOP
    v_qty := (v_entry->>'quantity')::INTEGER;
    IF v_qty IS NULL OR v_qty < 1 OR v_qty > p_max_qty_per_line OR (v_entry->>'sku') IS NULL THEN
      RAISE EXCEPTION 'INVALID_ITEM';
    END IF;

    -- 가격 0원 품목은 판매하지 않는다(가격 입력 전 실수로 켠 경우 방지)
    SELECT * INTO v_item FROM shop_items
     WHERE sku = v_entry->>'sku' AND is_active AND price > 0;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'ITEM_UNAVAILABLE' USING DETAIL = v_entry->>'sku';
    END IF;

    UPDATE shop_items
       SET stock = stock - v_qty
     WHERE id = v_item.id AND stock >= v_qty;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'OUT_OF_STOCK' USING DETAIL = v_item.name || '|' || v_item.option_label;
    END IF;

    INSERT INTO order_items (order_id, item_id, sku, product_slug, item_name, option_label, unit_price, quantity)
    VALUES (v_order.id, v_item.id, v_item.sku, v_item.product_slug, v_item.name, v_item.option_label, v_item.price, v_qty);

    v_total := v_total + v_item.price * v_qty;
  END LOOP;

  v_fee := CASE WHEN v_total >= p_free_shipping_threshold THEN 0 ELSE p_shipping_fee END;

  UPDATE orders
     SET items_total = v_total, shipping_fee = v_fee, total_amount = v_total + v_fee
   WHERE id = v_order.id
   RETURNING * INTO v_order;

  RETURN v_order;
END;
$$;

-- 결제 완료 처리. 반환값:
--   'OK'              방금 결제완료로 바뀜 (알림 메일은 이때만 보냄)
--   'ALREADY_PAID'    이미 처리된 주문 (웹훅·리다이렉트 중복 호출)
--   'AMOUNT_MISMATCH' 결제 금액이 주문 금액과 다름
--   'OUT_OF_STOCK'    대기 시간 만료로 풀린 재고를 다시 잡지 못함
--   'CANCELLED'       이미 취소된 주문
--   'NOT_FOUND'
CREATE OR REPLACE FUNCTION shop_mark_paid(
  p_order_id UUID,
  p_amount INTEGER,
  p_pay_method TEXT,
  p_paid_at TIMESTAMPTZ
) RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_order orders;
  v_line order_items;
BEGIN
  SELECT * INTO v_order FROM orders WHERE id = p_order_id FOR UPDATE;
  IF NOT FOUND THEN
    RETURN 'NOT_FOUND';
  END IF;

  IF v_order.status IN ('paid', 'preparing', 'shipped', 'delivered') THEN
    RETURN 'ALREADY_PAID';
  END IF;
  IF v_order.status = 'cancelled' THEN
    RETURN 'CANCELLED';
  END IF;
  IF p_amount IS DISTINCT FROM v_order.total_amount THEN
    RETURN 'AMOUNT_MISMATCH';
  END IF;

  IF NOT v_order.stock_reserved THEN
    -- expired / failed 주문: 재고를 다시 잡아 본다
    BEGIN
      FOR v_line IN SELECT * FROM order_items WHERE order_id = v_order.id LOOP
        UPDATE shop_items
           SET stock = stock - v_line.quantity
         WHERE id = v_line.item_id AND stock >= v_line.quantity;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'OUT_OF_STOCK';
        END IF;
      END LOOP;
    EXCEPTION WHEN raise_exception THEN
      RETURN 'OUT_OF_STOCK';
    END;
  END IF;

  UPDATE orders
     SET status = 'paid',
         stock_reserved = true,
         pay_method = p_pay_method,
         paid_at = COALESCE(p_paid_at, now())
   WHERE id = v_order.id;

  RETURN 'OK';
END;
$$;

-- 함수는 서버(service role)에서만 호출할 수 있게 한다.
REVOKE EXECUTE ON FUNCTION shop_release_order(UUID, TEXT, BOOLEAN, TEXT) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION shop_release_expired_orders() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION shop_create_order(TEXT, JSONB, JSONB, INTEGER, INTEGER, INTEGER, TEXT, INTEGER, INTEGER, INTEGER, INTEGER) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION shop_mark_paid(UUID, INTEGER, TEXT, TIMESTAMPTZ) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION shop_release_order(UUID, TEXT, BOOLEAN, TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION shop_release_expired_orders() TO service_role;
GRANT EXECUTE ON FUNCTION shop_create_order(TEXT, JSONB, JSONB, INTEGER, INTEGER, INTEGER, TEXT, INTEGER, INTEGER, INTEGER, INTEGER) TO service_role;
GRANT EXECUTE ON FUNCTION shop_mark_paid(UUID, INTEGER, TEXT, TIMESTAMPTZ) TO service_role;

-- ------------------------------------------------------------
-- 4. 판매 품목 초기값 — 가격·재고 0, 판매 중지 상태로 넣는다.
--    관리자(/admin) › 판매 품목에서 가격·재고를 입력하고 「판매 중」을 켜면 사이트에 구매 버튼이 나온다.
--    같은 SKU 가 이미 있으면 건너뛴다(입력한 가격·재고를 덮어쓰지 않음).
-- ------------------------------------------------------------
INSERT INTO shop_items (sku, product_slug, name, option_label, sort_order) VALUES
  ('TS-300',    'tube-standard', '티타늄 주름관 표준품', '300mm · 약 5권 · 3/8" NPT 양쪽 수나사', 10),
  ('TS-500',    'tube-standard', '티타늄 주름관 표준품', '500mm · 약 9권 · 3/8" NPT 양쪽 수나사', 20),
  ('TS-1000',   'tube-standard', '티타늄 주름관 표준품', '1,000mm · 약 18권 · 3/8" NPT 양쪽 수나사', 30),
  ('SK-TI-10A', 'socket',        '주름관 소켓',          '티타늄 · 10A (3/8")', 10),
  ('SK-TI-15A', 'socket',        '주름관 소켓',          '티타늄 · 15A (1/2")', 20),
  ('SK-BR-10A', 'socket',        '주름관 소켓',          '황동 · 10A (3/8")', 30),
  ('SK-BR-15A', 'socket',        '주름관 소켓',          '황동 · 15A (1/2")', 40)
ON CONFLICT (sku) DO NOTHING;
