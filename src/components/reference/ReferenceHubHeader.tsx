"use client";

import { Target, Flame, TrendingUp } from "lucide-react";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import { EXAM_SELECTION_THEMES } from "@/lib/edtech/exam-selection-theme";
import { refUi } from "@/lib/reference/reference-ui";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

export type ReferenceHubStats = {
  readinessScore: number;
  studyStreakDays: number;
  overallAccuracy: number | null;
  motivationalMessage: string;
};

export function ReferenceHubHeader({
  examSlug,
  stats,
}: {
  examSlug: ExamSlug;
  stats: ReferenceHubStats;
}) {
  const exam = EXAM_CATALOG[examSlug];
  const theme = EXAM_SELECTION_THEMES[examSlug];
  const ExamIcon = theme.icon;

  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br text-white shadow-[var(--shadow-apple-sm)]",
            theme.gradient
          )}
        >
          <ExamIcon className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <p className={refUi.eyebrow}>Reference</p>
          <h1 className={refUi.title}>{exam.shortName} study hub</h1>
          <p className={cn(refUi.subtitle, "mt-0.5 max-w-lg")}>{stats.motivationalMessage}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <StatPill icon={Target} label="Readiness" value={`${stats.readinessScore}%`} />
        <StatPill icon={Flame} label="Streak" value={`${stats.studyStreakDays}d`} />
        {stats.overallAccuracy != null ? (
          <StatPill icon={TrendingUp} label="Accuracy" value={`${stats.overallAccuracy}%`} />
        ) : null}
      </div>
    </header>
  );
}

function StatPill({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Target;
  label: string;
  value: string;
}) {
  return (
    <div className={refUi.statPill}>
      <Icon className="h-3.5 w-3.5 text-[var(--color-ink-muted)]" aria-hidden />
      <span className="text-[11px] font-medium text-[var(--color-ink-muted)]">{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}
