type RefreshRecord = { username: string; expiresAt: number };

const store = new Map<string, RefreshRecord>();

export function saveRefreshToken(token: string, username: string, ttlSeconds: number) {
  store.set(token, { username, expiresAt: Date.now() + ttlSeconds * 1000 });
}

export function verifyRefreshToken(token: string) {
  const record = store.get(token);
  if (!record) return null;
  if (Date.now() > record.expiresAt) {
    store.delete(token);
    return null;
  }
  return record.username;
}

export function revokeRefreshToken(token: string) {
  store.delete(token);
}