'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { CardResponse } from '@/types/card';
import { recordLessonCardResult } from './actions';
import { CardStat } from './page';

type Lesson = {
  id: string;
  type: 'BY_DEFINITION' | 'BY_SENTENCE';
  name: string;
  languageShortName: string | null;
};

type Props = {
  lesson: Lesson;
  cards: CardResponse[];
  stats: CardStat[];
};

type Phase = 'input' | 'result';

export default function FlashcardSession({ lesson, cards, stats }: Props) {
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState('');
  const [phase, setPhase] = useState<Phase>('input');
  const [isCorrect, setIsCorrect] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const isDone = index >= cards.length;
  const card = isDone ? null : cards[index];
  const currentStat = card ? (stats.find((s) => s.cardId === card.id) ?? null) : null;

  const prompt =
    card == null ? '' : lesson.type === 'BY_DEFINITION' ? card.definition : card.txtContent;
  const expected =
    card == null ? '' : lesson.type === 'BY_DEFINITION' ? card.txtContent : card.definition;

  useEffect(() => {
    if (phase === 'input') inputRef.current?.focus();
  }, [phase, index]);

  const handleCheck = useCallback(() => {
    if (!input.trim() || card == null) return;
    const correct = input.trim().toLowerCase() === expected.trim().toLowerCase();
    setIsCorrect(correct);
    setResults((prev) => [...prev, correct]);
    setPhase('result');
    recordLessonCardResult(lesson.id, card.id, correct).catch(console.error);
  }, [input, expected, card, lesson.id]);

  const handleNext = useCallback(() => {
    setInput('');
    setPhase('input');
    setIndex((i) => i + 1);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (phase === 'input') handleCheck();
        else handleNext();
      }
    },
    [phase, handleCheck, handleNext],
  );

  const handleRestart = useCallback(() => {
    setIndex(0);
    setInput('');
    setPhase('input');
    setResults([]);
  }, []);

  if (isDone) {
    const correct = results.filter(Boolean).length;
    const total = cards.length;
    const pct = Math.round((correct / total) * 100);

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
        <div className="w-full max-w-md text-center">
          <div className="text-5xl mb-4">
            {pct === 100 ? '🎉' : pct >= 60 ? '👍' : '📚'}
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Session complete!</h2>
          <p className="text-sm text-gray-400 mb-6">{lesson.name}</p>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
            <div className="text-5xl font-bold text-indigo-600 mb-1">
              {correct}
              <span className="text-2xl text-gray-300 font-normal"> / {total}</span>
            </div>
            <div className="text-sm text-gray-500 mb-4">{pct}% correct</div>
            <div className="flex justify-center gap-1.5 flex-wrap">
              {results.map((r, i) => (
                <span
                  key={i}
                  title={r ? 'Correct' : 'Incorrect'}
                  className={`w-3 h-3 rounded-full ${r ? 'bg-emerald-400' : 'bg-red-400'}`}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={handleRestart}
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition"
            >
              Try again
            </button>
            <Link
              href="/lessons"
              className="px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition"
            >
              All lessons
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-6 p-8 min-h-[60vh] items-start justify-center max-w-4xl mx-auto">

      {/* Left: flashcard content */}
      <div className="flex-1 max-w-lg">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-sm font-medium text-gray-700">{lesson.name}</p>
            <p className="text-xs text-gray-400">
              {lesson.type === 'BY_DEFINITION' ? 'Type the word' : 'Type the definition'}
            </p>
          </div>
          <span className="text-sm text-gray-400 font-medium tabular-nums">
            {index + 1} / {cards.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-100 rounded-full h-1.5 mb-8">
          <div
            className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${(index / cards.length) * 100}%` }}
          />
        </div>

        {/* Prompt card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 mb-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            {lesson.type === 'BY_DEFINITION' ? 'Definition' : 'Sentence'}
          </p>
          <p className="text-xl font-medium text-gray-800 leading-relaxed">{prompt}</p>
        </div>

        {/* Input phase */}
        {phase === 'input' && (
          <div className="space-y-3">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                lesson.type === 'BY_DEFINITION' ? 'Type the word…' : 'Type the definition…'
              }
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleCheck}
              disabled={!input.trim()}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Check
            </button>
          </div>
        )}

        {/* Result phase */}
        {phase === 'result' && (
          <div className="space-y-3">
            <div
              className={`flex items-start gap-3 p-4 rounded-xl border ${
                isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'
              }`}
            >
              <span className={`leading-none mt-0.5 ${isCorrect ? 'text-emerald-600' : 'text-red-500'}`}>
                {isCorrect ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                  </svg>
                )}
              </span>
              <div className="flex-1 min-w-0">
                <p className={`font-semibold ${isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </p>
                {!isCorrect && (
                  <p className="text-sm text-gray-600 mt-1">
                    Correct answer:{' '}
                    <span className="font-semibold text-gray-800">{expected}</span>
                  </p>
                )}
                <p className="text-sm text-gray-400 mt-0.5">
                  Your answer:{' '}
                  <span className={`font-medium ${isCorrect ? 'text-emerald-700' : 'text-gray-600'}`}>
                    {input}
                  </span>
                </p>
              </div>
            </div>

            <button
              onClick={handleNext}
              onKeyDown={handleKeyDown}
              autoFocus
              className="w-full bg-gray-800 text-white py-3 rounded-xl font-medium hover:bg-gray-700 transition"
            >
              {index + 1 < cards.length ? 'Next →' : 'See results'}
            </button>
          </div>
        )}
      </div>

      {/* Right: card history stats */}
      <div className="w-44 shrink-0 pt-1">
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm sticky top-8">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
            Card history
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
                  <path d="M20 6 9 17l-5-5"/>
                </svg>
                Correct
              </div>
              <span className="text-lg font-bold text-emerald-600 tabular-nums">
                {currentStat?.correctCount ?? 0}
              </span>
            </div>
            <div className="h-px bg-gray-100" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
                  <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                </svg>
                Wrong
              </div>
              <span className="text-lg font-bold text-red-500 tabular-nums">
                {currentStat?.wrongCount ?? 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
