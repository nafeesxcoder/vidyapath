import Link from "next/link";
import { notFound } from "next/navigation";
import { api } from "../../../../lib/api";
import AdSlot from "../../../../components/AdSlot";

export default async function CoursePage({ params }) {
  let course;
  try {
    course = await api.getCourse(params.courseSlug);
  } catch {
    return notFound();
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_260px]">
      <div>
        <h1 className="mb-1 text-2xl font-bold">{course.name}</h1>
        <p className="mb-6 text-slate-400">{course.description}</p>

        <div className="space-y-6">
          {course.subjects.map((subject) => (
            <div key={subject.id} className="rounded-lg border border-slate-800">
              <h2 className="border-b border-slate-800 bg-slate-900 px-4 py-2 font-semibold text-primary">
                {subject.name}
              </h2>
              <div className="divide-y divide-slate-800">
                {subject.chapters.map((chapter) => (
                  <div key={chapter.id} className="px-4 py-3">
                    <h3 className="mb-2 text-sm font-medium text-slate-300">{chapter.title}</h3>
                    <ul className="space-y-1">
                      {chapter.lessons.map((lesson) => (
                        <li key={lesson.id}>
                          <Link
                            href={`/lesson/${lesson.id}`}
                            className="flex items-center justify-between rounded px-2 py-1.5 text-sm hover:bg-slate-900 hover:text-primary"
                          >
                            <span>▶ {lesson.title}</span>
                            {lesson.duration_minutes && (
                              <span className="text-xs text-slate-500">{lesson.duration_minutes} min</span>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <aside className="hidden lg:block">
        <AdSlot label="Sidebar ad" className="sticky top-20 h-64" />
      </aside>
    </div>
  );
}
