'use client';

import { useState } from 'react';
import { updateLanguage } from './actions';
import DeleteButton from './DeleteButton';
import { Language } from '@/types/page';


export default function LanguageRow({ lang }: { lang: Language }) {
  const [isEditing, setIsEditing] = useState(false);

  // This wrapper allows us to close the edit mode after saving
  const handleAction = async (formData: FormData) => {
    await updateLanguage(lang.id, formData);
    setIsEditing(false);
  };

if (isEditing) {
    return (
      <tr className="bg-blue-50/50">
        <td className="px-6 py-4" colSpan={3}>
          <form action={handleAction} className="flex items-center gap-3">
            <input 
              name="shortName" 
              defaultValue={lang.shortName} 
              className="w-24 px-3 py-1.5 text-sm border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
            <input 
              name="fullName" 
              defaultValue={lang.fullName} 
              className="flex-1 px-3 py-1.5 text-sm border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="flex items-center gap-2 ml-auto">
              <button 
                type="submit" 
                className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
              <button 
                type="button" 
                onClick={() => setIsEditing(false)} 
                className="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </td>
      </tr>
    );
  }

  return (
    <tr className="hover:bg-gray-50 transition-colors duration-150">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        <span className="bg-gray-100 px-2 py-1 rounded text-xs uppercase tracking-wider text-gray-600">
          {lang.shortName}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {lang.fullName}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex justify-end items-center gap-3">
          <button 
            onClick={() => setIsEditing(true)} 
            className="text-blue-600 hover:text-blue-900 font-semibold"
          >
            Edit
          </button>
          <div className="w-[1px] h-4 bg-gray-200" /> {/* Subtle vertical divider */}
          <DeleteButton id={lang.id} />
        </div>
      </td>
    </tr>
  );
}