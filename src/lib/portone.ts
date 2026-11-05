import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

// 포트원 V2 REST API. https://developers.portone.io/api/rest-v2
const API_BASE = process.env.PORTONE_API_URL ?? "https://api.portone.io";

export type PortOnePaymentStatus =
  | "READY"
  | "PENDING"
  | "VIRTUAL_ACCOUNT_ISSUED"
  | "PAID"
  | "FAILED"
  | "PARTIAL_CANCELLED"
  | "CANCELLED";

export type PortOnePayment = {
  id: string;
  status: PortOnePaymentStatus;
  amount: { total: number };
  currency: string;
  paidAt?: string;
  method?: { type?: string; provider?: string; card?: { name?: string } };
};

export class PortOneError extends Error {
  constructor(message: string, public status: number, public type?: string) {
    super(message);
  }
}

function secret(): string {
  const s = process.env.PORTONE_API_SECRET;
  if (!s) throw new Error("PORTONE_API_SECRET 환경변수가 설정되지 않았습니다.");
  return s;
}

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `PortOne ${secret()}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
  const text = await res.text();
  const body = text ? JSON.parse(text) : {};
  if (!res.ok) {
    throw new PortOneError(body?.message ?? `PortOne API ${res.status}`, res.status, body?.type);
  }
  return body as T;
}

/** 결제 단건 조회. 결제가 없으면 null */
export async function getPayment(paymentId: string): Promise<PortOnePayment | null> {
  try {
    return await call<PortOnePayment>(`/payments/${encodeURIComponent(paymentId)}`);
  } catch (err) {
    if (err instanceof PortOneError && err.status === 404) return null;
    throw err;
  }
}

/** 결제 전액 취소 */
export async function cancelPayment(paymentId: string, reason: string): Promise<void> {
  try {
    await call(`/payments/${encodeURIComponent(paymentId)}/cancel`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    });
  } catch (err) {
    // 이미 취소된 결제는 성공으로 간주
    if (err instanceof PortOneError && err.type === "PAYMENT_ALREADY_CANCELLED") return;
    throw err;
  }
}

export function describePayMethod(payment: PortOnePayment): string {
  const m = payment.method;
  switch (m?.type) {
    case "PaymentMethodCard":
      return m.card?.name ? `카드 (${m.card.name})` : "카드";
    case "PaymentMethodEasyPay":
      return m.provider ? `간편결제 (${m.provider})` : "간편결제";
    case "PaymentMethodTransfer":
      return "계좌이체";
    case "PaymentMethodVirtualAccount":
      return "가상계좌";
    case "PaymentMethodMobile":
      return "휴대폰";
    default:
      return "카드";
  }
}

/**
 * 포트원 웹훅 서명 검증 (Standard Webhooks 규격).
 * PORTONE_WEBHOOK_SECRET이 없으면 검증을 건너뜁니다. 웹훅 본문은 신뢰하지 않고
 * 항상 결제 조회 API로 실제 상태를 다시 확인하므로, 검증 없이도 위조 결제는 불가능합니다.
 */
export function verifyWebhook(rawBody: string, headers: Headers): boolean {
  const webhookSecret = process.env.PORTONE_WEBHOOK_SECRET;
  if (!webhookSecret) return true;

  const id = headers.get("webhook-id");
  const timestamp = headers.get("webhook-timestamp");
  const signatures = headers.get("webhook-signature");
  if (!id || !timestamp || !signatures) return false;

  const ts = Number(timestamp);
  if (!Number.isFinite(ts) || Math.abs(Date.now() / 1000 - ts) > 5 * 60) return false;

  const key = Buffer.from(webhookSecret.replace(/^whsec_/, ""), "base64");
  const expected = createHmac("sha256", key).update(`${id}.${timestamp}.${rawBody}`).digest();

  return signatures.split(" ").some((entry) => {
    const [version, sig] = entry.split(",");
    if (version !== "v1" || !sig) return false;
    const given = Buffer.from(sig, "base64");
    return given.length === expected.length && timingSafeEqual(given, expected);
  });
}
