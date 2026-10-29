const express = require("express");
const pool = require("../lib/db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// GET /api/progress -> current user's progress across all lessons
router.get("/", requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM user_progress WHERE user_id = :userId",
      { userId: req.user.id }
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch progress" });
  }
});

// POST /api/progress/:lessonId  { completed, quizScore }
router.post("/:lessonId", requireAuth, async (req, res) => {
  try {
    const { completed = true, quizScore } = req.body;
    await pool.query(
      `INSERT INTO user_progress (user_id, lesson_id, completed, quiz_score)
       VALUES (:userId, :lessonId, :completed, :quizScore)
       ON DUPLICATE KEY UPDATE completed = :completed, quiz_score = :quizScore`,
      { userId: req.user.id, lessonId: req.params.lessonId, completed, quizScore: quizScore ?? null }
    );
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update progress" });
  }
});

module.exports = router;
