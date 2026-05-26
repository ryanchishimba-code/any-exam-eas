"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/study", label: "Study hub" },
  { href: "/study/practice", label: "Quick review" },
  { href: "/learn", label: "Flashcards" },
  { href: "/generate", label: "AI exams" },
  { href: "/progress", label: "Progress" },
  { href: "/dashboard", label: "Dashboard" },
];

export function StudySubnav() {
  const pathname = usePathname();

  return (
    <nav
      className="mt-8 flex flex-wrap gap-1 rounded-2xl border border-black/[0.06] bg-white/80 p-1.5 shadow-[var(--shadow-apple-sm)]"
      aria-label="Study navigation"
    >
      {links.map((l) => {
        const active =
          pathname === l.href ||
          (l.href === "/learn" && pathname.startsWith("/learn")) ||
          (l.href === "/generate" && pathname.startsWith("/generate")) ||
          (l.href === "/study/practice" && pathname.startsWith("/study/practice"));
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              active
                ? "bg-[var(--color-accent)] text-white shadow-sm"
                : "text-[var(--color-ink-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-ink)]"
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
