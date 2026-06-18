"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { EXAM_NAV_ITEMS } from "@/lib/routes";
import { cn } from "@/lib/utils";

/**
 * Exam navigation. Renders the exam links inline and always visible — no
 * open-on-hover / click-to-open dropdown that disappears.
 */
export function ExamsDropdown() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-4" aria-label="Exams">
      {EXAM_NAV_ITEMS.map((exam) => {
        const active =
          pathname === exam.href ||
          pathname.startsWith(`${exam.href}/`) ||
          pathname.startsWith(`/practice/${exam.slug}`);

        return (
          <Link
            key={exam.slug}
            href={exam.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "text-xs transition-colors duration-200",
              active
                ? "font-semibold text-[var(--color-ink)] underline decoration-2 underline-offset-4 decoration-[var(--color-accent)]"
                : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
            )}
          >
            {exam.label}
          </Link>
        );
      })}
    </div>
  );
}
