import "server-only";
import { randomInt } from "node:crypto";
import { after } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { cancelPayment, describePayMethod, getPayment } from "@/lib/portone";
import { sendCancelledEmail, sendOrderPaidEmails, sendShippedEmail } from "@/lib/shop/email";
import { mapItem, revalidateStorefront, type ShopItemRow } from "@/lib/shop/catalog";
import {
  FREE_SHIPPING_THRESHOLD,
  MAX_CART_LINES,
  MAX_ORDERS_PER_HOUR_PER_CLIENT,
  MAX_PENDING_ORDERS_PER_CLIENT,
  MAX_PENDING_UNITS_PER_CLIENT,
  MAX_QTY_PER_LINE,
  ORDER_TTL_MINUTES,
  SHIPPING_FEE,
  SHOP_CONTACT,
  calcShippingFee,
  getCourier,
  trackingUrlFor,
} from "@/lib/shop/config";
import { onlyDigits } from "@/lib/shop/format";
import type { CartItem, CheckoutCustomer, OrderStatus, PublicOrder, Quote, QuoteLine } from "@/lib/shop/types";

/**
 * 온라인 구매 주문 처리 — tauti(반지몰)의 검증된 흐름을 주름관 판매 품목(SKU) 구조에 맞게 옮겼다
 *
 * 1) 결제 직전 createOrder: DB 함수가 판매가로 금액을 계산하고 재고를 30분 점유
 * 2) 결제창 종료·모바일 리디렉트·웹훅이 모두 syncPayment 로 모인다 — 포트원에서 실제 결제를 다시 조회해 금액을 대조
 * 3) 금액이 다르거나 재고가 없으면 결제를 자동 전액 취소
 */

// ------------------------------------------------------------------
// 타입 · 에러
// ------------------------------------------------------------------

export type OrderItemRecord = {
  id: string;
  order_id: string;
  item_id: string | null;
  sku: string;
  product_slug: string;
  item_name: string;
  option_label: string;
  unit_price: number;
  quantity: number;
};

export type OrderRecord = {
  id: string;
  order_no: string;
  status: OrderStatus;
  stock_reserved: boolean;
  buyer_name: string;
  buyer_email: string;
  buyer_phone: string;
  buyer_company: string;
  recipient_name: string;
  recipient_phone: string;
  postcode: string;
  address1: string;
  address2: string;
  delivery_memo: string;
  items_total: number;
  shipping_fee: number;
  total_amount: number;
  pay_method: string | null;
  paid_at: string | null;
  courier: string | null;
  tracking_number: string | null;
  shipped_at: string | null;
  cancelled_at: string | null;
  cancel_reason: string | null;
  admin_memo: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
  items: OrderItemRecord[];
};

export class ShopError extends Error {
  constructor(
    message: string,
    public code: string,
    public status = 400,
  ) {
    super(message);
  }
}

const PAID_STATUSES: OrderStatus[] = ["paid", "preparing", "shipped", "delivered"];
const TERMINAL_STATUSES: OrderStatus[] = ["cancelled", "expired", "failed"];

export function isPaidStatus(status: OrderStatus): boolean {
  return PAID_STATUSES.includes(status);
}

// ------------------------------------------------------------------
// 입력 검증
// ------------------------------------------------------------------

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SKU_RE = /^[A-Z0-9][A-Z0-9-]{1,39}$/;
/** 주문번호 = 포트원 paymentId. A + 날짜(YYMMDD) + 6자리 */
const ORDER_NO_RE = /^A\d{6}-[A-Z0-9]{6}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isOrderNo(value: unknown): value is string {
  return typeof value === "string" && ORDER_NO_RE.test(value);
}

/** 장바구니 입력을 정리한다. 같은 SKU 는 합친다. */
export function normalizeCartItems(raw: unknown): CartItem[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    throw new ShopError("장바구니가 비어 있습니다.", "EMPTY_CART");
  }
  const merged = new Map<string, CartItem>();
  for (const entry of raw) {
    const item = entry as Partial<CartItem>;
    const sku = typeof item?.sku === "string" ? item.sku.trim() : "";
    const quantity = Number(item?.quantity);
    if (!SKU_RE.test(sku) || !Number.isInteger(quantity) || quantity < 1) {
      throw new ShopError("장바구니 정보가 올바르지 않습니다.", "INVALID_CART");
    }
    const prev = merged.get(sku);
    merged.set(sku, { sku, quantity: Math.min(MAX_QTY_PER_LINE, (prev?.quantity ?? 0) + quantity) });
  }
  if (merged.size > MAX_CART_LINES) {
    throw new ShopError(`한 번에 최대 ${MAX_CART_LINES}개 품목까지 주문할 수 있습니다.`, "INVALID_CART");
  }
  return [...merged.values()];
}

