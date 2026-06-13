import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const isClerkConfigured = 
  clerkKey && 
  clerkKey.startsWith('pk_') && 
  !clerkKey.includes('...') &&
  !clerkKey.includes('ZXhwb3J0LXRlc3QtOTkuY2xlcmsuYWNjb3VudHMuZGV2JA');

const isProtectedRoute = createRouteMatcher([
  '/account(.*)',
  '/checkout(.*)',
  '/orders(.*)',
  '/admin(.*)',
]);

// Clerk Middleware handler
const clerkHandler = clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();

  // Enforce admin protection at the middleware level
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!userId) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('redirect_url', req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    const role = (sessionClaims?.metadata as any)?.role;
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // Protect standard user routes
  if (isProtectedRoute(req)) {
    if (!userId) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('redirect_url', req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
});

// Hybrid Middleware entrypoint
export default function middleware(req: NextRequest, event: any) {
  if (isClerkConfigured) {
    return clerkHandler(req, event);
  }

  // Mock / Simulated Auth Middleware Fallback
  const path = req.nextUrl.pathname;
  const isMockAdmin = req.cookies.get('zelix_mock_role')?.value === 'admin';
  const isMockLoggedIn = req.cookies.get('zelix_mock_user_id')?.value;

  if (path.startsWith('/admin')) {
    if (!isMockLoggedIn) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('redirect_url', path);
      return NextResponse.redirect(loginUrl);
    }
    if (!isMockAdmin) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  const isProtected = ['/account', '/checkout', '/orders'].some(p => path.startsWith(p));
  if (isProtected && !isMockLoggedIn) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirect_url', path);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.[^?]*\\..*).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
