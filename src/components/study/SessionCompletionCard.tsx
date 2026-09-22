"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { BookOpen, LayoutGrid } from "lucide-react";
import { STUDY_HUB_PATH } from "@/lib/study-hub/config";
import { cn } from "@/lib/utils";

export type SessionSummaryStats = {
  correct: number;
  total: number;
  accuracy: number;
};

export type SessionDomainBreakdownRow = {
  id: string;
  label: string;
  correct: number;
  total: number;
  pct: number;
};

export type SessionNotePreview = {
  questionNumber: number;
  text: string;
};

export type SessionReceipt = {
  attemptsSaved: number;
  accuracy: number;
  correct: number;
  studyStreakDays: number;
  weakTopics: { id: string; label: string }[];
  reviewIncorrectHref: string;
  analyticsHref: string;
};

type Props = {
  title?: string;
  subtitle?: string;
  summary: SessionSummaryStats;
  domainBreakdown?: SessionDomainBreakdownRow[];
  notes?: SessionNotePreview[];
  onReview?: () => void;
  reviewLabel?: string;
  returnHref?: string;
  returnLabel?: string;
  compact?: boolean;
  className?: string;
  extraActions?: ReactNode;
  receipt?: SessionReceipt;
};

export function SessionPersistGate({
  state,
  error,
  onRetry,
}: {
  state: "saving" | "error";
  error?: string | null;
  onRetry: () => void;
}) {
  if (state === "saving") {
    return (
      <div
        role="status"
        className="rounded-2xl border border-[var(--color-border)]/80 bg-[var(--color-surface-elevated)] p-6 sm:p-8"
      >
        <p className="text-lg font-semibold text-[var(--color-ink)]">Saving your session…</p>
        <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
          Attempts are not on Analytics until this save finishes.
        </p>
      </div>
    );
  }

  return (
    <div
      role="alert"
      className="rounded-2xl border border-rose-200 bg-rose-50 p-6 sm:p-8"
    >
      <p className="text-lg font-semibold text-rose-950">Session not saved</p>
      <p className="mt-2 text-sm text-rose-900">
        {error ?? "We couldn't save this session. Analytics will stay empty until it saves."}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 inline-flex items-center justify-center rounded-xl bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-white"
      >
        Retry save
      </button>
    </div>
  );
}

