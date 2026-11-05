declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * 견적 폼 접수 성공 → GA4 권장 이벤트 generate_lead
 * GA4 를 GA 화면에서 「주요 이벤트」로 표시하면 전환으로 잡힌다. GA4 가 꺼져 있으면 아무 일도 하지 않는다.
 */
export function trackLead(siteLang: "ko" | "en" | "ja") {
  try {
    window.gtag?.("event", "generate_lead", { form_name: "quote", site_lang: siteLang });
  } catch {
    /* 통계 전송이 실패해도 폼 동작은 막지 않는다 */
  }
}

/**
 * 온라인 결제 완료 → GA4 권장 이벤트 purchase (같은 주문은 transaction_id 로 한 번만 집계된다)
 */
export function trackPurchase(orderNo: string, totalWon: number) {
  try {
    window.gtag?.("event", "purchase", { transaction_id: orderNo, value: totalWon, currency: "KRW" });
  } catch {
    /* 통계 전송이 실패해도 결제 화면은 막지 않는다 */
  }
}
