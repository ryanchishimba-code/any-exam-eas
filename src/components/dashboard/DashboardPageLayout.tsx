"use client";

import { type ReactNode } from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

type DashboardPageLayoutProps = {
  userName?: string | null;
  hasPremiumAccess?: boolean;
  children: ReactNode;
  headerExtra?: ReactNode;
};

export function DashboardPageLayout({
  userName,
  hasPremiumAccess = false,
  children,
  headerExtra,
}: DashboardPageLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="mx-auto flex max-w-6xl gap-8 px-6 pb-24 pt-[var(--page-top)]">
        <DashboardSidebar />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-ink-muted)]">
            Study Hub
          </p>
          <h1 className="apple-display mt-2 text-[clamp(2rem,5vw,2.75rem)]">
            Hello{userName ? `, ${userName.split(" ")[0]}` : ""}.
          </h1>
          <p className="apple-subhead mt-3 max-w-xl text-[1.0625rem]">
            {hasPremiumAccess
              ? "Your study command center — pick an exam track and keep building exam-day confidence."
              : "Track your accuracy, target weak topics, and jump back into studying."}
          </p>
          {headerExtra}
          <div className="mt-10">{children}</div>
        </div>
      </div>
    </div>
  );
}
