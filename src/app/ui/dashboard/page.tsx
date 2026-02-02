import { Page } from "@/types/page";
import Pagination from "../components/pagination";

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
    <div>
      <h1 className="text-2xl font-bold mb-4">Languages</h1>

      <table className="min-w-full border bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">Short</th>
            <th className="border px-4 py-2">Full name</th>
          </tr>
        </thead>
        <tbody>
          {data.content.map((lang) => (
            <tr key={lang.id}>
              <td className="border px-4 py-2">{lang.shortName}</td>
              <td className="border px-4 py-2">{lang.fullName}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination page={data.number} totalPages={data.totalPages} />
    </div>
  );
}
