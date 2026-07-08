import Link from 'next/link';
import { TableContainer, Td, Th } from '@/components/table';
import { DeleteLessonButton } from './DeleteLessonButton';
import { serverFetch } from '@/lib/serverFetch';
import { Page } from '@/types/api';
import Pagination from '@/components/pagination';

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
  const data = await getLessons(page);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Lessons</h1>
        <Link
          href="/lessons/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + New Lesson
        </Link>
      </div>

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
          {data.content.map((lesson) => (
            <tr key={lesson.id} className="hover:bg-gray-50 transition-colors">
              <Td className="font-medium text-gray-900">{lesson.name}</Td>
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
          ))}
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
