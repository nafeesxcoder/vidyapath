"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="text-lg font-bold text-primary">
          VidyaPath
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/learn" className="hover:text-primary">
            All Courses
          </Link>
          <Link href="/login" className="hover:text-primary">
            Login
          </Link>
          <Link
            href="/signup"
            className="rounded-md bg-primary px-3 py-1.5 font-medium text-white hover:opacity-90"
          >
            Sign up
          </Link>
        </div>
      </div>
    </nav>
  );
}
