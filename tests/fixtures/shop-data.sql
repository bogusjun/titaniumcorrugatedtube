-- 검사용 가격·재고 초기화. 각 검사 파일이 시작할 때 실행한다.
DELETE FROM orders;
DELETE FROM shop_items WHERE sku NOT IN ('TS-300','TS-500','TS-1000','SK-TI-10A','SK-TI-15A','SK-BR-10A','SK-BR-15A');

UPDATE shop_items SET is_active = true, compare_at_price = NULL;
UPDATE shop_items SET price = 33000, stock = 5  WHERE sku = 'TS-300';
UPDATE shop_items SET price = 41000, stock = 1  WHERE sku = 'TS-500';
UPDATE shop_items SET price = 59000, stock = 0  WHERE sku = 'TS-1000';
UPDATE shop_items SET price = 12000, stock = 50, compare_at_price = 15000 WHERE sku = 'SK-TI-10A';
UPDATE shop_items SET price = 14000, stock = 3  WHERE sku = 'SK-TI-15A';
-- 판매 중지 품목: 가격 0원(가격 미입력) / 가격은 있지만 꺼 둠
UPDATE shop_items SET price = 0,     stock = 10, is_active = false WHERE sku = 'SK-BR-10A';
UPDATE shop_items SET price = 6000,  stock = 10, is_active = false WHERE sku = 'SK-BR-15A';
