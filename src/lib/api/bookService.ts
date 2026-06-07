import { BookResponse, CreateBookRequest } from '@/types/book';
import { Page } from '@/types/api';
import { serverFetch } from '@/lib/serverFetch';

const BACKEND_URL = process.env.BACKEND_URL;

export async function getBooks(page = 0): Promise<Page<BookResponse>> {
  const res = await serverFetch(`${BACKEND_URL}/v1/book?page=${page}&size=10`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch books');
  }

  return res.json();
}

export async function updateBook(id: string, data: Partial<CreateBookRequest>): Promise<BookResponse> {
  const res = await serverFetch(`${BACKEND_URL}/v1/book/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Failed to update book');
  }

  return res.json();
}

export async function createBook(data: CreateBookRequest): Promise<BookResponse> {
  const res = await serverFetch(`${BACKEND_URL}/v1/book`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Failed to create book');
  }

  return res.json();
}

export async function deleteBookById(id: string) {
  const res = await serverFetch(`${BACKEND_URL}/v1/book/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error('Failed to delete book from backend');
  }

  return res;
}

export async function getBookById(id: string): Promise<BookResponse> {
  const res = await serverFetch(`${BACKEND_URL}/v1/book/${id}`, {
    next: { tags: [`book-${id}`] },
  } as RequestInit);

  if (!res.ok) {
    throw new Error(`Failed to fetch book with id: ${id}`);
  }

  return res.json();
}

export async function deleteWordsByBookPage(bookId: string, pageNum: number) {
  const res = await serverFetch(`${BACKEND_URL}/v1/word/by-book/${bookId}/page/${pageNum}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error(`Failed to clear page ${pageNum}`);
  }

  return res;
}

export async function getBooksByLanguage(languageId: string, page = 0): Promise<Page<BookResponse>> {
  const res = await serverFetch(
    `${BACKEND_URL}/v1/book/by-language/${languageId}?page=${page}&size=10`,
  );

  if (!res.ok) {
    throw new Error('Failed to fetch books for this language');
  }

  return res.json();
}
