import { getWordsByBookAndPage, getWordById } from "@/lib/api/wordService";
import Link from "next/link";
import { redirect } from "next/navigation";
import ClearPageButton from "../../../ClearPageButton";
import { getCardById } from "@/lib/api/cardService";
import EditCardForm from "@/app/(protected)/cards/EditCardForm";
import ReaderLine from "../../../ReaderLine";

interface PageProps {
  params: Promise<{ id: string; pageNum: string }>;
  searchParams: Promise<{ wordId?: string }>;
}

export default async function BookReaderPage({ params, searchParams }: PageProps) {
  const { id, pageNum } = await params;
  const resolvedSearchParams = await searchParams;
  const wordId = resolvedSearchParams?.wordId as string | undefined;

  const currentPage = parseInt(pageNum);
  const data = await getWordsByBookAndPage(id, currentPage);

  const selectedWord = wordId ? await getWordById(wordId) : null;
  const selectedCard = selectedWord?.cardId ? await getCardById(selectedWord.cardId) : null;

  async function jumpToPage(formData: FormData) {
    'use server';
    const targetPage = formData.get('targetPage');
    if (targetPage) {
      const queryString = wordId ? `?wordId=${wordId}` : '';
      redirect(`/books/${id}/reader/${targetPage}${queryString}`);
    }
  }

  if (!data) return <div className="p-10 text-center">Page not found or no words recorded.</div>;

return (
    <div className="max-w-7xl mx-auto p-8">
      {/* Navigation Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b pb-6">
        <div className="flex items-center gap-4">
          <Link href={`/books`} className="text-gray-400 hover:text-gray-600 transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </Link>
          <h2 className="font-semibold text-gray-700">Reading Mode</h2>
          <Link href={`/books/${id}/reader/${pageNum}/edit`} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-semibold">
            Edit Page
          </Link>
          <Link href={`/books/${id}/import`} className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-xs font-semibold">
            Import
          </Link>
          <ClearPageButton bookId={id} pageNum={currentPage} />
        </div>

        <div className="flex items-center gap-3">
          <form action={jumpToPage} className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Go to:</span>
            <input name="targetPage" type="number" min="1" placeholder={currentPage.toString()} className="w-16 px-2 py-1 border rounded text-center text-sm outline-none focus:ring-2 focus:ring-amber-500" />
          </form>
          <div className="h-4 w-px bg-gray-200 mx-2" />
          <div className="flex items-center gap-1">
            <Link href={`/books/${id}/reader/${currentPage - 1}`} className={`p-2 hover:bg-gray-100 rounded-full transition ${currentPage <= 1 ? 'pointer-events-none opacity-20' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </Link>
            <span className="text-sm font-medium min-w-[80px] text-center">Pg. {currentPage}</span>
            <Link href={`/books/${id}/reader/${currentPage + 1}`} className="p-2 hover:bg-gray-100 rounded-full transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Layout Splitter */}
      <div className={`grid gap-8 transition-all duration-300 ${selectedWord ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'}`}>

      {/* The "Physical" Page Container */}
      <div className={`bg-[#fdfbf7] shadow-2xl border border-amber-100 min-h-[80vh] p-12 rounded-sm ring-1 ring-amber-50 transition-all ${selectedWord ? 'lg:col-span-2' : ''}`}>
        <div className="space-y-4">
          {Object.entries(data.lines)
            .sort(([a], [b]) => parseInt(a) - parseInt(b))
            .map(([lineNum, words]) => (
              <ReaderLine
                key={`${currentPage}-${lineNum}`}
                lineNum={lineNum}
                words={words}
                wordId={wordId}
                pageNum={currentPage}
              />
            ))}
        </div>
      </div>

        {/* Sidebar Panel */}
        {selectedWord && (
          <div className="flex flex-col gap-6 self-start sticky top-6 max-h-[calc(100vh-4rem)] overflow-y-auto pr-1">

            {/* WORD METRICS INSPECTOR PANEL */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 animate-in fade-in slide-in-from-right-4 duration-200">
              <div className="flex justify-between items-start border-b pb-4 mb-4">
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-gray-400">Inspecting Element</span>
                  <h3 className="text-3xl font-serif font-bold text-gray-800 mt-1">{selectedWord.txtContent}</h3>
                </div>
                <Link href={`/books/${id}/reader/${pageNum}`} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition" title="Close Panel">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                </Link>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <label className="text-xs font-semibold text-gray-400 block mb-1">Word Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                    ${selectedWord.status === 'KNOWN' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                    ${selectedWord.status === 'LEARNING' ? 'bg-amber-50 text-amber-700 border-amber-200' : ''}
                    ${selectedWord.status === 'NEW' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                  `}>
                    ● {selectedWord.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-gray-50 p-3 rounded-lg border border-gray-100 text-center">
                  <div>
                    <span className="text-[10px] block text-gray-400 uppercase font-bold">Page</span>
                    <span className="text-sm font-semibold text-gray-700">{selectedWord.pageNum ?? 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] block text-gray-400 uppercase font-bold">Line No.</span>
                    <span className="text-sm font-semibold text-gray-700">{selectedWord.lineNum ?? 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] block text-gray-400 uppercase font-bold">Position</span>
                    <span className="text-sm font-semibold text-gray-700">{selectedWord.wordNum ?? 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* FLASHCARD DESIGN PANEL */}
            {selectedCard ? (
              <div className="bg-gradient-to-br from-amber-50/40 via-white to-white border border-amber-200 rounded-xl shadow-lg p-6 animate-in fade-in slide-in-from-right-6 duration-300">
                <div className="flex items-center gap-2 border-b border-amber-100 pb-3 mb-4">
                  <svg className="text-amber-500" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="18" x="3" y="3" rx="2" /><path d="M7 7h10M7 12h10M7 17h10"/>
                  </svg>
                  <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Connected Flashcard</h4>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-[11px] font-semibold text-gray-400 block uppercase">Card Term</span>
                    <p className="text-xl font-semibold text-gray-800">{selectedCard.txtContent}</p>
                  </div>

                  <EditCardForm key={selectedCard.id} card={selectedCard} />

                  <div className="pt-3 border-t border-gray-100 text-[11px] font-mono text-gray-400 break-all">
                    <span>Card UUID: {selectedCard.id}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-6 text-center text-sm text-gray-400">
                No system flashcard linked to this word entity.
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}