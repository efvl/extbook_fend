import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revokeRefreshToken } from "@/lib/tokenStore";
import { AUTH_COOKIES } from "@/lib/authConstants";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  // Revoke refresh token server-side
  if (refreshToken) {
    revokeRefreshToken(refreshToken);
  }

  // Delete cookies (match path + options used when setting them)
  cookieStore.delete({
    name: AUTH_COOKIES.access,
    path: "/",
  });

  cookieStore.delete({
    name: AUTH_COOKIES.refresh,
    path: "/",
  });

  return NextResponse.json({ success: true });
}