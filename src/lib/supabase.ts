import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * 주름관 전용 Supabase 프로젝트 — 온라인 구매(판매 품목·주문)만 쓴다. 표 구조: supabase/migrations/002_shop.sql
 * 서버 전용 service-role 클라이언트라 RLS 를 우회한다. 클라이언트 컴포넌트에서 import 하면 안 된다.
 */
let adminClient: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

/** 환경변수가 없을 때 빌드가 깨지지 않도록 처음 호출될 때 만든다 */
export function getSupabaseAdmin(): SupabaseClient {
  if (adminClient) return adminClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Supabase 환경변수(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)가 설정되지 않았습니다.");
  }
  adminClient = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return adminClient;
}
