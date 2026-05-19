import CardForm from "../cardForm";

export default async function ManageCardPage({ params }: { params: { id?: string } }) {
  let initialData = null;
  if (params?.id) {
    const cardRes = await fetch(`${process.env.BACKEND_URL}/v1/card/${params.id}`);
    initialData = await cardRes.json();
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Edit Card</h1>
      <CardForm initialData={initialData} />
    </div>
  );
}