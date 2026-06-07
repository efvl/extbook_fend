'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { WordResponse, WordStatus } from '@/types/word';
import { serverFetch } from '@/lib/serverFetch';

const BACKEND_URL = process.env.BACKEND_URL;

export async function savePageWords(bookId: string, pageNum: number, formData: FormData) {
  const wordIds = formData.getAll('wordId') as string[];
  const contents = formData.getAll('txtContent') as string[];
  const lineNums = formData.getAll('lineNum') as string[];
  const wordNums = formData.getAll('wordNum') as string[];
  const statuses = formData.getAll('status') as string[];

  const updates = wordIds.map((id, index) => ({
    id: id,
    bookId: bookId,
    pageNum: pageNum,
    lineNum: lineNums[index] ? Number(lineNums[index]) : null,
    wordNum: wordNums[index] ? Number(wordNums[index]) : null,
    txtContent: contents[index],
    status: statuses[index]
  }));

  const res = await serverFetch(`${BACKEND_URL}/v1/word/bulk`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });

  if (!res.ok) {
    const errorMsg = await res.text();
    console.error("Bulk Update Failed:", errorMsg);
    return { error: "Failed to save page changes." };
  }

  revalidatePath(`/books/${bookId}/reader/${pageNum}`);
  redirect(`/books/${bookId}/reader/${pageNum}`);
}

export async function getWordById(id: string): Promise<WordResponse | null> {
  try {
    const res = await serverFetch(`${BACKEND_URL}/v1/word/${id}`, {
      cache: 'no-store'
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch word details:", error);
    return null;
  }
}

export async function toggleWordStatus(id: string, currentStatus: WordStatus) {
  const statusMap: Record<WordStatus, WordStatus> = {
    'NEW': 'LEARNING',
    'LEARNING': 'KNOWN',
    'KNOWN': 'NEW'
  };

  const newStatus = statusMap[currentStatus];

  const res = await serverFetch(`${BACKEND_URL}/v1/word/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newStatus),
  });

  if (!res.ok) {
    const error = await res.json();
    return { error: error.message || "Failed to update word status" };
  }

  revalidatePath('/books/[id]/reader/[pageNum]', 'page');
}

export async function createWord(prevState: any, formData: FormData) {
  const data = {
    bookId: formData.get('bookId'),
    pageNum: formData.get('pageNum') ? Number(formData.get('pageNum')) : null,
    lineNum: formData.get('lineNum') ? Number(formData.get('lineNum')) : null,
    wordNum: formData.get('wordNum') ? Number(formData.get('wordNum')) : null,
    txtContent: formData.get('txtContent'),
    status: formData.get('status'),
  };

  const res = await serverFetch(`${BACKEND_URL}/v1/word`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    return { error: error.message || "Failed to create word" };
  }

  revalidatePath('/words');
  redirect(`/words?bookId=${data.bookId}`);
}

export async function saveWord(prevState: any, formData: FormData) {
  const id = formData.get('id');
  const rawTxt = formData.get('txtContent');
  const bookId = formData.get('bookId');

  const cardDataTxt = rawTxt
    ? String(rawTxt)
        .toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "")
        .replace(/\s+/g, " ")
        .trim()
    : '';

  const payload = {
    bookId: bookId,
    pageNum: formData.get('pageNum') ? Number(formData.get('pageNum')) : null,
    lineNum: formData.get('lineNum') ? Number(formData.get('lineNum')) : null,
    wordNum: formData.get('wordNum') ? Number(formData.get('wordNum')) : null,
    txtContent: rawTxt,
    status: formData.get('status'),
    cardText: cardDataTxt,
  };

  const baseUrl = process.env.BACKEND_URL;
  if (!baseUrl) {
    return { error: "Server configuration error: Missing BACKEND_URL." };
  }

  const url = id ? `${baseUrl}/v1/word/${id}` : `${baseUrl}/v1/word`;
  const method = id ? 'PUT' : 'POST';

  try {
    const res = await serverFetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      return { error: "Could not save the word. Please verify your data." };
    }
  } catch (err) {
    return { error: "Network error. Failed to connect to the backend server." };
  }

  revalidatePath('/words');
  redirect(`/words?bookId=${bookId || ''}`);
}

export async function deleteWord(id: string) {
  await serverFetch(`${BACKEND_URL}/v1/word/${id}`, { method: 'DELETE' });
  revalidatePath('/words');
}

export async function importPageText(bookId: string, formData: FormData) {
  const rawPageNum = formData.get('pageNum');
  const rawText = formData.get('rawText') as string;

  if (!rawText || rawPageNum === null || rawPageNum === '') {
    return { error: "Page number and text are required." };
  }

  const pageNum = Number(rawPageNum);
  if (isNaN(pageNum)) {
    return { error: "Invalid page number." };
  }

  const lines = rawText.split('\n');
  const wordsToCreate: any[] = [];

  lines.forEach((line, lineIdx) => {
    const words = line.trim().split(/\s+/).filter(w => w.length > 0);

    words.forEach((wordText, wordIdx) => {
      const cardDataTxt = wordText
        ? String(wordText)
            .toLowerCase()
            .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "")
            .trim()
        : '';

      if (!cardDataTxt) return;

      wordsToCreate.push({
        bookId: bookId,
        pageNum: pageNum,
        lineNum: lineIdx + 1,
        wordNum: wordIdx + 1,
        txtContent: wordText,
        status: 'NEW',
        cardText: cardDataTxt,
      });
    });
  });

  if (wordsToCreate.length === 0) {
    return { error: "No valid words found to import." };
  }

  const baseUrl = process.env.BACKEND_URL;
  if (!baseUrl) return { error: "Internal server configuration error." };

  try {
    const res = await serverFetch(`${baseUrl}/v1/word/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(wordsToCreate),
    });

    if (!res.ok) {
      return { error: "Failed to import words. Check backend logs." };
    }
  } catch (error) {
    return { error: "Network error: Failed to reach backend." };
  }

  redirect(`/books/${bookId}/reader/${pageNum}`);
}

export async function incrementLineProgress(cardIds: string[]) {
  try {
    const uniqueCardIds = Array.from(new Set(cardIds)).filter(Boolean);

    if (uniqueCardIds.length === 0) {
      return { success: true, updatedCount: 0 };
    }

    const response = await serverFetch(`${BACKEND_URL}/v1/card/actual-count`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(uniqueCardIds),
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const updatedCount = await response.json();

    revalidatePath('/books/[id]/reader/[pageNum]', 'page');

    return { success: true, updatedCount };
  } catch (error) {
    console.error("Failed to bulk update line progress:", error);
    return { error: "Failed to update progress for this line." };
  }
}