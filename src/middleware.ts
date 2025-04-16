// File: middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const roleCookie = request.cookies.get("role")?.value || "";

  // Routes that require "admin" or "superadmin"
  if (
    pathname.startsWith("/admindashboard") ||
    pathname.startsWith("/create-event")
  ) {
    if (!["admin", "superadmin"].includes(roleCookie)) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }
  }

  // Routes that require "superadmin" only
  // This covers /superadmin, /superadmin/dashboard, /superadmin/eventapproval, etc.
  if (pathname.startsWith("/superadmin")) {
    if (roleCookie !== "superadmin") {
      return NextResponse.redirect(new URL("/signin", request.url));
    }
  }

  return NextResponse.next();
}

// We only run this middleware on certain routes
export const config = {
  matcher: [
    // Admin or superadmin
    "/admindashboard/:path*",
    "/create-event/:path*",

    // Superadmin
    "/superadmin/:path*",
  ],
};
