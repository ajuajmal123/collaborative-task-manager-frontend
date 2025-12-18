import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const ACCESS_SECRET = new TextEncoder().encode(
  process.env.NEXT_PUBLIC_ACCESS_SECRET
);

const protectedPaths = ["/dashboard","/profile"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  const accessToken = req.cookies.get("accessToken")?.value;

  //  PROTECTED ROUTES
  if (isProtected) {
    if (!accessToken) {
      return NextResponse.redirect(
        new URL("/", req.url)
      );
    }

    try {
      await jwtVerify(accessToken, ACCESS_SECRET);
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(
        new URL("/", req.url)
      );
    }
  }

  //  AUTH PAGES (login/register)
  if (pathname === "/" || pathname === "/register") {
    if (accessToken) {
      try {
        await jwtVerify(accessToken, ACCESS_SECRET);
        return NextResponse.redirect(
          new URL("/dashboard", req.url)
        );
      } catch {
        return NextResponse.next();
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/", "/register"],
};
