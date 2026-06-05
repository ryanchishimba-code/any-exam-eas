"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, X } from "lucide-react";
import {
  clearActivitySessionSummary,
  readActivitySessionSummary,
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
    const stored = readActivitySessionSummary();
    if (stored) setSummary(stored);
  }, [searchParams]);

  if (!summary) return null;

  function dismiss() {
    clearActivitySessionSummary();
    setSummary(null);
    const url = new URL(window.location.href);
    url.searchParams.delete("session");
    window.history.replaceState({}, "", url.pathname + url.hash);
  }

  const unanswered =
    summary.answered != null && summary.total != null
      ? Math.max(0, summary.total - summary.answered)
      : null;

  const showQuizStats =
    summary.activityType === "exam" ||
    summary.activityType === "practice" ||
    summary.activityType === "cat";

  return (
    <section
      className="rounded-2xl border border-sky-200/80 bg-gradient-to-br from-sky-50 via-white to-indigo-50/40 p-5 shadow-sm"
      aria-labelledby="session-summary-heading"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-700">
            <CheckCircle2 className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <h2 id="session-summary-heading" className="text-base font-semibold text-slate-900">
              Progress saved
            </h2>
            <p className="mt-0.5 text-sm text-slate-600">
              {endedEarlyCopy(summary)}
              Summary for <span className="font-medium">{summary.title}</span>.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label="Dismiss session summary"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {showQuizStats && summary.answered != null && summary.total != null && (
          <div className="rounded-xl border border-white/80 bg-white/80 px-4 py-3">
            <dt className="text-[0.6875rem] font-semibold uppercase tracking-wide text-slate-500">
              Answered
            </dt>
            <dd className="mt-1 text-lg font-semibold tabular-nums text-slate-900">
              {summary.answered} / {summary.total}
            </dd>
          </div>
        )}
        {showQuizStats && summary.correct != null && summary.accuracy != null && (
          <div className="rounded-xl border border-white/80 bg-white/80 px-4 py-3">
            <dt className="text-[0.6875rem] font-semibold uppercase tracking-wide text-slate-500">
              Correct
            </dt>
            <dd className="mt-1 text-lg font-semibold tabular-nums text-slate-900">
              {summary.correct}
              <span className="ml-1 text-sm font-medium text-slate-500">
                ({summary.accuracy}%)
              </span>
            </dd>
          </div>
        )}
        {unanswered != null && unanswered > 0 && (
          <div className="rounded-xl border border-white/80 bg-white/80 px-4 py-3">
            <dt className="text-[0.6875rem] font-semibold uppercase tracking-wide text-slate-500">
              Unanswered
            </dt>
            <dd className="mt-1 text-lg font-semibold tabular-nums text-slate-900">
              {unanswered}
            </dd>
          </div>
        )}
        {summary.activityType === "drugs" && (
          <>
            {summary.reviewed != null && (
              <div className="rounded-xl border border-white/80 bg-white/80 px-4 py-3">
                <dt className="text-[0.6875rem] font-semibold uppercase tracking-wide text-slate-500">
                  Reviewed
                </dt>
                <dd className="mt-1 text-lg font-semibold tabular-nums text-slate-900">
                  {summary.reviewed}
                </dd>
              </div>
            )}
            {summary.mastered != null && summary.total != null && (
              <div className="rounded-xl border border-white/80 bg-white/80 px-4 py-3">
                <dt className="text-[0.6875rem] font-semibold uppercase tracking-wide text-slate-500">
                  Mastered
                </dt>
                <dd className="mt-1 text-lg font-semibold tabular-nums text-slate-900">
                  {summary.mastered} / {summary.total}
                </dd>
              </div>
            )}
          </>
        )}
        {summary.activityType === "quilt" && summary.mastered != null && summary.total != null && (
          <div className="rounded-xl border border-white/80 bg-white/80 px-4 py-3">
            <dt className="text-[0.6875rem] font-semibold uppercase tracking-wide text-slate-500">
              Tiles mastered
            </dt>
            <dd className="mt-1 text-lg font-semibold tabular-nums text-slate-900">
              {summary.mastered} / {summary.total}
            </dd>
          </div>
        )}
        {summary.progressPct != null && (
          <div className="rounded-xl border border-white/80 bg-white/80 px-4 py-3">
            <dt className="text-[0.6875rem] font-semibold uppercase tracking-wide text-slate-500">
              Progress
            </dt>
            <dd className="mt-1 text-lg font-semibold tabular-nums text-slate-900">
              {summary.progressPct}%
            </dd>
          </div>
        )}
        {summary.timed && summary.timeRemainingSec != null && (
          <div className="rounded-xl border border-white/80 bg-white/80 px-4 py-3">
            <dt className="text-[0.6875rem] font-semibold uppercase tracking-wide text-slate-500">
              Time left
            </dt>
            <dd className="mt-1 text-lg font-semibold tabular-nums text-slate-900">
              {formatTime(summary.timeRemainingSec)}
            </dd>
          </div>
        )}
        {summary.flaggedCount != null && summary.flaggedCount > 0 && (
          <div className="rounded-xl border border-white/80 bg-white/80 px-4 py-3">
            <dt className="text-[0.6875rem] font-semibold uppercase tracking-wide text-slate-500">
              Flagged
            </dt>
            <dd className="mt-1 text-lg font-semibold tabular-nums text-slate-900">
              {summary.flaggedCount}
            </dd>
          </div>
        )}
        {summary.mode && (
          <div className="rounded-xl border border-white/80 bg-white/80 px-4 py-3">
            <dt className="text-[0.6875rem] font-semibold uppercase tracking-wide text-slate-500">
              Mode
            </dt>
            <dd className="mt-1 text-sm font-semibold capitalize text-slate-900">
              {summary.mode.replace(/_/g, " ")}
            </dd>
          </div>
        )}
      </dl>
    </section>
  );
}
