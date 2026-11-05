// 재고 함수(002_shop.sql) 직접 검사: 주문 생성·품절·결제 확인·만료·취소 복원·권한·동시성·남용 제한·파기
import pg from "pg";
import { db, ok, pool, resetShopData, run, stock } from "./lib.mjs";

const CUSTOMER = {
  buyer_name: "검사", buyer_email: "t@example.com", buyer_phone: "01000000000", buyer_company: "(주)검사",
  recipient_name: "검사", recipient_phone: "01000000000", postcode: "06236", address1: "서울",
};
let seq = 0;
const nextNo = () => `DB${++seq}`;

/** shop_create_order 호출. items: [[sku, qty], ...] — 배송비 4000, 10만 원 이상 무료 */
async function create(items, { clientKey = null, orderNo = nextNo(), client = pool } = {}) {
  const rows = items.map(([sku, quantity]) => ({ sku, quantity }));
  const { rows: out } = await client.query(
    "SELECT * FROM shop_create_order($1, $2, $3, 4000, 100000, 30, $4)",
    [orderNo, CUSTOMER, JSON.stringify(rows), clientKey],
  );
  return out[0];
}

/** 예외 메시지를 돌려준다 (성공하면 null) */
async function errorOf(promise) {
  try {
    await promise;
    return null;
  } catch (err) {
    return err.message;
  }
}

const markPaid = async (orderId, amount) =>
  (await db("SELECT shop_mark_paid($1, $2, 'CARD', now()) AS r", [orderId, amount]))[0].r;
const release = async (orderId, status) =>
  (await db("SELECT shop_release_order($1, $2, true, '검사') AS r", [orderId, status]))[0].r;
const statusOf = async (orderId) => (await db("SELECT status, stock_reserved FROM orders WHERE id = $1", [orderId]))[0];

