import Link from "next/link";
import { notFound } from "next/navigation";
import { api } from "../../../lib/api";
import VideoEmbed from "../../../components/VideoEmbed";
import AdSlot from "../../../components/AdSlot";

export default async function LessonPage({ params }) {
  let lesson;
  try {
    lesson = await api.getLesson(params.id);
  } catch {
    return notFound();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="text-xs text-slate-500">
        {lesson.course_name} → {lesson.subject_name} → {lesson.chapter_title}
      </div>

      <h1 className="text-2xl font-bold">{lesson.title}</h1>

      <VideoEmbed youtubeId={lesson.youtube_video_id} title={lesson.title} />

      <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
        <h2 className="mb-2 font-semibold text-primary">Notes</h2>
        <p className="whitespace-pre-line text-sm text-slate-300">
          {lesson.notes || "Notes not added yet for this lesson."}
        </p>
      </div>

      <Link
        href={`/lesson/${lesson.id}/quiz`}
        className="inline-block rounded-md bg-secondary px-4 py-2 font-medium text-slate-950 hover:opacity-90"
      >
        Take Quiz →
      </Link>

      <AdSlot label="Bottom of content ad" className="h-24" />
    </div>
  );
}
