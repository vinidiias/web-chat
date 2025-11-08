//EXTERNAL LIBRARIES
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    // Check for authentication token in cookies
    const token = request.cookies.get("authToken")?.value;
    const isAuthPage = request.nextUrl.pathname.startsWith("/auth");

    // If not authenticated and trying to access protected route
    if (!token && !isAuthPage) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }

    // If authenticated and trying to access auth page, redirect to home
    if (token && isAuthPage) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Allow the request to proceed
    return NextResponse.next();
}

// Configure which routes this middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}