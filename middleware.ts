import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import PocketBase from 'pocketbase';

export async function middleware(request: NextRequest) {
  const pb = new PocketBase('https://database.zulfikar.site');

  // Load the auth store from the cookie header
  const cookieHeader = request.headers.get('cookie') || '';
  pb.authStore.loadFromCookie(cookieHeader);

  const record = pb.authStore.record as {
    email?: string;
    role?: string;
  } | null;

  const isAdmin =
    pb.authStore.isValid &&
    (!!record?.role || record?.email?.includes('zulfikawr'));

  console.log('Middleware Debug:', {
    path: request.nextUrl.pathname,
    isValid: pb.authStore.isValid,
    record: record ? { email: record.email, role: record.role } : null,
    isAdmin,
  });

  const isDatabaseRoute = request.nextUrl.pathname.startsWith('/database');
  const isLoginRoute = request.nextUrl.pathname === '/login';

  if (isDatabaseRoute && !isAdmin) {
    // Redirect unauthorized users to login
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  if (isLoginRoute && isAdmin) {
    // If already logged in as admin, redirect to database
    return NextResponse.redirect(new URL('/database', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/database/:path*', '/login'],
};
