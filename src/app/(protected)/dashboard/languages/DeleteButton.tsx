'use client';

import { deleteLanguage } from "./actions";

export default function DeleteButton({ id }: { id: string }) {
  return (
    <button
      onClick={() => deleteLanguage(id)}
      className="text-red-500 hover:text-red-700 font-semibold"
    >
      Disable
    </button>
  );
}