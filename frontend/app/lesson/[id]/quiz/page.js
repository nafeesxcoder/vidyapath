"use client";

import { useEffect, useState } from "react";
import { api } from "../../../../lib/api";

export default function QuizPage({ params }) {
  const { id } = params;
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .getQuiz(id)
      .then(setQuestions)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit() {
    try {
      const res = await api.submitQuiz(id, answers);
      setResult(res);
    } catch (e) {
      setError(e.message);
    }
  }

  if (loading) return <p className="text-slate-400">Loading quiz...</p>;
  if (error) return <p className="text-red-400">{error}</p>;
  if (questions.length === 0) return <p className="text-slate-400">No quiz questions yet for this lesson.</p>;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">Lesson Quiz</h1>

      {result ? (
        <div className="rounded-lg border border-primary/50 bg-primary/10 p-6 text-center">
          <p className="text-3xl font-bold text-secondary">
            {result.score} / {result.total}
          </p>
          <p className="mt-2 text-slate-300">Great effort! Review the notes and try again anytime.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {questions.map((q, i) => (
            <div key={q.id} className="rounded-lg border border-slate-800 bg-slate-900 p-4">
              <p className="mb-3 font-medium">
                {i + 1}. {q.question}
              </p>
              <div className="space-y-2">
                {q.options.map((opt) => (
                  <label
                    key={opt}
                    className="flex cursor-pointer items-center gap-2 rounded-md border border-slate-800 px-3 py-2 hover:border-primary"
                  >
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      value={opt}
                      checked={answers[q.id] === opt}
                      onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={handleSubmit}
            className="w-full rounded-md bg-primary py-3 font-medium text-white hover:opacity-90"
          >
            Submit Quiz
          </button>
        </div>
      )}
    </div>
  );
}
