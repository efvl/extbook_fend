import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL!; 

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") ?? "0";
  const size = searchParams.get("size") ?? "20";

  const res = await fetch(
    `${BACKEND_URL}/v1/lang/all?page=${page}&size=${size}`,
    {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch languages" },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}