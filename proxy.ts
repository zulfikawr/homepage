import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

interface NextRequestWithGeo extends NextRequest {
  geo?: {
    country?: string;
  };
}

export default async function proxy(request: NextRequest) {
  const req = request as NextRequestWithGeo;

  const isAdminCookie = req.cookies.get('isAdmin');
  const isAdmin = isAdminCookie?.value === 'true';

  const isDatabaseRoute = req.nextUrl.pathname.startsWith('/database');
  const isLoginRoute = req.nextUrl.pathname === '/login';
  const isApiRoute = req.nextUrl.pathname.startsWith('/api');
  const isStaticRoute =
    req.nextUrl.pathname.startsWith('/_next') ||
    req.nextUrl.pathname.startsWith('/favicon') ||
    req.nextUrl.pathname.includes('.');

  // Log analytics for public, non-static GET requests
  const referrer = req.headers.get('referer') || 'Direct';
  const isDevOrVercel = /dev|vercel/i.test(referrer);
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (
    req.method === 'GET' &&
    !isDatabaseRoute &&
    !isLoginRoute &&
    !isApiRoute &&
    !isStaticRoute &&
    !isDevelopment &&
    !isDevOrVercel
  ) {
    const country =
      req.headers.get('cf-ipcountry') || req.geo?.country || 'Unknown';

    // Fire-and-forget call to our internal analytics API
    const analyticsData = {
      path: req.nextUrl.pathname,
      referrer: referrer,
      user_agent: req.headers.get('user-agent') || 'Unknown',
      country: country,
    };

    fetch(`${req.nextUrl.origin}/api/analytics/record`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(analyticsData),
    }).catch((err) => console.error('[Proxy] Analytics Trigger Error:', err));
  }

  if (isDatabaseRoute && !isAdmin) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  if (isLoginRoute && isAdmin) {
    return NextResponse.redirect(new URL('/database', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
