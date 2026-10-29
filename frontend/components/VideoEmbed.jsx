export default function VideoEmbed({ youtubeId, title }) {
  if (!youtubeId) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-lg border border-dashed border-slate-700 bg-slate-900 text-sm text-slate-500">
        Video not added yet for this lesson — add a YouTube video ID via the Admin panel.
      </div>
    );
  }

  return (
    <div className="aspect-video overflow-hidden rounded-lg border border-slate-800">
      <iframe
        className="h-full w-full"
        src={`https://www.youtube.com/embed/${youtubeId}`}
        title={title || "Lesson video"}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
