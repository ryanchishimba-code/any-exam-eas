"use client";

import { useState } from "react";
import { Brain, ChevronDown } from "lucide-react";
import { reviewIncorrectPosition } from "@/lib/study/review-incorrect-queue-label";

/** Question-specific reason, or null when the line is generic. */
export function specificQuestionReason(reasoning: string | null | undefined): string | null {
  const text = reasoning?.trim() ?? "";
  if (!text || /adaptive selection based on your weak areas/i.test(text)) return null;
  if (/missed before|previously missed|answered incorrectly/i.test(text)) return "Missed before";
  if (/due for review|spaced repetition/i.test(text)) return "Due for review";
  if (/weak area|topic gap/i.test(text)) return "Weak area";
  if (/unseen|new topic|broadens coverage/i.test(text)) return "New topic";
  return null;
}

type Props = {
  reasoning: string;
  sessionRationale?: string;
  questionIndex?: number;
  total?: number;
  /** Full open-remediation queue when this sitting is a capped slice of it. */
  openTotal?: number | null;
};

export function AdaptiveReasoningChip({
  reasoning,
  sessionRationale,
  questionIndex,
  total,
  openTotal,
}: Props) {
  const [open, setOpen] = useState(false);

  const specific = specificQuestionReason(reasoning);
  if (!specific) return null;

  const position =
    questionIndex != null && total != null
      ? reviewIncorrectPosition({ index: questionIndex, sittingSize: total, openTotal })
      : null;

  return (
    <div className="mb-4 rounded-xl border border-teal-200/70 bg-gradient-to-r from-teal-50/80 to-cyan-50/50">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
        aria-expanded={open}
      >
        <span className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-0.5 text-left text-sm font-semibold text-teal-800">
          <Brain className="h-4 w-4 shrink-0" aria-hidden />
          <span className="whitespace-normal">Why this question</span>
          <span className="whitespace-normal font-medium text-teal-900">{reasoning.trim()}</span>
          {position ? (
            <span className="inline-flex items-center gap-1.5 font-normal tabular-nums">
              <span className="text-teal-600/80">{position.sitting}</span>
              {position.openLabel ? (
                <span className="font-medium text-teal-800">· {position.openLabel}</span>
              ) : null}
            </span>
          ) : null}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-teal-600 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      {open && (
        <div className="border-t border-teal-100/80 px-4 py-3 text-sm leading-relaxed text-slate-700">
          <p className="whitespace-normal">{reasoning.trim()}</p>
          {sessionRationale && (
            <p className="mt-2 text-xs text-slate-500">
              <span className="font-semibold text-teal-700">Session plan: </span>
              {sessionRationale}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
