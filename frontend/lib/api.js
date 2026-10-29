const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function request(path, { method = "GET", body, token } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed: ${res.status}`);
  return data;
}

export const api = {
  getCategories: () => request("/categories"),
  getCategory: (slug) => request(`/categories/${slug}`),
  getCourse: (slug) => request(`/courses/${slug}`),
  getLesson: (id) => request(`/lessons/${id}`),
  getQuiz: (lessonId) => request(`/lessons/${lessonId}/quiz`),
  submitQuiz: (lessonId, answers) => request(`/lessons/${lessonId}/quiz/submit`, { method: "POST", body: { answers } }),
  signup: (payload) => request("/auth/signup", { method: "POST", body: payload }),
  login: (payload) => request("/auth/login", { method: "POST", body: payload }),
};
