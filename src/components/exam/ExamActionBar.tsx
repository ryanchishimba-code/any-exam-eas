"use client";

import { useState } from "react";
import { Square } from "lucide-react";
import { cn } from "@/lib/utils";

type ExamActionBarProps = {
  mode: "exam" | "review";
  onEndExam?: () => void;
  onReturnToReview?: () => void;
  endLabel?: string;
  returnLabel?: string;
  className?: string;
  variant?: "light" | "dark";
};

/** End exam (during session) or return to review (after finishing questions). */
export function ExamActionBar({
  mode,
  onEndExam,
  onReturnToReview,
  endLabel = "End exam",
  returnLabel = "Return to exam review",
  className,
  variant = "light",
}: ExamActionBarProps) {
  const [confirmEnd, setConfirmEnd] = useState(false);

  if (mode === "review" && onReturnToReview) {
    return (
      <button
        type="button"
        onClick={onReturnToReview}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-semibold transition",
          variant === "dark"
            ? "border-white/20 text-slate-200 hover:bg-white/10"
            : "border-slate-200 text-slate-700 hover:bg-slate-50",
          className
        )}
      >
        {returnLabel}
      </button>
    );
  }

  if (mode !== "exam" || !onEndExam) return null;

  if (confirmEnd) {
    return (
      <div
        className={cn(
          "flex flex-wrap items-center gap-2 rounded-xl border px-3 py-2",
          variant === "dark"
            ? "border-rose-500/40 bg-rose-950/40"
            : "border-rose-200 bg-rose-50"
        )}
      >
        <span
          className={cn(
            "text-xs font-medium",
            variant === "dark" ? "text-rose-200" : "text-rose-900"
          )}
        >
          End early? Saved answers will be scored.
        </span>
        <button
          type="button"
          onClick={() => setConfirmEnd(false)}
          className={cn(
            "rounded-lg px-3 py-1.5 text-xs font-semibold",
            variant === "dark"
              ? "border border-white/20 text-slate-200"
              : "border border-slate-200 bg-white text-slate-700"
          )}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => {
            setConfirmEnd(false);
            onEndExam();
          }}
          className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
        >
          {endLabel}
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirmEnd(true)}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-semibold transition",
        variant === "dark"
          ? "border-rose-400/30 text-rose-200 hover:border-rose-400/50 hover:bg-rose-500/10"
          : "border-slate-200 text-slate-700 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-800",
        className
      )}
    >
      <Square className="h-3.5 w-3.5" aria-hidden />
      {endLabel}
    </button>
  );
}
