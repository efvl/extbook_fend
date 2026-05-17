'use client';

import { useTransition } from 'react';
import { toggleWordStatus } from '../words/actions';
import { WordResponse, WordStatus } from '@/types/word';

export default function ReaderWord({ word }: { word: WordResponse }) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(() => {
      toggleWordStatus(word.id, word.status);
    });
  };

  const statusStyles: Record<WordStatus, string> = {
    KNOWN: "text-gray-900",
    LEARNING: "bg-amber-200 text-amber-900 shadow-sm",
    NEW: "bg-blue-100 text-blue-800"
  };

  return (
    <span
      onClick={handleClick}
      className={`
        cursor-pointer px-1 rounded transition-all duration-200 select-none
        ${isPending ? 'opacity-50 scale-95' : 'hover:scale-105'}
        ${statusStyles[word.status]}
      `}
      title={`Click to change status (Current: ${word.status})`}
    >
      {word.txtContent}
    </span>
  );
}