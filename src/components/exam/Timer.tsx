"use client";

import { ChevronDown, ChevronUp, Clock, Pause, Play } from "lucide-react";
import { formatMmSs } from "@/lib/full-exam/config";
import { cn } from "@/lib/utils";

export type ExamTimerProps = {
  /** Total allotted seconds (0 = untimed). */
  totalSec: number;
  remainingSec: number;
  elapsedSec: number;
  timed: boolean;
  paused: boolean;
  questionsCompleted: number;
  questionsTotal: number;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  allowPause?: boolean;
  className?: string;
};

function timerColor(remainingSec: number, totalSec: number, timed: boolean): string {
  if (!timed || totalSec <= 0) return "text-teal-600";
  const ratio = remainingSec / totalSec;
  if (remainingSec <= 600) return "text-rose-600";
  if (ratio <= 0.25) return "text-amber-600";
  return "text-teal-600";
}

function ringColor(remainingSec: number, totalSec: number, timed: boolean): string {
  if (!timed || totalSec <= 0) return "stroke-teal-500";
  if (remainingSec <= 600) return "stroke-rose-500";
  if (remainingSec / totalSec <= 0.25) return "stroke-amber-500";
  return "stroke-teal-500";
}

export function Timer({
  totalSec,
  remainingSec,
  elapsedSec,
  timed,
  paused,
  questionsCompleted,
  questionsTotal,
  collapsed,
  onToggleCollapse,
  onPause,
  onResume,
  allowPause = true,
  className,
}: ExamTimerProps) {
  const displaySec = timed ? remainingSec : elapsedSec;
  const progressPct = timed && totalSec > 0 ? (remainingSec / totalSec) * 100 : 100;
  const color = timerColor(remainingSec, totalSec, timed);
  const ring = ringColor(remainingSec, totalSec, timed);
  const circumference = 2 * Math.PI * 42;
  const dashOffset = circumference - (progressPct / 100) * circumference;

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={onToggleCollapse}
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold shadow-sm transition hover:border-teal-300",
          className
        )}
        aria-label="Show timer"
      >
        <Clock className="h-4 w-4 text-teal-600" aria-hidden />
        <span className={cn("font-mono tabular-nums", color)}>{formatMmSs(displaySec)}</span>
        <ChevronDown className="h-4 w-4 text-slate-400" aria-hidden />
      </button>
    );
  }

  return (
    <div className={cn("rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm", className)}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {timed ? "Time remaining" : "Elapsed"}
        </p>
        {onToggleCollapse ? (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 md:hidden"
            aria-label="Hide timer"
          >
            <ChevronUp className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      <div className="relative mx-auto mt-3 flex h-28 w-28 items-center justify-center">
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100" aria-hidden>
          <circle cx="50" cy="50" r="42" fill="none" className="stroke-slate-100" strokeWidth="6" />
          {timed ? (
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              className={cn(ring, "transition-all duration-1000")}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
            />
          ) : null}
        </svg>
        <span className={cn("font-mono text-2xl font-bold tabular-nums", color)}>
          {formatMmSs(displaySec)}
        </span>
      </div>

      {timed && totalSec > 0 ? (
        <p className="mt-2 text-center text-xs text-slate-500">
          of {formatMmSs(totalSec)} total
        </p>
      ) : null}

      <div className="mt-4 rounded-xl bg-slate-50 px-3 py-2 text-center">
        <p className="text-xs text-slate-500">Progress</p>
        <p className="text-sm font-semibold text-slate-800">
          {questionsCompleted} / {questionsTotal} answered
        </p>
      </div>

      {allowPause && timed ? (
        <button
          type="button"
          onClick={paused ? onResume : onPause}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2 text-sm font-medium text-slate-700 transition hover:border-teal-300 hover:bg-teal-50"
        >
          {paused ? (
            <>
              <Play className="h-4 w-4" aria-hidden /> Resume
            </>
          ) : (
            <>
              <Pause className="h-4 w-4" aria-hidden /> Pause
            </>
          )}
        </button>
      ) : null}

      {paused ? (
        <p className="mt-2 text-center text-xs font-medium text-amber-700">Exam paused</p>
      ) : null}
    </div>
  );
}
