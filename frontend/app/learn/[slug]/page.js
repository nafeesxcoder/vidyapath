import Link from "next/link";
import { notFound } from "next/navigation";
import { api } from "../../../lib/api";

export default async function CategoryPage({ params }) {
  let category;
  try {
    category = await api.getCategory(params.slug);
  } catch {
    return notFound();
  }

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">
        {category.icon} {category.name}
      </h1>
      <p className="mb-6 text-slate-400">{category.description}</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {category.courses.map((course) => (
          <Link
            key={course.id}
            href={`/learn/${category.slug}/${course.slug}`}
            className="rounded-xl border border-slate-800 bg-slate-900 p-5 hover:border-primary"
          >
            <h3 className="font-semibold">{course.name}</h3>
            <p className="mt-1 text-sm text-slate-400">{course.description}</p>
            {course.duration_label && (
              <span className="mt-3 inline-block rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary">
                {course.duration_label}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
