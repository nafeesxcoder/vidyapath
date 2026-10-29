const express = require("express");
const pool = require("../lib/db");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

router.use(requireAuth, requireRole("ADMIN"));

// --- Categories ---
router.post("/categories", async (req, res) => {
  try {
    const { name, slug, description, icon } = req.body;
    const [result] = await pool.query(
      "INSERT INTO categories (name, slug, description, icon) VALUES (:name, :slug, :description, :icon)",
      { name, slug, description: description || null, icon: icon || "📘" }
    );
    res.status(201).json({ id: result.insertId, name, slug, description, icon });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create category" });
  }
});

// --- Courses ---
router.post("/courses", async (req, res) => {
  try {
    const { categoryId, name, slug, description, durationLabel } = req.body;
    const [result] = await pool.query(
      `INSERT INTO courses (category_id, name, slug, description, duration_label)
       VALUES (:categoryId, :name, :slug, :description, :durationLabel)`,
      { categoryId, name, slug, description: description || null, durationLabel: durationLabel || null }
    );
    res.status(201).json({ id: result.insertId, categoryId, name, slug });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create course" });
  }
});

// --- Subjects ---
router.post("/subjects", async (req, res) => {
  try {
    const { courseId, name, displayOrder = 0 } = req.body;
    const [result] = await pool.query(
      "INSERT INTO subjects (course_id, name, display_order) VALUES (:courseId, :name, :displayOrder)",
      { courseId, name, displayOrder }
    );
    res.status(201).json({ id: result.insertId, courseId, name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create subject" });
  }
});

// --- Chapters ---
router.post("/chapters", async (req, res) => {
  try {
    const { subjectId, title, displayOrder = 0 } = req.body;
    const [result] = await pool.query(
      "INSERT INTO chapters (subject_id, title, display_order) VALUES (:subjectId, :title, :displayOrder)",
      { subjectId, title, displayOrder }
    );
    res.status(201).json({ id: result.insertId, subjectId, title });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create chapter" });
  }
});

// --- Lessons ---
router.post("/lessons", async (req, res) => {
  try {
    const { chapterId, title, displayOrder = 0, youtubeVideoId, notes, durationMinutes } = req.body;
    const [result] = await pool.query(
      `INSERT INTO lessons (chapter_id, title, display_order, youtube_video_id, notes, duration_minutes)
       VALUES (:chapterId, :title, :displayOrder, :youtubeVideoId, :notes, :durationMinutes)`,
      {
        chapterId,
        title,
        displayOrder,
        youtubeVideoId: youtubeVideoId || null,
        notes: notes || null,
        durationMinutes: durationMinutes || null,
      }
    );
    res.status(201).json({ id: result.insertId, chapterId, title });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create lesson" });
  }
});

// --- Quiz questions ---
router.post("/quiz", async (req, res) => {
  try {
    const { lessonId, question, options, correctAnswer } = req.body;
    const [result] = await pool.query(
      "INSERT INTO quiz_questions (lesson_id, question, options, correct_answer) VALUES (:lessonId, :question, :options, :correctAnswer)",
      { lessonId, question, options: JSON.stringify(options), correctAnswer }
    );
    res.status(201).json({ id: result.insertId, lessonId, question });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create quiz question" });
  }
});

module.exports = router;
