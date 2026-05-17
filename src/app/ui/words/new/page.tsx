import WordForm from "../wordForm";

async function getBooks() {
  const res = await fetch(`${process.env.BACKEND_URL}/v1/book?size=100`, { cache: 'no-store' });
  const data = await res.json();
  return data.content || [];
}

export default async function NewWordPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ bookId?: string }> 
}) {
  // 1. Await the searchParams (Required in Next.js 15)
  const params = await searchParams;

  // 2. Extract the bookId from the URL if it exists
  // If it doesn't exist, it will be undefined, and the dropdown will show "Select a book..."
  const selectedBookId = params.bookId || "";

  // 3. Fetch your books list
  const books = await getBooks();

  return (
    <div className="max-w-3xl mx-auto p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Add Word to Vocabulary</h1>
        <p className="text-sm text-gray-500">Log a specific word location and its content.</p>
      </div>
      
      <WordForm books={books} defaultBookId={selectedBookId} />
    </div>
  );
}