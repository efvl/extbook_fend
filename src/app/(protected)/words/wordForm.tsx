'use client';

import { useActionState } from 'react';
import { createWord, saveWord } from './actions';
import { WordResponse } from "@/types/word";
import Link from 'next/link';

export default function WordForm({ 
  books, 
  initialData, 
  defaultBookId 
}: { 
  books: any[], 
  initialData?: WordResponse, 
  defaultBookId?: string // Optional for Create mode
}) {
  const [state, formAction, isPending] = useActionState(saveWord, null);

  // Logic: Use the ID from existing word first, then the URL param, then empty string
  const activeBookId = initialData?.bookId || defaultBookId || "";

return (
    <form action={formAction} className="space-y-6 bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
      {/* Hidden ID for Updates */}
      {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}

      {/* Book Selection */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Source Book</label>
        <select 
          name="bookId" 
          defaultValue={activeBookId} // This will pre-select the correct book
          required 
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
        >
          <option value="">Select a book...</option>
          {books.map((book) => (
            <option key={book.id} value={book.id}>
              {book.title}
            </option>
          ))}
        </select>
      </div>

      {/* Text Content */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Word / Phrase</label>
        <input 
          name="txtContent" 
          defaultValue={initialData?.txtContent}
          required 
          maxLength={128}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
        />
      </div>

      {/* Location Logic (Match Long pageNum, lineNum, wordNum) */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { name: 'pageNum', label: 'Page' },
          { name: 'lineNum', label: 'Line' },
          { name: 'wordNum', label: 'Word Index' }
        ].map((field) => (
          <div key={field.name}>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{field.label}</label>
            <input 
              name={field.name} 
              type="number" 
              defaultValue={(initialData as any)?.[field.name] ?? ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500" 
            />
          </div>
        ))}
      </div>

      {/* Status Selection */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Learning Status</label>
        <div className="flex gap-6">
          {['NEW', 'LEARNING', 'KNOWN'].map((status) => (
            <label key={status} className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="status" 
                value={status} 
                defaultChecked={initialData ? initialData.status === status : status === 'NEW'} 
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300" 
              />
              <span className="text-sm font-medium text-gray-700">{status}</span>
            </label>
          ))}
        </div>
      </div>

        <div className="pt-6 border-t flex justify-end items-center gap-4">
            <button 
              disabled={isPending}
              type="submit" 
              className="px-8 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:bg-blue-300 transition-all shadow-md shadow-blue-100"
            >
              {isPending ? 'Saving...' : initialData ? 'Update Word' : 'Create Word'}
        </button>
      </div>
    </form>
  );
}