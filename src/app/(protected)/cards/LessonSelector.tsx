'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';

type Lesson = { id: string; name: string; type: string; languageShortName: string | null };

export default function LessonSelector({ lessons }: { lessons: Lesson[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentLessonId = searchParams.get('lessonId') ?? '';

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const params = new URLSearchParams(searchParams.toString());
      if (e.target.value) {
        params.set('lessonId', e.target.value);
      } else {
        params.delete('lessonId');
      }
      params.set('page', '0');
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  const clearLesson = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('lessonId');
    router.push(`${pathname}?${params.toString()}`);
  }, [router, pathname, searchParams]);

  return (
    <div className="flex items-end gap-3 mb-4 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
      <div className="flex-1">
        <label className="block text-xs font-medium text-indigo-700 mb-1">
          Add cards to lesson
        </label>
        <select
          value={currentLessonId}
          onChange={handleChange}
          className="w-full border border-indigo-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        >
          <option value="">— select a lesson —</option>
          {lessons.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
              {l.type === 'BY_DEFINITION' ? ' · Definitions' : ' · Sentences'}
              {l.languageShortName ? ` [${l.languageShortName}]` : ''}
            </option>
          ))}
        </select>
      </div>
      {currentLessonId && (
        <button
          onClick={clearLesson}
          className="px-3 py-2 text-sm text-indigo-600 border border-indigo-300 rounded-md hover:bg-indigo-100 transition"
        >
          Clear
        </button>
      )}
    </div>
  );
}
