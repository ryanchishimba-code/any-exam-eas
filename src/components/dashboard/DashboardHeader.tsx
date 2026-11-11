"use client";

import { Flame, Layers } from "lucide-react";
import { displayFirstName } from "@/lib/display-name";
import { dbUi } from "@/lib/study/dashboard-ui";
import { cn } from "@/lib/utils";

/** Grouped integer with ASCII commas. `toLocaleString` can differ between Node and the browser. */
function formatCount(value: number): string {
  return Math.trunc(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

type Props = {
  examName: string;
  userName?: string | null;
  streakDays: number;
  dueCount?: number;
  /** Saved attempts on this board. Same total as Today's block and Analytics. */
  boardAttempts?: number;
  /** Same overall accuracy Analytics shows. */
  accuracyPct?: number | null;
  /** Same outline depth Readiness and Analytics show. */
  outlineDepthPct?: number | null;
};

export function DashboardHeader({
  examName,
  userName,
  streakDays,
  dueCount = 0,
  boardAttempts = 0,
  accuracyPct = null,
  outlineDepthPct = null,
}: Props) {
  const firstName = displayFirstName(userName);

  return (
    <header className="flex flex-wrap items-end justify-between gap-3 px-0.5 pt-1">
      <div className="min-w-0">
        <h1 className={cn(dbUi.title, "text-balance")}>
          {firstName ? `Hi, ${firstName}` : "Dashboard"}
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-1.5" role="status" aria-label="Study status">
        <span className={dbUi.statusPillAccent}>{examName}</span>
        {streakDays > 0 ? (
          <span className={dbUi.statusPill}>
            <Flame className="h-3 w-3 text-amber-500" aria-hidden />
            {streakDays}d
          </span>
        ) : null}
        {dueCount > 0 ? (
          <span className={dbUi.statusPillAccent} aria-label={`${dueCount} spaced review due`}>
            {dueCount} spaced review due
          </span>
        ) : null}
        {accuracyPct != null ? (
          <span className={dbUi.statusPill} aria-label={`Overall accuracy ${accuracyPct} percent`}>
            {accuracyPct}% accuracy
          </span>
        ) : null}
        {outlineDepthPct != null ? (
          <span className={dbUi.statusPill} aria-label={`Outline depth ${outlineDepthPct} percent`}>
            {outlineDepthPct}% outline
          </span>
        ) : null}
        {boardAttempts > 0 ? (
          <span
            className={dbUi.statusPill}
            aria-label={`${formatCount(boardAttempts)} saved attempts on this board`}
          >
            <Layers className="h-3 w-3" aria-hidden />
            {formatCount(boardAttempts)}
          </span>
        ) : null}
      </div>
    </header>
  );
}
