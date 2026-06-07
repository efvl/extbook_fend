import { importPageText } from "../../../words/actions";
import ImportForm from "./importForm";

export default async function ImportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
// Define the client-side action handler
  async function handleFormAction(formData: FormData) {
    "use server";
    await importPageText(id, formData);
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Bulk Import Page</h1>
        <p className="text-gray-500">Paste a full page of text below. It will be parsed into individual words.</p>
      </div>

      <form action={handleFormAction} className="space-y-6">
        <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Page Number</label>
            <input 
              name="pageNum" 
              type="number" 
              required 
              className="w-32 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="e.g. 42"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Page Content</label>
            <textarea 
              name="rawText"
              required
              rows={20}
              className="w-full px-4 py-3 border rounded-lg font-serif text-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Paste the text from the book page here..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button 
            type="submit"
            className="px-8 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 shadow-lg transition-transform active:scale-95"
          >
            Parse & Create Words
          </button>
        </div>
      </form>
    </div>
  );
}