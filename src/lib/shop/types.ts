// 클라이언트·서버 양쪽에서 쓰는 온라인 구매 타입

/** 화면에 보여 주는 판매 품목(SKU) */
export type ShopItem = {
  id: string;
  sku: string;
  productSlug: string;
  name: string;
  optionLabel: string;
  /** 부가세 포함 판매가(원) */
  price: number;
  /** 할인 전 가격 — 판매가보다 클 때만 할인으로 표시 */
  compareAtPrice: number | null;
  stock: number;
};

export type CartItem = {
  sku: string;
  quantity: number;
};

export type QuoteProblem = "unavailable" | "out_of_stock" | "insufficient";

export type QuoteLine = {
  sku: string;
  productSlug: string;
  name: string;
  optionLabel: string;
  quantity: number;
  unitPrice: number;
  compareAtPrice: number | null;
  lineTotal: number;
  /** 지금 남은 재고 */
  available: number;
  problem: QuoteProblem | null;
};

export type Quote = {
  lines: QuoteLine[];
  itemsTotal: number;
  shippingFee: number;
  total: number;
  /** 모든 줄이 주문 가능한지 */
  ok: boolean;
};

export type CheckoutCustomer = {
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  /** 회사명(선택) */
  buyerCompany: string;
  recipientName: string;
  recipientPhone: string;
  postcode: string;
  address1: string;
  address2: string;
  deliveryMemo: string;
};

export type OrderStatus =
  | "pending"
  | "paid"
  | "preparing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "expired"
  | "failed";

export type PublicOrderItem = {
  sku: string;
  productSlug: string;
  name: string;
  optionLabel: string;
  quantity: number;
  unitPrice: number;
};

/** 구매자에게 보여 주는 주문 정보 */
export type PublicOrder = {
  orderNo: string;
  status: OrderStatus;
  createdAt: string;
  paidAt: string | null;
  items: PublicOrderItem[];
  itemsTotal: number;
  shippingFee: number;
  totalAmount: number;
  payMethod: string | null;
  buyerCompany: string;
  recipientName: string;
  recipientPhone: string;
  postcode: string;
  address1: string;
  address2: string;
  deliveryMemo: string;
  courierName: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
  cancelledAt: string | null;
};
