"use client";

import { Target } from "lucide-react";
import {
  PRACTICE_PROGRESS_HINT,
  PRACTICE_PROGRESS_LABEL,
  PROGRESS_METRICS_DISCLAIMER,
} from "@/lib/site";
import {
  catAbilityToPracticePct,
  catStopReasonLabel,
} from "@/lib/questions/cat-select";
import type { FullExamCatOutcome } from "@/types/full-exam";
import { feUi } from "@/lib/study/full-exam-ui";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

type Props = {
  catOutcome: FullExamCatOutcome;
};

export function FullExamCatPracticeBand({ catOutcome }: Props) {
  const practicePct = catAbilityToPracticePct(catOutcome.ability);
  const stopLabel = catStopReasonLabel(catOutcome.stopReason);
  const answered = catOutcome.correctCount + catOutcome.incorrectCount;

  return (
    <section
      aria-labelledby="cat-practice-band-heading"
      className={cn(feUi.panel, "p-5 sm:p-6")}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-teal-500/10">
          <Target className="h-5 w-5 text-teal-700" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-teal-800">
            Practice CAT · not a pass predictor
          </p>
          <h2 id="cat-practice-band-heading" className={feUi.sectionTitle}>
            {catOutcome.practiceBand.label}
          </h2>
          <p className={cn(feUi.sectionHint, "mt-1")}>{catOutcome.practiceBand.hint}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-black/[0.06] bg-[var(--color-surface)] px-3 py-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
            Answered
          </p>
          <p className="mt-0.5 text-sm font-semibold tabular-nums text-[var(--color-ink)]">
            {answered} / up to 145
          </p>
        </div>
        <div className="rounded-xl border border-black/[0.06] bg-[var(--color-surface)] px-3 py-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
            Accuracy
          </p>
          <p className="mt-0.5 text-sm font-semibold tabular-nums text-[var(--color-ink)]">
            {answered > 0
              ? `${Math.round((catOutcome.correctCount / answered) * 100)}%`
              : "—"}
          </p>
        </div>
        <div className="rounded-xl border border-black/[0.06] bg-[var(--color-surface)] px-3 py-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
            Stop
          </p>
          <p className="mt-0.5 text-sm font-semibold text-[var(--color-ink)]">
            {stopLabel ?? "Session ended"}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold text-[var(--color-ink)]">
            {PRACTICE_PROGRESS_LABEL}
          </p>
          <p className="text-xs font-semibold tabular-nums text-[var(--color-ink)]">
            {practicePct}%
          </p>
        </div>
        <Progress value={practicePct} className="mt-1.5 h-1.5 rounded-full bg-black/[0.06]" />
        <p className="mt-1.5 text-[11px] text-[var(--color-ink-muted)]">{PRACTICE_PROGRESS_HINT}</p>
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-[var(--color-ink-muted)]">
        {PROGRESS_METRICS_DISCLAIMER}
      </p>
    </section>
  );
}
