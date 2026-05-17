import ReaderWord from "@/app/ui/words/readerWord";
import { getWordsByBookAndPage } from "../../../../words/services";
import Link from "next/link";
import { redirect } from "next/navigation";
import ClearPageButton from "../../../ClearPageButton";

export default async function BookReaderPage({ params }: { params: Promise<{ id: string, pageNum: string }> }) {
  const { id, pageNum } = await params;
  const currentPage = parseInt(pageNum);
  const data = await getWordsByBookAndPage(id, currentPage);

// Server Action to handle the "Jump to Page"
  async function jumpToPage(formData: FormData) {
    'use server';
    const targetPage = formData.get('targetPage');
    if (targetPage) {
      redirect(`/ui/books/${id}/reader/${targetPage}`);
    }
  }

if (!data) return <div className="p-10 text-center">Page not found or no words recorded.</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Navigation Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b pb-6">
        <div className="flex items-center gap-4">
          <Link href={`/ui/books`} className="text-gray-400 hover:text-gray-600 transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/></svg>
          </Link>
          <h2 className="font-semibold text-gray-700">Reading Mode</h2>

          {/* Edit Button */}
          <Link href={`/ui/books/${id}/reader/${pageNum}/edit`} 
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-semibold"
            >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
            Edit Page
          </Link>

          {/* Import Button */}
          <Link href={`/ui/books/${id}/import`}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-xs font-semibold"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
            Import
          </Link>

        {/* Clear Page Action */}
        <ClearPageButton bookId={id} pageNum={currentPage} />

        </div>
        {/* Jump to Page Form */}
        <div className="flex items-center gap-3">
          <form action={jumpToPage} className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Go to:</span>
            <input 
              name="targetPage"
              type="number" 
              min="1"
              placeholder={currentPage.toString()}
              className="w-16 px-2 py-1 border rounded text-center text-sm outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button type="submit" className="hidden">Go</button>
          </form>
          
          <div className="h-4 w-px bg-gray-200 mx-2" />

          <div className="flex items-center gap-1">
            <Link 
              href={`/ui/books/${id}/reader/${currentPage - 1}`}
              className={`p-2 hover:bg-gray-100 rounded-full transition ${currentPage <= 1 ? 'pointer-events-none opacity-20' : ''}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </Link>
            <span className="text-sm font-medium min-w-[80px] text-center">
              Pg. {currentPage}
            </span>
            <Link 
              href={`/ui/books/${id}/reader/${currentPage + 1}`}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </Link>
          </div>
        </div>
      </div>

{/* The "Physical" Page Container */}
      <div className="bg-[#fdfbf7] shadow-2xl border border-amber-100 min-h-[80vh] p-12 rounded-sm ring-1 ring-amber-50">
        <div className="space-y-4">
          {Object.entries(data.lines)
            .sort(([a], [b]) => parseInt(a) - parseInt(b))
            .map(([lineNum, words]) => (
              <div key={lineNum} className="flex flex-wrap items-baseline gap-x-2 border-l-2 border-transparent hover:border-amber-200 pl-4 transition-colors">
                <span className="text-[10px] text-gray-300 w-4 select-none">{lineNum}</span>
                {words.map((word) => (
                    <ReaderWord key={word.id} word={word} />
                ))}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

