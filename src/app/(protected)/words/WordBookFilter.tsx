'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback, useMemo } from 'react';

type Language = { id: string; shortName: string; fullName: string };
type Book = { id: string; title: string; authors: string; language: Language };

export default function WordBookFilter({
  languages,
  books,
}: {
  languages: Language[];
  books: Book[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentLangId = searchParams.get('langId') ?? '';
  const currentBookId = searchParams.get('bookId') ?? '';

  const filteredBooks = useMemo(
    () => (currentLangId ? books.filter((b) => b.language.id === currentLangId) : []),
    [books, currentLangId],
  );

  const handleLanguageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const langId = e.target.value;
      const params = new URLSearchParams();
      if (langId) params.set('langId', langId);
      params.set('page', '0');
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname],
  );

  const handleBookChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const bookId = e.target.value;
      const params = new URLSearchParams();
      if (currentLangId) params.set('langId', currentLangId);
      if (bookId) params.set('bookId', bookId);
      params.set('page', '0');
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, currentLangId],
  );

  return (
    <div className="flex flex-wrap items-end gap-3 mb-6">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Language</label>
        <select
          value={currentLangId}
          onChange={handleLanguageChange}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select language</option>
          {languages.map((l) => (
            <option key={l.id} value={l.id}>
              {l.shortName} — {l.fullName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Book</label>
        <select
          value={currentBookId}
          onChange={handleBookChange}
          disabled={!currentLangId}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-56 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <option value="">{currentLangId ? 'All books' : '— select language first —'}</option>
          {filteredBooks.map((b) => (
            <option key={b.id} value={b.id}>
              {b.title}{b.authors ? ` — ${b.authors}` : ''}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
