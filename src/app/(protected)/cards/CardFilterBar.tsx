'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';

type Language = { id: string; shortName: string; fullName: string };

const STATUSES = ['DRAFT', 'NEW', 'LEARNING', 'IN_PROCESS', 'READY', 'KNOWN'];

export default function CardFilterBar({ languages }: { languages: Language[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentStatus = searchParams.get('status') ?? '';
  const currentContent = searchParams.get('content') ?? '';
  const currentLanguageId = searchParams.get('languageId') ?? '';

  const hasFilter = !!(currentStatus || currentContent || currentLanguageId);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const form = e.currentTarget;
      const status = (form.elements.namedItem('status') as HTMLSelectElement).value;
      const content = (form.elements.namedItem('content') as HTMLInputElement).value.trim();
      const languageId = (form.elements.namedItem('languageId') as HTMLSelectElement).value;
      const params = new URLSearchParams();
      if (status) params.set('status', status);
      if (content) params.set('content', content);
      if (languageId) params.set('languageId', languageId);
      params.set('page', '0');
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname],
  );

  const handleClear = useCallback(() => {
    router.push(pathname);
  }, [router, pathname]);

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 mb-6 items-end">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Language</label>
        <select
          name="languageId"
          defaultValue={currentLanguageId}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All languages</option>
          {languages.map((l) => (
            <option key={l.id} value={l.id}>
              {l.shortName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
        <select
          name="status"
          defaultValue={currentStatus}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace('_', ' ')}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 min-w-48">
        <label className="block text-xs font-medium text-gray-500 mb-1">Content</label>
        <input
          type="text"
          name="content"
          defaultValue={currentContent}
          placeholder="Search by content..."
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition"
      >
        Filter
      </button>

      {hasFilter && (
        <button
          type="button"
          onClick={handleClear}
          className="px-4 py-2 border border-gray-300 text-sm rounded-md text-gray-600 hover:bg-gray-50 transition"
        >
          Clear
        </button>
      )}
    </form>
  );
}
