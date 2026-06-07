'use client';

import { deleteBookAction } from './actions';

export function DeleteBookButton({ id }: { id: string }) {
  return (
    // Wrap the call so the 'action' prop receives a function it can execute
    <form action={async () => {
      await deleteBookAction(id);
    }}>
      <button type="submit" className="text-red-500 hover:text-red-700 font-medium">
        Delete
      </button>
    </form>
  );
}