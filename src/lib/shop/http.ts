import "server-only";
import { NextResponse } from "next/server";
import { ShopError } from "@/lib/shop/orders";

/** 라우트 핸들러 공통 에러 응답 */
export function errorResponse(err: unknown) {
  if (err instanceof ShopError) {
    return NextResponse.json({ error: err.message, code: err.code }, { status: err.status });
  }
  console.error("[api]", err);
  return NextResponse.json({ error: "요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.", code: "INTERNAL" }, { status: 500 });
}

export async function readJson(req: Request): Promise<Record<string, unknown>> {
  try {
    const body = await req.json();
    return body && typeof body === "object" ? body : {};
  } catch {
    throw new ShopError("잘못된 요청입니다.", "BAD_REQUEST");
  }
}
