import { updateLanguage } from "./actions";

export default function EditLanguageForm({
  id,
  shortName,
  fullName,
}: {
  id: string;
  shortName: string;
  fullName: string;
}) {
  return (
    <form action={updateLanguage.bind(null, id)} className="flex gap-2">
      <input name="shortName" defaultValue={shortName} />
      <input name="fullName" defaultValue={fullName} />
      <button className="text-blue-600">Save</button>
    </form>
  );
}