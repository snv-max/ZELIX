import { NextResponse, type NextRequest } from 'next/server';


// Simple in-memory rate limit store for brute-force mitigation
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
    return false;
  }

  if (now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
    return false;
  }

  if (record.count >= limit) {
    return true;
  }

  record.count += 1;
  return false;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Forward old auth paths to correct endpoints
  if (pathname === '/auth/login') {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
  if (pathname === '/auth/signup') {
    const url = request.nextUrl.clone();
    url.pathname = '/signup';
    return NextResponse.redirect(url);
  }

  const ip = (request as any).ip || request.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';

  // 1. Rate Limiting to prevent brute-force/abuse
  const isLocalhost = ip.includes('127.0.0.1') || ip.includes('::1') || ip.includes('localhost');
  if (!isLocalhost && (pathname.startsWith('/api/') || pathname === '/login' || pathname === '/signup' || pathname === '/auth/login' || pathname === '/auth/signup')) {
    const isApi = pathname.startsWith('/api/');
    const limit = isApi ? 60 : 15; // 60 requests/min for APIs, 15/min for auth pages
    const windowMs = 60 * 1000; // 1 minute window

    if (isRateLimited(ip, limit, windowMs)) {
      if (isApi) {
        return NextResponse.json(
          { error: 'Too many requests. Please try again later.' },
          { status: 429 }
        );
      }
      return new NextResponse('Too many requests. Please try again later.', { status: 429 });
    }
  }

  // 2. Refresh & Validate Supabase Session (Bypassed for Auth0)
  /*
  const { supabaseResponse, user, supabase } = await updateSession(request);

  // Define route rules
  const isProtectedRoute = 
    pathname.startsWith('/account') || 
    pathname.startsWith('/profile') || 
    pathname.startsWith('/orders') ||
    pathname.startsWith('/checkout');

  const isAdminRoute = pathname.startsWith('/admin');

  // 3. Protected Route Security Check
  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // 4. Admin Role Security Check
  if (isAdminRoute) {
    if (!user || !supabase) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }

    try {
      // Query profiles table directly to check user role
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error || !profile || profile.role !== 'admin') {
        // Access Denied: redirect non-admin back to the homepage
        const url = request.nextUrl.clone();
        url.pathname = '/';
        return NextResponse.redirect(url);
      }
    } catch {
      // Fail secure if there is a DB error checking the profile
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }
  */

  return NextResponse.next();
}

// Intercept relevant paths (pages, api routes, auth entrypoints)
export const config = {
  matcher: [
    '/account/:path*',
    '/profile/:path*',
    '/orders/:path*',
    '/checkout/:path*',
    '/admin/:path*',
    '/login',
    '/signup',
    '/auth/login',
    '/auth/signup',
    '/api/:path*',
  ],
};
