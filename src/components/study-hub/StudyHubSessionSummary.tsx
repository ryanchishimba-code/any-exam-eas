"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, X } from "lucide-react";
import { dbUi } from "@/lib/study/dashboard-ui";
import {
  activitySummaryFromSearchParams,
  clearActivitySessionSummary,
  mergeActivitySummary,
  readActivitySessionSummary,
  receiptQueryKeys,
  type ActivitySessionSummary,
} from "@/lib/client/exam-session-summary";

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function endedEarlyCopy(summary: ActivitySessionSummary): string {
  if (!summary.endedEarly) return "";
  return summary.activityType === "exam"
    ? "You ended the exam early. "
    : "You ended the activity early. ";
}

export function StudyHubSessionSummary() {
  const searchParams = useSearchParams();
  const [summary, setSummary] = useState<ActivitySessionSummary | null>(null);

  useEffect(() => {
    if (searchParams.get("session") !== "ended") return;
    const merged = mergeActivitySummary(
      readActivitySessionSummary(),
      activitySummaryFromSearchParams(searchParams)
    );
    if (merged) setSummary(merged);
  }, [searchParams]);

  if (!summary) return null;

  function dismiss() {
    clearActivitySessionSummary();
    setSummary(null);
    const url = new URL(window.location.href);
    for (const key of receiptQueryKeys()) url.searchParams.delete(key);
    const next = url.searchParams.toString();
    window.history.replaceState({}, "", next ? `${url.pathname}?${next}${url.hash}` : url.pathname + url.hash);
  }

  const unanswered =
    summary.answered != null && summary.total != null
      ? Math.max(0, summary.total - summary.answered)
      : null;

  const practiceReceipt = summary.attemptsSaved != null;

  const showQuizStats =
    summary.activityType === "exam" ||
    summary.activityType === "practice" ||
    summary.activityType === "cat";

  const hasExtraStats =
    (showQuizStats && !practiceReceipt && summary.answered != null && summary.total != null) ||
    (showQuizStats && !practiceReceipt && summary.correct != null && summary.accuracy != null) ||
    (unanswered != null && unanswered > 0) ||
    (summary.activityType === "drugs" &&
      (summary.reviewed != null || (summary.mastered != null && summary.total != null))) ||
    (summary.activityType === "quilt" && summary.mastered != null && summary.total != null) ||
    summary.progressPct != null ||
    (Boolean(summary.timed) && summary.timeRemainingSec != null) ||
    (summary.flaggedCount != null && summary.flaggedCount > 0) ||
    Boolean(summary.mode);

  const statClass =
    "rounded-2xl border border-[var(--db-line,var(--color-border))]/80 bg-[var(--color-surface)]/50 px-4 py-3.5";
  const statLabel = dbUi.eyebrow;
  const statValue =
    "mt-1.5 text-[22px] font-semibold tracking-[-0.03em] tabular-nums text-[var(--color-ink)]";

  return (
    <section className={`${dbUi.heroSurface} mb-5 sm:mb-6`} aria-labelledby="session-summary-heading">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className={`${dbUi.eyebrow} inline-flex items-center gap-1.5`}>
            <CheckCircle2 className="h-3.5 w-3.5 text-[var(--color-accent)]" aria-hidden />
            {practiceReceipt ? "Session receipt" : "Saved"}
          </p>
          <h2
            id="session-summary-heading"
            className="mt-1 text-[22px] font-semibold tracking-[-0.03em] text-[var(--color-ink)] sm:text-[26px]"
          >
            {practiceReceipt ? `${summary.attemptsSaved} attempts saved` : "Progress saved"}
          </h2>
          <p className={`${dbUi.subtitle} mt-2`}>
            {endedEarlyCopy(summary)}
            {practiceReceipt ? (
              <>
                {summary.accuracy != null ? (
                  <>
                    {summary.accuracy}% accuracy
                    {summary.correct != null ? ` (${summary.correct} correct)` : ""}
                  </>
                ) : (
                  "Saved to this board"
                )}
                {summary.studyStreakDays != null ? ` · ${summary.studyStreakDays}d study streak` : ""}.
              </>
            ) : (
              <>
                Summary for <span className="font-medium text-[var(--color-ink)]">{summary.title}</span>.
              </>
            )}
          </p>
          {summary.weakTopicLabels && summary.weakTopicLabels.length > 0 ? (
            <p className="mt-2 text-[13px] leading-relaxed text-[var(--color-ink-muted)]">
              Weak topics touched: {summary.weakTopicLabels.join(", ")}
            </p>
          ) : practiceReceipt ? (
            <p className="mt-2 text-[13px] leading-relaxed text-[var(--color-ink-muted)]">
              No missed topics in this session.
            </p>
          ) : null}
          {summary.reviewIncorrectHref || summary.analyticsHref ? (
            <div className="mt-5 flex flex-col items-start gap-2.5 sm:flex-row sm:flex-wrap sm:items-center">
              {summary.reviewIncorrectHref ? (
                <Link href={summary.reviewIncorrectHref} className={dbUi.primaryBtn}>
                  Review incorrect
                </Link>
              ) : null}
              {summary.analyticsHref ? (
                <Link href={summary.analyticsHref} className={dbUi.ghostBtn}>
                  View analytics
                </Link>
              ) : null}
            </div>
          ) : null}
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="rounded-xl p-2 text-[var(--color-ink-muted)] transition hover:bg-[var(--color-surface)] hover:text-[var(--color-ink)]"
          aria-label="Dismiss session summary"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {hasExtraStats ? (
      <dl className="mt-6 grid gap-3 border-t border-[var(--color-border)]/45 pt-5 sm:grid-cols-2 lg:grid-cols-4">
        {showQuizStats && !practiceReceipt && summary.answered != null && summary.total != null && (
          <div className={statClass}>
            <dt className={statLabel}>Answered</dt>
            <dd className={statValue}>
              {summary.answered} / {summary.total}
            </dd>
          </div>
        )}
        {showQuizStats && !practiceReceipt && summary.correct != null && summary.accuracy != null && (
          <div className={statClass}>
            <dt className={statLabel}>Correct</dt>
            <dd className={statValue}>
              {summary.correct}
              <span className="ml-1 text-[15px] font-medium tracking-normal text-[var(--color-ink-muted)]">
                ({summary.accuracy}%)
              </span>
            </dd>
          </div>
        )}
        {unanswered != null && unanswered > 0 && (
          <div className={statClass}>
            <dt className={statLabel}>Unanswered</dt>
            <dd className={statValue}>{unanswered}</dd>
          </div>
        )}
        {summary.activityType === "drugs" && (
          <>
            {summary.reviewed != null && (
              <div className={statClass}>
                <dt className={statLabel}>Reviewed</dt>
                <dd className={statValue}>{summary.reviewed}</dd>
              </div>
            )}
            {summary.mastered != null && summary.total != null && (
              <div className={statClass}>
                <dt className={statLabel}>Mastered</dt>
                <dd className={statValue}>
                  {summary.mastered} / {summary.total}
                </dd>
              </div>
            )}
          </>
        )}
        {summary.activityType === "quilt" && summary.mastered != null && summary.total != null && (
          <div className={statClass}>
            <dt className={statLabel}>Tiles mastered</dt>
            <dd className={statValue}>
              {summary.mastered} / {summary.total}
            </dd>
          </div>
        )}
        {summary.progressPct != null && (
          <div className={statClass}>
            <dt className={statLabel}>Progress</dt>
            <dd className={statValue}>{summary.progressPct}%</dd>
          </div>
        )}
        {summary.timed && summary.timeRemainingSec != null && (
          <div className={statClass}>
            <dt className={statLabel}>Time left</dt>
            <dd className={statValue}>{formatTime(summary.timeRemainingSec)}</dd>
          </div>
        )}
        {summary.flaggedCount != null && summary.flaggedCount > 0 && (
          <div className={statClass}>
            <dt className={statLabel}>Flagged</dt>
            <dd className={statValue}>{summary.flaggedCount}</dd>
          </div>
        )}
        {summary.mode && (
          <div className={statClass}>
            <dt className={statLabel}>Mode</dt>
            <dd className="mt-1.5 text-[17px] font-semibold capitalize tracking-[-0.02em] text-[var(--color-ink)]">
              {summary.mode.replace(/_/g, " ")}
            </dd>
          </div>
        )}
      </dl>
      ) : null}
    </section>
  );
}