export function SessionCompletionCard({
  title = "Session complete",
  subtitle,
  summary,
  domainBreakdown,
  notes,
  onReview,
  reviewLabel = "Review explanations",
  returnHref = STUDY_HUB_PATH,
  returnLabel = "Study Hub",
  compact = false,
  className,
  extraActions,
  receipt,
}: Props) {
  const scoreColor =
    summary.accuracy >= 80
      ? "text-teal-600"
      : summary.accuracy >= 65
        ? "text-amber-600"
        : "text-rose-600";

  const notesWithText = notes?.filter((n) => n.text.trim()) ?? [];

  return (
    <div
      className={cn(
        compact
          ? "rounded-2xl border border-teal-200/70 bg-teal-50/50 p-4"
          : "rounded-2xl border border-[var(--color-border)]/80 bg-[var(--color-surface-elevated)] p-6 sm:p-8",
        className
      )}
    >
      {!compact ? (
        <>
          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-[3px] border-[var(--color-accent)]/25 bg-[var(--color-surface)]">
              <span className={cn("text-2xl font-bold tabular-nums tracking-tight", scoreColor)}>
                {summary.accuracy}%
              </span>
            </div>
            <p className="mt-4 text-xl font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
              {title}
            </p>
            {subtitle ? (
              <p className="mt-1 text-sm text-[var(--color-ink-muted)]">{subtitle}</p>
            ) : null}
            <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
              {summary.correct} / {summary.total} correct
            </p>
          </div>
        </>
      ) : (
        <p className="text-sm text-[var(--color-ink-muted)]">
          {summary.correct}/{summary.total} correct ({summary.accuracy}%) — review explanations or
          return to {returnLabel}.
        </p>
      )}

      {receipt ? (
        <div
          className={cn(
            "rounded-xl border border-[var(--color-border)]/50 bg-[var(--color-surface)]/60 p-4",
            compact ? "mt-3" : "mt-6"
          )}
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
            Session receipt
          </p>
          <ul className="mt-3 space-y-1 text-sm text-[var(--color-ink)]">
            <li>{receipt.attemptsSaved} attempts saved</li>
            <li>
              {receipt.accuracy}% accuracy ({receipt.correct} correct)
            </li>
            <li>{receipt.studyStreakDays}d study streak</li>
            <li>
              {receipt.weakTopics.length > 0
                ? `Weak topics touched: ${receipt.weakTopics.map((topic) => topic.label).join(", ")}`
                : "No missed topics in this session."}
            </li>
          </ul>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Link
              href={receipt.reviewIncorrectHref}
              className="inline-flex items-center justify-center rounded-xl bg-[var(--color-accent)] px-4 py-2.5 text-sm font-semibold text-white"
            >
              Review incorrect
            </Link>
            <Link
              href={receipt.analyticsHref}
              className="inline-flex items-center justify-center rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm font-semibold text-[var(--color-ink)]"
            >
              View analytics
            </Link>
          </div>
        </div>
      ) : null}

      {domainBreakdown && domainBreakdown.length > 0 ? (
        <div
          className={cn(
            "rounded-xl border border-[var(--color-border)]/50 bg-[var(--color-surface)]/60 p-4",
            compact ? "mt-3" : "mt-6"
          )}
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
            Organ-system breakdown
          </p>
          <p className="mt-1 text-[11px] text-[var(--color-ink-muted)]">
            Practice coverage only — not a board score prediction.
          </p>
          <ul className="mt-3 space-y-2">
            {domainBreakdown.slice(0, 8).map((row) => (
              <li key={row.id} className="flex items-center gap-3 text-sm">
                <span className="min-w-0 flex-1 truncate text-[var(--color-ink)]">{row.label}</span>
                <span className="tabular-nums text-[var(--color-ink-muted)]">
                  {row.correct}/{row.total}
                </span>
                <span className="w-10 text-right tabular-nums font-medium text-[var(--color-ink)]">
                  {row.pct}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {notesWithText.length > 0 ? (
        <div className={cn("rounded-xl border border-[var(--color-border)]/50 bg-[var(--color-surface)]/60 p-4", compact ? "mt-3" : "mt-6")}>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
            Your notes
          </p>
          <ul className="mt-3 space-y-2">
            {notesWithText.slice(0, 5).map((note) => (
              <li key={note.questionNumber} className="text-sm text-[var(--color-ink)]">
                <span className="font-medium text-[var(--color-ink-muted)]">
                  Q{note.questionNumber}:{" "}
                </span>
                {note.text.trim()}
              </li>
            ))}
          </ul>
          {notesWithText.length > 5 ? (
            <p className="mt-2 text-xs text-[var(--color-ink-muted)]">
              +{notesWithText.length - 5} more in review
            </p>
          ) : null}
        </div>
      ) : null}

      <div
        className={cn(
          "flex flex-col gap-3 sm:flex-row sm:justify-center",
          compact ? "mt-3" : "mt-6"
        )}
      >
        {onReview ? (
          <button
            type="button"
            onClick={onReview}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-white shadow-[0_1px_2px_rgba(15,23,42,0.08)] transition hover:opacity-95 sm:w-auto sm:min-w-[12rem]"
          >
            <BookOpen className="h-4 w-4 shrink-0" aria-hidden />
            {reviewLabel}
          </button>
        ) : null}
        <Link
          href={returnHref}
          className={cn(
            "inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--color-border)]/80 bg-[var(--color-surface-elevated)] px-5 py-3 text-sm font-semibold text-[var(--color-ink)] transition hover:border-[var(--color-accent)]/35 sm:w-auto sm:min-w-[12rem]",
            !onReview && "border-transparent bg-[var(--color-accent)] text-white hover:opacity-95"
          )}
        >
          <LayoutGrid className="h-4 w-4 shrink-0" aria-hidden />
          Back to {returnLabel}
        </Link>
      </div>

      {extraActions ? <div className="mt-4 flex flex-wrap justify-center gap-2">{extraActions}</div> : null}
    </div>
  );
}
