'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { WordResponse, WordStatus } from '@/types/word';
import { getCardById, updateCard } from '@/lib/api/cardService';

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

export async function getWordById(id: string): Promise<WordResponse | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/v1/word/${id}`, {
      cache: 'no-store' // Fetch fresh data dynamically
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch word details:", error);
    return null;
  }
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
  const id = formData.get('id'); 
  const rawTxt = formData.get('txtContent');
  const bookId = formData.get('bookId');
  console.log(rawTxt);

  // 1. Clean and normalize text
  const cardDataTxt = rawTxt
    ? String(rawTxt)
        .toLowerCase()
        // Updated regex: Handles common punctuation safely
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "") 
        .replace(/\s+/g, " ")                           
        .trim()                                         
    : '';
  
  // 2. Build Payload
  const payload = {
    bookId: bookId,
    pageNum: formData.get('pageNum') ? Number(formData.get('pageNum')) : null,
    lineNum: formData.get('lineNum') ? Number(formData.get('lineNum')) : null,
    wordNum: formData.get('wordNum') ? Number(formData.get('wordNum')) : null,
    txtContent: rawTxt, // You can reuse rawTxt variable here
    status: formData.get('status'),
    cardText: cardDataTxt,
  };

  const baseUrl = process.env.BACKEND_URL;
  if (!baseUrl) {
    return { error: "Server configuration error: Missing BACKEND_URL." };
  }

  const url = id ? `${baseUrl}/v1/word/${id}` : `${baseUrl}/v1/word`;
  const method = id ? 'PUT' : 'POST';

  // 3. Network Request Block
  try {
    const res = await fetch(url, {
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

  // 4. Cache Revalidation & Redirect (Keep outside the try/catch block)
  revalidatePath('/ui/words');
  redirect(`/ui/words?bookId=${bookId || ''}`);
}

export async function deleteWord(id: string) {
  await fetch(`${BACKEND_URL}/v1/word/${id}`, { method: 'DELETE' });
  revalidatePath('/ui/words');
}

export async function importPageText(bookId: string, formData: FormData) {
  const rawPageNum = formData.get('pageNum');
  const rawText = formData.get('rawText') as string;

  // Fix 1: Safe check for pageNum (allows page 0 if valid in your app)
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
    // Split by whitespace and filter out empty strings
    const words = line.trim().split(/\s+/).filter(w => w.length > 0);
    
    words.forEach((wordText, wordIdx) => {
      // Clear punctuation and lowercase
      const cardDataTxt = wordText
        ? String(wordText)
            .toLowerCase()
            .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "") 
            .trim()                                         
        : '';

      // Fix 2: Skip tokens that were strictly punctuation (e.g., "---" or "...")
      if (!cardDataTxt) return;

      wordsToCreate.push({
        bookId: bookId,
        pageNum: pageNum,
        lineNum: lineIdx + 1,   // 1-based indexing
        wordNum: wordIdx + 1,   // 1-based indexing
        txtContent: wordText,
        status: 'NEW',           // Default status for imports
        cardText: cardDataTxt,
      });
    });
  });

  // Guard against sending an empty payload to the backend
  if (wordsToCreate.length === 0) {
    return { error: "No valid words found to import." };
  }

  const baseUrl = process.env.BACKEND_URL;
  if (!baseUrl) return { error: "Internal server configuration error." };

  try {
    const res = await fetch(`${baseUrl}/v1/word/bulk`, {
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

  // Fix 3: Let redirect handle moving the user and refreshing the view target
  redirect(`/ui/books/${bookId}/reader/${pageNum}`);
}

export async function incrementLineProgress(cardIds: string[]) {
  try {
    // Filter out unique, valid card IDs to minimize unnecessary network calls
    const uniqueCardIds = Array.from(new Set(cardIds)).filter(Boolean);

    // Run parallel PATCH/PUT updates to your Java Backend
    await Promise.all(
      uniqueCardIds.map(async (id) => {
        const currentCard = await getCardById(id);
        if (currentCard) {
          const nextCount = (currentCard.actualCount || 0) + 1;
          return updateCard(id, { actualCount: nextCount });
        }
      })
    );

    // Refresh the layout cache so both the reader page and the sidebar sync instantly
    revalidatePath('/ui/books/[id]/reader/[pageNum]', 'page');
    return { success: true };
  } catch (error) {
    console.error("Failed to batch update line progress:", error);
    return { error: "Failed to update progress for this line." };
  }
}