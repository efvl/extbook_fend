'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { serverFetch } from '@/lib/serverFetch';

const BASE = process.env.BACKEND_URL;

export async function saveLessonAction(prevState: any, formData: FormData) {
  const id = formData.get('id') as string | null;

  const body = {
    type: formData.get('type') as string,
    name: formData.get('name') as string,
    languageId: formData.get('languageId') as string,
    cardIds: [],
  };

  if (!body.name?.trim()) return { error: 'Name is required.' };
  if (!body.type) return { error: 'Type is required.' };
  if (!body.languageId) return { error: 'Language is required.' };

  try {
    const res = id
      ? await serverFetch(`${BASE}/v1/lesson/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      : await serverFetch(`${BASE}/v1/lesson`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

    if (!res.ok) {
      const err = await res.text();
      return { error: err || 'Failed to save lesson.' };
    }
  } catch (err: any) {
    return { error: err.message || 'Failed to save lesson.' };
  }

  revalidatePath('/lessons');
  redirect('/lessons');
}

export async function deleteLessonAction(id: string): Promise<void> {
  try {
    await serverFetch(`${BASE}/v1/lesson/${id}`, { method: 'DELETE' });
    revalidatePath('/lessons');
  } catch (error) {
    console.error(error);
  }
}
