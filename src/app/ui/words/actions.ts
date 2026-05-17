'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { WordStatus } from '@/types/word';

const BACKEND_URL = process.env.BACKEND_URL;

export async function savePageWords(bookId: string, pageNum: number, formData: FormData) {
  // Extract all word IDs and their new content from the form
  const wordIds = formData.getAll('wordId') as string[];
  const contents = formData.getAll('txtContent') as string[];
  const lineNums = formData.getAll('lineNum') as string[];
  const wordNums = formData.getAll('wordNum') as string[];
  const statuses = formData.getAll('status') as string[];

  // Create an array of objects to send to the backend
  const updates = wordIds.map((id, index) => ({
    id: id, // Used by the service to identify the record
    bookId: bookId,
    pageNum: pageNum,
    lineNum: lineNums[index] ? Number(lineNums[index]) : null,
    wordNum: wordNums[index] ? Number(wordNums[index]) : null,
    txtContent: contents[index],
    status: statuses[index]
  }));

  const res = await fetch(`${BACKEND_URL}/v1/word/bulk`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });

  if (!res.ok) {
    const errorMsg = await res.text();
    console.error("Bulk Update Failed:", errorMsg);
    return { error: "Failed to save page changes." };
  }

  revalidatePath(`/ui/books/${bookId}/reader/${pageNum}`);
  redirect(`/ui/books/${bookId}/reader/${pageNum}`);
}

export async function toggleWordStatus(id: string, currentStatus: WordStatus) {
  // Logic: NEW -> LEARNING -> KNOWN -> NEW
  const statusMap: Record<WordStatus, WordStatus> = {
    'NEW': 'LEARNING',
    'LEARNING': 'KNOWN',
    'KNOWN': 'NEW'
  };
  
  const newStatus = statusMap[currentStatus];

  const res = await fetch(`${BACKEND_URL}/v1/word/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newStatus), 
  });

  if (!res.ok) {
      const error = await res.json();
      return { error: error.message || "Failed to update word status" };
    }

  revalidatePath('/ui/books/[id]/reader/[pageNum]', 'page');
}

export async function createWord(prevState: any, formData: FormData) {
  const data = {
    bookId: formData.get('bookId'),
    pageNum: formData.get('pageNum') ? Number(formData.get('pageNum')) : null,
    lineNum: formData.get('lineNum') ? Number(formData.get('lineNum')) : null,
    wordNum: formData.get('wordNum') ? Number(formData.get('wordNum')) : null,
    txtContent: formData.get('txtContent'),
    status: formData.get('status'), // Matches WordStatus Enum
  };

  const res = await fetch(`${BACKEND_URL}/v1/word`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

  if (!res.ok) {
      const error = await res.json();
      return { error: error.message || "Failed to create word" };
    }

  revalidatePath('/ui/words');
  // Redirect back to the book's word list if bookId was provided
  redirect(`/ui/words?bookId=${data.bookId}`);
}

export async function saveWord(prevState: any, formData: FormData) {
  const id = formData.get('id'); // ID from hidden input
  
  const payload = {
    bookId: formData.get('bookId'),
    pageNum: formData.get('pageNum') ? Number(formData.get('pageNum')) : null,
    lineNum: formData.get('lineNum') ? Number(formData.get('lineNum')) : null,
    wordNum: formData.get('wordNum') ? Number(formData.get('wordNum')) : null,
    txtContent: formData.get('txtContent'),
    status: formData.get('status'),
  };

  const url = id 
    ? `${process.env.BACKEND_URL}/v1/word/${id}` 
    : `${process.env.BACKEND_URL}/v1/word`;
    
  const method = id ? 'PUT' : 'POST';

  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    return { error: "Could not save the word. Please verify your data." };
  }

  revalidatePath('/ui/words');
  // Navigate back to the word list (optionally filtered by the book)
  redirect(`/ui/words?bookId=${payload.bookId}`);
}

export async function deleteWord(id: string) {
  await fetch(`${BACKEND_URL}/v1/word/${id}`, { method: 'DELETE' });
  revalidatePath('/ui/words');
}

export async function importPageText(bookId: string, formData: FormData) {
  const pageNum = Number(formData.get('pageNum'));
  const rawText = formData.get('rawText') as string;

  if (!rawText || !pageNum) return { error: "Page number and text are required." };

  const lines = rawText.split('\n');
  const wordsToCreate: any[] = [];

  lines.forEach((line, lineIdx) => {
    // Split by whitespace and filter out empty strings
    const words = line.trim().split(/\s+/).filter(w => w.length > 0);
    
    words.forEach((wordText, wordIdx) => {
      wordsToCreate.push({
        bookId: bookId,
        pageNum: pageNum,
        lineNum: lineIdx + 1,   // 1-based indexing
        wordNum: wordIdx + 1,   // 1-based indexing
        txtContent: wordText,
        status: 'NEW'           // Default status for imports
      });
    });
  });

  const res = await fetch(`${process.env.BACKEND_URL}/v1/word/bulk`, {
    method: 'POST', // Use POST for creating new records
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(wordsToCreate),
  });

  if (!res.ok) return { error: "Failed to import words. Check backend logs." };

  revalidatePath(`/ui/books/${bookId}/reader/${pageNum}`);
  redirect(`/ui/books/${bookId}/reader/${pageNum}`);
}