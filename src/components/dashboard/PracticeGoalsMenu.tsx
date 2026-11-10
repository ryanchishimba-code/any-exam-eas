"use client";

import { useId, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import type { ReadinessCriterion } from "@/lib/learning/exam-day-plan";
import {
  ACCURACY_GOAL_PCT,
  COVERAGE_GOAL_PCT,
  REMEDIATION_GOAL_PCT,
  REMEDIATION_MAX_OPEN,
} from "@/lib/learning/practice-measure";
import type { DifficultyMix } from "@/lib/learning/served-bank-stats";
import {
  PracticeGoalsCharts,
  type GoalDomainBar,
  type GoalTrendPoint,
} from "@/components/dashboard/PracticeGoalsCharts";
import { cn } from "@/lib/utils";

function MiniRing({ met, total, score }: { met: number; total: number; score: number }) {
  const size = 36;
  const stroke = 3.5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const fill = total > 0 ? Math.max(0, Math.min(1, met / total)) : 0;
  const offset = circumference - fill * circumference;
  return (
    <span
      className="relative grid h-9 w-9 shrink-0 place-items-center"
      aria-hidden
    >
      <svg width={size} height={size} className="-rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="color-mix(in srgb, var(--color-border) 80%, transparent)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="absolute text-[10px] font-semibold tabular-nums tracking-[-0.03em] text-[var(--color-ink)]">
        {met}/{total}
      </span>
      <span className="sr-only">{score}</span>
    </span>
  );
}

/**
 * One compact practice-goals row. Closed until the student opens it.
 * The same control is the dashboard proof and the analytics summary.
 */
export function PracticeGoalsMenu({
  surface,
  headline,
  score,
  disclaimer,
  criteria,
  trend = [],
  domains = [],
  difficultyMix = null,
  children,
}: {
  surface: "proof" | "analytics";
  headline: string;
  score: number;
  disclaimer: string;
  criteria: ReadinessCriterion[];
  trend?: GoalTrendPoint[];
  domains?: GoalDomainBar[];
  difficultyMix?: DifficultyMix | null;
  children?: ReactNode;
}) {
  const reactId = useId().replace(/:/g, "");
  const panelId = `${surface}-practice-goals-${reactId}`;
  const [open, setOpen] = useState(false);
  const goals = criteria.filter((row) => row.id !== "exam_sim");
  const met = goals.filter((row) => row.status === "met").length;

  return (
    <div
      data-practice-goals={surface}
      data-practice-headline={headline}
      data-practice-score={score}
      data-practice-open={open ? "true" : "false"}
    >
      <button
        type="button"
        className="flex w-full cursor-pointer items-center gap-2.5 rounded-2xl text-left outline-none ring-[var(--color-accent)] focus-visible:ring-2"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`${headline}. ${disclaimer}. ${open ? "Hide" : "Show"} practice goals`}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === "Escape" && open) {
            event.preventDefault();
            setOpen(false);
          }
        }}
      >
        <MiniRing met={met} total={Math.max(goals.length, 3)} score={score} />
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-semibold leading-tight tracking-[-0.02em] text-[var(--color-ink)]">
            {headline}
          </span>
          <span className="mt-0.5 block text-[13px] leading-snug text-[var(--color-ink-muted)]">
            Outline {COVERAGE_GOAL_PCT}% · accuracy {ACCURACY_GOAL_PCT}% · reviewed misses {REMEDIATION_GOAL_PCT}% with at most {REMEDIATION_MAX_OPEN} open
          </span>
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-[var(--color-ink-muted)] motion-safe:transition-transform motion-safe:duration-200",
            open && "rotate-180"
          )}
          aria-hidden
        />
      </button>

      <div
        id={panelId}
        role="region"
        aria-label="Practice goals"
        hidden={!open}
        className={cn(open && "motion-safe:animate-[practice-goals-in_220ms_ease-out]")}
      >
        <style>{`@keyframes practice-goals-in{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}`}</style>
        <PracticeGoalsCharts
          criteria={goals}
          trend={trend}
          domains={domains}
          difficultyMix={difficultyMix}
        />
        {children ? <div className="mt-4">{children}</div> : null}
      </div>
    </div>
  );
}
