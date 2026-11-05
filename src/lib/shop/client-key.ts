import "server-only";
import { createHmac } from "node:crypto";

/**
 * 주문 남용 제한용 접속자 식별값. IP를 서버 비밀키로 HMAC 해시해 원본 IP는 저장하지 않습니다.
 * Vercel은 x-real-ip / x-forwarded-for 를 직접 채워주므로 클라이언트가 위조할 수 없습니다.
 */
export function clientKeyFrom(headers: Headers): string | null {
  const ip = headers.get("x-real-ip")?.trim() || headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (!ip) return null;
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.ADMIN_SESSION_SECRET ?? "atx-tube";
  return createHmac("sha256", secret).update(`order-client:${ip}`).digest("hex").slice(0, 32);
}
