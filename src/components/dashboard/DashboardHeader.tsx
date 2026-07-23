"use client";

import { Flame } from "lucide-react";
import { displayFirstName } from "@/lib/display-name";
import { dbUi } from "@/lib/study/dashboard-ui";
import { cn } from "@/lib/utils";

type Props = {
  examName: string;
  userName?: string | null;
  streakDays: number;
};

export function DashboardHeader({ examName, userName, streakDays }: Props) {
  const firstName = displayFirstName(userName);

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 px-0.5">
      <div className="min-w-0 space-y-1.5">
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
          {firstName ? `Hi, ${firstName}` : "Dashboard"}
        </h1>
      </div>
    </header>
  );
}
