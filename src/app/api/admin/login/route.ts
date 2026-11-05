import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, SESSION_MAX_AGE, checkPassword, createSessionToken, isAdminConfigured } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "관리자 환경변수(ADMIN_PASSWORD, ADMIN_SESSION_SECRET 16자 이상)가 설정되지 않았습니다." },
      { status: 503 },
    );
  }

  const { password } = await req.json().catch(() => ({}));
  if (!checkPassword(password)) {
    // 무차별 대입을 늦추기 위한 지연
    await new Promise((r) => setTimeout(r, 800));
    return NextResponse.json({ error: "비밀번호가 올바르지 않습니다." }, { status: 401 });
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete(ADMIN_COOKIE);
  return res;
}
