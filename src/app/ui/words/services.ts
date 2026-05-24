import { WordResponse } from "@/types/word";

export async function getWordsByBookAndPage(bookId: string, pageNum: number) {
  const res = await fetch(
    `${process.env.BACKEND_URL}/v1/word/by-book/${bookId}/page/${pageNum}?size=2000`,
    { cache: 'no-store' }
  );
  if (!res.ok) return null;
  const data = await res.json();
  
  // Group words by lineNum for the UI
  const lines: Record<number, WordResponse[]> = {};
  data.content.forEach((word: WordResponse) => {
    const line = word.lineNum || 0;
    if (!lines[line]) lines[line] = [];
    lines[line].push(word);
  });

  // Sort words within each line by wordNum
  Object.values(lines).forEach(lineWords => {
    lineWords.sort((a, b) => (a.wordNum || 0) - (b.wordNum || 0));
  });

  return { 
    lines, 
    totalPages: data.totalPages, 
    totalElements: data.totalElements 
  };
}

export async function getWordById(id: string): Promise<WordResponse | null> {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/v1/word/${id}`, {
      cache: 'no-store' // Fetch fresh data dynamically
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch word details:", error);
    return null;
  }
}