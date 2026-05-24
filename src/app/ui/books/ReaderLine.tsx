'use client';

import { useState, useTransition, useEffect } from 'react';
import ReaderWord from '@/app/ui/words/readerWord';
import { WordResponse } from '@/types/word';
import { incrementLineProgress } from '../words/actions';


interface ReaderLineProps {
  lineNum: string;
  words: WordResponse[];
  wordId?: string;
  pageNum: number; // Used to track page changes explicitly
}

export default function ReaderLine({ lineNum, words, wordId, pageNum }: ReaderLineProps) {
  const [isChecked, setIsChecked] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Explicit safety check: Uncheck whenever the user flips pages
  useEffect(() => {
    setIsChecked(false);
  }, [pageNum]);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsChecked(checked);

    if (checked) {
      // Gather all associated cardIds for this line
      const cardIds = words.map(w => w.cardId).filter(Boolean);
      
      if (cardIds.length === 0) return;

      startTransition(async () => {
        const result = await incrementLineProgress(cardIds);
        if (result?.error) {
          alert(result.error);
          setIsChecked(false); // Rollback state on error
        }
      });
    }
  };

  return (
    <div 
      className={`flex flex-wrap items-baseline gap-x-2 border-l-2 pl-2 transition-colors duration-200
        ${isChecked ? 'border-green-400 bg-green-50/20' : 'border-transparent hover:border-amber-200'}
        ${isPending ? 'opacity-60 pointer-events-none' : ''}
      `}
    >
      {/* Checkbox tracking element */}
      <div className="flex items-center justify-center w-5 h-5 select-none self-center mr-1">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          disabled={isPending}
          className="w-4 h-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500 accent-amber-600 cursor-pointer disabled:cursor-not-allowed"
          title="Mark line as read and progress flashcards"
        />
      </div>

      {/* Line Number indicator */}
      <span className="text-[10px] text-gray-300 w-4 select-none font-mono">
        {lineNum}
      </span>

      {/* Word Mappers */}
      <div className="flex flex-wrap items-baseline gap-x-2 flex-1">
        {words.map((word) => (
          <ReaderWord key={word.id} word={word} isSelected={wordId === word.id} />
        ))}
      </div>
    </div>
  );
}
