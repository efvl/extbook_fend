import { Language } from "./language";


export interface BookResponse {
  id: string;        // UUID maps to string in TS
  title: string;
  authors: string;
  year: number | null; // Records often allow nulls for Integers
  info: string;
  isbn: string;
  language: Language;
}

export interface CreateBookRequest {
  title: string;
  authors: string;
  year: number | null;
  info: string;
  isbn: string;
  languageId: string; // Assuming your DTO maps language by ID on creation
}