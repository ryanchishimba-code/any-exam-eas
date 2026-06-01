"use client";

import { type ReactNode } from "react";
import { FeatureShortcuts } from "@/components/dashboard/FeatureShortcuts";

type DashboardPageLayoutProps = {
  userName?: string | null;
  hasPremiumAccess?: boolean;
  children: ReactNode;
};

export function DashboardPageLayout({
  userName,
  hasPremiumAccess = false,
  children,
}: DashboardPageLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="mx-auto max-w-5xl px-6 pb-24 pt-[var(--page-top)]">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-ink-muted)]">
          Dashboard
        </p>
        <h1 className="apple-display mt-2 text-[clamp(2rem,5vw,2.75rem)]">
          Hello{userName ? `, ${userName.split(" ")[0]}` : ""}.
        </h1>
        <p className="apple-subhead mt-3 max-w-xl text-[1.0625rem]">
          {hasPremiumAccess
            ? "Your study command center — pick a track and keep building exam-day confidence."
            : "Track your accuracy, target weak topics, and jump back into studying."}
        </p>

        {hasPremiumAccess && <FeatureShortcuts variant="grid" className="mt-8" />}

        <div className="mt-10">{children}</div>
      </div>
    </div>
  );
}
