"use client";

import { AlertCircle, ArrowRight, Loader2 } from "lucide-react";
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
  if (style === "review_incorrect") return "Review incorrect";
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
  return (
    <div className={qbUi.stickyBar}>
      <div className="space-y-3">
        <div className="min-w-0 space-y-1">
          <p className={qbUi.eyebrow}>Session preview</p>
          <p className="truncate text-[14px] font-semibold text-[var(--color-ink)]">{topicLabel}</p>
          <p className={qbUi.sectionHint}>
            {isTimedExam ? (
              <>
                {timedCount?.toLocaleString()} questions
                {typeof timedMinutes === "number" ? ` · ~${timedMinutes} min` : null}
              </>
            ) : (
              <>
                {questionCount} questions · {styleLabel(bankStyle)} ·{" "}
                {pace === "timed" ? "Timed" : "Untimed"} · ~{estimatedMinutes} min
              </>
            )}
          </p>
          {typeof availableCount === "number" && !isTimedExam ? (
            <p className="text-[11px] tabular-nums text-[var(--color-ink-muted)]">
              {availableCount.toLocaleString()} available in pool
            </p>
          ) : null}
        </div>

        {validationMessage ? (
          <div
            className={cn(
              "flex items-start gap-2 rounded-xl border border-amber-200/60 bg-amber-500/6 px-3 py-2.5 text-[12px] text-amber-950"
            )}
            role="alert"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <span>{validationMessage}</span>
          </div>
        ) : null}

        <button
          type="button"
          disabled={disabled || loading}
          className={cn(qbUi.primaryBtn, loading && "opacity-90")}
          onClick={onStart}
        >
          {loading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
              Preparing session…
            </>
          ) : (
            <>
              {isTimedExam
                ? `Start timed exam · ${timedCount ?? questionCount} questions`
                : bankStyle === "adaptive"
                  ? `Start adaptive · ${questionCount} questions`
                  : bankStyle === "weak_areas"
                    ? `Start weak-area drill · ${questionCount} questions`
                    : bankStyle === "review_incorrect"
                      ? `Review incorrect · ${questionCount} questions`
                      : `Start ${pace} practice · ${questionCount} questions`}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
