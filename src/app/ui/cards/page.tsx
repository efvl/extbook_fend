import Link from 'next/link';
import {TableContainer, Td, Th } from './../components/table'
import { DeleteCardButton } from './DeleteCardButton';
import { CardResponse } from '@/types/card';
import { getCards } from '@/lib/api/cardService';

export default async function BooksPage({ searchParams }: { searchParams: any }) {
  const params = await searchParams;
  const data = await getCards(params.page || 0);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Cards Dictionary</h1>
        <Link 
          href="/ui/cards/new" 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Add Card
        </Link>
      </div>

      <TableContainer>
          <thead className="bg-gray-50">
            <tr>
              <Th>Content</Th>
              <Th>Definition</Th>
              <Th>Target</Th>
              <Th>Actual</Th>
              <Th>Status</Th>
              <Th align="right">Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {data.content.map((card: CardResponse) => (
              <tr key={card.id} className="hover:bg-gray-50 transition-colors">
                <Td className="font-medium text-gray-900">
                  <div className="max-w-xs truncate" title={card.txtContent}>
                    {card.txtContent}
                  </div>
                </Td>
                <Td>{card.definition}</Td>
                <Td>{card.targetCount}</Td>
                <Td>{card.actualCount}</Td>
                <Td>{card.status}</Td>
                <Td align="right">
                  <div className="flex justify-end items-center gap-3">
                    <Link href={`/ui/cards/${card.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                      Edit
                    </Link>
                    <span className="text-gray-200">|</span>
                    <DeleteCardButton id={card.id} />
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </TableContainer>
    </div>
  );
}