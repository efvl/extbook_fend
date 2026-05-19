import CardForm from "../cardForm";

export default async function NewCardPage() {
  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">New Card</h1>
      <CardForm initialData={null} />
    </div>
  );
}
