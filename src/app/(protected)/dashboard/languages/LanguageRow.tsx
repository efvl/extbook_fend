'use client';

import { useState } from 'react';
import { updateLanguage, enableLanguage } from './actions';
import DeleteButton from './DeleteButton';
import { Language } from '@/types/language';


export default function LanguageRow({ lang }: { lang: Language }) {
  const [isEditing, setIsEditing] = useState(false);

  const handleAction = async (formData: FormData) => {
    await updateLanguage(lang.id, formData);
    setIsEditing(false);
  };

if (isEditing) {
    return (
      <tr className="bg-blue-50/50">
        <td className="px-6 py-4" colSpan={4}>
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
    <tr className={`transition-colors duration-150 ${lang.isEnable ? 'hover:bg-gray-50' : 'bg-gray-50 opacity-60'}`}>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        <span className="bg-gray-100 px-2 py-1 rounded text-xs uppercase tracking-wider text-gray-600">
          {lang.shortName}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {lang.fullName}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        {lang.isEnable ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            Active
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500 border border-gray-200">
            Disabled
          </span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex justify-end items-center gap-3">
          {lang.isEnable ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-600 hover:text-blue-900 font-semibold"
              >
                Edit
              </button>
              <div className="w-[1px] h-4 bg-gray-200" />
              <DeleteButton id={lang.id} />
            </>
          ) : (
            <button
              onClick={() => enableLanguage(lang.id)}
              className="text-emerald-600 hover:text-emerald-800 font-semibold"
            >
              Enable
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
