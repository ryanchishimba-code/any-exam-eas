"use client";

import Link from "next/link";
import { ArrowRight, GraduationCap, Target, TrendingDown } from "lucide-react";
import {
  analyticsHref,
  practiceTopicHref,
  referenceTopicHref,
} from "@/lib/edtech/practice-links";
import { getExamTopicStudyLinks } from "@/lib/reference/exam-topic-bridge";
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
              Weak topics
            </h2>
          </div>
          <p className={cn(dbUi.sectionHint, "mt-0.5")}>
            Topics where extra practice may help most — jump straight to a deep dive.
          </p>
        </div>
        <Link
          href={analyticsHref()}
          className="text-[12px] font-semibold text-[var(--color-accent)] hover:underline"
        >
          Full analytics
        </Link>
      </div>

      <ul className="space-y-2">
        {weakTopics.slice(0, 5).map((topic) => {
          const slug = topic.id.replace(/^(tag|subject):/, "");
          const links = getExamTopicStudyLinks(examSlug, slug);
          return (
            <li
              key={topic.id}
              className="flex flex-col gap-2 rounded-xl border border-amber-200/70 bg-amber-50/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="flex items-center gap-2 font-semibold text-amber-950">
                  <TrendingDown className="h-4 w-4 shrink-0 text-amber-600" aria-hidden />
                  <span className="truncate">{topic.name}</span>
                  <span className="tabular-nums text-sm text-amber-700/80">
                    {topic.masteryScore}%
                  </span>
                </p>
                <p className="mt-0.5 text-[11px] text-amber-800/70">
                  {topic.attempts} attempt{topic.attempts === 1 ? "" : "s"} · {topic.weight}% of
                  weakness weight
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {links.deepDiveHref ? (
                  <Link
                    href={links.deepDiveHref}
                    className="inline-flex items-center gap-1 rounded-lg bg-violet-600 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-violet-700"
                  >
                    <GraduationCap className="h-3.5 w-3.5" aria-hidden />
                    Deep dive
                  </Link>
                ) : null}
                <Link
                  href={referenceTopicHref(examSlug, slug)}
                  className="inline-flex items-center gap-1 rounded-lg border border-amber-300/80 bg-white px-3 py-1.5 text-[11px] font-bold text-amber-900 hover:bg-amber-50"
                >
                  Reference
                </Link>
                <Link
                  href={practiceTopicHref(examSlug, slug, 10)}
                  className="inline-flex items-center gap-1 rounded-lg border border-amber-300/80 bg-white px-3 py-1.5 text-[11px] font-bold text-amber-900 hover:bg-amber-50"
                >
                  Practice
                  <ArrowRight className="h-3 w-3" aria-hidden />
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
