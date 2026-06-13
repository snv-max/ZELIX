import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Match protected routes
const isProtectedRoute = createRouteMatcher([
  '/account(.*)',
  '/checkout(.*)',
  '/orders(.*)',
  '/admin(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
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
      // Redirect unauthorized users to home page
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

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.[^?]*\\..*).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
