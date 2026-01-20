import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import PocketBase from 'pocketbase';

interface NextRequestWithGeo extends NextRequest {
  geo?: {
    country?: string;
  };
  ip?: string;
}

export default async function proxy(request: NextRequest) {
  const req = request as NextRequestWithGeo;
  const pb = new PocketBase('https://database.zulfikar.site');

  // Load the auth store from the cookie header
  const cookieHeader = req.headers.get('cookie') || '';
  pb.authStore.loadFromCookie(cookieHeader);

  const record = pb.authStore.record as {
    email?: string;
    role?: string;
  } | null;

  const isAdmin =
    pb.authStore.isValid &&
    (!!record?.role || record?.email?.includes('zulfikawr'));

  const isDatabaseRoute = req.nextUrl.pathname.startsWith('/database');
  const isLoginRoute = req.nextUrl.pathname === '/login';
  const isApiRoute = req.nextUrl.pathname.startsWith('/api');
  const isStaticRoute =
    req.nextUrl.pathname.startsWith('/_next') ||
    req.nextUrl.pathname.startsWith('/favicon') ||
    req.nextUrl.pathname.includes('.');

  // Log analytics for public, non-static routes
  if (!isDatabaseRoute && !isLoginRoute && !isApiRoute && !isStaticRoute) {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      req.ip ||
      'Unknown';

    const country =
      req.headers.get('cf-ipcountry') ||
      req.headers.get('x-vercel-ip-country') ||
      req.geo?.country ||
      'Unknown';

    // Non-blocking geolocation and analytics
    (async () => {
      let finalCountry = country;
      if (
        finalCountry === 'Unknown' &&
        ip !== 'Unknown' &&
        ip !== '127.0.0.1' &&
        ip !== '::1'
      ) {
        try {
          const res = await fetch(`https://ipapi.co/${ip}/country_code/`, {
            next: { revalidate: 86400 },
          });
          if (res.ok) {
            const code = await res.text();
            if (code && code.length === 2) {
              finalCountry = code.toUpperCase();
            }
          }
        } catch {
          // silent fail
        }
      }

      try {
        await pb.collection('analytics_events').create({
          path: req.nextUrl.pathname,
          country: finalCountry,
          referrer: req.headers.get('referer') || 'Direct',
          user_agent: req.headers.get('user-agent') || 'Unknown',
          is_bot: /bot|crawler|spider|crawling/i.test(
            req.headers.get('user-agent') || '',
          ),
        });
      } catch {
        // silent fail
      }
    })();

    console.log(`Visitor Request: ${ip} -> ${req.nextUrl.pathname}`);
  }

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
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
