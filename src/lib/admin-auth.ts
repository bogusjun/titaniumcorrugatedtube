import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

const SESSION_COOKIE = 'admin_session';
const SESSION_VALUE = process.env.ADMIN_SESSION_SECRET!;

export function createSessionToken(): string {
  return SESSION_VALUE;
}

export function validateSessionToken(token: string): boolean {
  return token === SESSION_VALUE && SESSION_VALUE.length > 0;
}

export async function checkAdminAuth(req: NextRequest): Promise<boolean> {
  const cookieHeader = req.headers.get('cookie') ?? '';
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map((c) => {
      const [k, ...v] = c.trim().split('=');
      return [k, v.join('=')];
    })
  );
  const token = cookies[SESSION_COOKIE] ?? '';
  return validateSessionToken(token);
}

export async function checkAdminAuthFromCookies(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value ?? '';
  return validateSessionToken(token);
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;

export function buildSessionCookie(value: string, maxAge: number): string {
  return `${SESSION_COOKIE}=${value}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${maxAge}`;
}
