import Link from "next/link";
import { api } from "../../lib/api";

export default async function AllCategoriesPage() {
  let categories = [];
  try {
    categories = await api.getCategories();
  } catch {
    categories = [];
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">All Courses</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/learn/${c.slug}`}
            className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-center hover:border-primary"
          >
            <div className="text-3xl">{c.icon}</div>
            <h3 className="mt-2 font-semibold">{c.name}</h3>
            <p className="mt-1 text-xs text-slate-400">{c.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
