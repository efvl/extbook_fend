import BookForm from "../bookForm";

export default async function ManageBookPage({ params }: { params: { id?: string } }) {
  // Fetch languages using your internal logic or external API
  const langRes = await fetch(`${process.env.BACKEND_URL}/v1/lang/all?size=100`);
  const langData = await langRes.json();
  
  let initialData = null;
  if (params?.id) {
    const bookRes = await fetch(`${process.env.BACKEND_URL}/v1/book/${params.id}`);
    initialData = await bookRes.json();
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Edit Book</h1>
      <BookForm initialData={initialData} languages={langData.content} />
    </div>
  );
}