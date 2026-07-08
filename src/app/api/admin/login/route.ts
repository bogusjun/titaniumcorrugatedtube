export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { buildSessionCookie } from '@/lib/admin-auth';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { password } = await req.json() as { password?: string };

  const adminPassword = process.env.ADMIN_PASSWORD ?? '';
  const sessionSecret = process.env.ADMIN_SESSION_SECRET ?? '';

  if (!password || password !== adminPassword) {
    return NextResponse.json({ error: '비밀번호가 올바르지 않습니다.' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.headers.set('Set-Cookie', buildSessionCookie(sessionSecret, 60 * 60 * 8)); // 8시간
  return res;
}

export async function DELETE(): Promise<NextResponse> {
  const res = NextResponse.json({ ok: true });
  res.headers.set('Set-Cookie', buildSessionCookie('', 0));
  return res;
}
