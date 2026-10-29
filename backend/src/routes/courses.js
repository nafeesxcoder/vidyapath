const express = require("express");
const pool = require("../lib/db");

const router = express.Router();

// GET /api/courses/:slug -> course + nested subjects -> chapters -> lessons (TOC)
// Lesson notes/video are NOT included here (kept light for the sidebar);
// full lesson content is fetched separately via /api/lessons/:id.
router.get("/:slug", async (req, res) => {
  try {
    const [courseRows] = await pool.query(
      "SELECT * FROM courses WHERE slug = :slug",
      { slug: req.params.slug }
    );
    const course = courseRows[0];
    if (!course) return res.status(404).json({ error: "Course not found" });

    const [subjects] = await pool.query(
      "SELECT * FROM subjects WHERE course_id = :id ORDER BY display_order ASC, id ASC",
      { id: course.id }
    );

    for (const subject of subjects) {
      const [chapters] = await pool.query(
        "SELECT * FROM chapters WHERE subject_id = :id ORDER BY display_order ASC, id ASC",
        { id: subject.id }
      );

      for (const chapter of chapters) {
        const [lessons] = await pool.query(
          "SELECT id, title, display_order, duration_minutes FROM lessons WHERE chapter_id = :id ORDER BY display_order ASC, id ASC",
          { id: chapter.id }
        );
        chapter.lessons = lessons;
      }
      subject.chapters = chapters;
    }

    res.json({ ...course, subjects });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch course" });
  }
});

module.exports = router;