function text(raw: Record<string, unknown>, key: string, label: string, max: number, required = true): string {
  const value = typeof raw[key] === "string" ? (raw[key] as string).trim() : "";
  if (required && !value) throw new ShopError(`${label}을(를) 입력해 주세요.`, "INVALID_CUSTOMER");
  if (value.length > max) throw new ShopError(`${label}이(가) 너무 깁니다.`, "INVALID_CUSTOMER");
  return value;
}

function phone(raw: Record<string, unknown>, key: string, label: string): string {
  const digits = onlyDigits(typeof raw[key] === "string" ? (raw[key] as string) : "");
  if (!/^0\d{8,10}$/.test(digits)) throw new ShopError(`${label}를 정확히 입력해 주세요.`, "INVALID_CUSTOMER");
  return digits;
}

export function validateCustomer(input: unknown): CheckoutCustomer {
  const raw = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const customer: CheckoutCustomer = {
    buyerName: text(raw, "buyerName", "주문자 이름", 30),
    buyerEmail: text(raw, "buyerEmail", "이메일", 100),
    buyerPhone: phone(raw, "buyerPhone", "주문자 연락처"),
    buyerCompany: text(raw, "buyerCompany", "회사명", 60, false),
    recipientName: text(raw, "recipientName", "받는 분 이름", 30),
    recipientPhone: phone(raw, "recipientPhone", "받는 분 연락처"),
    postcode: text(raw, "postcode", "우편번호", 10),
    address1: text(raw, "address1", "주소", 200),
    address2: text(raw, "address2", "상세주소", 100, false),
    deliveryMemo: text(raw, "deliveryMemo", "배송 요청사항", 100, false),
  };
  if (!EMAIL_RE.test(customer.buyerEmail)) throw new ShopError("이메일 형식이 올바르지 않습니다.", "INVALID_CUSTOMER");
  if (!/^\d{5}$/.test(customer.postcode)) throw new ShopError("우편번호를 주소 검색으로 입력해 주세요.", "INVALID_CUSTOMER");
  return customer;
}

// ------------------------------------------------------------------
// 견적 (장바구니 금액 · 재고 확인)
// ------------------------------------------------------------------

export async function quoteCart(items: CartItem[]): Promise<Quote> {
  const skus = [...new Set(items.map((i) => i.sku))];
  const { data, error } = await getSupabaseAdmin()
    .from("shop_items")
    .select("*")
    .in("sku", skus)
    .eq("is_active", true)
    .gt("price", 0);
  if (error) throw new ShopError("판매 정보를 불러오지 못했습니다.", "INTERNAL", 500);

  const bySku = new Map((data as ShopItemRow[] ?? []).map((row) => [row.sku, mapItem(row)]));

  const lines: QuoteLine[] = items.map((item) => {
    const s = bySku.get(item.sku);
    if (!s) {
      return {
        sku: item.sku,
        productSlug: "",
        name: "",
        optionLabel: "",
        quantity: item.quantity,
        unitPrice: 0,
        compareAtPrice: null,
        lineTotal: 0,
        available: 0,
        problem: "unavailable",
      };
    }
    return {
      sku: s.sku,
      productSlug: s.productSlug,
      name: s.name,
      optionLabel: s.optionLabel,
      quantity: item.quantity,
      unitPrice: s.price,
      compareAtPrice: s.compareAtPrice,
      lineTotal: s.price * item.quantity,
      available: s.stock,
      problem: s.stock === 0 ? "out_of_stock" : s.stock < item.quantity ? "insufficient" : null,
    };
  });

  const itemsTotal = lines.filter((l) => !l.problem).reduce((sum, l) => sum + l.lineTotal, 0);
  const shippingFee = calcShippingFee(itemsTotal);
  return {
    lines,
    itemsTotal,
    shippingFee,
    total: itemsTotal + shippingFee,
    ok: lines.length > 0 && lines.every((l) => !l.problem),
  };
}

