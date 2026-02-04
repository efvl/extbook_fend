import { createLanguage } from "./actions";

export default function CreateLanguageForm() {
  return (
    <form action={createLanguage} className="flex gap-2 mb-4">
      <input
        name="shortName"
        placeholder="Short name"
        required
        className="border px-2 py-1"
      />
      <input
        name="fullName"
        placeholder="Full name"
        required
        className="border px-2 py-1"
      />
      <button className="bg-blue-600 text-white px-3 py-1 rounded">
        Add
      </button>
    </form>
  );
}