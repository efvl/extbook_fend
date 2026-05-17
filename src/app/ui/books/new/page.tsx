import BookForm from "../bookForm";

export default async function ManageBookPage() {
  // Fetch languages using your internal logic or external API
  const langRes = await fetch(`${process.env.BACKEND_URL}/v1/lang/all?size=100`);
  const langData = await langRes.json();
  
  let initialData = null;

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">New Book</h1>
      <BookForm initialData={initialData} languages={langData.content} />
    </div>
  );
}