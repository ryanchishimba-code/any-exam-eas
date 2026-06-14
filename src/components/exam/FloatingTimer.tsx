"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { formatHms } from "@/lib/full-exam/config";
import { feUi } from "@/lib/study/full-exam-ui";
import { cn } from "@/lib/utils";

export type FloatingTimerProps = {
  totalSec: number;
  remainingSec: number;
  elapsedSec: number;
  timed: boolean;
  paused: boolean;
  questionsCompleted: number;
  questionsTotal: number;
  className?: string;
};

type TimerVisuals = {
  textClass: string;
  ringClass: string;
  pulse: boolean;
};

function getTimerVisuals(remainingSec: number, totalSec: number, timed: boolean): TimerVisuals {
  if (!timed || totalSec <= 0) {
    return {
      textClass: "text-[var(--color-accent)]",
      ringClass: "border-[var(--color-accent)]/20",
      pulse: false,
    };
  }
  const pulse = remainingSec <= 600;
  if (remainingSec <= 300) {
    return { textClass: "text-rose-600", ringClass: "border-rose-200", pulse };
  }
  if (remainingSec <= 900) {
    return { textClass: "text-amber-600", ringClass: "border-amber-200", pulse };
  }
  return { textClass: "text-emerald-600", ringClass: "border-emerald-200", pulse: false };
}

/** Compact exam clock — pill style, hide with T key. */
export function FloatingTimer({
  remainingSec,
  elapsedSec,
  timed,
  paused,
  questionsCompleted,
  questionsTotal,
  totalSec,
  className,
}: FloatingTimerProps) {
  const [hidden, setHidden] = useState(false);
  const displaySec = timed ? remainingSec : elapsedSec;
  const visuals = getTimerVisuals(remainingSec, totalSec, timed);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key === "t" || e.key === "T") {
        e.preventDefault();
        setHidden((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (hidden) {
    return (
      <motion.button
        type="button"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={() => setHidden(false)}
        className={cn(
          feUi.timerPill,
          "top-[calc(var(--nav-height)+0.5rem)] right-3 sm:right-4",
          "flex h-9 items-center gap-1.5 px-3 text-[12px] font-semibold text-[var(--color-ink-muted)]",
          className
        )}
        aria-label="Show exam timer"
        title="Show timer (T)"
      >
        <Clock className="h-3.5 w-3.5" aria-hidden />
        Timer
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        feUi.timerPill,
        "top-[calc(var(--nav-height)+0.5rem)] right-3 sm:right-4",
        "border",
        visuals.ringClass,
        paused && "opacity-80",
        className
      )}
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="flex items-center gap-2.5">
        <Clock className={cn("h-4 w-4 shrink-0", visuals.textClass)} aria-hidden />
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
            {timed ? "Time left" : "Elapsed"}
          </p>
          <p
            className={cn(
              "font-mono text-[17px] font-bold tabular-nums leading-none",
              visuals.textClass,
              visuals.pulse && !paused && "animate-pulse"
            )}
          >
            {formatHms(displaySec)}
          </p>
        </div>
      </div>
      <p className="mt-1 border-t border-black/[0.05] pt-1 text-center text-[10px] tabular-nums text-[var(--color-ink-muted)]">
        {questionsCompleted}/{questionsTotal} answered
        {paused ? " · Paused" : ""}
      </p>
    </motion.div>
  );
}
