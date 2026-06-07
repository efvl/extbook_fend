'use client';

import { clearBookPageAction } from "./actions";

export default function ClearPageButton({ bookId, pageNum }: { bookId: string, pageNum: number }) {
  const handleClear = async () => {
    if (confirm('Are you sure you want to delete all words on this page?')) {
      await clearBookPageAction(bookId, pageNum);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClear}
      className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-xs font-semibold"
    >
      Clear Page
    </button>
  );
}