"use client";

import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function adminPost(path, body, token) {
  const res = await fetch(`${API_BASE}/admin${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [message, setMessage] = useState(null);

  const [categoryForm, setCategoryForm] = useState({ name: "", slug: "", description: "", icon: "📘" });
  const [courseForm, setCourseForm] = useState({ categoryId: "", name: "", slug: "", description: "", durationLabel: "" });
  const [subjectForm, setSubjectForm] = useState({ courseId: "", name: "" });
  const [chapterForm, setChapterForm] = useState({ subjectId: "", title: "" });
  const [lessonForm, setLessonForm] = useState({ chapterId: "", title: "", youtubeVideoId: "", notes: "", durationMinutes: "" });

  useEffect(() => {
    const storedToken = localStorage.getItem("vidyapath_token");
    const storedUser = localStorage.getItem("vidyapath_user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  function handleResult(promise) {
    promise.then(() => setMessage("Saved.")).catch((e) => setMessage(e.message));
  }

  if (!user) {
    return (
      <p className="text-slate-400">
        You must be logged in as an ADMIN. Seed data creates <code>admin@vidyapath.dev</code> /{" "}
        <code>Admin@123</code> — log in with that account.
      </p>
    );
  }

  if (user.role !== "ADMIN") {
    return <p className="text-red-400">Forbidden — your account is not an admin.</p>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Admin Panel</h1>
      {message && <p className="rounded-md bg-slate-900 px-3 py-2 text-sm text-slate-300">{message}</p>}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleResult(adminPost("/categories", categoryForm, token));
        }}
        className="grid max-w-lg gap-2 rounded-lg border border-slate-800 bg-slate-900 p-4"
      >
        <h2 className="font-semibold text-primary">Add Category (e.g. 12th, BCA, MCA, UPSC)</h2>
        <input placeholder="Name" required className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
          value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} />
        <input placeholder="Slug" required className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
          value={categoryForm.slug} onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })} />
        <input placeholder="Description" className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
          value={categoryForm.description} onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })} />
        <input placeholder="Icon (emoji)" className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
          value={categoryForm.icon} onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })} />
        <button className="rounded-md bg-primary py-2 font-medium text-white hover:opacity-90">Add Category</button>
      </form>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleResult(adminPost("/courses", courseForm, token));
        }}
        className="grid max-w-lg gap-2 rounded-lg border border-slate-800 bg-slate-900 p-4"
      >
        <h2 className="font-semibold text-primary">Add Course (e.g. BCA Sem 1)</h2>
        <input placeholder="Category ID" required type="number" className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
          value={courseForm.categoryId} onChange={(e) => setCourseForm({ ...courseForm, categoryId: e.target.value })} />
        <input placeholder="Name" required className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
          value={courseForm.name} onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })} />
        <input placeholder="Slug" required className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
          value={courseForm.slug} onChange={(e) => setCourseForm({ ...courseForm, slug: e.target.value })} />
        <input placeholder="Description" className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
          value={courseForm.description} onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })} />
        <input placeholder="Duration label (e.g. 3 Years)" className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
          value={courseForm.durationLabel} onChange={(e) => setCourseForm({ ...courseForm, durationLabel: e.target.value })} />
        <button className="rounded-md bg-primary py-2 font-medium text-white hover:opacity-90">Add Course</button>
      </form>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleResult(adminPost("/subjects", subjectForm, token));
        }}
        className="grid max-w-lg gap-2 rounded-lg border border-slate-800 bg-slate-900 p-4"
      >
        <h2 className="font-semibold text-primary">Add Subject</h2>
        <input placeholder="Course ID" required type="number" className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
          value={subjectForm.courseId} onChange={(e) => setSubjectForm({ ...subjectForm, courseId: e.target.value })} />
        <input placeholder="Subject name" required className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
          value={subjectForm.name} onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })} />
        <button className="rounded-md bg-primary py-2 font-medium text-white hover:opacity-90">Add Subject</button>
      </form>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleResult(adminPost("/chapters", chapterForm, token));
        }}
        className="grid max-w-lg gap-2 rounded-lg border border-slate-800 bg-slate-900 p-4"
      >
        <h2 className="font-semibold text-primary">Add Chapter</h2>
        <input placeholder="Subject ID" required type="number" className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
          value={chapterForm.subjectId} onChange={(e) => setChapterForm({ ...chapterForm, subjectId: e.target.value })} />
        <input placeholder="Chapter title" required className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
          value={chapterForm.title} onChange={(e) => setChapterForm({ ...chapterForm, title: e.target.value })} />
        <button className="rounded-md bg-primary py-2 font-medium text-white hover:opacity-90">Add Chapter</button>
      </form>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleResult(adminPost("/lessons", lessonForm, token));
        }}
        className="grid max-w-lg gap-2 rounded-lg border border-slate-800 bg-slate-900 p-4"
      >
        <h2 className="font-semibold text-primary">Add Lesson (video + notes)</h2>
        <input placeholder="Chapter ID" required type="number" className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
          value={lessonForm.chapterId} onChange={(e) => setLessonForm({ ...lessonForm, chapterId: e.target.value })} />
        <input placeholder="Lesson title" required className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
          value={lessonForm.title} onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })} />
        <input placeholder="YouTube video ID (e.g. dQw4w9WgXcQ)" className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
          value={lessonForm.youtubeVideoId} onChange={(e) => setLessonForm({ ...lessonForm, youtubeVideoId: e.target.value })} />
        <textarea placeholder="Notes" className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
          value={lessonForm.notes} onChange={(e) => setLessonForm({ ...lessonForm, notes: e.target.value })} />
        <input placeholder="Duration (minutes)" type="number" className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
          value={lessonForm.durationMinutes} onChange={(e) => setLessonForm({ ...lessonForm, durationMinutes: e.target.value })} />
        <button className="rounded-md bg-primary py-2 font-medium text-white hover:opacity-90">Add Lesson</button>
      </form>
    </div>
  );
}
