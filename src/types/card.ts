
export type CardStatus = 'DRAFT' | 'NEW' | 'LEARNING' | 'IN_PROCESS' | 'READY' | 'KNOWN';

export interface CardResponse {
  id: string;
  txtContent: string;
  definition: string;
  targetCount: number;
  actualCount: number;
  status: CardStatus;
}

export interface CreateCardRequest {
  txtContent: string;
  definition: string;
  targetCount: number;
  actualCount: number;
  status: CardStatus;
}