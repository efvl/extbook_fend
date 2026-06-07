import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIES } from "@/lib/authConstants";

const BACKEND_URL = process.env.BACKEND_URL!;

export async function POST() {
  const cookieStore = await cookies();
  const oldRefreshToken = cookieStore.get(AUTH_COOKIES.refresh)?.value;

  if (!oldRefreshToken) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const backendRes = await fetch(`${BACKEND_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: oldRefreshToken }),
  });

  if (!backendRes.ok) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const { accessToken, refreshToken, expiresIn } = await backendRes.json();

  cookieStore.set({
    name: AUTH_COOKIES.access,
    value: accessToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: expiresIn,
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
