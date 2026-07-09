import BookForm from "../bookForm";
import { serverFetch } from "@/lib/serverFetch";

export default async function ManageBookPage() {
  const langRes = await serverFetch(`${process.env.BACKEND_URL}/v1/lang/enabled?size=100`);
  const langData = await langRes.json();

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">New Book</h1>
      <BookForm initialData={null} languages={langData.content} />
    </div>
  );
}