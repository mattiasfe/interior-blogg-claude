import { NextResponse } from "next/server";
import { clerkMiddleware } from "@clerk/nextjs/server";
import { isAuthConfigured } from "@/lib/access";

/**
 * Clerk only has to run so `auth()` is available inside routes and pages.
 * Nothing is blocked here: the blog and the studio page stay public, and the
 * routes that cost money (`/api/studio/*`, `/api/stripe/*`) check access
 * themselves so they can answer 401/402/429 instead of redirecting.
 */
export default isAuthConfigured() ? clerkMiddleware() : () => NextResponse.next();

export const config = {
  matcher: ["/((?!_next|.*\..*).*)", "/api/(.*)"],
};
