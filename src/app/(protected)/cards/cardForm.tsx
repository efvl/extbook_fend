'use client';

import { useActionState, useState } from 'react';
import { saveCardAction } from './actions';
import { CardResponse } from '@/types/card';

export default function CardForm({ initialData }: { initialData?: CardResponse | null }) {
  const [state, formAction, isPending] = useActionState(saveCardAction, null);
  const [contentCount, setContentCount] = useState(initialData?.txtContent?.length || 0);
  const [defCount, setDefCount] = useState(initialData?.definition?.length || 0);

  return (
    <form action={formAction} className="space-y-5">
      {/* Hidden ID field for Updates */}
      {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}

      {state?.error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
          {state.error}
        </div>
      )}

      {/* Text Content */}
      <div>
        <div className="flex justify-between items-end mb-1">
          <label className="block text-sm font-medium text-gray-700">Text Content</label>
          <span className={`text-xs ${contentCount > 120 ? 'text-red-500' : 'text-gray-400'}`}>
            {contentCount}/128
          </span>
        </div>
        <input 
          name="txtContent" 
          maxLength={128}
          type="text"
          defaultValue={initialData?.txtContent}
          onChange={(e) => setContentCount(e.target.value.length)}
          required 
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
          placeholder="Word or phrase..."
        />
      </div>

      {/* Definition */}
      <div>
        <div className="flex justify-between items-end mb-1">
          <label className="block text-sm font-medium text-gray-700">Definition</label>
          <span className={`text-xs ${defCount > 500 ? 'text-red-500' : 'text-gray-400'}`}>
            {defCount}/512
          </span>
        </div>
        <textarea 
          name="definition" 
          maxLength={512}
          rows={4}
          defaultValue={initialData?.definition}
          onChange={(e) => setDefCount(e.target.value.length)}
          required 
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" 
          placeholder="Enter description or translation..."
        />
      </div>

      {/* Numerical values & Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Target Count</label>
          <input 
            name="targetCount" 
            type="number" 
            min="0"
            defaultValue={initialData?.targetCount ?? 0} 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Actual Count</label>
          <input 
            name="actualCount" 
            type="number" 
            min="0"
            defaultValue={initialData?.actualCount ?? 0} 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select 
            name="status" 
            defaultValue={initialData?.status || "NEW"}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          >
            <option value="NEW">New</option>
            <option value="LEARNING">Learning</option>
            <option value="REVIEW">Review</option>
            <option value="MASTERED">Mastered</option>
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button 
          disabled={isPending}
          type="submit" 
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300 transition-all"
        >
          {isPending ? 'Saving...' : initialData ? 'Update Card' : 'Create Card'}
        </button>
      </div>
    </form>
  );
}