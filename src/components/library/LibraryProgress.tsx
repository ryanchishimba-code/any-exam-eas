"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Gauge } from "lucide-react";
import { practiceTopicHref } from "@/lib/edtech/practice-links";
import type { LibraryHubStats } from "@/components/library/LibraryHubHeader";
import { useLibraryMotion } from "@/lib/library/use-library-motion";
import { libUi } from "@/lib/library/library-ui";
import type { WeakTopicRow } from "@/lib/learning/student-dashboard";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

type Props = {
  examSlug: ExamSlug;
  weakTopics: WeakTopicRow[];
  stats: LibraryHubStats;
};

/**
 * Section 5 (secondary, collapsed by default) — a calm at-a-glance progress
 * view. Kept out of the way on first load to protect the low-cognitive-load
 * goal; clicking any topic starts a focused session immediately.
 */
export function LibraryProgress({ examSlug, weakTopics, stats }: Props) {
  const [open, setOpen] = useState(false);
  const { reduce } = useLibraryMotion();

  return (
    <section aria-labelledby="library-progress-heading" className={cn(libUi.panel, "p-4 sm:p-5")}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3"
      >
        <span className="flex items-center gap-2">
          <Gauge className="h-4 w-4 text-[var(--color-accent)]" aria-hidden />
          <span id="library-progress-heading" className={libUi.sectionTitle}>
            Progress at a glance
          </span>
        </span>
        <span className="flex items-center gap-2">
          <span className={libUi.statPill}>{stats.readinessScore}% ready</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-[var(--color-ink-muted)] transition-transform",
              open && "rotate-180"
            )}
            aria-hidden
          />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-4 space-y-4">
          {/* Headline stats */}
          <div className="grid grid-cols-3 gap-2">
            <Stat label="Readiness" value={`${stats.readinessScore}%`} />
            <Stat label="Streak" value={`${stats.studyStreakDays}d`} />
            <Stat
              label="Accuracy"
              value={stats.overallAccuracy != null ? `${stats.overallAccuracy}%` : "—"}
            />
          </div>

          {/* Weak topics with mastery bars — tap to start a focused session. */}
          {weakTopics.length > 0 ? (
            <div className="space-y-2">
              <p className={libUi.sectionHint}>Tap a topic to start a focused 10-question set.</p>
              <ul className="space-y-1.5">
                {weakTopics.map((topic) => {
                  const slug = topic.id.replace(/^(tag|subject):/, "");
                  return (
                    <li key={topic.id}>
                      <Link
                        href={practiceTopicHref(examSlug, slug, 10)}
                        className="group flex items-center gap-3 rounded-[14px] border border-black/[0.05] bg-white px-3 py-2.5 transition hover:border-[var(--color-accent)]/25 hover:shadow-[var(--shadow-apple-sm)]"
                      >
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[13px] font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-accent)]">
                            {topic.name}
                          </span>
                          <span className="mt-1 block h-1.5 w-full overflow-hidden rounded-full bg-black/[0.06]">
                            <span
                              className="block h-full rounded-full bg-amber-400"
                              style={{ width: `${Math.min(100, Math.max(4, topic.masteryScore))}%` }}
                            />
                          </span>
                        </span>
                        <span className="shrink-0 text-[12px] font-bold tabular-nums text-amber-700">
                          {topic.masteryScore}%
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
            ) : (
              <p className={libUi.sectionHint}>
                Complete a few questions to unlock your personalized progress breakdown.
              </p>
            )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[14px] bg-black/[0.03] px-3 py-2.5 text-center">
      <p className="text-[18px] font-semibold tabular-nums text-[var(--color-ink)]">{value}</p>
      <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--color-ink-muted)]">
        {label}
      </p>
    </div>
  );
}
