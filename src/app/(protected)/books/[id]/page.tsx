import BookForm from "../bookForm";
import { serverFetch } from "@/lib/serverFetch";

export default async function ManageBookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [langRes, bookRes] = await Promise.all([
    serverFetch(`${process.env.BACKEND_URL}/v1/lang/all?size=100`),
    serverFetch(`${process.env.BACKEND_URL}/v1/book/${id}`),
  ]);

  const langData = await langRes.json();
  const initialData = await bookRes.json();

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Edit Book</h1>
      <BookForm initialData={initialData} languages={langData.content} />
    </div>
  );
}