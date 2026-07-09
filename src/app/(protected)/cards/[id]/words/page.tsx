import Link from 'next/link';
import { notFound } from 'next/navigation';
import { serverFetch } from '@/lib/serverFetch';
import { TableContainer, Td, Th } from '@/components/table';
import { WordResponse } from '@/types/word';
import { Page } from '@/types/api';
import Pagination from '@/components/pagination';

type CardDetail = { id: string; txtContent: string; definition: string };

async function getCard(id: string): Promise<CardDetail | null> {
  const res = await serverFetch(`${process.env.BACKEND_URL}/v1/card/${id}`, { cache: 'no-store' });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to load card');
  return res.json();
}

async function getWordsByCard(cardId: string, page = 0): Promise<Page<WordResponse>> {
  const res = await serverFetch(
    `${process.env.BACKEND_URL}/v1/word/by-card/${cardId}?page=${page}&size=20`,
    { cache: 'no-store' },
  );
  if (!res.ok) return { content: [], totalPages: 0, number: 0, totalElements: 0, size: 20, first: true, last: true };
  return res.json();
}

async function fetchPageWords(bookId: string, pageNum: number): Promise<WordResponse[]> {
  const res = await serverFetch(
    `${process.env.BACKEND_URL}/v1/word/by-book/${bookId}/page/${pageNum}?page=0&size=500`,
    { cache: 'no-store' },
  );
  if (!res.ok) return [];
  const data: Page<WordResponse> = await res.json();
  return data.content;
}

type LineMap = Map<string, WordResponse[]>;

function lineKey(bookId: string, pageNum: number, lineNum: number): string {
  return `${bookId}:${pageNum}:${lineNum}`;
}

async function buildLineMap(words: WordResponse[]): Promise<LineMap> {
  // Collect unique (bookId, pageNum) pairs that have a known location
  const pairs = new Map<string, { bookId: string; pageNum: number }>();
  for (const w of words) {
    if (w.bookId && w.pageNum != null && w.lineNum != null) {
      const key = `${w.bookId}:${w.pageNum}`;
      if (!pairs.has(key)) pairs.set(key, { bookId: w.bookId, pageNum: w.pageNum });
    }
  }

  const map: LineMap = new Map();
  await Promise.all(
    Array.from(pairs.values()).map(async ({ bookId, pageNum }) => {
      const pageWords = await fetchPageWords(bookId, pageNum);
      for (const w of pageWords) {
        if (w.lineNum != null) {
          const key = lineKey(bookId, pageNum, w.lineNum);
          if (!map.has(key)) map.set(key, []);
          map.get(key)!.push(w);
        }
      }
    }),
  );

  // Sort each line by wordNum ascending
  map.forEach((lineWords) => lineWords.sort((a, b) => (a.wordNum ?? 0) - (b.wordNum ?? 0)));
  return map;
}

const STATUS_STYLE: Record<string, string> = {
  KNOWN:      'bg-emerald-50 text-emerald-700 border-emerald-200',
  LEARNING:   'bg-amber-50 text-amber-700 border-amber-200',
  IN_PROCESS: 'bg-blue-50 text-blue-700 border-blue-200',
  READY:      'bg-violet-50 text-violet-700 border-violet-200',
  NEW:        'bg-slate-50 text-slate-600 border-slate-200',
  DRAFT:      'bg-gray-50 text-gray-500 border-gray-200',
};

export default async function CardWordsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string; back?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const page = Number(sp.page ?? 0);
  const backUrl = sp.back ?? '/cards';

  const [card, data] = await Promise.all([getCard(id), getWordsByCard(id, page)]);

  if (!card) notFound();

  const lineMap = await buildLineMap(data.content);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href={backUrl}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-4 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Back to Cards
        </Link>

        <h1 className="text-2xl font-bold text-gray-800">{card.txtContent}</h1>
        <p className="text-sm text-gray-500 mt-1">{card.definition}</p>
        <p className="text-xs text-gray-400 mt-2">
          {data.totalElements} word{data.totalElements !== 1 ? 's' : ''} found
        </p>
      </div>

      <TableContainer>
        <thead className="bg-gray-50">
          <tr>
            <Th>Book</Th>
            <Th>Location</Th>
            <Th>Line</Th>
            <Th>Status</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {data.content.map((word: WordResponse) => {
            const key =
              word.bookId && word.pageNum != null && word.lineNum != null
                ? lineKey(word.bookId, word.pageNum, word.lineNum)
                : null;
            const lineWords = key ? (lineMap.get(key) ?? []) : [];

            return (
              <tr key={word.id} className="hover:bg-gray-50 transition-colors">
                <Td>
                  <span className="text-sm text-gray-700">{word.bookTitle ?? '—'}</span>
                </Td>

                <Td>
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500">
                    {word.pageNum != null && (
                      <span className="bg-gray-100 px-1.5 py-0.5 rounded">P{word.pageNum}</span>
                    )}
                    {word.lineNum != null && (
                      <span className="bg-gray-100 px-1.5 py-0.5 rounded">L{word.lineNum}</span>
                    )}
                    {word.wordNum != null && (
                      <span className="bg-gray-100 px-1.5 py-0.5 rounded">W{word.wordNum}</span>
                    )}
                    {word.pageNum == null && word.lineNum == null && (
                      <span className="text-gray-300 italic">No loc.</span>
                    )}
                  </div>
                </Td>

                <Td>
                  {lineWords.length > 0 ? (
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {lineWords.map((w) =>
                        w.id === word.id ? (
                          <mark
                            key={w.id}
                            className="bg-yellow-100 text-gray-900 font-semibold rounded px-0.5 not-italic"
                          >
                            {w.txtContent}
                          </mark>
                        ) : (
                          <span key={w.id}>{w.txtContent}</span>
                        ),
                      ).reduce<React.ReactNode[]>((acc, el, i) => {
                        return i === 0 ? [el] : [...acc, ' ', el];
                      }, [])}
                    </p>
                  ) : (
                    <span className="text-gray-300 text-xs italic">—</span>
                  )}
                </Td>

                <Td>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${STATUS_STYLE[word.status] ?? STATUS_STYLE.DRAFT}`}>
                    {word.status}
                  </span>
                </Td>
              </tr>
            );
          })}
          {data.content.length === 0 && (
            <tr>
              <td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-400">
                No words linked to this card yet.
              </td>
            </tr>
          )}
        </tbody>
      </TableContainer>

      <Pagination page={data.number} totalPages={data.totalPages} />
    </div>
  );
}
