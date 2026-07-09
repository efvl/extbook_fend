import LessonForm from '../LessonForm';
import { serverFetch } from '@/lib/serverFetch';
import { Page } from '@/types/api';
import { notFound } from 'next/navigation';

type Language = { id: string; shortName: string; fullName: string };

async function getLanguages(): Promise<Language[]> {
  const res = await serverFetch(
    `${process.env.BACKEND_URL}/v1/lang/enabled?page=0&size=100`,
    { cache: 'no-store' },
  );
  if (!res.ok) return [];
  const data: Page<Language> = await res.json();
  return data.content;
}

export default async function EditLessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [lessonRes, languages] = await Promise.all([
    serverFetch(`${process.env.BACKEND_URL}/v1/lesson/${id}`, { cache: 'no-store' }),
    getLanguages(),
  ]);

  if (!lessonRes.ok) notFound();

  const lesson = await lessonRes.json();

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Edit Lesson</h1>
      <LessonForm initialData={lesson} languages={languages} />
    </div>
  );
}
