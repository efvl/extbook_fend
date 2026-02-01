import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { AUTH_COOKIES } from "./lib/authConstants";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIES.access)?.value;

  // Protect all routes under /ui
  if (req.nextUrl.pathname.startsWith("/ui")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url)); // redirect to login
    }

    try {
      await jwtVerify(token, JWT_SECRET); // throws if invalid or expired
      return NextResponse.next();
    } catch (err) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/ui/:path*"], // apply to all /ui routes
};