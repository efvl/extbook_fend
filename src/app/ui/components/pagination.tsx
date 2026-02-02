'use client';

import { useRouter } from "next/navigation";

export default function Pagination({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) {
  const router = useRouter();

  return (
    <div className="flex gap-2 mt-4">
      <button
        disabled={page === 0}
        onClick={() => router.push(`?page=${page - 1}`)}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Prev
      </button>

      <span className="px-2 py-1">
        Page {page + 1} of {totalPages}
      </span>

      <button
        disabled={page + 1 >= totalPages}
        onClick={() => router.push(`?page=${page + 1}`)}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}