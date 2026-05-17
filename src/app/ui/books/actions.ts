'use server';

import { createBook, deleteBookById, deleteWordsByBookPage, updateBook, updateBook as updateBookAction } from '@/lib/api/bookService';
import { CreateBookRequest } from '@/types/book';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const BACKEND_URL = process.env.BACKEND_URL;

// Define a strict state type for useActionState (formerly useFormState)
export type ActionState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>; // Useful if Spring Boot returns structured validation errors
} | null;

export async function saveBookAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const id = formData.get('id') as string | null; // Present only during Update

  // 1. Extract and sanitize values safely
  const data: CreateBookRequest = {
    title: (formData.get('title') as string) ?? '',
    authors: (formData.get('authors') as string) ?? '',
    year: formData.get('year') ? Number(formData.get('year')) : null,
    info: (formData.get('info') as string) ?? '',
    isbn: (formData.get('isbn') as string) ?? '',
    languageId: (formData.get('languageId') as string) ?? '',
  };

  // 2. Execute API Call
  try {
    // res will be of type BookResponse here
    const res = id 
      ? await updateBook(id, data) 
      : await createBook(data);
      
    // If it reaches here, the backend returned a 2xx success code 
    // and you have access to the created/updated book data if needed.
    
  } catch (err: any) {
    console.error("Failed to save book:", err);
    
    // Fallback error message if your service layer throws a generic Error
    return { 
      error: err.message || "Failed to connect to backend service. Please try again." 
    };
  }

  // 3. Clear cache and Redirect (Must be placed outside the try/catch block)
  revalidatePath('/ui/books');
  redirect('/ui/books');
}

export async function deleteBookAction(id: string): Promise<void> {
  try {
    await deleteBookById(id);
    revalidatePath('/ui/books');
    // No return needed for success if you're just revalidating
  } catch (error) {
    console.error(error);
  }
}

export async function clearBookPageAction(bookId: string, pageNum: number): Promise<void> {
  try {
    await deleteWordsByBookPage(bookId, pageNum);
    revalidatePath(`/ui/books/${bookId}/reader/${pageNum}`);
    // No return needed for success if you're just revalidating
  } catch (error) {
    console.error(error);
  }
}