import WordForm from "../wordForm";
import { serverFetch } from '@/lib/serverFetch';

async function getBooks() {
  const res = await serverFetch(`${process.env.BACKEND_URL}/v1/book?size=100`, { cache: 'no-store' });
  const data = await res.json();
  return data.content || [];
}

export default async function NewWordPage({
  searchParams
}: {
  searchParams: Promise<{ bookId?: string }>
}) {
  const params = await searchParams;
  const selectedBookId = params.bookId || "";
  const books = await getBooks();

  return (
    <div className="max-w-3xl mx-auto p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Add Word to Vocabulary</h1>
        <p className="text-sm text-gray-500">Log a specific word location and its content.</p>
      </div>

      <WordForm books={books} defaultBookId={selectedBookId} />
    </div>
  );
}