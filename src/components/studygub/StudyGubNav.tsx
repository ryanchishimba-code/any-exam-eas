"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Layers, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  STUDYGUB_EXAM_BANKS,
  STUDYGUB_PATH,
  TOP_500_DRUGS_PATH,
  questionBankHref,
} from "@/lib/studygub/config";

const HOME = { href: STUDYGUB_PATH, label: "StudyGub", icon: LayoutGrid } as const;

export function StudyGubNav() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === STUDYGUB_PATH) return pathname === STUDYGUB_PATH;
    if (href === TOP_500_DRUGS_PATH) return pathname.startsWith(TOP_500_DRUGS_PATH);
    if (href.startsWith("/study/practice")) {
      return pathname.startsWith("/study/practice");
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const items = [
    HOME,
    ...STUDYGUB_EXAM_BANKS.map((exam) => ({
      href: questionBankHref(exam.fieldId),
      label: exam.label,
      icon: BookOpen,
    })),
    { href: TOP_500_DRUGS_PATH, label: "Top 500 Drugs", icon: Layers },
  ];

  return (
    <aside className="hidden w-52 shrink-0 lg:block">
      <nav
        className="sticky top-24 space-y-1 rounded-2xl border border-slate-200/80 bg-white/80 p-3 shadow-sm backdrop-blur"
        aria-label="StudyGub"
      >
        {items.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              isActive(href)
                ? "bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
