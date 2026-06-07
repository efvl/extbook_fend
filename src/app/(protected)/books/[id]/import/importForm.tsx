'use client';

import { useState, useMemo } from 'react';
import { importPageText } from '../../../words/actions';

export default function ImportForm({ bookId }: { bookId: string }) {
  const [text, setText] = useState('');
  const [pageNum, setPageNum] = useState('');

  // Calculate preview data whenever text changes
  const stats = useMemo(() => {
    const lines = text.split('\n').filter(l => l.trim() !== '');
    const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length;
    return {
      lineCount: lines.length,
      wordCount: wordCount
    };
  }, [text]);

// Define the client-side action handler
  async function handleFormAction(formData: FormData) {
    "use server";
    await importPageText(bookId, formData);
  }

  return (
    <form action={handleFormAction} className="space-y-6">
      <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
        <div className="flex items-center gap-8">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Page Number</label>
            <input 
              name="pageNum" 
              type="number" 
              value={pageNum}
              onChange={(e) => setPageNum(e.target.value)}
              required 
              className="w-32 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>

          {/* PREVIEW STATS CHIPS */}
          <div className="flex gap-4 self-end pb-1">
            <div className="px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-xs font-medium text-blue-700">
              Lines: {stats.lineCount}
            </div>
            <div className="px-3 py-1 bg-green-50 border border-green-100 rounded-full text-xs font-medium text-green-700">
              Total Words: {stats.wordCount}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Page Content</label>
          <textarea 
            name="rawText"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            rows={12}
            className="w-full px-4 py-3 border rounded-lg font-serif text-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Paste text here..."
          />
        </div>
      </div>

      {/* DYNAMIC PREVIEW LIST (Optional: showing first 5 words) */}
      {stats.wordCount > 0 && (
        <div className="p-4 bg-gray-50 border rounded-lg border-dashed">
          <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">Import Preview</p>
          <div className="flex flex-wrap gap-2">
            {text.trim().split(/\s+/).slice(0, 10).map((w, i) => (
              <span key={i} className="text-sm bg-white border px-2 py-0.5 rounded shadow-sm text-gray-600">
                {w}
              </span>
            ))}
            {stats.wordCount > 10 && <span className="text-gray-400">...</span>}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-4">
        <button 
          type="submit"
          disabled={stats.wordCount === 0 || !pageNum}
          className="px-8 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 shadow-lg transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed active:scale-95"
        >
          Create {stats.wordCount} Words
        </button>
      </div>
    </form>
  );
}