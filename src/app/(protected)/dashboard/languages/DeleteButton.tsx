'use client';

import { deleteLanguage } from "./actions";

export default function DeleteButton({ id }: { id: string }) {
  return (
    <button
      onClick={() => deleteLanguage(id)}
      className="text-red-600 hover:underline"
    >
      Delete
    </button>
  );
}