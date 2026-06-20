"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { QuestionBankPace, QuestionBankStyle } from "@/lib/exam/modes";
import { qbUi } from "@/lib/study/question-bank-ui";
import { cn } from "@/lib/utils";

type Props = {
  topicLabel: string;
  questionCount: number;
  pace: QuestionBankPace;
  bankStyle: QuestionBankStyle;
  estimatedMinutes: number;
  availableCount: number | null;
  validationMessage?: string;
  loading: boolean;
  disabled: boolean;
  onStart: () => void;
  isTimedExam?: boolean;
  timedCount?: number;
  timedMinutes?: number;
};

function styleLabel(style: QuestionBankStyle): string {
  if (style === "adaptive") return "Adaptive";
  if (style === "weak_areas") return "Weak areas";
  return "Standard";
}

export function QuestionBankSessionPreview({
  topicLabel,
  questionCount,
  pace,
  bankStyle,
  estimatedMinutes,
  availableCount,
  validationMessage,
  loading,
  disabled,
  onStart,
  isTimedExam,
  timedCount,
  timedMinutes,
}: Props) {
  const startLabel = loading
    ? "Loading…"
    : isTimedExam
      ? `Start timed exam · ${timedCount ?? questionCount} questions`
      : bankStyle === "adaptive"
        ? `Start adaptive · ${questionCount} questions`
        : bankStyle === "weak_areas"
          ? `Start weak-area drill · ${questionCount} questions`
          : `Start ${pace} practice · ${questionCount} questions`;

  return (
    <div className={qbUi.startBar}>
      <div className="space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-3 px-0.5">
          <div className="min-w-0 space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-ink-muted)]">
              Session preview
            </p>
            <p className="truncate text-[15px] font-semibold text-[var(--color-ink)]">{topicLabel}</p>
            <p className="text-[12px] text-[var(--color-ink-muted)]">
              {isTimedExam ? (
                <>
                  {timedCount?.toLocaleString()} questions
                  {typeof timedMinutes === "number" ? ` · ~${timedMinutes} min` : null}
                </>
              ) : (
                <>
                  {questionCount} questions · {styleLabel(bankStyle)} · {pace === "timed" ? "Timed" : "Untimed"}
                  {` · ~${estimatedMinutes} min`}
                </>
              )}
            </p>
            {typeof availableCount === "number" && !isTimedExam ? (
              <p className="text-[11px] tabular-nums text-[var(--color-ink-muted)]">
                {availableCount.toLocaleString()} available in pool
              </p>
            ) : null}
          </div>
        </div>

        {validationMessage ? (
          <div
            className={cn(
              "flex items-start gap-2 rounded-[14px] border px-3 py-2.5 text-[12px]",
              "border-amber-200/80 bg-amber-500/8 text-amber-950 dark:text-amber-100"
            )}
            role="alert"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <span>{validationMessage}</span>
          </div>
        ) : null}

        <Button
          type="button"
          disabled={disabled || loading}
          className={qbUi.startBtn}
          onClick={onStart}
        >
          {startLabel}
        </Button>
      </div>
    </div>
  );
}
