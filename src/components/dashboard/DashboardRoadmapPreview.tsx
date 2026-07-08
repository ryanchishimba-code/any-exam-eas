"use client";

import Link from "next/link";
import { ArrowRight, Map } from "lucide-react";
import type { ExamRoadmapData } from "@/lib/learning/exam-roadmap";
import { roadmapHref } from "@/lib/learning/roadmap-links";
import { dbUi } from "@/lib/study/dashboard-ui";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

export function DashboardRoadmapPreview({
  examSlug,
  roadmap,
}: {
  examSlug: ExamSlug;
  roadmap: ExamRoadmapData;
}) {
  const priorities = roadmap.priorityTopics.slice(0, 3);

  if (priorities.length === 0 && roadmap.overallReadiness >= 80) {
    return (
      <section aria-labelledby="dashboard-roadmap-heading" className="space-y-2.5">
        <Header examSlug={examSlug} overall={roadmap.overallReadiness} />
        <p className={cn(dbUi.surface, "px-4 py-3 text-[13px] text-[var(--color-ink-muted)]")}>
          Strong across all blueprint areas — keep timed practice to stay exam-ready.
        </p>
      </section>
    );
  }

  return (
    <section aria-labelledby="dashboard-roadmap-heading" className="space-y-2.5">
      <Header examSlug={examSlug} overall={roadmap.overallReadiness} />
      <p className={cn(dbUi.sectionHint, "px-0.5")}>{roadmap.passFocusMessage}</p>

      <ul className={dbUi.listSurface}>
        {priorities.map((topic) => (
          <li key={topic.categoryId} className={dbUi.listRow}>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-[var(--color-ink)]">
                {topic.label}
              </p>
              <p className={dbUi.sectionHint}>
                {topic.blueprintWeightPct}% of exam · {topic.readinessLabel}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="text-[12px] font-semibold tabular-nums text-[var(--color-ink-muted)]">
                {topic.readinessScore}%
              </span>
              <Link
                href={topic.practiceHref}
                className="text-[11px] font-semibold text-[var(--color-accent)] hover:underline"
              >
                Practice
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Header({ examSlug, overall }: { examSlug: ExamSlug; overall: number }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-2 px-0.5">
      <div>
        <div className="flex items-center gap-2">
          <Map className="h-3.5 w-3.5 text-[var(--color-accent)]" aria-hidden />
          <h2 id="dashboard-roadmap-heading" className={dbUi.sectionTitle}>
            Exam roadmap
          </h2>
        </div>
        <p className={cn(dbUi.sectionHint, "mt-0.5")}>
          Blueprint readiness — {overall}% overall
        </p>
      </div>
      <Link
        href={roadmapHref(examSlug)}
        className="inline-flex items-center gap-1 text-[12px] font-semibold text-[var(--color-accent)] hover:underline"
      >
        Full roadmap
        <ArrowRight className="h-3.5 w-3.5" aria-hidden />
      </Link>
    </div>
  );
}
