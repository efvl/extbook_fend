import { Page } from "@/types/page";
import Pagination from "../components/pagination";
import CreateLanguageForm from "./languages/CreateLanguageForm";
import LanguageRow from "./languages/LanguageRow";

type Language = {
  id: string;
  shortName: string;
  fullName: string;
};

async function getLanguages(page = 0, size = 10): Promise<Page<Language>> {
  const res = await fetch(
    `http://localhost:3000/api/languages?page=${page}&size=${size}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to load languages");
  }

  return res.json();
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? 0);
  const data = await getLanguages(page);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Languages</h1>
      <CreateLanguageForm />
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
          <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left font-semibold text-gray-900">Short Name</th>
            <th className="px-6 py-3 text-left font-semibold text-gray-900">Full Name</th>
            <th className="px-6 py-3 text-right font-semibold text-gray-900">Actions</th>
          </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.content.map((lang) => (
              <LanguageRow key={lang.id} lang={lang} />
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={data.number} totalPages={data.totalPages} />
    </div>
  );
}
