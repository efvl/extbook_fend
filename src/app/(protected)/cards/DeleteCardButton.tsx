'use client';

import { deleteCardAction } from './actions';

export function DeleteCardButton({ id }: { id: string }) {
  return (
    // Wrap the call so the 'action' prop receives a function it can execute
    <form action={async () => {
      await deleteCardAction(id);
    }}>
      <button type="submit" className="text-red-500 hover:text-red-700 font-medium">
        Delete
      </button>
    </form>
  );
}