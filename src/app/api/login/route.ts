import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SignJWT } from "jose";
import { v4 as uuidv4 } from "uuid";
import { saveRefreshToken } from "@/lib/tokenStore";
import { AUTH_COOKIES } from "@/lib/authConstants";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function POST(request: Request) {
  const { username, password } = await request.json();

  // Replace this with real user lookup / database validation
  if (username !== "admin" || password !== "1234") {
    return NextResponse.json(
      { success: false, message: "Invalid credentials" },
      { status: 401 }
    );
  }
  
  // 🔐 Create access token (15 minutes)
  const accessToken = await new SignJWT({ username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(JWT_SECRET);

  // 🔁 Create refresh token (7 days)
  const refreshToken = uuidv4();
  saveRefreshToken(refreshToken, username, 7 * 24 * 60 * 60);

  const cookieStore = await cookies();

  cookieStore.set({
    name: AUTH_COOKIES.access,
    value: accessToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 15 * 60,
    sameSite: "strict",
  });

  cookieStore.set({
    name: AUTH_COOKIES.refresh,
    value: refreshToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
    sameSite: "strict",
  });

  return NextResponse.json({ success: true });
}