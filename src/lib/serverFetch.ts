import { cookies } from 'next/headers';
import { AUTH_COOKIES } from './authConstants';

export async function serverFetch(url: string, options?: RequestInit): Promise<Response> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIES.access)?.value;

  return fetch(url, {
    ...options,
    headers: {
      ...options?.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}
