import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { routeAccessMap } from './lib/settings';
import { NextResponse } from 'next/server';

// Create matchers for routes and their allowed roles
const matchers = Object.keys(routeAccessMap).map(route => ({
  matcher: createRouteMatcher([route]),
  allowedRoles: routeAccessMap[route],
}));
const publicRoutes = ['/', '/sign-up'];

export default clerkMiddleware((auth, req) => {
  const { sessionClaims, userId } = auth();
  const isPublicRoute = publicRoutes.includes(new URL(req.url).pathname);

  if (new URL(req.url).pathname === '/redirect' || isPublicRoute) {
    return NextResponse.next();
  }
  // Check if the user is signing up or being redirected
  if (!userId) {
    return NextResponse.redirect(new URL('/', req.url));
  }
  const role = (sessionClaims?.metadata as { role?: string })?.role;


  // If the user has no role, redirect to the redirect page
  if (userId && !role ) {
    return NextResponse.redirect(new URL('/redirect', req.url));
  }

   // Check if the user's role is allowed for the requested route
   if(role){
   for (const { matcher, allowedRoles } of matchers) {
    if (matcher(req) && !allowedRoles.includes(role!)) {
      return NextResponse.redirect(new URL(`/${role}`, req.url));
    }
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