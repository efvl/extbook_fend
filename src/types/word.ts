export type WordStatus = 'DRAFT' | 'NEW' | 'LEARNING' | 'IN_PROCESS' | 'READY' | 'KNOWN';

export interface WordResponse {
  id: string;
  pageNum: number | null;
  lineNum: number | null;
  wordNum: number | null;
  txtContent: string;
  status: WordStatus;
  bookId: string;
  bookTitle: string | null;
  cardId: string;
  languageId: string | null;
  languageShortName: string | null;
}