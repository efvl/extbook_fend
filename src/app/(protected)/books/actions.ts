'use server';

import { createBook, deleteBookById, deleteWordsByBookPage, updateBook } from '@/lib/api/bookService';
import { CreateBookRequest } from '@/types/book';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export type ActionState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
} | null;

export async function saveBookAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const id = formData.get('id') as string | null;

  const data: CreateBookRequest = {
    title: (formData.get('title') as string) ?? '',
    authors: (formData.get('authors') as string) ?? '',
    year: formData.get('year') ? Number(formData.get('year')) : null,
    info: (formData.get('info') as string) ?? '',
    isbn: (formData.get('isbn') as string) ?? '',
    languageId: (formData.get('languageId') as string) ?? '',
  };

  try {
    id ? await updateBook(id, data) : await createBook(data);
  } catch (err: any) {
    console.error("Failed to save book:", err);
    return { error: err.message || "Failed to connect to backend service. Please try again." };
  }

  revalidatePath('/books');
  redirect('/books');
}

export async function deleteBookAction(id: string): Promise<void> {
  try {
    await deleteBookById(id);
    revalidatePath('/books');
  } catch (error) {
    console.error(error);
  }
}

export async function clearBookPageAction(bookId: string, pageNum: number): Promise<void> {
  try {
    await deleteWordsByBookPage(bookId, pageNum);
    revalidatePath(`/books/${bookId}/reader/${pageNum}`);
  } catch (error) {
    console.error(error);
  }
}