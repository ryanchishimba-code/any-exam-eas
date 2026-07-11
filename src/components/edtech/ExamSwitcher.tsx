"use client";

import { useTransition } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronDown, GraduationCap, LayoutGrid, Loader2 } from "lucide-react";
import { switchExamPreference } from "@/lib/edtech/actions";
import {
  prepareClientForExamSwitch,
  resolvePathAfterExamSwitch,
} from "@/lib/client/exam-switch-reset";
import { navigateHard } from "@/lib/client/navigate-hard";
import { useAppPreferences } from "@/lib/client/use-app-preferences";
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
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [pending, startTransition] = useTransition();
  const { setExamSlug, refresh } = useAppPreferences();
  const exam = EXAM_CATALOG[currentExam];
  const isNav = variant === "nav";
  const isMobile = variant === "mobile";
  const switchHref = `${ROUTES.selectExam}?switch=1`;

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as ExamSlug;
    if (next === currentExam) return;
    setExamSlug(next);
    startTransition(async () => {
      const result = await switchExamPreference(next);
      if (!result.ok) {
        setExamSlug(currentExam);
        return;
      }
      prepareClientForExamSwitch(queryClient, next);
      onSwitched?.();
      await refresh();
      const nextPath = resolvePathAfterExamSwitch(
        pathname,
        new URLSearchParams(searchParams.toString()),
        next
      );
      // Always hard-navigate so RSC + client state remount for the new exam.
      navigateHard(nextPath === pathname ? `${nextPath}?switched=${next}` : nextPath);
    });
  }

  if (isNav) {
    return (
      <Link
        href={switchHref}
        className="inline-flex items-center gap-1.5 rounded-lg border border-black/[0.08] bg-white/90 py-1.5 pl-2 pr-2.5 text-xs font-semibold text-[var(--color-ink)] shadow-sm transition hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-surface)]"
        aria-label={`Current exam: ${exam.name}. Switch exam`}
        title="Switch exam"
      >
        <GraduationCap className="h-3.5 w-3.5 text-[var(--color-accent)]" aria-hidden />
        <span>{exam.shortName}</span>
        <ChevronDown className="h-3 w-3 text-[var(--color-ink-muted)]" aria-hidden />
      </Link>
    );
  }

  if (isMobile) {
    return (
      <div className="flex w-full flex-col gap-1.5">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          My exam
        </span>
        <Link
          href={switchHref}
          className="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 pl-3 pr-3 text-sm font-semibold text-slate-900 transition hover:border-teal-300 hover:bg-teal-50/50"
          aria-label={`Current exam: ${exam.name}. Switch exam`}
        >
          <GraduationCap className="h-4 w-4 text-[var(--color-accent)]" aria-hidden />
          <span className="flex-1 text-left">{exam.name}</span>
          <span className="text-xs font-semibold text-teal-700">Switch</span>
        </Link>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-2")}>
      <label className={cn("relative inline-flex items-center gap-2")}>
        <span className="sr-only">Switch exam</span>
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Exam</span>
        <div className="relative">
          <select
            value={currentExam}
            disabled={pending}
            onChange={onChange}
            aria-busy={pending}
            className={cn(
              "appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-9 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-slate-300 focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20",
              pending && "opacity-70"
            )}
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
          {pending ? (
            <Loader2
              className="pointer-events-none absolute right-8 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin text-[var(--color-accent)]"
              aria-hidden
            />
          ) : null}
        </div>
        <span className="hidden text-sm text-slate-500 sm:inline">{exam.name}</span>
      </label>
      <Link
        href={switchHref}
        className="inline-flex items-center gap-1 rounded-lg border border-slate-200/80 bg-white px-2 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-teal-300 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-teal-600 dark:hover:text-teal-400"
        title="Open full exam selection screen"
      >
        <LayoutGrid className="h-3.5 w-3.5" aria-hidden />
        <span className="hidden sm:inline">Switch</span>
      </Link>
    </div>
  );
}
