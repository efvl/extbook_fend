'use client';

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function Pagination({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) {
  const searchParams = useSearchParams();

  // This helper creates a new URL while keeping ALL current search params
  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `?${params.toString()}`;
  };

  return (
    <div className="flex items-center gap-2 mt-6">
      <Link
        href={createPageURL(page - 1)}
        // Use aria-disabled or conditional styling since Link can't be "disabled"
        className={`px-4 py-2 border rounded-md text-sm transition ${
          page === 0 
            ? "pointer-events-none opacity-50 bg-gray-50 text-gray-400" 
            : "hover:bg-gray-50 border-gray-300 text-gray-700 shadow-sm"
        }`}
      >
        Prev
      </Link>

      <span className="text-sm font-medium text-gray-600 px-4">
        Page <span className="text-gray-900">{page + 1}</span> of {totalPages}
      </span>

      <Link
        href={createPageURL(page + 1)}
        className={`px-4 py-2 border rounded-md text-sm transition ${
          page + 1 >= totalPages
            ? "pointer-events-none opacity-50 bg-gray-50 text-gray-400"
            : "hover:bg-gray-50 border-gray-300 text-gray-700 shadow-sm"
        }`}
      >
        Next
      </Link>
    </div>
  );
}