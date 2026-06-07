"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { formatHms } from "@/lib/full-exam/config";
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
  borderClass: string;
  pulse: boolean;
};

function getTimerVisuals(
  remainingSec: number,
  totalSec: number,
  timed: boolean
): TimerVisuals {
  if (!timed || totalSec <= 0) {
    return {
      textClass: "text-teal-700",
      borderClass: "border-teal-200/80 bg-teal-50/90",
      pulse: false,
    };
  }

  const pulse = remainingSec <= 600;

  if (remainingSec <= 300) {
    return {
      textClass: "text-rose-700",
      borderClass: "border-rose-200/80 bg-rose-50/90",
      pulse,
    };
  }
  if (remainingSec <= 900) {
    return {
      textClass: "text-amber-700",
      borderClass: "border-amber-200/80 bg-amber-50/90",
      pulse,
    };
  }
  return {
    textClass: "text-emerald-700",
    borderClass: "border-emerald-200/80 bg-emerald-50/90",
    pulse: false,
  };
}

/** Compact exam clock — time only, no progress ring. */
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
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={() => setHidden(false)}
        className={cn(
          "fixed z-[90] flex h-9 items-center gap-1.5 rounded-full border border-white/60 bg-white/90 px-3 text-xs font-medium text-slate-600 shadow-md backdrop-blur-md",
          "top-[calc(var(--nav-height)+0.5rem)] right-3 sm:right-4",
          className
        )}
        aria-label="Show exam timer"
        title="Show timer (T)"
      >
        <Clock className="h-3.5 w-3.5" aria-hidden />
        Show timer
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "fixed z-[90] select-none rounded-xl border px-3 py-2 shadow-md backdrop-blur-md",
        visuals.borderClass,
        "top-[calc(var(--nav-height)+0.5rem)] right-3 sm:right-4",
        paused && "opacity-85",
        className
      )}
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="flex items-center gap-2">
        <Clock className={cn("h-4 w-4 shrink-0", visuals.textClass)} aria-hidden />
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            {timed ? "Time left" : "Elapsed"}
          </p>
          <p
            className={cn(
              "font-mono text-lg font-bold tabular-nums leading-none sm:text-xl",
              visuals.textClass,
              visuals.pulse && !paused && "animate-pulse"
            )}
          >
            {formatHms(displaySec)}
          </p>
        </div>
      </div>
      <p className="mt-1 text-center text-[10px] tabular-nums text-slate-500">
        {questionsCompleted}/{questionsTotal} answered
        {paused ? " · Paused" : ""}
      </p>
    </motion.div>
  );
}
