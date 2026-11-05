import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

/**
 * 관리자 세션 — 「만료시각.서명」 형태의 HMAC 서명 쿠키 (12시간)
 * ADMIN_PASSWORD, ADMIN_SESSION_SECRET(16자 이상) 환경변수가 모두 있어야 로그인할 수 있다.
 * 예전 방식(쿠키 값 = 비밀값 그대로)은 쿠키가 새면 영구히 쓸 수 있어 바꿨다.
 */
export const ADMIN_COOKIE = "admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 12;

function sessionSecret(): string | null {
  const s = process.env.ADMIN_SESSION_SECRET;
  return s && s.length >= 16 ? s : null;
}

export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD && sessionSecret());
}

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function checkPassword(input: unknown): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  return Boolean(expected) && typeof input === "string" && safeEqual(input, expected!);
}

export function createSessionToken(): string {
  const secret = sessionSecret();
  if (!secret) throw new Error("ADMIN_SESSION_SECRET이 설정되지 않았습니다.");
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
  return `${exp}.${sign(`admin.${exp}`, secret)}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  const secret = sessionSecret();
  if (!secret || !token) return false;
  const [expRaw, sig] = token.split(".");
  const exp = Number(expRaw);
  if (!Number.isInteger(exp) || !sig || exp < Date.now() / 1000) return false;
  return safeEqual(sig, sign(`admin.${exp}`, secret));
}

export function checkAdminAuth(req: NextRequest | Request): boolean {
  const cookie = "cookies" in req && typeof req.cookies?.get === "function"
    ? req.cookies.get(ADMIN_COOKIE)?.value
    : parseCookie(req.headers.get("cookie"), ADMIN_COOKIE);
  return verifySessionToken(cookie);
}

function parseCookie(header: string | null, name: string): string | undefined {
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return decodeURIComponent(v.join("="));
  }
  return undefined;
}
