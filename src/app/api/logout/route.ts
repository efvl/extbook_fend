import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIES } from "@/lib/authConstants";

const BACKEND_URL = process.env.BACKEND_URL!;

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(AUTH_COOKIES.refresh)?.value;

  if (refreshToken) {
    // Best-effort revocation — don't fail logout if backend is unreachable
    await fetch(`${BACKEND_URL}/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    }).catch(() => {});
  }

  cookieStore.delete({ name: AUTH_COOKIES.access, path: "/" });
  cookieStore.delete({ name: AUTH_COOKIES.refresh, path: "/" });

  return NextResponse.json({ success: true });
}
