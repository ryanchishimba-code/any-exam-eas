"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Clock,
  Minimize2,
  Pause,
  Play,
  Square,
  X,
} from "lucide-react";
import { formatMmSs } from "@/lib/full-exam/config";
import { cn } from "@/lib/utils";

export type FloatingTimerProps = {
  totalSec: number;
  remainingSec: number;
  elapsedSec: number;
  timed: boolean;
  paused: boolean;
  questionsCompleted: number;
  questionsTotal: number;
  allowPause?: boolean;
  onPause?: () => void;
  onResume?: () => void;
  onEndExam?: () => void;
  className?: string;
};

type TimerVisuals = {
  textClass: string;
  ringClass: string;
  glowClass: string;
  pulse: boolean;
};

function getTimerVisuals(
  remainingSec: number,
  totalSec: number,
  timed: boolean
): TimerVisuals {
  if (!timed || totalSec <= 0) {
    return {
      textClass: "text-teal-600",
      ringClass: "stroke-teal-500",
      glowClass: "shadow-teal-500/20",
      pulse: false,
    };
  }

  const pulse = remainingSec <= 600;

  if (remainingSec <= 300) {
    return {
      textClass: "text-rose-600",
      ringClass: "stroke-rose-500",
      glowClass: "shadow-rose-500/25",
      pulse,
    };
  }
  if (remainingSec <= 900) {
    return {
      textClass: "text-amber-600",
      ringClass: "stroke-amber-500",
      glowClass: "shadow-amber-500/20",
      pulse,
    };
  }
  return {
    textClass: "text-emerald-600",
    ringClass: "stroke-emerald-500",
    glowClass: "shadow-emerald-500/15",
    pulse: false,
  };
}

