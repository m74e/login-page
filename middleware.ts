import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { parse } from 'cookie';

const PROTECTED_PATHS = ['/dashboard'];

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;
  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const cookies = parse(req.headers.get('cookie') || '');
  if (!cookies.accessToken) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('redirect', pathname + (searchParams.toString() ? `?${searchParams}` : ''));
    return NextResponse.redirect(loginUrl);
  }


  return NextResponse.next();
}
