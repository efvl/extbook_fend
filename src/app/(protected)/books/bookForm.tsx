'use client';

import { useActionState } from 'react';
import { saveBookAction } from './actions';
import { useState } from 'react';

export default function BookForm({ 
  initialData, 
  languages 
}: { 
  initialData?: any, 
  languages: any[] 
}) {
  // useActionState handles the form result and the 'pending' state
  const [state, formAction, isPending] = useActionState(saveBookAction, null);
  const [charCount, setCharCount] = useState(initialData?.title?.length || 0);

  return (
    <form action={formAction} className="space-y-5">
      {/* Hidden ID field for Updates */}
      {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}

      {state?.error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
          {state.error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
        <select 
          name="languageId" 
          defaultValue={initialData?.language?.id || ""}
          required 
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
        >
          <option value="">Select Language...</option>
          {languages.map((lang) => (
            <option key={lang.id} value={lang.id}>{lang.fullName}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
        <div className="flex justify-between items-end mb-1">
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <span className={`text-xs ${charCount > 250 ? 'text-red-500' : 'text-gray-400'}`}>
            {charCount}/255
        </span>
        </div>
        <textarea 
            name="title" 
            maxLength={255}
            rows={3}
            defaultValue={initialData?.title}
            onChange={(e) => setCharCount(e.target.value.length)}
            required 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" 
            placeholder="Enter the full book title..."
            />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Authors</label>
          <input name="authors" defaultValue={initialData?.authors} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
          <input name="year" type="number" defaultValue={initialData?.year} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <button 
          disabled={isPending}
          type="submit" 
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300 transition-all"
        >
          {isPending ? 'Saving...' : initialData ? 'Update Book' : 'Create Book'}
        </button>
      </div>
    </form>
  );
}