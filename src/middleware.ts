import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/admin-auth';

/**
 * /admin, /api/admin 접근 제어 — 공개 페이지에는 돌지 않는다(matcher). 각 관리자 API 도 한 번 더 확인한다.
 * 세션 쿠키는 HMAC 서명이라 node:crypto 가 필요해 Node 런타임에서 돈다(Next 15.5 정식 기능).
 */
export function middleware(req: NextRequest): NextResponse {
  const { pathname } = req.nextUrl;

  if (pathname === '/admin/login' || pathname === '/api/admin/login') {
    return NextResponse.next();
  }

  const authorized = checkAdminAuth(req);

  if (pathname.startsWith('/api/admin')) {
    return authorized ? NextResponse.next() : NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!authorized) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }
  return NextResponse.next();
}

export const config = {
  runtime: 'nodejs',
  // :path* 는 0개 이상이라 /admin 자체도 포함
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
