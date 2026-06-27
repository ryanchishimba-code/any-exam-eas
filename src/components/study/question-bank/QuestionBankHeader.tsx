"use client";

import Link from "next/link";
import { ChevronRight, LayoutGrid } from "lucide-react";
import { qbUi } from "@/lib/study/question-bank-ui";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

type Props = {
  examName: string;
  usmleStepLabel?: string;
  practiceMode: "bank" | "timed";
  topicCount?: number | null;
  totalQuestions?: number | null;
  readinessScore?: number;
  streakDays?: number;
};

export function QuestionBankHeader({
  examName,
  usmleStepLabel,
  practiceMode,
  topicCount,
  totalQuestions,
  readinessScore,
  streakDays,
}: Props) {
  return (
    <header className="space-y-4 px-0.5">
      <nav aria-label="Breadcrumb" className={qbUi.eyebrow}>
        <ol className="flex items-center gap-1">
          <li>
            <Link
              href={ROUTES.dashboard}
              className="text-[var(--color-ink-muted)] transition hover:text-[var(--color-accent)]"
            >
              Dashboard
            </Link>
          </li>
          <li aria-hidden>
            <ChevronRight className="inline h-3 w-3 opacity-40" />
          </li>
          <li className="text-[var(--color-ink)]">Question Bank</li>
        </ol>
      </nav>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[var(--color-accent)]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[var(--color-accent)]">
              {examName}
            </span>
            {usmleStepLabel ? (
              <span className={qbUi.statPill}>{usmleStepLabel}</span>
            ) : null}
            <span className={qbUi.statPill}>
              {practiceMode === "timed" ? "Timed exam" : "Question bank"}
            </span>
          </div>
          <h1 className={cn(qbUi.title, "text-balance")}>Practice {examName}</h1>
          <p className={qbUi.subtitle}>
            Pick a topic, tune your session, and start — every question matches your exam.
          </p>
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {typeof readinessScore === "number" ? (
              <span className={qbUi.statPill}>{readinessScore}% ready</span>
            ) : null}
            {typeof topicCount === "number" ? (
              <span className={qbUi.statPill}>
                {topicCount} {topicCount === 1 ? "topic" : "topics"}
              </span>
            ) : null}
            {typeof totalQuestions === "number" ? (
              <span className={qbUi.statPill}>{totalQuestions.toLocaleString()} questions</span>
            ) : null}
            {typeof streakDays === "number" && streakDays > 0 ? (
              <span className={qbUi.statPill}>{streakDays}d streak</span>
            ) : null}
          </div>
        </div>

        <Link href={`${ROUTES.selectExam}?switch=1`} className={cn(qbUi.switchExam, "shrink-0")}>
          <LayoutGrid className="h-3.5 w-3.5" aria-hidden />
          Switch exam
        </Link>
      </div>
    </header>
  );
}
