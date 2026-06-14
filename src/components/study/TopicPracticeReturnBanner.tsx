"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";

export type TopicPracticeReturn = {
  href: string;
  label: string;
};

export function TopicPracticeReturnBanner({ returnTo }: { returnTo: TopicPracticeReturn }) {
  return (
    <Link
      href={returnTo.href}
      className="inline-flex items-center gap-2 rounded-xl border border-teal-200/80 bg-teal-50/60 px-3 py-2 text-sm font-medium text-teal-900 transition hover:bg-teal-50"
    >
      <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
      Back to {returnTo.label}
    </Link>
  );
}

export function TopicPracticeReturnCompletion({
  returnTo,
  summary,
  compact = false,
}: {
  returnTo: TopicPracticeReturn;
  summary: { correct: number; total: number; accuracy: number };
  compact?: boolean;
}) {
  return (
    <div
      className={
        compact
          ? "rounded-2xl border border-teal-200/70 bg-teal-50/50 p-4"
          : "mt-8 rounded-2xl border border-black/[0.08] bg-white p-6 shadow-sm sm:p-8"
      }
    >
      {!compact ? (
        <>
          <p className="text-lg font-semibold text-[var(--color-ink)]">Session complete</p>
          <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
            {summary.correct} / {summary.total} correct ({summary.accuracy}%)
          </p>
        </>
      ) : (
        <p className="text-sm text-[var(--color-ink-muted)]">
          {summary.correct}/{summary.total} correct ({summary.accuracy}%) — continue reviewing or
          practice again.
        </p>
      )}
      <div className={compact ? "mt-3" : "mt-6"}>
        <Link
          href={returnTo.href}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 sm:w-auto"
        >
          <BookOpen className="h-4 w-4" aria-hidden />
          Back to {returnTo.label}
        </Link>
      </div>
    </div>
  );
}
