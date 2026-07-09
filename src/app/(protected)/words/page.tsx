import { WordResponse } from '@/types/word';
import Pagination from '@/components/pagination';
import { TableContainer, Td, Th } from '@/components/table';
import { deleteWord } from "./actions";
import Link from "next/link";
import { serverFetch } from '@/lib/serverFetch';
import WordBookFilter from './WordBookFilter';

type Language = { id: string; shortName: string; fullName: string };
type Book = { id: string; title: string; authors: string; language: Language };

async function getWords(page = 0, bookId?: string) {
  const baseUrl = process.env.BACKEND_URL;

  const url = bookId
    ? `${baseUrl}/v1/word/by-book/${bookId}?page=${page}&size=10`
    : `${baseUrl}/v1/word?page=${page}&size=10`;

  const res = await serverFetch(url, { cache: 'no-store' });
  if (!res.ok) return { content: [], totalPages: 0, number: 0 };
  return res.json();
}

async function getBooks(): Promise<Book[]> {
  const res = await serverFetch(
    `${process.env.BACKEND_URL}/v1/book?page=0&size=200`,
    { cache: 'no-store' },
  );
  if (!res.ok) return [];
  const data = await res.json();
  return data.content ?? [];
}

async function getLanguages(): Promise<Language[]> {
  const res = await serverFetch(
    `${process.env.BACKEND_URL}/v1/lang/enabled?page=0&size=100`,
    { cache: 'no-store' },
  );
  if (!res.ok) return [];
  const data = await res.json();
  return data.content ?? [];
}

export default async function WordsPage({
  searchParams
}: {
  searchParams: Promise<{ page?: string; bookId?: string; langId?: string }>
}) {
  const params = await searchParams;
  const page = Number(params.page || 0);
  const bookId = params.bookId;
  const langId = params.langId;

  const [data, books, languages] = await Promise.all([
    getWords(page, bookId),
    getBooks(),
    getLanguages(),
  ]);

  const bookTitle = books.find((b) => b.id === bookId)?.title ?? '';

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {bookId ? `Vocabulary for: ${bookTitle}` : "All Words"}
          </h1>
          {(bookId || langId) && (
            <Link href="/words" className="text-xs text-blue-600 hover:underline">
              ← Clear filter and show all words
            </Link>
          )}
        </div>

        <Link href="/words/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-md transition">
          + Add Word
        </Link>
      </div>

      <WordBookFilter languages={languages} books={books} />

      <TableContainer>
        <thead className="bg-gray-50">
          <tr>
            <Th>Content</Th>
            <Th>Location</Th>
            <Th>Status</Th>
            <Th align="right">Actions</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {data.content.map((word: WordResponse) => (
            <tr key={word.id} className="hover:bg-gray-50 transition-all duration-200">

              <Td className="font-semibold text-gray-900">
                <span className="cursor-default" title={word.txtContent}>
                  {word.txtContent.length > 40
                    ? `${word.txtContent.substring(0, 40)}...`
                    : word.txtContent}
                </span>
              </Td>

              <Td>
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500">
                  {word.pageNum && <span className="bg-gray-100 px-1.5 py-0.5 rounded">P{word.pageNum}</span>}
                  {word.lineNum && <span className="bg-gray-100 px-1.5 py-0.5 rounded">L{word.lineNum}</span>}
                  {word.wordNum && <span className="bg-gray-100 px-1.5 py-0.5 rounded">W{word.wordNum}</span>}
                  {!word.pageNum && !word.lineNum && <span className="text-gray-300 italic">No loc.</span>}
                </div>
              </Td>

              <Td>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                  word.status === 'KNOWN'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : word.status === 'LEARNING'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                    word.status === 'KNOWN' ? 'bg-emerald-500' :
                    word.status === 'LEARNING' ? 'bg-amber-500' : 'bg-slate-400'
                  }`} />
                  {word.status}
                </span>
              </Td>

              <Td align="right">
                <div className="flex justify-end gap-2 items-center">
                  <Link href={`/words/${word.id}`}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    title="Edit Word"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>
                    </svg>
                  </Link>

                  <form action={deleteWord.bind(null, word.id)}>
                    <button
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Delete Word"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>
                      </svg>
                    </button>
                  </form>
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </TableContainer>
      <Pagination
        page={data.number}
        totalPages={data.totalPages}
      />
    </div>
  );
}