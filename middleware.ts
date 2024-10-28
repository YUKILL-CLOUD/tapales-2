import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { routeAccessMap } from './lib/settings';
import { NextResponse } from 'next/server';

// Create matchers for routes and their allowed roles
const matchers = Object.keys(routeAccessMap).map(route => ({
  matcher: createRouteMatcher([route]),
  allowedRoles: routeAccessMap[route],
}));

export default clerkMiddleware((auth, req) => {
  const { sessionClaims } = auth();

  // If there's no session, allow the request to proceed
  if (!sessionClaims) {
    return NextResponse.next();
  }

  const role = (sessionClaims?.metadata as { role?: string })?.role;

  // Check if the user is signing up or being redirected
  if (!sessionClaims && (req.url.includes('/sign-up') || req.url.includes('/redirect'))) {
    return NextResponse.next(); // Skip middleware checks for these routes
  }

  // If the user has no role, redirect to the redirect page
  if (!role) {
    return NextResponse.redirect(new URL('/redirect', req.url));
  }

  // Check if the user's role is allowed for the requested route
  for (const { matcher, allowedRoles } of matchers) {
    if (matcher(req) && !allowedRoles.includes(role)) {
      return NextResponse.redirect(new URL(`/${role}`, req.url))
    }
}

 return NextResponse.next(); // Proceed if all checks pass
})
export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}