// ------------------------------------------------------------------
// 주문 조회
// ------------------------------------------------------------------

const ORDER_SELECT = "*, items:order_items(*)";

export async function getOrderByNo(orderNo: string): Promise<OrderRecord | null> {
  const { data, error } = await getSupabaseAdmin().from("orders").select(ORDER_SELECT).eq("order_no", orderNo).maybeSingle();
  if (error) throw new ShopError("주문 정보를 불러오지 못했습니다.", "INTERNAL", 500);
  return data as OrderRecord | null;
}

export async function getOrderById(id: string): Promise<OrderRecord | null> {
  if (!UUID_RE.test(id)) return null;
  const { data, error } = await getSupabaseAdmin().from("orders").select(ORDER_SELECT).eq("id", id).maybeSingle();
  if (error) throw new ShopError("주문 정보를 불러오지 못했습니다.", "INTERNAL", 500);
  return data as OrderRecord | null;
}

/** 선택지 이름의 첫 부분만 — 「300mm · 약 5권 · …」 → 「300mm」 */
export function shortOption(optionLabel: string): string {
  return optionLabel.split(" · ")[0] ?? optionLabel;
}

/** 결제창·메일 제목에 쓰는 주문 이름 */
export function orderNameOf(order: Pick<OrderRecord, "items">): string {
  const [first, ...rest] = order.items;
  if (!first) return "ATX 티타늄 주름관 주문";
  const base = `${first.item_name} ${shortOption(first.option_label)}`;
  return rest.length ? `${base} 외 ${rest.length}건` : base;
}

export function toPublicOrder(order: OrderRecord): PublicOrder {
  return {
    orderNo: order.order_no,
    status: order.status,
    createdAt: order.created_at,
    paidAt: order.paid_at,
    items: order.items.map((i) => ({
      sku: i.sku,
      productSlug: i.product_slug,
      name: i.item_name,
      optionLabel: i.option_label,
      quantity: i.quantity,
      unitPrice: i.unit_price,
    })),
    itemsTotal: order.items_total,
    shippingFee: order.shipping_fee,
    totalAmount: order.total_amount,
    payMethod: order.pay_method,
    buyerCompany: order.buyer_company,
    recipientName: order.recipient_name,
    recipientPhone: order.recipient_phone,
    postcode: order.postcode,
    address1: order.address1,
    address2: order.address2,
    deliveryMemo: order.delivery_memo,
    courierName: getCourier(order.courier)?.name ?? null,
    trackingNumber: order.tracking_number,
    trackingUrl: trackingUrlFor(order.courier, order.tracking_number),
    cancelledAt: order.cancelled_at,
  };
}

/**
 * 주문번호만 알면 볼 수 있는 응답(결제 완료 화면)용 — 연락처·상세주소를 가린다.
 * 전체 정보는 휴대폰 번호까지 확인하는 주문 조회에서만 보여 준다.
 */
export function toReceipt(order: OrderRecord): PublicOrder {
  const full = toPublicOrder(order);
  const name = full.recipientName;
  return {
    ...full,
    recipientName: name.length <= 1 ? name : name.length === 2 ? `${name[0]}*` : `${name[0]}${"*".repeat(name.length - 2)}${name.at(-1)}`,
    recipientPhone: full.recipientPhone.replace(/^(\d{3})\d+(\d{4})$/, "$1-****-$2"),
    address2: "",
    deliveryMemo: "",
  };
}

/** 비회원 주문 조회: 주문번호 + 주문자 휴대폰 번호 */
export async function lookupOrder(orderNo: string, phoneInput: string): Promise<OrderRecord | null> {
  if (!isOrderNo(orderNo)) return null;
  const order = await getOrderByNo(orderNo);
  if (!order || order.buyer_phone !== onlyDigits(phoneInput)) return null;
  return order;
}

// ------------------------------------------------------------------
// 주문 생성 (재고 점유)
// ------------------------------------------------------------------

function generateOrderNo(): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 6; i++) suffix += alphabet[randomInt(alphabet.length)];
  return `A${get("year")}${get("month")}${get("day")}-${suffix}`;
}

