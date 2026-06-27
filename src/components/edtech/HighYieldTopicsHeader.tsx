"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, ChevronRight } from "lucide-react";
import { questionBankHref } from "@/lib/edtech/practice-links";
import { studyUi } from "@/lib/study/study-ui";
import { ROUTES } from "@/lib/routes";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

type Props = {
  examSlug: ExamSlug;
  examLabel: string;
  usmleStepLabel?: string;
  topicCount: number;
  reviewedCount: number;
  masteryPct: number;
};

export function HighYieldTopicsHeader({
  examSlug,
  examLabel,
  usmleStepLabel,
  topicCount,
  reviewedCount,
  masteryPct,
}: Props) {
  const label = usmleStepLabel ?? examLabel;

  return (
    <header className="space-y-4 px-0.5">
      <nav aria-label="Breadcrumb" className={studyUi.eyebrow}>
        <ol className="flex items-center gap-1">
          <li>
            <Link
              href={ROUTES.practiceHub}
              className="text-[var(--color-ink-muted)] transition hover:text-[var(--color-accent)]"
            >
              Study Hub
            </Link>
          </li>
          <li aria-hidden>
            <ChevronRight className="inline h-3 w-3 opacity-40" />
          </li>
          <li className="text-[var(--color-ink)]">Topics</li>
        </ol>
      </nav>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[var(--color-accent)]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[var(--color-accent)]">
              {label}
            </span>
            {reviewedCount > 0 ? (
              <span className={studyUi.statPill}>
                {reviewedCount}/{topicCount} reviewed
              </span>
            ) : null}
          </div>
          <h1 className={cn(studyUi.title, "text-balance")}>High-Yield Topics</h1>
          <p className={studyUi.subtitle}>
            {topicCount} exam-focused summaries and textbook modules — pearls, pitfalls, and
            practice links.
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            <span className={studyUi.statPill}>{masteryPct}% explored</span>
            <span className="h-1.5 w-24 overflow-hidden rounded-full bg-[var(--color-surface)]">
              <span
                className="block h-full rounded-full bg-[var(--color-accent)]/70 transition-all duration-500"
                style={{ width: `${masteryPct}%` }}
              />
            </span>
          </div>
        </div>

        <Link
          href={questionBankHref(examSlug)}
          className={cn(studyUi.ghostBtn, "shrink-0 sm:min-w-[9rem]")}
        >
          <BookOpen className="h-3.5 w-3.5" aria-hidden />
          Question bank
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </div>
    </header>
  );
}
