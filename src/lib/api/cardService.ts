import { CardResponse, CreateCardRequest } from '@/types/card';
import { Page } from '@/types/api';

const BACKEND_URL = process.env.BACKEND_URL;

export async function getCards(page = 0): Promise<Page<CardResponse>> {
  const res = await fetch(`${BACKEND_URL}/v1/card?page=${page}&size=10`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch cards');
  }

  return res.json();
}

export async function updateCard(id: string, data: Partial<CreateCardRequest>): Promise<CardResponse> {
  const res = await fetch(`${BACKEND_URL}/v1/card/${id}`, {
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
  const res = await fetch(`${BACKEND_URL}/v1/card`, {
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
  const res = await fetch(`${BACKEND_URL}/v1/card/${id}`, { 
    method: 'DELETE' 
  });
  
  if (!res.ok) {
    throw new Error('Failed to delete card from backend');
  }
  
  return res;
}

export async function getCardById(id: string): Promise<CardResponse> {
  const res = await fetch(`${BACKEND_URL}/v1/card/${id}`, {
    // Keeps Next.js 15 tag revalidation consistency for on-demand caching updates
    next: { tags: [`card-${id}`] } 
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch card with id: ${id}`);
  }

  return res.json();
}