export async function createOrder(customer: CheckoutCustomer, items: CartItem[], clientKey: string | null = null): Promise<OrderRecord> {
  const supabase = getSupabaseAdmin();
  const payload = {
    buyer_name: customer.buyerName,
    buyer_email: customer.buyerEmail,
    buyer_phone: customer.buyerPhone,
    buyer_company: customer.buyerCompany,
    recipient_name: customer.recipientName,
    recipient_phone: customer.recipientPhone,
    postcode: customer.postcode,
    address1: customer.address1,
    address2: customer.address2,
    delivery_memo: customer.deliveryMemo,
  };
  const rpcItems = items.map((i) => ({ sku: i.sku, quantity: i.quantity }));

  for (let attempt = 0; attempt < 4; attempt++) {
    const { data, error } = await supabase.rpc("shop_create_order", {
      p_order_no: generateOrderNo(),
      p_customer: payload,
      p_items: rpcItems,
      p_shipping_fee: SHIPPING_FEE,
      p_free_shipping_threshold: FREE_SHIPPING_THRESHOLD,
      p_ttl_minutes: ORDER_TTL_MINUTES,
      p_client_key: clientKey,
      p_max_pending_orders: MAX_PENDING_ORDERS_PER_CLIENT,
      p_max_pending_units: MAX_PENDING_UNITS_PER_CLIENT,
      p_max_orders_per_hour: MAX_ORDERS_PER_HOUR_PER_CLIENT,
      p_max_qty_per_line: MAX_QTY_PER_LINE,
    });

    if (error) {
      if (error.code === "23505") continue; // 주문번호 충돌 → 재시도
      if (error.message === "TOO_MANY_PENDING") {
        throw new ShopError(
          `결제 대기 중인 주문이 있습니다. 열려 있는 결제창을 마치거나 잠시 후 다시 시도해 주세요. 문의: ${SHOP_CONTACT.phone}`,
          "TOO_MANY_PENDING",
          429,
        );
      }
      if (error.message === "TOO_MANY_UNITS") {
        throw new ShopError(
          `한 번에 결제할 수 있는 수량(${MAX_PENDING_UNITS_PER_CLIENT}개)을 넘었습니다. 대량 구매는 견적 문의 또는 ${SHOP_CONTACT.phone}로 연락해 주세요.`,
          "TOO_MANY_UNITS",
          429,
        );
      }
      if (error.message === "RATE_LIMITED") {
        throw new ShopError("주문 시도가 너무 많습니다. 잠시 후 다시 시도해 주세요.", "RATE_LIMITED", 429);
      }
      if (error.message === "OUT_OF_STOCK") {
        const [name, option] = (error.details ?? "").split("|");
        throw new ShopError(
          name ? `${name} ${shortOption(option ?? "")} 재고가 부족합니다. 장바구니를 확인해 주세요.` : "재고가 부족한 품목이 있습니다.",
          "OUT_OF_STOCK",
          409,
        );
      }
      if (error.message === "ITEM_UNAVAILABLE") {
        throw new ShopError("판매가 중지된 품목이 있습니다. 장바구니를 확인해 주세요.", "ITEM_UNAVAILABLE", 409);
      }
      if (error.message === "INVALID_ITEM") {
        throw new ShopError(`한 품목은 최대 ${MAX_QTY_PER_LINE}개까지 주문할 수 있습니다.`, "INVALID_CART", 400);
      }
      console.error("[orders] 주문 생성 실패:", error);
      throw new ShopError("주문을 만들지 못했습니다. 잠시 후 다시 시도해 주세요.", "INTERNAL", 500);
    }

    revalidateStorefront();
    const order = await getOrderById((data as { id: string }).id);
    if (!order) throw new ShopError("주문을 만들지 못했습니다.", "INTERNAL", 500);
    return order;
  }
  throw new ShopError("주문을 만들지 못했습니다. 다시 시도해 주세요.", "INTERNAL", 500);
}

// ------------------------------------------------------------------
// 결제 동기화 (리디렉트 · 결제창 응답 · 웹훅이 모두 이 함수로 처리)
// ------------------------------------------------------------------

export type SyncResult =
  | { result: "paid"; order: OrderRecord }
  | { result: "pending"; order: OrderRecord }
  | { result: "failed"; order: OrderRecord; message: string };

