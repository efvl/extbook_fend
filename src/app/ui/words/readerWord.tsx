'use client';

import { useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { deleteWord, toggleWordStatus } from '../words/actions';
import Link from 'next/link';
import { WordResponse, WordStatus } from '@/types/word';

interface ReaderWordProps {
  word: WordResponse;
  isSelected: boolean;
}

export default function ReaderWord({ word, isSelected }: ReaderWordProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Handle icon status change trigger explicitly
  const handleToggleStatus = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    startTransition(async () => {
      const result = await toggleWordStatus(word.id, word.status);
      if (result?.error) alert(result.error);
    });
  };

  // Handle icon delete trigger explicitly
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete "${word.txtContent}"?`)) {
      startTransition(async () => {
        await deleteWord(word.id);
        // Clear query parameters if the currently active layout word is deleted
        if (searchParams.get('wordId') === word.id) {
          router.push(window.location.pathname);
        }
      });
    }
  };

  const statusStyles: Record<WordStatus, string> = {
    KNOWN: "text-gray-900 hover:bg-gray-100",
    LEARNING: "bg-amber-100 text-amber-900 shadow-sm hover:bg-amber-200",
    NEW: "bg-blue-50 text-blue-800 hover:bg-blue-100"
  };

// Construct a clean, preserving URL query string target for the current active page structure
  const currentQuery = new URLSearchParams(searchParams.toString());
  currentQuery.set('wordId', word.id);

return (
    <div className={`relative inline-flex items-center group my-0.5 ${isPending ? 'opacity-50 pointer-events-none' : ''}`}>
{/* Clicking the word maps directly to updates via URL Query parameters */}
      <Link
        href={`?${currentQuery.toString()}`}
        scroll={false} // Prevents unexpected window scroll jumps
        className={`
          cursor-pointer px-1.5 py-0.5 rounded transition-all duration-150 select-none font-medium text-base
          ${statusStyles[word.status]}
          ${isSelected ? 'ring-2 ring-blue-500 ring-offset-1 scale-105 shadow-sm' : ''}
        `}
      >
        {word.txtContent}
      </Link>

{/* Hover Toolbar Action overlay */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:flex items-center gap-1 bg-white border border-gray-200 shadow-xl rounded-md p-1 z-20 before:content-[''] before:absolute before:top-full before:left-0 before:right-0 before:h-2">
        
        {/* Toggle Action Icon */}
        <button
          type="button"
          onClick={handleToggleStatus}
          className="p-1 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors"
          title="Toggle Status Value"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 16h5v5" />
          </svg>
        </button>

        {/* Delete Action Icon */}
        <button
          type="button"
          onClick={handleDelete}
          className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
          title="Delete Word Profile"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
        </button>

      </div>
    </div>
  );
}