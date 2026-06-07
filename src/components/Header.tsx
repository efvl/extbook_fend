'use client';

import Link from "next/link";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-white">
      <div className="text-lg font-semibold">
        MyApp
      </div>

      <Link
        href="/login"
        className="text-sm font-medium text-blue-600 hover:underline"
      >
        Login
      </Link>
    </header>
  );
}