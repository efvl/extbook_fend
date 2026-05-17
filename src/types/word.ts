export type WordStatus = 'NEW' | 'LEARNING' | 'KNOWN';

export interface WordResponse {
  id: string;        // UUIDs are handled as strings in TypeScript
  pageNum: number | null;
  lineNum: number | null;
  wordNum: number | null;
  txtContent: string;
  status: WordStatus;
  bookId: string;    // UUID
}