'use server';

import { serverFetch } from '@/lib/serverFetch';

export async function recordLessonCardResult(
  lessonId: string,
  cardId: string,
  correct: boolean,
): Promise<void> {
  const res = await serverFetch(
    `${process.env.BACKEND_URL}/v1/lesson/${lessonId}/cards/${cardId}/result`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correct }),
    },
  );
  if (!res.ok) throw new Error('Failed to record result');
}