async function releaseOrder(orderId: string, status: "cancelled" | "expired" | "failed", restock: boolean, reason: string | null) {
  const { data, error } = await getSupabaseAdmin().rpc("shop_release_order", {
    p_order_id: orderId,
    p_new_status: status,
    p_restock: restock,
    p_reason: reason,
  });
  if (error) {
    console.error("[orders] 재고 복원 실패:", error);
    throw new ShopError("주문 상태를 바꾸지 못했습니다.", "INTERNAL", 500);
  }
  if (data) revalidateStorefront();
  return Boolean(data);
}

async function refetch(order: OrderRecord): Promise<OrderRecord> {
  return (await getOrderById(order.id)) ?? order;
}

export async function syncPayment(orderNo: string): Promise<SyncResult> {
  const order = await getOrderByNo(orderNo);
  if (!order) throw new ShopError("주문을 찾을 수 없습니다.", "NOT_FOUND", 404);
  if (isPaidStatus(order.status)) return { result: "paid", order };

  const payment = await getPayment(orderNo);
  if (!payment) {
    return order.status === "pending"
      ? { result: "pending", order }
      : { result: "failed", order, message: "결제가 완료되지 않았습니다." };
  }

  if (payment.status === "PAID") {
    const amount = payment.currency === "KRW" || payment.currency === "CURRENCY_KRW" ? payment.amount.total : -1;
    const { data, error } = await getSupabaseAdmin().rpc("shop_mark_paid", {
      p_order_id: order.id,
      p_amount: amount,
      p_pay_method: describePayMethod(payment),
      p_paid_at: payment.paidAt ?? null,
    });
    if (error) {
      console.error("[orders] 결제 완료 처리 실패:", error);
      throw new ShopError(`결제 확인 중 오류가 발생했습니다. ${SHOP_CONTACT.phone}로 문의해 주세요.`, "INTERNAL", 500);
    }

    if (data === "OK" || data === "ALREADY_PAID") {
      const fresh = await refetch(order);
      if (data === "OK") {
        revalidateStorefront();
        after(() => sendOrderPaidEmails(fresh));
      }
      return { result: "paid", order: fresh };
    }

    // 결제는 됐지만 주문으로 받을 수 없는 경우 → 자동 전액 취소
    const reason =
      data === "AMOUNT_MISMATCH"
        ? "결제 금액이 주문 금액과 일치하지 않아 결제가 자동 취소되었습니다."
        : data === "OUT_OF_STOCK"
          ? "결제 대기 시간이 지나 재고가 소진되어 결제가 자동 취소되었습니다."
          : "취소된 주문이라 결제가 자동 취소되었습니다.";
    await cancelPayment(orderNo, reason);
    if (order.status === "pending") await releaseOrder(order.id, "failed", true, reason);
    else await getSupabaseAdmin().from("orders").update({ cancel_reason: reason }).eq("id", order.id);
    return { result: "failed", order: await refetch(order), message: reason };
  }

  if (payment.status === "FAILED" || payment.status === "CANCELLED") {
    if (order.status === "pending") await releaseOrder(order.id, "failed", true, null);
    return { result: "failed", order: await refetch(order), message: "결제가 완료되지 않았습니다." };
  }

  // READY / PENDING / VIRTUAL_ACCOUNT_ISSUED
  return order.status === "pending"
    ? { result: "pending", order }
    : { result: "failed", order, message: "결제 대기 시간이 지났습니다. 다시 주문해 주세요." };
}

/** 결제창을 닫았거나 실패했을 때: 실제로 결제되지 않았으면 재고를 바로 풀어 준다 */
export async function abortPayment(orderNo: string): Promise<SyncResult> {
  const synced = await syncPayment(orderNo);
  if (synced.result !== "pending") return synced;
  await releaseOrder(synced.order.id, "failed", true, null);
  return { result: "failed", order: await refetch(synced.order), message: "결제가 취소되었습니다." };
}

// ------------------------------------------------------------------
// 관리자
// ------------------------------------------------------------------

