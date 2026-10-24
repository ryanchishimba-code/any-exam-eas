"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { boardAccentPillClass } from "@/lib/marketing/board-accent";
import type { ExamSlug } from "@/types/edtech";
import {
  trialStartHereFullMockHref,
  trialStartHerePracticeHref,
  type TrialStartHereRecord,
} from "@/lib/trial/trial-start-here";

type Props = {
  examSlug: ExamSlug;
  boardName: string;
  fieldId: string;
  record: TrialStartHereRecord | null;
  step: 1 | 2 | 3;
  questionsAnswered: number;
  accuracyPct: number;
  reviewIncorrectHref: string | null;
};

async function persistStatus(
  status: TrialStartHereRecord["status"],
  step: number,
  examSlug: ExamSlug
): Promise<void> {
  await fetch("/api/me/trial-start-here", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, step, examSlug }),
  });
}

export function TrialStartHerePath({
  examSlug,
  boardName,
  fieldId,
  record,
  step,
  questionsAnswered,
  accuracyPct,
  reviewIncorrectHref,
}: Props) {
  const [hidden, setHidden] = useState(false);
  const pillClass = boardAccentPillClass(examSlug);
  const practiceHref = trialStartHerePracticeHref(examSlug, fieldId);
  const mockHref = trialStartHereFullMockHref(examSlug, fieldId);
  const mockStepReady = step >= 3 || record?.status === "practice_done";

  const dismiss = useCallback(async () => {
    setHidden(true);
    await persistStatus("dismissed", step, examSlug);
  }, [examSlug, step]);

  const complete = useCallback(async () => {
    setHidden(true);
    await persistStatus("completed", 3, examSlug);
  }, [examSlug]);

  const startPractice = useCallback(async () => {
    await persistStatus("active", 1, examSlug);
  }, [examSlug]);

  if (hidden) return null;

  return (
    <section
      className="relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4 sm:p-5"
      aria-label="Start here"
    >
      <button
        type="button"
        onClick={() => void dismiss()}
        className="absolute right-3 top-3 rounded-lg p-1.5 text-[var(--color-ink-muted)] hover:bg-[var(--color-border)]/40 hover:text-[var(--color-ink)]"
        aria-label="Dismiss Start here"
      >
        <X className="h-4 w-4" aria-hidden />
      </button>

      <div className="flex items-start gap-2 pr-8">
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-accent)]" aria-hidden />
        <div className="min-w-0 space-y-1">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-accent)]">
            Start here
          </p>
          <h2 className="text-base font-semibold text-[var(--color-ink)]">
            Your first {boardName} session
          </h2>
          <p className="text-[13px] leading-snug text-[var(--color-ink-muted)]">
            Three quick steps — practice, review misses, then try your full adaptive mock.
          </p>
        </div>
      </div>

      <ol className="mt-4 space-y-3" role="list">
        <li
          className={cn(
            "rounded-xl border px-3 py-3",
            step === 1
              ? "border-[color-mix(in_srgb,var(--color-accent)_35%,transparent)] bg-[color-mix(in_srgb,var(--color-accent)_6%,transparent)]"
              : "border-[var(--color-border)]/70"
          )}
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[13px] font-semibold text-[var(--color-ink)]">
                {step > 1 ? (
                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-[var(--color-accent)]" aria-hidden />
                    10-question warm-up
                  </span>
                ) : (
                  "1. 10-question warm-up"
                )}
              </p>
              <p className="mt-0.5 text-[12px] text-[var(--color-ink-muted)]">
                One tap — mixed topics from your {boardName} bank.
              </p>
            </div>
            {step === 1 ? (
              <Link
                href={practiceHref}
                onClick={() => void startPractice()}
                className={cn(
                  pillClass,
                  "inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-semibold text-white"
                )}
              >
                Start 10 questions
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            ) : null}
          </div>
        </li>

        <li
          className={cn(
            "rounded-xl border px-3 py-3",
            step === 2
              ? "border-[color-mix(in_srgb,var(--color-accent)_35%,transparent)] bg-[color-mix(in_srgb,var(--color-accent)_6%,transparent)]"
              : "border-[var(--color-border)]/70",
            step < 2 && "opacity-60"
          )}
        >
          <p className="text-[13px] font-semibold text-[var(--color-ink)]">2. Your results</p>
          {step >= 2 ? (
            <div className="mt-2 space-y-2 text-[13px] text-[var(--color-ink-muted)]">
              <p>
                <span className="font-semibold text-[var(--color-ink)]">{questionsAnswered}</span>{" "}
                questions answered ·{" "}
                <span className="font-semibold text-[var(--color-ink)]">{accuracyPct}%</span>{" "}
                accuracy (last 30 days on this board).
              </p>
              {reviewIncorrectHref ? (
                <Link
                  href={reviewIncorrectHref}
                  className="inline-flex font-semibold text-[var(--color-accent)] hover:underline"
                  onClick={() => void persistStatus("practice_done", 2, examSlug)}
                >
                  Review what you missed
                </Link>
              ) : (
                <p>Finish your first block to see misses here.</p>
              )}
            </div>
          ) : (
            <p className="mt-1 text-[12px] text-[var(--color-ink-muted)]">
              We will surface misses and accuracy after your warm-up.
            </p>
          )}
        </li>

        <li
          className={cn(
            "rounded-xl border px-3 py-3",
            mockStepReady
              ? "border-[color-mix(in_srgb,var(--color-accent)_35%,transparent)] bg-[color-mix(in_srgb,var(--color-accent)_6%,transparent)]"
              : "border-[var(--color-border)]/70",
            !mockStepReady && "opacity-60"
          )}
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[13px] font-semibold text-[var(--color-ink)]">
                3. Full adaptive mock
              </p>
              <p className="mt-0.5 text-[12px] text-[var(--color-ink-muted)]">
                Your trial includes one full-length adaptive mock for {boardName}.
              </p>
            </div>
            {mockStepReady ? (
              <div className="flex flex-wrap gap-2">
                <Link
                  href={mockHref}
                  className={cn(
                    pillClass,
                    "inline-flex items-center justify-center rounded-full px-4 py-2 text-[13px] font-semibold text-white"
                  )}
                >
                  Open adaptive mock
                </Link>
                <button
                  type="button"
                  onClick={() => void complete()}
                  className="rounded-full border border-[var(--color-border)] px-4 py-2 text-[13px] font-semibold text-[var(--color-ink)]"
                >
                  Done
                </button>
              </div>
            ) : null}
          </div>
        </li>
      </ol>

    </section>
  );
}
