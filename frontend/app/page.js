import Link from "next/link";
import AdSlot from "../components/AdSlot";
import { api } from "../lib/api";

export default async function HomePage() {
  let categories = [];
  try {
    categories = await api.getCategories();
  } catch {
    categories = [];
  }

  return (
    <div className="space-y-12">
      <section className="rounded-2xl bg-gradient-to-br from-primary/20 to-slate-900 p-10 text-center">
        <h1 className="text-4xl font-extrabold sm:text-5xl">
          12th se <span className="text-secondary">Masters Degree</span> tak — Sab Kuch Yahi
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-slate-300">
          Class 12th ho, BCA/MCA ho, ya UPSC ki taiyari — video lectures, notes aur quiz
          sab ek hi jagah, 100% free.
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Choose Your Path</h2>
        {categories.length === 0 ? (
          <p className="text-sm text-slate-400">
            No categories yet — run <code>npm run seed</code> in <code>/backend</code> first.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/learn/${c.slug}`}
                className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-center transition hover:border-primary"
              >
                <div className="text-3xl">{c.icon}</div>
                <h3 className="mt-2 font-semibold">{c.name}</h3>
                <p className="mt-1 text-xs text-slate-400">{c.description}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <AdSlot label="Homepage ad slot" className="h-24" />
    </div>
  );
}
