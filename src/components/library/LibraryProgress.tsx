"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { practiceTopicHref } from "@/lib/edtech/practice-links";
import type { LibraryHubStats } from "@/components/library/LibraryHubHeader";
import { libUi } from "@/lib/library/library-ui";
import { filterStudentFacingWeakTopics } from "@/lib/learning/concept-labels";
import type { WeakTopicRow } from "@/lib/learning/student-dashboard";
import type { ExamSlug } from "@/types/edtech";
import { PRACTICE_PROGRESS_LABEL } from "@/lib/site";
import { cn } from "@/lib/utils";

type Props = {
  examSlug: ExamSlug;
  weakTopics: WeakTopicRow[];
  stats: LibraryHubStats;
};

export function LibraryProgress({ examSlug, weakTopics, stats }: Props) {
  const [open, setOpen] = useState(false);
  const facingWeak = filterStudentFacingWeakTopics(weakTopics);

  return (
    <section aria-labelledby="library-progress-heading" className={cn(libUi.surface, "overflow-hidden")}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition hover:bg-[var(--color-surface)]/40"
      >
        <div>
          <p id="library-progress-heading" className={libUi.sectionTitle}>
            Progress
          </p>
          <p className={cn(libUi.sectionHint, "mt-0.5")}>
            {stats.readinessScore}% {PRACTICE_PROGRESS_LABEL.toLowerCase()}
            {stats.overallAccuracy != null ? ` · ${stats.overallAccuracy}% accuracy` : ""}
            {stats.studyStreakDays > 0 ? ` · ${stats.studyStreakDays}d streak` : ""}
          </p>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-[var(--color-ink-muted)] transition-transform",
            open && "rotate-180"
          )}
          aria-hidden
        />
      </button>

      {open ? (
        <div className={cn(libUi.sectionDivider, "px-4 pb-4 pt-1")}>
          {facingWeak.length > 0 ? (
            <ul className="space-y-1">
              {facingWeak.map((topic) => {
                const slug = topic.id.replace(/^(tag|subject):/, "");
                return (
                  <li key={topic.id}>
                    <Link
                      href={practiceTopicHref(examSlug, slug, 10)}
                      className="flex items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-[var(--color-surface)]/60"
                    >
                      <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-[var(--color-ink)]">
                        {topic.name}
                      </span>
                      <span className="h-1 w-16 overflow-hidden rounded-full bg-[var(--color-surface)]">
                        <span
                          className="block h-full rounded-full bg-[var(--color-accent)]/70"
                          style={{ width: `${Math.min(100, Math.max(8, topic.masteryScore))}%` }}
                        />
                      </span>
                      <span className="w-8 shrink-0 text-right text-[11px] font-semibold tabular-nums text-[var(--color-ink-muted)]">
                        {topic.masteryScore}%
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className={libUi.sectionHint}>
              Answer a few questions to unlock personalized weak-area tracking.
            </p>
          )}
        </div>
      ) : null}
    </section>
  );
}