export async function listOrders(opts: { status?: string; q?: string; page: number; limit: number }) {
  let query = getSupabaseAdmin()
    .from("orders")
    .select(ORDER_SELECT, { count: "exact" })
    .order("created_at", { ascending: false })
    .range((opts.page - 1) * opts.limit, opts.page * opts.limit - 1);

  if (opts.status === "active") query = query.in("status", PAID_STATUSES);
  else if (opts.status === "todo") query = query.in("status", ["paid", "preparing"]);
  else if (opts.status === "unpaid") query = query.in("status", ["pending", "expired", "failed"]);
  else if (opts.status && opts.status !== "all") query = query.eq("status", opts.status);

  const q = (opts.q ?? "").replace(/[^0-9A-Za-z가-힣-]/g, "").slice(0, 30);
  if (q) {
    const digits = onlyDigits(q);
    const filters = [`order_no.ilike.%${q}%`, `buyer_name.ilike.%${q}%`, `recipient_name.ilike.%${q}%`, `buyer_company.ilike.%${q}%`];
    if (digits.length >= 4) filters.push(`buyer_phone.ilike.%${digits}%`);
    query = query.or(filters.join(","));
  }

  const { data, error, count } = await query;
  if (error) throw new ShopError(error.message, "INTERNAL", 500);
  return { data: (data ?? []) as OrderRecord[], total: count ?? 0 };
}

export async function updateOrderByAdmin(
  id: string,
  patch: { status?: string; courier?: string; trackingNumber?: string; adminMemo?: string },
): Promise<OrderRecord> {
  const order = await getOrderById(id);
  if (!order) throw new ShopError("주문을 찾을 수 없습니다.", "NOT_FOUND", 404);

  const update: Record<string, unknown> = {};
  if (patch.adminMemo !== undefined) update.admin_memo = String(patch.adminMemo).slice(0, 500);

  if (patch.courier !== undefined) {
    if (!getCourier(patch.courier)) throw new ShopError("택배사를 선택해 주세요.", "INVALID");
    update.courier = patch.courier;
  }
  if (patch.trackingNumber !== undefined) {
    const no = String(patch.trackingNumber).replace(/[^0-9A-Za-z-]/g, "").slice(0, 30);
    update.tracking_number = no || null;
  }

  let newlyShipped = false;
  if (patch.status !== undefined && patch.status !== order.status) {
    if (!PAID_STATUSES.includes(patch.status as OrderStatus) || !isPaidStatus(order.status)) {
      throw new ShopError("결제가 끝난 주문만 배송 상태를 바꿀 수 있습니다. 취소는 「주문 취소」 버튼을 쓰세요.", "INVALID");
    }
    update.status = patch.status;
    if (patch.status === "shipped") {
      const tracking = (update.tracking_number as string | null | undefined) ?? order.tracking_number;
      const courier = (update.courier as string | undefined) ?? order.courier;
      if (!tracking || !courier) throw new ShopError("배송중으로 바꾸려면 택배사와 송장번호를 입력해 주세요.", "INVALID");
      if (!order.shipped_at) {
        update.shipped_at = new Date().toISOString();
        newlyShipped = true;
      }
    }
  }

  if (Object.keys(update).length === 0) return order;

  const { error } = await getSupabaseAdmin().from("orders").update(update).eq("id", id);
  if (error) throw new ShopError(error.message, "INTERNAL", 500);

  const fresh = await refetch(order);
  if (newlyShipped) {
    const courier = getCourier(fresh.courier);
    after(() => sendShippedEmail(fresh, courier?.name ?? "", trackingUrlFor(fresh.courier, fresh.tracking_number)));
  }
  return fresh;
}

/** 관리자 주문 취소: 결제된 주문이면 포트원 전액 환불 후 재고 복원 */
export async function cancelOrderByAdmin(id: string, reason: string, restock: boolean): Promise<{ order: OrderRecord; refunded: boolean }> {
  const order = await getOrderById(id);
  if (!order) throw new ShopError("주문을 찾을 수 없습니다.", "NOT_FOUND", 404);
  if (TERMINAL_STATUSES.includes(order.status)) throw new ShopError("이미 끝난 주문입니다.", "INVALID");

  const cleanReason = reason.trim().slice(0, 200) || "판매자 취소";
  let refunded = false;
  const payment = await getPayment(order.order_no);
  if (payment && (payment.status === "PAID" || payment.status === "PARTIAL_CANCELLED")) {
    await cancelPayment(order.order_no, cleanReason);
    refunded = true;
  } else if (payment?.status === "CANCELLED") {
    refunded = isPaidStatus(order.status);
  }

  await releaseOrder(order.id, "cancelled", restock, cleanReason);
  const fresh = await refetch(order);
  if (isPaidStatus(order.status) || refunded) after(() => sendCancelledEmail(fresh, refunded));
  return { order: fresh, refunded };
}
