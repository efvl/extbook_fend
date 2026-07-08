import Link from 'next/link';
import { TableContainer, Td, Th } from '@/components/table';
import { DeleteCardButton } from './DeleteCardButton';
import { CardResponse } from '@/types/card';
import { getCards } from '@/lib/api/cardService';
import Pagination from '@/components/pagination';
import CardFilterBar from './CardFilterBar';
import LessonSelector from './LessonSelector';
import { AddToLessonButton } from './AddToLessonButton';
import { serverFetch } from '@/lib/serverFetch';
import { Page } from '@/types/api';

type Language = { id: string; shortName: string; fullName: string };
type Lesson = { id: string; name: string; type: string; languageShortName: string | null; cardIds: string[] };

async function getLanguages(): Promise<Language[]> {
  const res = await serverFetch(
    `${process.env.BACKEND_URL}/v1/lang/all?page=0&size=100`,
    { cache: 'no-store' },
  );
  if (!res.ok) return [];
  const data: Page<Language> = await res.json();
  return data.content;
}

async function getLessons(): Promise<Lesson[]> {
  const res = await serverFetch(
    `${process.env.BACKEND_URL}/v1/lesson/all`,
    { cache: 'no-store' },
  );
  if (!res.ok) return [];
  const data = await res.json();
  return data.content ?? [];
}

export default async function CardsPage({ searchParams }: { searchParams: any }) {
  const params = await searchParams;
  const lessonId: string | undefined = params.lessonId;

  const [data, languages, lessons] = await Promise.all([
    getCards(params.page || 0, params.status, params.content, params.languageId),
    getLanguages(),
    getLessons(),
  ]);

  const lessonCardIds = new Set(
    lessonId ? (lessons.find((l) => l.id === lessonId)?.cardIds ?? []) : [],
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Cards Dictionary</h1>
        <Link
          href="/cards/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Add Card
        </Link>
      </div>

      <LessonSelector lessons={lessons} />

      <CardFilterBar languages={languages} />

      <TableContainer>
        <thead className="bg-gray-50">
          <tr>
            <Th>Language</Th>
            <Th>Content</Th>
            <Th>Definition</Th>
            <Th>Target</Th>
            <Th>Actual</Th>
            <Th>Status</Th>
            <Th align="right">Actions</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {data.content.map((card: CardResponse) => (
            <tr key={card.id} className="hover:bg-gray-50 transition-colors">
              <Td>
                <span className="text-xs font-medium text-gray-500">
                  {card.languageShortName ?? '—'}
                </span>
              </Td>
              <Td className="font-medium text-gray-900">
                <div className="max-w-xs truncate" title={card.txtContent}>
                  {card.txtContent}
                </div>
              </Td>
              <Td>{card.definition}</Td>
              <Td>{card.targetCount}</Td>
              <Td>{card.actualCount}</Td>
              <Td>{card.status}</Td>
              <Td align="right">
                <div className="flex justify-end items-center gap-3">
                  {lessonId && (
                    <>
                      {lessonCardIds.has(card.id) ? (
                        <span className="text-xs font-medium text-emerald-600">In lesson ✓</span>
                      ) : (
                        <AddToLessonButton lessonId={lessonId} cardId={card.id} />
                      )}
                      <span className="text-gray-200">|</span>
                    </>
                  )}
                  <Link href={`/cards/${card.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                    Edit
                  </Link>
                  <span className="text-gray-200">|</span>
                  <DeleteCardButton id={card.id} />
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </TableContainer>
      <Pagination page={data.number} totalPages={data.totalPages} />
    </div>
  );
}
