'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const COOKIE = 'selectedLesson';

export type SelectedLesson = { id: string; name: string; type: string };

export async function setSelectedLessonCookie(
  id: string,
  name: string,
  type: string,
): Promise<void> {
  (await cookies()).set(COOKIE, JSON.stringify({ id, name, type }), {
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  revalidatePath('/lessons');
}

export async function clearSelectedLessonCookie(): Promise<void> {
  (await cookies()).delete(COOKIE);
  revalidatePath('/lessons');
}

export async function readSelectedLessonCookie(): Promise<SelectedLesson | null> {
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SelectedLesson;
  } catch {
    return null;
  }
}
