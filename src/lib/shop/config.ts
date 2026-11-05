/**
 * 온라인 구매 정책 값 — 구매 안내 문구(ShopPolicyNotice)·이용약관과 일치해야 한다
 *
 * ⚠ 배송비·무료배송 기준은 회사 확정 전 임시값이다. 정해지면 여기만 바꾸면 된다 (docs/SHOP_SETUP.md).
 */
export const SHIPPING_FEE = 4000;
export const FREE_SHIPPING_THRESHOLD = 100000;

/** 온라인으로 파는 제품(products.json slug) — 나머지 제품은 견적 문의 */
export const SHOP_PRODUCT_SLUGS = ["tube-standard", "socket"] as const;

/** 결제창을 연 뒤 재고를 붙잡아 두는 시간(분) */
export const ORDER_TTL_MINUTES = 30;

/** 한 품목당 최대 주문 수량 — 더 많으면 견적 문의로 안내 (DB 함수 인자로도 넘긴다) */
export const MAX_QTY_PER_LINE = 50;
export const MAX_CART_LINES = 20;

/** 관리자 화면에서 「재고 적음」으로 표시하는 기준 */
export const LOW_STOCK_THRESHOLD = 5;

/** 같은 접속자 기준 남용 방지 — 결제창만 반복해 열어 재고를 묶어 두는 것을 막는다 */
export const MAX_PENDING_ORDERS_PER_CLIENT = 2;
export const MAX_PENDING_UNITS_PER_CLIENT = 100;
export const MAX_ORDERS_PER_HOUR_PER_CLIENT = 10;

export const SHOP_CONTACT = { phone: "1544-1909", email: "777@atx.kr" };

export type Courier = { code: string; name: string; trackingUrl: (no: string) => string };

export const COURIERS: Courier[] = [
  { code: "cj", name: "CJ대한통운", trackingUrl: (no) => `https://trace.cjlogistics.com/next/tracking.html?wblNo=${encodeURIComponent(no)}` },
  { code: "epost", name: "우체국택배", trackingUrl: (no) => `https://service.epost.go.kr/trace.RetrieveDomRigiTraceList.comm?sid1=${encodeURIComponent(no)}` },
  { code: "lotte", name: "롯데택배", trackingUrl: (no) => `https://www.lotteglogis.com/home/reservation/tracking/linkView?InvNo=${encodeURIComponent(no)}` },
  { code: "hanjin", name: "한진택배", trackingUrl: (no) => `https://www.hanjin.com/kor/CMS/DeliveryMgr/WaybillResult.do?mCode=MN038&schLang=KR&wblnumText2=${encodeURIComponent(no)}` },
  { code: "logen", name: "로젠택배", trackingUrl: (no) => `https://www.ilogen.com/web/personal/trace/${encodeURIComponent(no)}` },
  { code: "kdexp", name: "경동택배", trackingUrl: (no) => `https://kdexp.com/service/delivery/etc/delivery.do?barcode=${encodeURIComponent(no)}` },
];

export const DEFAULT_COURIER = "cj";

export function getCourier(code: string | null | undefined): Courier | undefined {
  return COURIERS.find((c) => c.code === code);
}

export function trackingUrlFor(courier: string | null | undefined, trackingNumber: string | null | undefined): string | null {
  if (!trackingNumber) return null;
  return getCourier(courier)?.trackingUrl(trackingNumber.replace(/[^0-9A-Za-z]/g, "")) ?? null;
}

export function calcShippingFee(itemsTotal: number): number {
  if (itemsTotal <= 0) return 0;
  return itemsTotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
}

/**
 * 판매자 정보 — 전자상거래법상 사이트 아래쪽에 표시해야 한다(상호·대표자·주소·전화·사업자번호·통신판매업 신고번호).
 * ⚠ 대표자·통신판매업 신고번호는 회사 확인 후 채운다. 비어 있으면 푸터에 그 항목을 표시하지 않는다.
 *    판매를 켜기 전(관리자 › 판매 품목 「판매 중」)에 반드시 채울 것 — docs/SHOP_SETUP.md
 */
export const SELLER = {
  legalName: "(주)에이티엑스",
  representative: "",
  mailOrderNo: "",
  businessNo: "131-86-09143",
  hosting: "Vercel Inc.",
};