await run("db", async () => {
  await resetShopData();

  // ---- 주문 생성 ----
  const o1 = await create([["TS-300", 2], ["SK-TI-10A", 3]]);
  ok(o1.status === "pending" && o1.items_total === 102000 && o1.shipping_fee === 0 && o1.total_amount === 102000, "order total from DB prices (33,000×2 + 12,000×3), free shipping over 100,000");
  ok(o1.buyer_company === "(주)검사", "company name stored");
  ok((await stock("TS-300")) === 3 && (await stock("SK-TI-10A")) === 47, "stock reserved on create");
  const [line] = await db("SELECT sku, item_name, option_label, unit_price FROM order_items WHERE order_id = $1 AND sku = 'TS-300'", [o1.id]);
  ok(line.item_name === "티타늄 주름관 표준품" && line.option_label.startsWith("300mm") && line.unit_price === 33000, "order line keeps name/option/price snapshot");

  ok((await errorOf(create([["TS-300", 1], ["TS-1000", 1]]))) === "OUT_OF_STOCK" && (await stock("TS-300")) === 3, "out-of-stock line rolls back the whole order");
  ok((await errorOf(create([["SK-BR-10A", 1]]))) === "ITEM_UNAVAILABLE", "0-won item cannot be ordered");
  ok((await errorOf(create([["SK-BR-15A", 1]]))) === "ITEM_UNAVAILABLE", "inactive item cannot be ordered");
  ok((await errorOf(create([["SK-TI-10A", 51]]))) === "INVALID_ITEM", "more than 50 per line refused");
  ok((await errorOf(create([]))) === "EMPTY_CART", "empty cart refused");

  // ---- 결제 확인 ----
  ok((await markPaid(o1.id, 100)) === "AMOUNT_MISMATCH", "wrong amount → AMOUNT_MISMATCH");
  ok((await markPaid(o1.id, 102000)) === "OK", "right amount → OK");
  ok((await markPaid(o1.id, 102000)) === "ALREADY_PAID", "second confirm → ALREADY_PAID");

  // ---- 배송비 ----
  const o3 = await create([["SK-TI-15A", 1]]);
  ok(o3.items_total === 14000 && o3.shipping_fee === 4000 && o3.total_amount === 18000, "shipping fee 4,000 under 100,000");

  // ---- 만료 ----
  const o2 = await create([["TS-500", 1]]);
  await db("UPDATE orders SET expires_at = now() - interval '1 minute' WHERE id = $1", [o2.id]);
  ok((await db("SELECT shop_release_expired_orders() AS n"))[0].n === 1, "expired pending order released");
  ok((await statusOf(o2.id)).status === "expired" && (await stock("TS-500")) === 1, "expiry returns stock");
  ok((await markPaid(o2.id, 45000)) === "OK" && (await stock("TS-500")) === 0, "late payment re-reserves stock");

  await db("UPDATE shop_items SET stock = 1 WHERE sku = 'SK-TI-15A'");
  const a = await create([["SK-TI-15A", 1]]);
  await db("UPDATE orders SET expires_at = now() - interval '1 minute' WHERE id = $1", [a.id]);
  await create([["SK-TI-15A", 1]]); // 다른 사람이 풀린 재고를 가져감
  ok((await markPaid(a.id, 18000)) === "OUT_OF_STOCK" && (await stock("SK-TI-15A")) === 0, "late payment with no stock left → OUT_OF_STOCK");

  // ---- 취소 ----
  ok((await release(o1.id, "cancelled")) === true, "cancel paid order");
  ok((await stock("TS-300")) === 5 && (await stock("SK-TI-10A")) === 50, "cancel restores stock");
  ok((await release(o1.id, "cancelled")) === false, "second cancel is a no-op");
  ok((await release(o2.id, "expired")) === false, "paid order cannot be expired");

  // ---- 권한: 공개(anon) 역할 ----
  const c = await pool.connect();
  try {
    await c.query("SET ROLE anon");
    ok((await errorOf(c.query("SELECT shop_release_expired_orders()")))?.includes("permission denied") ?? false, "anon cannot call stock functions");
    ok((await c.query("SELECT count(*)::int AS n FROM orders")).rows[0].n === 0, "anon cannot read orders (RLS)");
    ok((await c.query("SELECT count(*)::int AS n FROM shop_items")).rows[0].n === 0, "anon cannot read shop items (RLS)");
    await c.query("UPDATE shop_items SET price = 1 WHERE sku = 'TS-300'");
    await c.query("RESET ROLE");
    ok((await db("SELECT price FROM shop_items WHERE sku = 'TS-300'"))[0].price === 33000, "anon cannot change prices");
  } finally {
    await c.query("RESET ROLE").catch(() => {});
    c.release();
  }

  // ---- 동시 주문: 마지막 1개 ----
  await db("UPDATE shop_items SET stock = 1 WHERE sku = 'TS-1000'");
  const racers = Array.from({ length: 10 }, async () => {
    const client = new pg.Client({ connectionString: pool.options.connectionString });
    await client.connect();
    try {
      return (await errorOf(create([["TS-1000", 1]], { client }))) === null;
    } finally {
      await client.end();
    }
  });
  const wins = (await Promise.all(racers)).filter(Boolean).length;
  ok(wins === 1 && (await stock("TS-1000")) === 0, `10 concurrent buyers for the last unit → ${wins} succeeded`);

  // ---- 남용 제한 (접속자별) ----
  await db("UPDATE shop_items SET stock = 500 WHERE sku IN ('SK-TI-10A', 'SK-TI-15A')");
  const one = [["SK-TI-10A", 1]];
  const p1 = await create(one, { clientKey: "A" });
  await create(one, { clientKey: "A" });
  ok((await errorOf(create(one, { clientKey: "A" }))) === "TOO_MANY_PENDING", "3rd open payment from same client refused");
  ok((await errorOf(create(one, { clientKey: "B" }))) === null, "other client unaffected");
  await release(p1.id, "failed");
  ok((await errorOf(create(one, { clientKey: "A" }))) === null, "after one is released the client can order again");
  ok((await errorOf(create([["SK-TI-10A", 50], ["SK-TI-15A", 50], ["TS-300", 1]], { clientKey: "C" }))) === "TOO_MANY_UNITS", "more than 100 pending units refused");
  for (let i = 0; i < 10; i++) {
    const o = await create(one, { clientKey: "D" });
    await release(o.id, "failed");
  }
  ok((await errorOf(create(one, { clientKey: "D" }))) === "RATE_LIMITED", "11th order within an hour refused");
  ok((await errorOf(create(one, { clientKey: null }))) === null, "no client key → no limits");

  const limited = Array.from({ length: 6 }, async () => {
    const client = new pg.Client({ connectionString: pool.options.connectionString });
    await client.connect();
    try {
      return (await errorOf(create(one, { clientKey: "E", client }))) === null;
    } finally {
      await client.end();
    }
  });
  const allowed = (await Promise.all(limited)).filter(Boolean).length;
  ok(allowed === 2, `6 concurrent requests from one client → ${allowed} allowed`);

  // ---- 결제 안 된 주문 1년 뒤 파기 (개인정보처리방침) ----
  const old = await create(one);
  await release(old.id, "failed");
  await db("UPDATE orders SET created_at = now() - interval '13 months' WHERE id = $1", [old.id]);
  const keepPaid = (await db("SELECT id FROM orders WHERE status = 'paid' LIMIT 1"))[0];
  await db("UPDATE orders SET created_at = now() - interval '13 months' WHERE id = $1", [keepPaid.id]);
  await db("SELECT shop_release_expired_orders()");
  ok((await db("SELECT count(*)::int AS n FROM orders WHERE id = $1", [old.id]))[0].n === 0, "unpaid order older than 1 year purged");
  ok((await db("SELECT count(*)::int AS n FROM orders WHERE id = $1", [keepPaid.id]))[0].n === 1, "paid order kept (5-year legal retention)");
});
