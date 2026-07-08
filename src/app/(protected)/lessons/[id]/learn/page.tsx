import { notFound } from 'next/navigation';
import Link from 'next/link';
import { serverFetch } from '@/lib/serverFetch';
import { CardResponse } from '@/types/card';
import FlashcardSession from './FlashcardSession';

type LessonDetail = {
  id: string;
  type: 'BY_DEFINITION' | 'BY_SENTENCE';
  name: string;
  languageShortName: string | null;
  cardIds: string[];
};

export type CardStat = { cardId: string; correctCount: number; wrongCount: number };

async function getLesson(id: string): Promise<LessonDetail | null> {
  const res = await serverFetch(`${process.env.BACKEND_URL}/v1/lesson/${id}`, { cache: 'no-store' });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to load lesson');
  return res.json();
}

async function fetchCard(id: string): Promise<CardResponse> {
  const res = await serverFetch(`${process.env.BACKEND_URL}/v1/card/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to load card ${id}`);
  return res.json();
}

async function getCardStats(lessonId: string): Promise<CardStat[]> {
  const res = await serverFetch(
    `${process.env.BACKEND_URL}/v1/lesson/${lessonId}/stats`,
    { cache: 'no-store' },
  );
  if (!res.ok) return [];
  return res.json();
}

export default async function LearnPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lesson = await getLesson(id);
  if (!lesson) notFound();

  const [cards, stats] = await Promise.all([
    lesson.cardIds.length ? Promise.all(lesson.cardIds.map(fetchCard)) : Promise.resolve([]),
    getCardStats(id),
  ]);

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
        <h1 className="text-xl font-bold text-gray-800 mb-2">{lesson.name}</h1>
        <p className="text-gray-500 mb-6">No cards in this lesson yet.</p>
        <Link href="/cards" className="text-indigo-600 hover:underline text-sm">
          ← Add cards from the Cards page
        </Link>
      </div>
    );
  }

  return <FlashcardSession lesson={lesson} cards={cards} stats={stats} />;
}
