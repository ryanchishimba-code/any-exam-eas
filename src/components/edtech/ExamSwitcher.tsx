"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { ChevronDown, GraduationCap, LayoutGrid } from "lucide-react";
import { switchExamPreference } from "@/lib/edtech/actions";
import { EXAM_CATALOG, EXAM_SLUGS } from "@/lib/edtech/exams";
import { ROUTES } from "@/lib/routes";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

export function ExamSwitcher({
  currentExam,
  variant = "default",
  onSwitched,
}: {
  currentExam: ExamSlug;
  variant?: "default" | "nav" | "mobile";
  onSwitched?: () => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const exam = EXAM_CATALOG[currentExam];
  const isNav = variant === "nav";
  const isMobile = variant === "mobile";

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as ExamSlug;
    if (next === currentExam) return;
    startTransition(async () => {
      await switchExamPreference(next);
      onSwitched?.();
      router.refresh();
    });
  }

  if (isNav) {
    return (
      <label className="relative inline-flex items-center gap-1.5">
        <GraduationCap className="h-3.5 w-3.5 text-[var(--color-accent)]" aria-hidden />
        <span className="sr-only">Primary exam</span>
        <div className="relative">
          <select
            value={currentExam}
            disabled={pending}
            onChange={onChange}
            aria-label={`Primary exam: ${exam.name}`}
            className="appearance-none rounded-lg border border-black/[0.08] bg-white/90 py-1.5 pl-2 pr-7 text-xs font-semibold text-[var(--color-ink)] shadow-sm transition hover:border-[var(--color-accent)]/40 focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
          >
            {EXAM_SLUGS.map((slug) => (
              <option key={slug} value={slug}>
                {EXAM_CATALOG[slug].shortName}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-1.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
            aria-hidden
          />
        </div>
      </label>
    );
  }

  if (isMobile) {
    return (
      <label className="flex w-full flex-col gap-1.5">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          My exam
        </span>
        <div className="relative">
          <select
            value={currentExam}
            disabled={pending}
            onChange={onChange}
            className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-3 pr-9 text-sm font-semibold text-slate-900"
          >
            {EXAM_SLUGS.map((slug) => (
              <option key={slug} value={slug}>
                {EXAM_CATALOG[slug].name}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden
          />
        </div>
      </label>
    );
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-2", isNav && "gap-1.5")}>
      <label className={cn("relative inline-flex items-center gap-2")}>
      <span className="sr-only">Switch exam</span>
      <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Exam</span>
      <div className="relative">
        <select
          value={currentExam}
          disabled={pending}
          onChange={onChange}
          className="appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-9 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-slate-300 focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
        >
          {EXAM_SLUGS.map((slug) => (
            <option key={slug} value={slug}>
              {EXAM_CATALOG[slug].shortName}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          aria-hidden
        />
      </div>
      <span className="hidden text-sm text-slate-500 sm:inline">{exam.name}</span>
      </label>
      <Link
        href={`${ROUTES.selectExam}?switch=1`}
        className="inline-flex items-center gap-1 rounded-lg border border-slate-200/80 bg-white px-2 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-teal-300 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-teal-600 dark:hover:text-teal-400"
        title="Open full exam selection screen"
      >
        <LayoutGrid className="h-3.5 w-3.5" aria-hidden />
        <span className="hidden sm:inline">Switch</span>
      </Link>
    </div>
  );
}
