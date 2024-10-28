import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { routeAccessMap } from './lib/settings'
import { NextResponse } from 'next/server';


const matchers = Object.keys(routeAccessMap).map(route=>({
    matcher: createRouteMatcher([route]),
    allowedRoles: routeAccessMap[route],
    }));

export default clerkMiddleware((auth, req) => {
//   if (isProtectedRoute(req)) auth().protect()
const {sessionClaims } = auth();

if (!sessionClaims) {
    return NextResponse.next();
  }


const role = (sessionClaims?.metadata as {role?: string })?.role;

// Check if the user is signing up, in which case bypass role checking
if (!sessionClaims && req.url.includes('/sign-up')|| req.url.includes('/redirect')){
    return NextResponse.next(); // Skip middleware checks for the sign-up route
  }

if (!role) {
    return NextResponse.redirect(new URL('/redirect', req.url));
  }

for (const {matcher, allowedRoles }of matchers){
    if (matcher(req)&& !allowedRoles.includes(role!)){
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