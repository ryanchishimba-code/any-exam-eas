"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, BookOpen, Layers, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  STUDY_HUB_EXAM_BANKS,
  STUDY_HUB_PATH,
  TOP_500_DRUGS_PATH,
  questionBankHref,
  studyHubProgressHref,
} from "@/lib/study-hub/config";

export function StudyHubNav() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === STUDY_HUB_PATH) return pathname === STUDY_HUB_PATH;
    if (href === studyHubProgressHref()) return pathname === STUDY_HUB_PATH;
    if (href === TOP_500_DRUGS_PATH) return pathname.startsWith(TOP_500_DRUGS_PATH);
    if (href.startsWith("/study/practice")) return pathname.startsWith("/study/practice");
    return pathname === href;
  }

  const items = [
    { href: STUDY_HUB_PATH, label: "Study Hub", icon: LayoutGrid },
    ...STUDY_HUB_EXAM_BANKS.map((exam) => ({
      href: questionBankHref(exam.fieldId),
      label: exam.label,
      icon: BookOpen,
    })),
    { href: TOP_500_DRUGS_PATH, label: "Top 500 Drugs", icon: Layers },
    { href: studyHubProgressHref(), label: "Progress", icon: BarChart3 },
  ];

  return (
    <aside className="hidden w-52 shrink-0 lg:block">
      <nav
        className="sticky top-24 space-y-1 rounded-2xl border border-slate-200/80 bg-white/80 p-3 shadow-sm backdrop-blur"
        aria-label="Study Hub"
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
