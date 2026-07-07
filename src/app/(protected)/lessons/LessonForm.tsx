'use client';

import { useActionState } from 'react';
import { saveLessonAction } from './actions';

type Language = { id: string; shortName: string; fullName: string };

type LessonData = {
  id: string;
  type: string;
  name: string;
  languageId: string;
};

const LESSON_TYPES = [
  { value: 'BY_DEFINITION', label: 'By Definition' },
  { value: 'BY_SENTENCE', label: 'By Sentence' },
];

export default function LessonForm({
  initialData,
  languages,
}: {
  initialData?: LessonData | null;
  languages: Language[];
}) {
  const [state, formAction, isPending] = useActionState(saveLessonAction, null);

  return (
    <form action={formAction} className="space-y-5">
      {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}

      {state?.error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
          {state.error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input
          name="name"
          type="text"
          maxLength={256}
          defaultValue={initialData?.name}
          required
          placeholder="Lesson name..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select
            name="type"
            defaultValue={initialData?.type ?? 'BY_DEFINITION'}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          >
            {LESSON_TYPES.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
          <select
            name="languageId"
            defaultValue={initialData?.languageId ?? ''}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          >
            <option value="" disabled>Select language</option>
            {languages.map((l) => (
              <option key={l.id} value={l.id}>
                {l.shortName} — {l.fullName}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          disabled={isPending}
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300 transition-all"
        >
          {isPending ? 'Saving...' : initialData ? 'Update Lesson' : 'Create Lesson'}
        </button>
      </div>
    </form>
  );
}
