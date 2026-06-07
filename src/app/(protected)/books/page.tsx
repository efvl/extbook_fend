import Link from 'next/link';
import {TableContainer, Td, Th } from '@/components/table'
import { getBooks } from '@/lib/api/bookService';
import { BookResponse } from '@/types/book';
import { DeleteBookButton } from './DeleteBookButton';

export default async function BooksPage({ searchParams }: { searchParams: any }) {
  const params = await searchParams;
  const data = await getBooks(params.page || 0);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Book Inventory</h1>
        <Link
          href="/books/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Add Book
        </Link>
      </div>

      <TableContainer>
          <thead className="bg-gray-50">
            <tr>
              <Th>Title</Th>
              <Th>Author</Th>
              <Th>Year</Th>
              <Th>Lang</Th>
              <Th align="right">Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {data.content.map((book: BookResponse) => (
              <tr key={book.id} className="hover:bg-gray-50 transition-colors">
                <Td className="font-medium text-gray-900">
                  <div className="max-w-xs truncate" title={book.title}>
                    {book.title}
                  </div>
                  <div className="text-xs text-gray-400 font-normal">{book.isbn}</div>
                </Td>
                <Td>{book.authors}</Td>
                <Td>{book.year}</Td>
                <Td>{book.language.shortName}</Td>
                <Td align="right">
                  <div className="flex justify-end items-center gap-3">
                    <Link
                      href={`/books/${book.id}/reader/1`}
                      className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-md border border-amber-200 hover:bg-amber-100 transition-colors text-xs font-bold uppercase"
                      title="Open book page-by-page view"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                      Read
                    </Link>
                    <span className="text-gray-200">|</span>
                    <Link href={`/words?bookId=${book.id}`}
                      className="text-amber-600 hover:text-amber-800 flex items-center gap-1 text-xs font-bold uppercase tracking-tight"
                      title="View vocabulary for this book"
                    >
                      Words
                    </Link>
                    <span className="text-gray-200">|</span>
                    <Link
                      href={`/books/${book.id}/import`}
                      className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 border border-green-200 rounded hover:bg-green-100 transition-colors text-xs font-bold"
                      title="Import full page text"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 5v14M5 12h14"/></svg>
                      IMPORT
                    </Link>
                    <span className="text-gray-200">|</span>
                    <Link href={`/books/${book.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                      Edit
                    </Link>
                    <span className="text-gray-200">|</span>
                    <DeleteBookButton id={book.id} />
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </TableContainer>
    </div>
  );
}