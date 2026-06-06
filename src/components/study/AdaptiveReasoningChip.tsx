"use client";

import { useState } from "react";
import { Brain, ChevronDown } from "lucide-react";

type Props = {
  reasoning: string;
  sessionRationale?: string;
  questionIndex?: number;
  total?: number;
};

export function AdaptiveReasoningChip({
  reasoning,
  sessionRationale,
  questionIndex,
  total,
}: Props) {
  const [open, setOpen] = useState(false);

  if (!reasoning && !sessionRationale) return null;

  return (
    <div className="mb-4 rounded-xl border border-teal-200/70 bg-gradient-to-r from-teal-50/80 to-cyan-50/50">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-teal-800">
          <Brain className="h-4 w-4 shrink-0" aria-hidden />
          Why this question?
          {questionIndex != null && total != null && (
            <span className="font-normal text-teal-600/80">
              ({questionIndex + 1}/{total})
            </span>
          )}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-teal-600 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      {open && (
        <div className="border-t border-teal-100/80 px-4 py-3 text-sm leading-relaxed text-slate-700">
          <p>{reasoning}</p>
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
