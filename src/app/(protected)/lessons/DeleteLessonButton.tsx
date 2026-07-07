'use client';

import { deleteLessonAction } from './actions';

export function DeleteLessonButton({ id }: { id: string }) {
  return (
    <form action={async () => { await deleteLessonAction(id); }}>
      <button type="submit" className="text-red-500 hover:text-red-700 font-medium">
        Delete
      </button>
    </form>
  );
}
