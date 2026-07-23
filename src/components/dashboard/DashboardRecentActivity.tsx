"use client";

import Link from "next/link";
import { ChevronRight, Clock } from "lucide-react";
import { recentTestHref } from "@/lib/edtech/recent-test-links";
import { dbUi } from "@/lib/study/dashboard-ui";
import type { RecentTestRow } from "@/lib/learning/student-dashboard";
import type { ExamSlug } from "@/types/edtech";

export function DashboardRecentActivity({
  examSlug,
  recentTests,
  embedded = false,
}: {
  examSlug: ExamSlug;
  recentTests: RecentTestRow[];
  /** When nested under a parent <details>, hide the section chrome. */
  embedded?: boolean;
}) {
  const items = recentTests.slice(0, 3);
  if (items.length === 0) return null;

  const list = (
    <div className={embedded ? "divide-y divide-[var(--color-border)]/60" : dbUi.listSurface}>
      {items.map((test) => {
        const when = new Date(test.completedAt).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        });
        return (
          <Link key={test.id} href={recentTestHref(examSlug, test)} className={dbUi.listRow}>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-[var(--color-ink)]">
                {test.title}
              </p>
              <p className={dbUi.sectionHint}>{when}</p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1 text-[13px] font-semibold tabular-nums text-[var(--color-ink)]">
              {test.score}%
              <ChevronRight className="h-3.5 w-3.5 text-[var(--color-ink-muted)]" aria-hidden />
            </span>
          </Link>
        );
      })}
    </div>
  );

  if (embedded) return list;

  return (
    <section aria-labelledby="dashboard-recent-heading" className="space-y-2.5">
      <div className="flex items-center gap-2 px-0.5">
        <Clock className="h-3.5 w-3.5 text-[var(--color-ink-muted)]" aria-hidden />
        <h2 id="dashboard-recent-heading" className={dbUi.sectionTitle}>
          Recent activity
        </h2>
      </div>
      {list}
    </section>
  );
}
