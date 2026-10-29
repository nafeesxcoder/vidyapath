const express = require("express");
const pool = require("../lib/db");

const router = express.Router();

// GET /api/categories -> all categories for homepage (12th, BCA, MCA, UPSC ...)
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM categories ORDER BY display_order ASC, id ASC"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// GET /api/categories/:slug -> category + its courses
router.get("/:slug", async (req, res) => {
  try {
    const [catRows] = await pool.query(
      "SELECT * FROM categories WHERE slug = :slug",
      { slug: req.params.slug }
    );
    const category = catRows[0];
    if (!category) return res.status(404).json({ error: "Category not found" });

    const [courses] = await pool.query(
      "SELECT * FROM courses WHERE category_id = :id ORDER BY id ASC",
      { id: category.id }
    );

    res.json({ ...category, courses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch category" });
  }
});

module.exports = router;
