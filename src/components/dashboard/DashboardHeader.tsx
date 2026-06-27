"use client";

import Link from "next/link";
import { ChevronRight, Flame, LayoutGrid } from "lucide-react";
import { displayFirstName } from "@/lib/display-name";
import { dbUi } from "@/lib/study/dashboard-ui";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

type Props = {
  examName: string;
  userName?: string | null;
  readinessScore: number;
  accuracyPct: number;
  streakDays: number;
  questionsToday: number;
  trendDelta: number | null;
};

export function DashboardHeader({
  examName,
  userName,
  readinessScore,
  accuracyPct,
  streakDays,
  questionsToday,
  trendDelta,
}: Props) {
  const firstName = displayFirstName(userName);

  return (
    <header className="space-y-4 px-0.5">
      <nav aria-label="Breadcrumb" className={dbUi.eyebrow}>
        <ol className="flex items-center gap-1">
          <li>
            <Link
              href={ROUTES.practiceHub}
              className="text-[var(--color-ink-muted)] transition hover:text-[var(--color-accent)]"
            >
              Study Hub
            </Link>
          </li>
          <li aria-hidden>
            <ChevronRight className="inline h-3 w-3 opacity-40" />
          </li>
          <li className="text-[var(--color-ink)]">Dashboard</li>
        </ol>
      </nav>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[var(--color-accent)]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[var(--color-accent)]">
              {examName}
            </span>
            {streakDays > 0 ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/8 px-2.5 py-0.5 text-[11px] font-medium text-amber-800">
                <Flame className="h-3 w-3 text-amber-600" aria-hidden />
                {streakDays}d streak
              </span>
            ) : null}
          </div>
          <h1 className={cn(dbUi.title, "text-balance")}>
            Welcome back{firstName ? `, ${firstName}` : ""}
          </h1>
          <p className={dbUi.subtitle}>Your study command center — readiness, focus, and next steps.</p>
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            <span className={dbUi.statPill}>{readinessScore}% ready</span>
            <span className={dbUi.statPill}>{accuracyPct}% accuracy</span>
            <span className={questionsToday > 0 ? dbUi.statPillHighlight : dbUi.statPill}>
              {questionsToday} today
            </span>
            {trendDelta != null ? (
              <span className={dbUi.statPill}>
                {trendDelta >= 0 ? "+" : ""}
                {trendDelta}% trend
              </span>
            ) : null}
          </div>
        </div>

        <Link href={`${ROUTES.selectExam}?switch=1`} className={cn(dbUi.switchExam, "shrink-0")}>
          <LayoutGrid className="h-3.5 w-3.5" aria-hidden />
          Switch exam
        </Link>
      </div>
    </header>
  );
}
