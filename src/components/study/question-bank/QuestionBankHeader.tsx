"use client";

import Link from "next/link";
import { ChevronRight, LayoutGrid } from "lucide-react";
import { qbUi } from "@/lib/study/question-bank-ui";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

type Props = {
  examName: string;
  usmleStepLabel?: string;
  /** Scored question total. Same number as the All card and Mixed topics. */
  questionCount?: number | null;
};

export function QuestionBankHeader({ examName, usmleStepLabel, questionCount }: Props) {
  return (
    <header className="space-y-3 px-0.5">
      <nav
        aria-label="Breadcrumb"
        className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-wide"
      >
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

      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className={cn(qbUi.title, "text-balance")}>Practice {examName}</h1>
          {typeof questionCount === "number" ? (
            <p
              className="mt-1 text-[15px] tabular-nums text-[var(--color-ink-muted)]"
              data-active-question-count={questionCount}
            >
              {questionCount.toLocaleString("en-US")} questions
            </p>
          ) : null}
          {usmleStepLabel ? (
            <p className={cn(qbUi.sectionHint, "mt-1")}>{usmleStepLabel}</p>
          ) : null}
        </div>
        <Link href={`${ROUTES.selectExam}?switch=1`} className={cn(qbUi.switchExam, "shrink-0")}>
          <LayoutGrid className="h-3.5 w-3.5" aria-hidden />
          Switch exam
        </Link>
      </div>
    </header>
  );
}
