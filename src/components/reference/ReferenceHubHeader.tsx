"use client";

import { motion } from "framer-motion";
import { Flame, Target, TrendingUp } from "lucide-react";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import { EXAM_SELECTION_THEMES } from "@/lib/edtech/exam-selection-theme";
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
    <motion.header
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={cn(
        "relative overflow-hidden rounded-3xl border border-black/[0.06] p-5 shadow-[var(--shadow-apple-sm)] sm:p-6",
        "bg-gradient-to-br from-white via-white to-slate-50/80"
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br opacity-30 blur-3xl",
          theme.gradient
        )}
        aria-hidden
      />
      <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex gap-3">
          <span
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-md",
              theme.gradient
            )}
          >
            <ExamIcon className="h-6 w-6" aria-hidden />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--color-accent)]">
              Study Reference
            </p>
            <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-[var(--color-ink)] sm:text-3xl">
              Your {exam.shortName} home base
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--color-ink-muted)]">
              {stats.motivationalMessage} AI brief, tools, and memory cards — tuned to what you need
              today.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 lg:max-w-sm lg:justify-end">
          <StatChip
            icon={Target}
            label="Readiness"
            value={`${stats.readinessScore}%`}
            accent="text-violet-700 bg-violet-50 ring-violet-100"
          />
          <StatChip
            icon={Flame}
            label="Streak"
            value={`${stats.studyStreakDays}d`}
            accent="text-orange-700 bg-orange-50 ring-orange-100"
          />
          {stats.overallAccuracy != null ? (
            <StatChip
              icon={TrendingUp}
              label="Accuracy"
              value={`${stats.overallAccuracy}%`}
              accent="text-emerald-700 bg-emerald-50 ring-emerald-100"
            />
          ) : null}
        </div>
      </div>
    </motion.header>
  );
}

function StatChip({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof Target;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-2xl px-3 py-2 ring-1",
        accent
      )}
    >
      <Icon className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wide opacity-70">{label}</p>
        <p className="text-sm font-bold tabular-nums">{value}</p>
      </div>
    </div>
  );
}
