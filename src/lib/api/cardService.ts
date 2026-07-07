import { CardResponse, CreateCardRequest } from '@/types/card';
import { Page } from '@/types/api';
import { serverFetch } from '@/lib/serverFetch';

const BACKEND_URL = process.env.BACKEND_URL;

export async function getCards(
  page = 0,
  status?: string,
  content?: string,
  languageId?: string,
): Promise<Page<CardResponse>> {
  const params = new URLSearchParams({ page: String(page), size: '10' });
  if (status) params.set('status', status);
  if (content) params.set('content', content);
  if (languageId) params.set('languageId', languageId);

  const res = await serverFetch(`${BACKEND_URL}/v1/card?${params}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch cards');
  }

  return res.json();
}

export async function updateCard(id: string, data: Partial<CreateCardRequest>): Promise<CardResponse> {
  const res = await serverFetch(`${BACKEND_URL}/v1/card/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Failed to update card');
  }

  return res.json();
}

export async function createCard(data: CreateCardRequest): Promise<CardResponse> {
  const res = await serverFetch(`${BACKEND_URL}/v1/card`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Failed to create card');
  }

  return res.json();
}

export async function deleteCardById(id: string) {
  const res = await serverFetch(`${BACKEND_URL}/v1/card/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error('Failed to delete card from backend');
  }

  return res;
}

export async function getCardById(id: string): Promise<CardResponse> {
  const res = await serverFetch(`${BACKEND_URL}/v1/card/${id}`, {
    next: { tags: [`card-${id}`] },
  } as RequestInit);

  if (!res.ok) {
    throw new Error(`Failed to fetch card with id: ${id}`);
  }

  return res.json();
}
