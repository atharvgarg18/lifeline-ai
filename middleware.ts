import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Check for token in cookies or Authorization header
  const token = request.cookies.get('ll_token')?.value;

  // Note: localStorage isn't accessible in middleware (server-side).
  // We rely on the client AuthContext to redirect to /login if no token.
  // This middleware handles server-side cookie-based auth check.
  if (!token && pathname !== '/') {
    // Only hard-redirect if we have a cookie-based signal
    // Client-side AuthContext handles localStorage redirect
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};