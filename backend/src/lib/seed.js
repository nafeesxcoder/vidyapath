require("dotenv").config();
const bcrypt = require("bcryptjs");
const mysql = require("mysql2/promise");

// Seeds all 4 categories requested (12th, BCA, MCA, UPSC) with one course each
// so every part of the hierarchy is testable end-to-end.
// NOTE: youtube_video_id is left NULL here on purpose — add real YouTube
// video IDs for each lesson via the Admin panel (or directly in this file)
// rather than seeding guessed/placeholder IDs that may not exist or may not
// match the lesson topic.
const DATA = [
  {
    category: { name: "Class 12th", slug: "class-12th", icon: "🎓", description: "NCERT-based Class 12th preparation — Physics, Chemistry, Maths, Biology and more." },
    course: { name: "Class 12th — Science Stream", slug: "12th-science", description: "Complete Class 12th Science syllabus.", durationLabel: "1 Year" },
    subject: "Physics",
    chapter: "Electrostatics",
    lesson: { title: "Introduction to Electric Charge", notes: "Electric charge, Coulomb's law, and electric field basics. (Add full notes via Admin panel.)", durationMinutes: 25 },
  },
  {
    category: { name: "BCA", slug: "bca", icon: "💻", description: "Bachelor of Computer Applications — full 3-year syllabus, semester-wise." },
    course: { name: "BCA — Semester 1", slug: "bca-sem-1", description: "Foundational programming and computer fundamentals.", durationLabel: "3 Years" },
    subject: "Programming in C",
    chapter: "Fundamentals of C",
    lesson: { title: "Variables, Data Types & Operators", notes: "Basics of C variables, data types, and operators with examples. (Add full notes via Admin panel.)", durationMinutes: 30 },
  },
  {
    category: { name: "MCA", slug: "mca", icon: "🖥️", description: "Master of Computer Applications — advanced CS concepts, semester-wise." },
    course: { name: "MCA — Semester 1", slug: "mca-sem-1", description: "Advanced programming, data structures, and computer organization.", durationLabel: "2 Years" },
    subject: "Data Structures",
    chapter: "Linear Data Structures",
    lesson: { title: "Arrays, Stacks & Queues Overview", notes: "Core linear data structures used throughout the MCA curriculum. (Add full notes via Admin panel.)", durationMinutes: 35 },
  },
  {
    category: { name: "UPSC", slug: "upsc", icon: "🏛️", description: "UPSC Civil Services preparation — Prelims, Mains, and Optional subjects." },
    course: { name: "UPSC — Prelims", slug: "upsc-prelims", description: "General Studies Paper 1 preparation.", durationLabel: "Ongoing" },
    subject: "Indian Polity",
    chapter: "The Constitution of India",
    lesson: { title: "Making of the Constitution", notes: "Constituent Assembly, key committees, and the drafting process. (Add full notes via Admin panel.)", durationMinutes: 40 },
  },
];

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    namedPlaceholders: true,
  });

  // Admin user
  const adminPassword = await bcrypt.hash("Admin@123", 10);
  await connection.query(
    `INSERT INTO users (name, email, password, role)
     VALUES ('VidyaPath Admin', 'admin@vidyapath.dev', :password, 'ADMIN')
     ON DUPLICATE KEY UPDATE name = name`,
    { password: adminPassword }
  );

  for (const entry of DATA) {
    const [[existingCat]] = await connection.query(
      "SELECT id FROM categories WHERE slug = :slug",
      { slug: entry.category.slug }
    ).then(([rows]) => [rows]);

    let categoryId;
    if (existingCat) {
      categoryId = existingCat.id;
    } else {
      const [result] = await connection.query(
        "INSERT INTO categories (name, slug, description, icon) VALUES (:name, :slug, :description, :icon)",
        entry.category
      );
      categoryId = result.insertId;
    }

    const [existingCourseRows] = await connection.query(
      "SELECT id FROM courses WHERE slug = :slug",
      { slug: entry.course.slug }
    );
    let courseId;
    if (existingCourseRows[0]) {
      courseId = existingCourseRows[0].id;
    } else {
      const [result] = await connection.query(
        "INSERT INTO courses (category_id, name, slug, description, duration_label) VALUES (:categoryId, :name, :slug, :description, :durationLabel)",
        { categoryId, ...entry.course }
      );
      courseId = result.insertId;
    }

    const [existingSubjectRows] = await connection.query(
      "SELECT id FROM subjects WHERE course_id = :courseId AND name = :name",
      { courseId, name: entry.subject }
    );
    let subjectId;
    if (existingSubjectRows[0]) {
      subjectId = existingSubjectRows[0].id;
    } else {
      const [result] = await connection.query(
        "INSERT INTO subjects (course_id, name) VALUES (:courseId, :name)",
        { courseId, name: entry.subject }
      );
      subjectId = result.insertId;
    }

    const [existingChapterRows] = await connection.query(
      "SELECT id FROM chapters WHERE subject_id = :subjectId AND title = :title",
      { subjectId, title: entry.chapter }
    );
    let chapterId;
    if (existingChapterRows[0]) {
      chapterId = existingChapterRows[0].id;
    } else {
      const [result] = await connection.query(
        "INSERT INTO chapters (subject_id, title) VALUES (:subjectId, :title)",
        { subjectId, title: entry.chapter }
      );
      chapterId = result.insertId;
    }

    const [existingLessonRows] = await connection.query(
      "SELECT id FROM lessons WHERE chapter_id = :chapterId AND title = :title",
      { chapterId, title: entry.lesson.title }
    );
    let lessonId;
    if (existingLessonRows[0]) {
      lessonId = existingLessonRows[0].id;
    } else {
      const [result] = await connection.query(
        "INSERT INTO lessons (chapter_id, title, notes, duration_minutes) VALUES (:chapterId, :title, :notes, :durationMinutes)",
        { chapterId, ...entry.lesson }
      );
      lessonId = result.insertId;
    }

    const [existingQuiz] = await connection.query(
      "SELECT id FROM quiz_questions WHERE lesson_id = :lessonId",
      { lessonId }
    );
    if (!existingQuiz[0]) {
      await connection.query(
        "INSERT INTO quiz_questions (lesson_id, question, options, correct_answer) VALUES (:lessonId, :question, :options, :correctAnswer)",
        {
          lessonId,
          question: `Placeholder question for "${entry.lesson.title}" — replace via Admin panel.`,
          options: JSON.stringify(["Option A", "Option B", "Option C", "Option D"]),
          correctAnswer: "Option A",
        }
      );
    }

    console.log(`[seed] ${entry.category.name} -> ${entry.course.name} ready`);
  }

  console.log("[seed] done. Admin login -> admin@vidyapath.dev / Admin@123");
  await connection.end();
}

main().catch((err) => {
  console.error("[seed] failed:", err);
  process.exit(1);
});
