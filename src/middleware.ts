import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE = 'admin_session';

/**
 * /admin 보호만 한다 — 공개 페이지에는 돌지 않는다(matcher)
 * 예전에는 모든 페이지에 x-pathname 헤더를 넣어 국문 레이아웃이 읽었는데, 그 때문에 국문 페이지가
 * 요청마다 새로 렌더링됐다. /admin 은 (ko) 그룹 밖이라 필요 없어 뺐다.
 */
export function middleware(req: NextRequest): NextResponse {
  const { pathname } = req.nextUrl;

  // /admin/login은 인증 없이 접근 허용
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  const token = req.cookies.get(SESSION_COOKIE)?.value ?? '';
  const sessionSecret = process.env.ADMIN_SESSION_SECRET ?? '';

  if (!token || token !== sessionSecret || sessionSecret.length === 0) {
    const loginUrl = new URL('/admin/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // /admin 과 그 아래 전부 (:path* 는 0개 이상이라 /admin 자체도 포함)
  matcher: ['/admin/:path*'],
};
