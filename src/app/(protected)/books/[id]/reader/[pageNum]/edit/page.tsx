import { getWordsByBookAndPage } from "@/lib/api/wordService";
import { savePageWords } from "../../../../../words/actions";
import Link from "next/link";

export default async function WritingModePage({ params }: { params: Promise<{ id: string, pageNum: string }> }) {
  const { id, pageNum } = await params;
  const currentPage = parseInt(pageNum);
  const data = await getWordsByBookAndPage(id, currentPage);

  async function handleFormAction(formData: FormData) {
    "use server";
    await savePageWords(id, currentPage, formData);
  }

  if (!data) return <div>No words found for this page.</div>;

  return (
    <div className="max-w-5xl mx-auto p-8">
      <form action={handleFormAction}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Writing Mode</h1>
            <p className="text-sm text-gray-500">Editing Page {currentPage}</p>
          </div>
          <div className="flex gap-3">
            <Link
              href={`/books/${id}/reader/${pageNum}`}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-lg transition-transform active:scale-95"
            >
              Save All Changes
            </button>
          </div>
        </div>

        {/* The Editable "Paper" */}
        <div className="bg-white shadow-2xl border border-gray-200 min-h-[80vh] p-12 rounded-lg">
          <div className="space-y-6">
            {Object.entries(data.lines)
              .sort(([a], [b]) => parseInt(a) - parseInt(b))
              .map(([lineNum, words]) => (
                <div key={lineNum} className="flex flex-wrap items-center gap-2 border-b border-gray-50 pb-2">
                  <span className="text-xs text-gray-400 w-6 font-mono">{lineNum}</span>
                  {words.map((word) => (
                    <div key={word.id} className="flex flex-col">
                        <input type="hidden" name="wordId" value={word.id} />
                        <input type="hidden" name="lineNum" value={word.lineNum || ""} />
                        <input type="hidden" name="wordNum" value={word.wordNum || ""} />
                        <input type="hidden" name="status" value={word.status} />
                      <input
                        name="txtContent"
                        defaultValue={word.txtContent}
                        className="px-2 py-1 border border-transparent hover:border-blue-200 focus:border-blue-500 focus:bg-blue-50 outline-none rounded transition-all text-lg font-serif min-w-[60px]"
                        style={{ width: `${Math.max(word.txtContent.length + 2, 5)}ch` }}
                      />
                    </div>
                  ))}
                </div>
              ))}
          </div>
        </div>
      </form>
    </div>
  );
}