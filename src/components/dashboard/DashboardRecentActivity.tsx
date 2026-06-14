"use client";

import Link from "next/link";
import { ChevronRight, Clock } from "lucide-react";
import { analyticsHref } from "@/lib/edtech/practice-links";
import { dbUi } from "@/lib/study/dashboard-ui";
import type { RecentTestRow } from "@/lib/learning/student-dashboard";
import { cn } from "@/lib/utils";

export function DashboardRecentActivity({ recentTests }: { recentTests: RecentTestRow[] }) {
  const items = recentTests.slice(0, 3);
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="dashboard-recent-heading" className="space-y-3">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-[var(--color-ink-muted)]" aria-hidden />
        <h2 id="dashboard-recent-heading" className={dbUi.sectionTitle}>
          Recent activity
        </h2>
      </div>
      <div className={dbUi.insetGroup}>
        {items.map((test) => {
          const when = new Date(test.completedAt).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          });
          return (
            <Link
              key={test.id}
              href={analyticsHref()}
              className={cn(dbUi.listRow, "border-b border-black/[0.04] last:border-0")}
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-[var(--color-ink)]">{test.title}</p>
                <p className="text-[12px] text-[var(--color-ink-muted)]">{when}</p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1 font-semibold tabular-nums text-[var(--color-ink)]">
                {test.score}%
                <ChevronRight className="h-3.5 w-3.5 text-[var(--color-ink-muted)]" aria-hidden />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
