import { NextRequest, NextResponse } from "next/server";
import { handleUserAuth } from "@/lib/auth-middleware";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip static & api routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth/login") ||
    pathname.startsWith("/api/auth/logout") ||
    pathname.startsWith("/api/auth/refresh") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  //  Protect dashboard & profile
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/profile")) {
    return handleUserAuth(req);
  }

  //  Prevent logged-in users from seeing login/register
  if (pathname === "/" || pathname === "/register") {
    const accessToken = req.cookies.get("accessToken")?.value;
    const refreshToken = req.cookies.get("refreshToken")?.value;

    if (accessToken || refreshToken) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
