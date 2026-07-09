import Link from 'next/link';
import { TableContainer, Td, Th } from '@/components/table';
import { DeleteLessonButton } from './DeleteLessonButton';
import { serverFetch } from '@/lib/serverFetch';
import { Page } from '@/types/api';
import Pagination from '@/components/pagination';
import {
  readSelectedLessonCookie,
  setSelectedLessonCookie,
  clearSelectedLessonCookie,
} from '@/lib/selectedLessonActions';

type LessonResponse = {
  id: string;
  type: 'BY_DEFINITION' | 'BY_SENTENCE';
  name: string;
  languageId: string;
  languageShortName: string;
  cardIds: string[];
};

const TYPE_LABEL: Record<string, string> = {
  BY_DEFINITION: 'By Definition',
  BY_SENTENCE: 'By Sentence',
};

async function getLessons(page = 0): Promise<Page<LessonResponse>> {
  const res = await serverFetch(
    `${process.env.BACKEND_URL}/v1/lesson/all?page=${page}&size=20`,
    { cache: 'no-store' },
  );
  if (!res.ok) throw new Error('Failed to load lessons');
  return res.json();
}

export default async function LessonsPage({ searchParams }: { searchParams: any }) {
  const params = await searchParams;
  const page = Number(params.page ?? 0);

  const [data, selectedLesson] = await Promise.all([
    getLessons(page),
    readSelectedLessonCookie(),
  ]);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Lessons</h1>
        <Link
          href="/lessons/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + New Lesson
        </Link>
      </div>

      {/* Selected lesson banner */}
      {selectedLesson ? (
        <div className="flex items-center gap-3 mb-6 px-4 py-3 bg-indigo-50 border border-indigo-200 rounded-xl">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wide shrink-0">
              Selected
            </span>
            <span className="font-semibold text-indigo-900 truncate">{selectedLesson.name}</span>
            <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-600 border border-indigo-200 shrink-0">
              {TYPE_LABEL[selectedLesson.type] ?? selectedLesson.type}
            </span>
          </div>
          <form action={clearSelectedLessonCookie}>
            <button
              type="submit"
              className="text-xs text-indigo-500 hover:text-indigo-800 font-medium transition shrink-0"
            >
              Clear
            </button>
          </form>
        </div>
      ) : (
        <p className="text-sm text-gray-400 mb-6">No lesson selected. Click <strong>Select</strong> on a row to set one.</p>
      )}

      <TableContainer>
        <thead className="bg-gray-50">
          <tr>
            <Th>Name</Th>
            <Th>Type</Th>
            <Th>Language</Th>
            <Th>Cards</Th>
            <Th align="right">Actions</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {data.content.map((lesson) => {
            const isSelected = selectedLesson?.id === lesson.id;
            return (
              <tr
                key={lesson.id}
                className={`transition-colors ${isSelected ? 'bg-indigo-50 hover:bg-indigo-100' : 'hover:bg-gray-50'}`}
              >
                <Td className="font-medium text-gray-900">
                  <div className="flex items-center gap-2">
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                    )}
                    {lesson.name}
                  </div>
                </Td>
                <Td>
                  <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {TYPE_LABEL[lesson.type] ?? lesson.type}
                  </span>
                </Td>
                <Td>
                  <span className="text-xs font-medium text-gray-500">
                    {lesson.languageShortName ?? '—'}
                  </span>
                </Td>
                <Td>{lesson.cardIds?.length ?? 0}</Td>
                <Td align="right">
                  <div className="flex justify-end items-center gap-3">
                    <form action={setSelectedLessonCookie.bind(null, lesson.id, lesson.name, lesson.type)}>
                      <button
                        type="submit"
                        className={`font-medium text-sm transition-colors ${
                          isSelected
                            ? 'text-indigo-600 cursor-default'
                            : 'text-gray-500 hover:text-indigo-600'
                        }`}
                        disabled={isSelected}
                      >
                        {isSelected ? '✓ Selected' : 'Select'}
                      </button>
                    </form>
                    <span className="text-gray-200">|</span>
                    {lesson.cardIds?.length > 0 && (
                      <>
                        <Link
                          href={`/lessons/${lesson.id}/learn`}
                          className="text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                          Learn
                        </Link>
                        <span className="text-gray-200">|</span>
                      </>
                    )}
                    <Link
                      href={`/lessons/${lesson.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Edit
                    </Link>
                    <span className="text-gray-200">|</span>
                    <DeleteLessonButton id={lesson.id} />
                  </div>
                </Td>
              </tr>
            );
          })}
          {data.content.length === 0 && (
            <tr>
              <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-400">
                No lessons yet. Create one to get started.
              </td>
            </tr>
          )}
        </tbody>
      </TableContainer>
      <Pagination page={data.number} totalPages={data.totalPages} />
    </div>
  );
}