const RING_RADIUS = 34;
const CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export function FloatingTimer({
  totalSec,
  remainingSec,
  elapsedSec,
  timed,
  paused,
  questionsCompleted,
  questionsTotal,
  allowPause = true,
  onPause,
  onResume,
  onEndExam,
  className,
}: FloatingTimerProps) {
  const popoverId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [endConfirm, setEndConfirm] = useState(false);

  const displaySec = timed ? remainingSec : elapsedSec;
  const progressPct =
    timed && totalSec > 0 ? Math.max(0, Math.min(100, (remainingSec / totalSec) * 100)) : 100;
  const dashOffset = CIRCUMFERENCE - (progressPct / 100) * CIRCUMFERENCE;
  const visuals = getTimerVisuals(remainingSec, totalSec, timed);

  useEffect(() => setMounted(true), []);

  const closePopover = useCallback(() => {
    setPopoverOpen(false);
    setEndConfirm(false);
  }, []);

  useEffect(() => {
    if (!popoverOpen) return;
    function onPointerDown(e: MouseEvent | TouchEvent) {
      const target = e.target as Node;
      if (rootRef.current?.contains(target)) return;
      const popoverEl = document.getElementById(popoverId);
      if (popoverEl?.contains(target)) return;
      closePopover();
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [popoverOpen, closePopover, popoverId]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      if (e.key === "t" || e.key === "T") {
        e.preventDefault();
        setHidden((v) => {
          if (!v) setMinimized(true);
          return !v;
        });
        setPopoverOpen(false);
      }
      if (e.key === "Escape") closePopover();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closePopover]);

  function togglePopover() {
    if (hidden) {
      setHidden(false);
      setMinimized(false);
      return;
    }
    if (minimized) {
      setMinimized(false);
      return;
    }
    setPopoverOpen((v) => !v);
  }

  function handleMinimize(e: React.MouseEvent) {
    e.stopPropagation();
    setMinimized(true);
    setPopoverOpen(false);
    setEndConfirm(false);
  }

  const popover = mounted && popoverOpen ? (
    createPortal(
      <AnimatePresence>
        {popoverOpen ? (
          <motion.div
            id={popoverId}
            role="dialog"
            aria-label="Exam timer options"
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed right-3 top-[calc(var(--nav-height)+5.25rem)] z-[95] w-[min(16rem,calc(100vw-1.5rem))] rounded-2xl border border-white/60 bg-white/95 p-4 shadow-xl backdrop-blur-xl sm:right-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {timed ? "Time remaining" : "Elapsed"}
                </p>
                <p className={cn("font-mono text-2xl font-bold tabular-nums", visuals.textClass)}>
                  {formatMmSs(displaySec)}
                </p>
              </div>
              <button
                type="button"
                onClick={closePopover}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                aria-label="Close timer menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {timed && totalSec > 0 ? (
              <p className="mt-1 text-xs text-slate-500">
                Total allotted: {formatMmSs(totalSec)}
              </p>
            ) : null}

            <p className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-center text-xs text-slate-600">
              <span className="font-semibold text-slate-800">
                {questionsCompleted} / {questionsTotal}
              </span>{" "}
              answered
            </p>

            {paused ? (
              <p className="mt-2 text-center text-xs font-medium text-amber-700">Exam paused</p>
            ) : null}

            <div className="mt-4 space-y-2">
              {allowPause && timed ? (
                <button
                  type="button"
                  onClick={() => {
                    closePopover();
                    if (paused) onResume?.();
                    else onPause?.();
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-teal-300 hover:bg-teal-50"
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

              {onEndExam ? (
                endConfirm ? (
                  <div className="space-y-2 rounded-xl border border-rose-200 bg-rose-50/80 p-3">
                    <p className="text-xs font-medium text-rose-900">
                      End exam early? Saved answers will be scored.
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setEndConfirm(false)}
                        className="flex-1 rounded-lg border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          closePopover();
                          onEndExam();
                        }}
                        className="flex-1 rounded-lg bg-rose-600 py-2 text-xs font-semibold text-white hover:bg-rose-700"
                      >
                        End exam
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setEndConfirm(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-800"
                  >
                    <Square className="h-3.5 w-3.5" aria-hidden /> End exam
                  </button>
                )
              ) : null}
            </div>

            <p className="mt-3 text-center text-[10px] text-slate-400">
              Press <kbd className="rounded border border-slate-200 bg-slate-50 px-1 font-mono">T</kbd>{" "}
              to hide timer
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>,
      document.body
    )
  ) : null;

  if (hidden) {
    return (
      <>
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => {
            setHidden(false);
            setMinimized(true);
          }}
          className={cn(
            "fixed z-[90] flex h-9 w-9 items-center justify-center rounded-full border border-white/50 bg-white/80 text-slate-600 shadow-lg backdrop-blur-md transition hover:scale-105 hover:text-teal-700",
            "top-[calc(var(--nav-height)+0.5rem)] right-3 sm:right-4",
            className
          )}
          aria-label="Show exam timer"
          title="Show timer (T)"
        >
          <Clock className="h-4 w-4" aria-hidden />
        </motion.button>
        {popover}
      </>
    );
  }

  if (minimized) {
    return (
      <>
        <motion.div ref={rootRef} className="fixed top-[calc(var(--nav-height)+0.5rem)] right-3 z-[90] sm:right-4">
          <motion.button
            type="button"
            layout
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{
            opacity: 1,
            scale: 1,
            ...(visuals.pulse && !paused
              ? { boxShadow: ["0 4px 14px rgba(244,63,94,0.15)", "0 4px 22px rgba(244,63,94,0.35)", "0 4px 14px rgba(244,63,94,0.15)"] }
              : {}),
          }}
          transition={
            visuals.pulse && !paused
              ? { boxShadow: { duration: 1.4, repeat: Infinity, ease: "easeInOut" } }
              : { duration: 0.25 }
          }
          onClick={togglePopover}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/85 shadow-lg backdrop-blur-md",
            visuals.glowClass,
            className
          )}
          aria-label={`Timer ${formatMmSs(displaySec)}. Tap to expand.`}
          aria-expanded={false}
          aria-haspopup="dialog"
        >
          <Clock className={cn("h-4 w-4", visuals.textClass)} aria-hidden />
        </motion.button>
        </motion.div>
        {popover}
      </>
    );
  }

  return (
    <>
      <motion.div
        ref={rootRef}
        layout
        initial={{ opacity: 0, y: -8, scale: 0.94 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          ...(visuals.pulse && !paused
            ? { boxShadow: ["0 8px 24px rgba(244,63,94,0.12)", "0 8px 32px rgba(244,63,94,0.28)", "0 8px 24px rgba(244,63,94,0.12)"] }
            : {}),
        }}
        transition={
          visuals.pulse && !paused
            ? { boxShadow: { duration: 1.4, repeat: Infinity, ease: "easeInOut" }, default: { duration: 0.3 } }
            : { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }
        }
        className={cn(
          "fixed z-[90] w-[6rem] select-none rounded-2xl border border-white/50 bg-white/80 p-1.5 shadow-lg backdrop-blur-xl max-md:w-[5.75rem] sm:w-[7rem]",
          visuals.glowClass,
          "top-[calc(var(--nav-height)+0.5rem)] right-3 sm:right-4",
          paused && "opacity-90",
          className
        )}
      >
        <button
          type="button"
          onClick={togglePopover}
          className="group relative flex w-full flex-col items-center rounded-xl transition hover:bg-white/50"
          aria-label={`${timed ? "Time remaining" : "Elapsed"} ${formatMmSs(displaySec)}. Open timer menu.`}
          aria-expanded={popoverOpen}
          aria-haspopup="dialog"
          aria-controls={popoverOpen ? popoverId : undefined}
        >
          <div className="relative flex h-[3.25rem] w-[3.25rem] items-center justify-center sm:h-[3.5rem] sm:w-[3.5rem]">
            <svg
              className="absolute inset-0 -rotate-90"
              viewBox="0 0 100 100"
              aria-hidden
            >
              <circle
                cx="50"
                cy="50"
                r={RING_RADIUS}
                fill="none"
                className="stroke-slate-200/80"
                strokeWidth="5"
              />
              {timed ? (
                <circle
                  cx="50"
                  cy="50"
                  r={RING_RADIUS}
                  fill="none"
                  className={cn(visuals.ringClass, "transition-[stroke-dashoffset,stroke] duration-1000 ease-linear")}
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={dashOffset}
                />
              ) : null}
            </svg>
            <span
              className={cn(
                "relative font-mono text-base font-bold tabular-nums leading-none sm:text-lg",
                visuals.textClass
              )}
            >
              {formatMmSs(displaySec)}
            </span>
          </div>

          <p className="mt-0.5 text-[9px] font-semibold tabular-nums text-slate-500 sm:text-[10px]">
            {questionsCompleted}/{questionsTotal}
          </p>

          {paused ? (
            <span className="mt-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-700">
              Paused
            </span>
          ) : null}
        </button>

        <button
          type="button"
          onClick={handleMinimize}
          className="absolute -bottom-1 -left-1 flex h-6 w-6 items-center justify-center rounded-full border border-white/70 bg-white/90 text-slate-400 shadow-sm transition hover:text-slate-700 md:hidden"
          aria-label="Minimize timer"
        >
          <Minimize2 className="h-3 w-3" aria-hidden />
        </button>
      </motion.div>
      {popover}
    </>
  );
}
