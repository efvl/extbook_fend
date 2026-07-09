import { Page } from "@/types/api";
import Pagination from "@/components/pagination";
import CreateLanguageForm from "./languages/CreateLanguageForm";
import LanguageRow from "./languages/LanguageRow";
import { serverFetch } from "@/lib/serverFetch";

type Language = {
  id: string;
  shortName: string;
  fullName: string;
  isEnable: boolean;
};

type LanguageStats = {
  id: string;
  shortName: string;
  fullName: string;
  bookCount: number;
  wordCount: number;
};

type StatusStats = Record<string, number>;

const WORD_STATUS_STYLE: Record<string, { bg: string; text: string; border: string }> = {
  NEW:        { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200" },
  LEARNING:   { bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200" },
  IN_PROCESS: { bg: "bg-orange-50",  text: "text-orange-700",  border: "border-orange-200" },
  READY:      { bg: "bg-teal-50",    text: "text-teal-700",    border: "border-teal-200" },
  KNOWN:      { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  DRAFT:      { bg: "bg-gray-50",    text: "text-gray-500",    border: "border-gray-200" },
};

function StatBadge({ status, count }: { status: string; count: number }) {
  const style = WORD_STATUS_STYLE[status] ?? WORD_STATUS_STYLE.DRAFT;
  return (
    <div className={`flex flex-col items-center px-4 py-3 rounded-lg border ${style.bg} ${style.border}`}>
      <span className={`text-2xl font-bold ${style.text}`}>{count}</span>
      <span className={`text-xs font-semibold uppercase tracking-wide mt-1 ${style.text}`}>
        {status.replace("_", " ")}
      </span>
    </div>
  );
}

function StatsPanel({ title, stats }: { title: string; stats: StatusStats }) {
  const total = Object.values(stats).reduce((s, n) => s + n, 0);
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6">
      <div className="flex items-baseline gap-3 mb-4">
        <h2 className="text-base font-semibold text-gray-700">{title}</h2>
        <span className="text-sm text-gray-400">{total} total</span>
      </div>
      <div className="flex flex-wrap gap-3">
        {Object.entries(stats).map(([status, count]) => (
          <StatBadge key={status} status={status} count={count} />
        ))}
      </div>
    </div>
  );
}

async function getLanguages(page = 0, size = 10): Promise<Page<Language>> {
  const res = await serverFetch(
    `${process.env.BACKEND_URL}/v1/lang/all?page=${page}&size=${size}`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Failed to load languages");
  return res.json();
}

async function getStats(): Promise<{ words: StatusStats; cards: StatusStats }> {
  const [wordRes, cardRes] = await Promise.all([
    serverFetch(`${process.env.BACKEND_URL}/v1/word/stats`, { cache: "no-store" }),
    serverFetch(`${process.env.BACKEND_URL}/v1/card/stats`, { cache: "no-store" }),
  ]);
  const words: StatusStats = wordRes.ok ? await wordRes.json() : {};
  const cards: StatusStats = cardRes.ok ? await cardRes.json() : {};
  return { words, cards };
}

async function getLanguageStats(): Promise<LanguageStats[]> {
  const res = await serverFetch(`${process.env.BACKEND_URL}/v1/lang/stats`, { cache: "no-store" });
  return res.ok ? res.json() : [];
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? 0);

  const [data, { words, cards }, langStats] = await Promise.all([
    getLanguages(page),
    getStats(),
    getLanguageStats(),
  ]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <StatsPanel title="Words" stats={words} />
      <StatsPanel title="Cards" stats={cards} />

      {langStats.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6">
          <h2 className="text-base font-semibold text-gray-700 mb-4">Words &amp; Books by Language</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-2 text-left font-semibold text-gray-600">Language</th>
                  <th className="pb-2 text-right font-semibold text-gray-600 pr-6">Books</th>
                  <th className="pb-2 text-right font-semibold text-gray-600">Words</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {langStats.map((lang) => (
                  <tr key={lang.id}>
                    <td className="py-2 text-gray-800">
                      <span className="font-medium">{lang.shortName}</span>
                      <span className="ml-2 text-gray-400 text-xs">{lang.fullName}</span>
                    </td>
                    <td className="py-2 text-right pr-6 text-gray-700">{lang.bookCount}</td>
                    <td className="py-2 text-right text-gray-700">{lang.wordCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <h2 className="text-base font-semibold text-gray-700 mb-3">Languages</h2>
      <CreateLanguageForm />
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-gray-900">Short Name</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-900">Full Name</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-right font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.content.map((lang) => (
              <LanguageRow key={lang.id} lang={lang} />
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={data.number} totalPages={data.totalPages} />
    </div>
  );
}
