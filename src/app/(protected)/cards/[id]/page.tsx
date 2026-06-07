import CardForm from "../cardForm";
import { serverFetch } from "@/lib/serverFetch";

export default async function ManageCardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const cardRes = await serverFetch(`${process.env.BACKEND_URL}/v1/card/${id}`);
  const initialData = await cardRes.json();

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Edit Card</h1>
      <CardForm initialData={initialData} />
    </div>
  );
}