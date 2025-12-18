import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.NEXT_PUBLIC_ACCESS_SECRET
);

export async function handleUserAuth(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  // No tokens at all → login
  if (!accessToken && !refreshToken) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 2Fast path — access token valid
  if (accessToken) {
    try {
      await jwtVerify(accessToken, secret);
      return NextResponse.next();
    } catch {
      // expired → try refresh
    }
  }

  //  Slow path — refresh token
  if (refreshToken) {
    try {
      const refreshUrl = new URL("/api/auth/refresh", req.url);

      const refreshRes = await fetch(refreshUrl, {
        method: "POST",
        headers: {
          Cookie: `refreshToken=${refreshToken}`,
        },
      });

      if (refreshRes.ok) {
        const setCookie = refreshRes.headers.get("set-cookie");

        const res = NextResponse.next();

        if (setCookie) {
          res.headers.append("Set-Cookie", setCookie);
        }

        return res;
      }
    } catch (err) {
      console.error("Refresh failed", err);
    }
  }

  //  Everything failed → login
  return NextResponse.redirect(new URL("/", req.url));
}
