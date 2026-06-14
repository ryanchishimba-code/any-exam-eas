"use client";

import Link from "next/link";
import { ArrowRight, Target, TrendingDown } from "lucide-react";
import { practiceTopicHref, referenceTopicHref, analyticsHref } from "@/lib/edtech/practice-links";
import { dbUi } from "@/lib/study/dashboard-ui";
import type { WeakTopicRow } from "@/lib/learning/student-dashboard";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

export function DashboardWeakTopics({
  examSlug,
  weakTopics,
}: {
  examSlug: ExamSlug;
  weakTopics: WeakTopicRow[];
}) {
  if (weakTopics.length === 0) return null;

  return (
    <section aria-labelledby="dashboard-weak-heading" className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-amber-600" aria-hidden />
            <h2 id="dashboard-weak-heading" className={dbUi.sectionTitle}>
              Focus areas
            </h2>
          </div>
          <p className={cn(dbUi.sectionHint, "mt-0.5")}>
            Topics where extra practice may help most.
          </p>
        </div>
        <Link
          href={analyticsHref()}
          className="text-[12px] font-semibold text-[var(--color-accent)] hover:underline"
        >
          Full analytics
        </Link>
      </div>

      <div className={dbUi.chipRow}>
        {weakTopics.slice(0, 5).map((topic) => {
          const slug = topic.id.replace(/^(tag|subject):/, "");
          return (
            <div
              key={topic.id}
              className="inline-flex shrink-0 snap-start items-center overflow-hidden rounded-full border border-amber-200/70 bg-amber-50/80"
            >
              <Link
                href={referenceTopicHref(examSlug, slug)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold text-amber-950"
              >
                <TrendingDown className="h-3.5 w-3.5 text-amber-600" aria-hidden />
                {topic.name}
                <span className="tabular-nums text-amber-700/80">{topic.masteryScore}%</span>
              </Link>
              <Link
                href={practiceTopicHref(examSlug, slug, 10)}
                className="border-l border-amber-200/70 px-2.5 py-2 text-[11px] font-bold text-amber-800 hover:bg-amber-100/80"
              >
                Practice
                <ArrowRight className="ml-0.5 inline h-3 w-3" aria-hidden />
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
