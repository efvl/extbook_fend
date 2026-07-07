
export type CardStatus = 'DRAFT' | 'NEW' | 'LEARNING' | 'IN_PROCESS' | 'READY' | 'KNOWN';

export interface CardResponse {
  id: string;
  txtContent: string;
  definition: string;
  targetCount: number;
  actualCount: number;
  status: CardStatus;
  languageId: string | null;
  languageShortName: string | null;
}

export interface CreateCardRequest {
  txtContent: string;
  definition: string;
  targetCount: number;
  actualCount: number;
  status: CardStatus;
}