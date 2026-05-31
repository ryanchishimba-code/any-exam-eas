"use client";

import { cn } from "@/lib/utils";
import { PRACTICE_PROGRESS_LABEL } from "@/lib/site";

type Props = {
  score: number;
  size?: number;
  stroke?: number;
  label?: string;
  className?: string;
};

export function ReadinessRing({
  score,
  size = 88,
  stroke = 7,
  label = PRACTICE_PROGRESS_LABEL,
  className,
}: Props) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.min(100, Math.max(0, score));
  const offset = c - (pct / 100) * c;

  return (
    <div className={cn("relative inline-flex flex-col items-center", className)}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-black/[0.06] dark:text-white/10"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-semibold tabular-nums text-[var(--color-ink)]">{pct}%</span>
      </div>
      <span className="mt-1 text-[10px] font-medium uppercase tracking-wide text-[var(--color-ink-muted)]">
        {label}
      </span>
    </div>
  );
}
