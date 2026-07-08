'use client';

import { addCardToLessonAction } from './actions';

export function AddToLessonButton({ lessonId, cardId }: { lessonId: string; cardId: string }) {
  return (
    <form action={addCardToLessonAction.bind(null, lessonId, cardId)}>
      <button
        type="submit"
        className="text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors"
      >
        + Lesson
      </button>
    </form>
  );
}
