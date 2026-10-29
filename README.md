# VidyaPath — 12th se Masters Degree tak, Full Free Preparation

Monorepo: `/backend` (Node + Express + MySQL, plain JS) and `/frontend`
(Next.js 14 App Router + Tailwind, plain JS).

## Structure

One hierarchy powers every category requested (12th, BCA, MCA, UPSC — and any
future one you add):

```
Category (e.g. "BCA")
  └─ Course (e.g. "BCA — Semester 1")
       └─ Subject (e.g. "Programming in C")
            └─ Chapter (e.g. "Fundamentals of C")
                 └─ Lesson (video + notes + quiz)
```

## What's real vs. stubbed in this scaffold

**Fully wired and testable end-to-end:**
- Signup/Login (JWT, bcrypt-hashed passwords), MySQL-backed
- Homepage → Category → Course → full Subject/Chapter/Lesson TOC
- Lesson page: real YouTube embed (once you add a video ID) + notes
- Quiz: fetch questions (answers stripped), submit, server-graded score
- Admin panel: add Category / Course / Subject / Chapter / Lesson / Quiz question (JWT + ADMIN role protected)
- Seed script: populates all 4 requested categories (12th, BCA, MCA, UPSC), each with one course → subject → chapter → lesson → quiz, so every layer is clickable on first run
- Progress tracking API (`/api/progress`) — not yet wired into any dashboard UI (see below)

**Intentionally stubbed (flagged in code) — build these next:**
- Seeded lessons have **no YouTube video ID** on purpose (a guessed ID could point to the wrong/nonexistent video) — add real video IDs via the Admin panel's "Add Lesson" form, or directly in `backend/src/lib/seed.js`
- Seeded quiz questions are placeholders ("replace via Admin panel") — same reasoning
- No progress-bar UI yet on a student dashboard — the API exists, the page doesn't
- No payment/subscription logic (you chose 100% free + ads, so this is correctly absent)
- AdSense slots are placeholder `<div>`s — real `<ins class="adsbygoogle">` is commented out in `components/AdSlot.jsx`, add your `data-ad-client`/`data-ad-slot` when you have them
- No search bar yet on the homepage

## 1. Prerequisites

- Node.js 18+
- Docker + Docker Compose (for MySQL) — or your own local MySQL install

## 2. Start MySQL

```bash
docker-compose up -d
```

## 3. Backend setup

```bash
cd backend
cp .env.example .env
npm install
npm run migrate     # creates all tables from sql/schema.sql
npm run seed         # populates 12th, BCA, MCA, UPSC with starter content
npm run dev          # starts on http://localhost:5000
```

Seed creates an admin login: **admin@vidyapath.dev / Admin@123**

Health check: `curl http://localhost:5000/api/health`

## 4. Frontend setup

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev          # starts on http://localhost:3000
```

## 5. Try the flow

1. Visit `http://localhost:3000` → see 4 category cards (12th, BCA, MCA, UPSC)
2. Click **BCA** → see "BCA — Semester 1" course card
3. Click it → see Subject → Chapter → Lesson tree
4. Click a lesson → see video placeholder (add a real YouTube ID via Admin) + notes
5. Click **Take Quiz** → answer → submit → see score
6. Log in as admin (`/login`) with the seeded account → go to `/admin` → add a real lesson with a real YouTube video ID for any chapter

## 6. Adding real content

Every table has a matching Admin form. To add e.g. a Class 12th Chemistry chapter:
1. Find/create the course (`courses` table — or via `/admin` "Add Course" form, note the categoryId shown on the categories API)
2. Add a Subject under it
3. Add a Chapter under that subject
4. Add a Lesson under that chapter, with a real YouTube video ID and notes
5. Add Quiz questions for that lesson

This is manual by design for v1 — a bulk-import (CSV/JSON) tool is a natural next step once
you have real content to load at scale.

## 7. Deployment notes

- **Frontend**: Vercel — set `NEXT_PUBLIC_API_URL` to your backend's public URL.
- **Backend**: Railway/Render — set all vars from `.env.example`, point `DB_*` at a managed MySQL (PlanetScale, Railway MySQL, AWS RDS).
- Run `npm run migrate` once against production MySQL before first deploy.
- **Cloudflare**: DNS + CDN in front of the frontend deployment for caching and DDoS protection.
