import WordForm from "../wordForm";
import { WordResponse } from '@/types/word';

// Fetch the specific word to edit
async function getWord(id: string): Promise<WordResponse> {
  const res = await fetch(`${process.env.BACKEND_URL}/v1/word/${id}`, { 
    cache: 'no-store' 
  });
  if (!res.ok) throw new Error("Word not found");
  return res.json();
}

// Fetch books for the dropdown
async function getBooks() {
  const res = await fetch(`${process.env.BACKEND_URL}/v1/book?size=100`, { 
    cache: 'no-store' 
  });
  const data = await res.json();
  return data.content || [];
}

export default async function EditWordPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Parallel fetching improves performance
  const [word, books] = await Promise.all([
    getWord(id),
    getBooks()
  ]);

  return (
    <div className="max-w-3xl mx-auto p-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Edit Vocabulary Entry</h1>
        <p className="text-sm text-gray-500">Modify the content, location, or status for this word.</p>
      </header>
      
      <WordForm 
        books={books} 
        initialData={word} 
      />
    </div>
  );
}