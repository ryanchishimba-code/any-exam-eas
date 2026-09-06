"use client";

import { Flame, Layers } from "lucide-react";
import { displayFirstName } from "@/lib/display-name";
import { dbUi } from "@/lib/study/dashboard-ui";
import { cn } from "@/lib/utils";

type Props = {
  examName: string;
  userName?: string | null;
  streakDays: number;
  dueCount?: number;
  questionsAnswered?: number;
};

export function DashboardHeader({
  examName,
  userName,
  streakDays,
  dueCount = 0,
  questionsAnswered = 0,
}: Props) {
  const firstName = displayFirstName(userName);

  return (
    <header className="flex flex-wrap items-end justify-between gap-3 px-0.5 pt-1">
      <div className="min-w-0">
        <p className={dbUi.eyebrow}>Study command</p>
        <h1 className={cn(dbUi.title, "mt-1 text-balance")}>
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
        {dueCount > 0 ? <span className={dbUi.statusPillAccent}>{dueCount} due</span> : null}
        {questionsAnswered > 0 ? (
          <span className={dbUi.statusPill}>
            <Layers className="h-3 w-3" aria-hidden />
            {questionsAnswered.toLocaleString()}
          </span>
        ) : null}
      </div>
    </header>
  );
}
