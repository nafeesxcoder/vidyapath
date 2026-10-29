const express = require("express");
const pool = require("../lib/db");

const router = express.Router();

// GET /api/lessons/:id -> full lesson content (YouTube video id + notes)
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT l.*, c.title AS chapter_title, s.name AS subject_name,
              co.name AS course_name, co.slug AS course_slug
       FROM lessons l
       JOIN chapters c ON l.chapter_id = c.id
       JOIN subjects s ON c.subject_id = s.id
       JOIN courses co ON s.course_id = co.id
       WHERE l.id = :id`,
      { id: req.params.id }
    );
    const lesson = rows[0];
    if (!lesson) return res.status(404).json({ error: "Lesson not found" });
    res.json(lesson);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch lesson" });
  }
});

// GET /api/lessons/:id/quiz -> questions (answers stripped)
router.get("/:id/quiz", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, question, options FROM quiz_questions WHERE lesson_id = :id",
      { id: req.params.id }
    );
    // MySQL JSON column already comes back parsed as an array via mysql2.
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch quiz" });
  }
});

// POST /api/lessons/:id/quiz/submit  { answers: { [questionId]: choice } }
router.post("/:id/quiz/submit", async (req, res) => {
  try {
    const { answers = {} } = req.body;
    const [questions] = await pool.query(
      "SELECT id, correct_answer FROM quiz_questions WHERE lesson_id = :id",
      { id: req.params.id }
    );

    let score = 0;
    const results = questions.map((q) => {
      const correct = answers[q.id] === q.correct_answer;
      if (correct) score += 1;
      return { questionId: q.id, correct, correctAnswer: q.correct_answer };
    });

    res.json({ score, total: questions.length, results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit quiz" });
  }
});

module.exports = router;
