import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SignJWT } from "jose";
import { v4 as uuidv4 } from "uuid";
import {
  verifyRefreshToken,
  saveRefreshToken,
  revokeRefreshToken,
} from "@/lib/tokenStore";
import { AUTH_COOKIES } from "@/lib/authConstants";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function POST() {
  const cookieStore = await cookies();
  const oldToken = cookieStore.get("refresh_token")?.value;

  if (!oldToken) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const username = verifyRefreshToken(oldToken);
  if (!username) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  // 🔁 Rotate refresh token
  revokeRefreshToken(oldToken);
  const newRefreshToken = uuidv4();
  saveRefreshToken(newRefreshToken, username, 7 * 24 * 60 * 60);

  // 🔐 Issue new access token (15 minutes)
  const newAccessToken = await new SignJWT({ username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(JWT_SECRET);

  cookieStore.set({
    name: AUTH_COOKIES.access,
    value: newAccessToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 15 * 60,
    sameSite: "strict",
  });

  cookieStore.set({
    name: AUTH_COOKIES.refresh,
    value: newRefreshToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
    sameSite: "strict",
  });

  return NextResponse.json({ success: true });
}