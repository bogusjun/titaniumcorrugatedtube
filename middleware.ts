import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE = 'admin_session';

export function middleware(req: NextRequest): NextResponse {
  const { pathname } = req.nextUrl;

  // pathname을 헤더로 전달해 root layout에서 admin 여부 판단
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-pathname', pathname);

  // /admin/login은 인증 없이 접근 허용
  if (pathname === '/admin/login') {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // /admin/* 전체 보호
  if (pathname.startsWith('/admin')) {
    const token = req.cookies.get(SESSION_COOKIE)?.value ?? '';
    const sessionSecret = process.env.ADMIN_SESSION_SECRET ?? '';

    if (!token || token !== sessionSecret || sessionSecret.length === 0) {
      const loginUrl = new URL('/admin/login', req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    // admin 보호 + 전체 페이지에 x-pathname 헤더 주입 (정적 파일 제외)
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
