'use client';

import { useState, useTransition } from 'react';
import { CardResponse, CardStatus } from '@/types/card';
import { handleUpdateCardAction } from './actions';

interface EditCardFormProps {
  card: CardResponse;
}

export default function EditCardForm({ card }: EditCardFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Local Form States
  const [definition, setDefinition] = useState(card.definition || '');
  const [status, setStatus] = useState<CardStatus>(card.status);

  const statuses: CardStatus[] = ['DRAFT', 'NEW', 'LEARNING', 'IN_PROCESS', 'READY', 'KNOWN'];

  const handleSave = () => {
    startTransition(async () => {
      const result = await handleUpdateCardAction(card.id, definition, status);
      if (result?.error) {
        alert(result.error);
      } else {
        setIsEditing(false);
      }
    });
  };

  const handleCancel = () => {
    // Reset back to original database properties
    setDefinition(card.definition || '');
    setStatus(card.status);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="space-y-4">
        <div>
        <span className="text-[11px] font-semibold text-gray-400 block uppercase tracking-wider">
            Definition / Translation
        </span>
        <div className="mt-1 p-3 bg-slate-50 border border-slate-100 rounded-lg text-gray-800 text-sm font-normal tracking-wide leading-relaxed min-h-[4rem] whitespace-pre-wrap">
            {card.definition ? (
            card.definition
            ) : (
            <span className="text-gray-400 italic">No definition recorded yet.</span>
            )}
        </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-1">
          <div>
            <span className="text-[11px] font-semibold text-gray-400 block uppercase">Review Progress</span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-gray-800">{card.actualCount}</span>
              <span className="text-xs text-gray-400">/ {card.targetCount} reviews</span>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-gray-400 block uppercase mb-1">Card Status</span>
            <div>
              <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wider border
                ${card.status === 'READY' || card.status === 'KNOWN' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                ${card.status === 'LEARNING' || card.status === 'IN_PROCESS' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : ''}
                ${card.status === 'DRAFT' || card.status === 'NEW' ? 'bg-gray-100 text-gray-700 border-gray-300' : ''}
              `}>
                {card.status}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="w-full mt-2 py-2 px-4 bg-gray-50 hover:bg-amber-50 text-gray-600 hover:text-amber-700 font-medium text-xs rounded-lg border border-gray-200 hover:border-amber-200 transition duration-150 flex items-center justify-center gap-1.5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
          Edit Flashcard Properties
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in-50 duration-150">
      {/* Definition Textarea Field */}
      <div>
        <label className="text-[11px] font-bold text-amber-800 block uppercase mb-1">Edit Definition</label>
        <textarea
          rows={3}
          value={definition}
          onChange={(e) => setDefinition(e.target.value)}
          disabled={isPending}
          className="w-full p-2.5 text-sm border border-amber-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50/10 resize-none font-serif text-gray-800 placeholder-gray-400"
          placeholder="Type flashcard translation or structural grammar definition here..."
        />
      </div>

      {/* Status Selection Dropdown */}
      <div>
        <label className="text-[11px] font-bold text-amber-800 block uppercase mb-1">Update Status Flow</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as CardStatus)}
          disabled={isPending}
          className="w-full p-2.5 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 font-medium text-gray-700 cursor-pointer"
        >
          {statuses.map((stat) => (
            <option key={stat} value={stat}>
              {stat}
            </option>
          ))}
        </select>
      </div>

      {/* Action Submit Row */}
      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={handleCancel}
          disabled={isPending}
          className="flex-1 py-2 border border-gray-200 text-gray-500 rounded-lg text-xs font-semibold hover:bg-gray-50 transition active:scale-95 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="flex-1 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-sm transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1"
        >
          {isPending ? (
            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}