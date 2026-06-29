"use client";

import { useEffect, useRef, useState } from "react";

export type LongRunningProgressStep = {
  /** Progress threshold (0–100) at which this label applies. */
  at: number;
  label: string;
};

const DEFAULT_EXAM_LOAD_STEPS: LongRunningProgressStep[] = [
  { at: 0, label: "Preparing your exam…" },
  { at: 8, label: "Working on it — assembling your questions…" },
  { at: 28, label: "Working on it — almost there…" },
  { at: 48, label: "Still working on it — large exams can take a moment…" },
  { at: 72, label: "Working on it — thanks for your patience…" },
];

function labelForProgress(steps: LongRunningProgressStep[], progress: number): string {
  const match = [...steps].reverse().find((step) => progress >= step.at);
  return match?.label ?? steps[0]?.label ?? "Working on it…";
}

type Options = {
  steps?: LongRunningProgressStep[];
  /** Show the progress bar after this many ms (long-running loads only). */
  barAfterMs?: number;
  maxProgress?: number;
};

/** Simulated progress for async exam loads — bar appears after a short delay. */
export function useLongRunningProgress(active: boolean, opts?: Options) {
  const steps = opts?.steps ?? DEFAULT_EXAM_LOAD_STEPS;
  const barAfterMs = opts?.barAfterMs ?? 900;
  const maxProgress = opts?.maxProgress ?? 94;
  const stepsRef = useRef(steps);
  stepsRef.current = steps;

  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState(steps[0]?.label ?? "Preparing your exam…");
  const [showBar, setShowBar] = useState(false);

  useEffect(() => {
    if (!active) {
      setProgress(0);
      setStatus(stepsRef.current[0]?.label ?? "Preparing your exam…");
      setShowBar(false);
      return;
    }

    const currentSteps = stepsRef.current;
    setProgress(4);
    setStatus(labelForProgress(currentSteps, 4));

    const barTimer = window.setTimeout(() => setShowBar(true), barAfterMs);

    const interval = window.setInterval(() => {
      setProgress((current) => {
        const next = Math.min(current + 1.5 + Math.random() * 3.5, maxProgress);
        setStatus(labelForProgress(stepsRef.current, next));
        return next;
      });
    }, 650);

    return () => {
      window.clearTimeout(barTimer);
      window.clearInterval(interval);
    };
  }, [active, barAfterMs, maxProgress]);

  return { progress, status, showBar };
}
