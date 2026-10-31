"use client";

import Link from "next/link";
import { BookOpen, Layers, Sparkles } from "lucide-react";
import { RelatedAnatomyLinks } from "@/components/anatomy/RelatedAnatomyLinks";
import { practiceTopicHref } from "@/lib/edtech/practice-links-core";
import { ROUTES } from "@/lib/routes";
import {
  getExamTopicStudyLinks,
  getWeakTopicsFromBreakdown,
} from "@/lib/library/exam-topic-bridge";
import { feUi } from "@/lib/study/full-exam-ui";
import type { FullExamTopicBreakdown } from "@/types/full-exam";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

type Props = {
  examSlug: ExamSlug;
  topicBreakdown: FullExamTopicBreakdown[];
  /** Question-bank session size for the Practice CTA (default 10). */
  practiceCount?: number;
  /** Autostart the practice session (used after practice CAT). */
  autostartPractice?: boolean;
};

export function FullExamStudyLinks({
  examSlug,
  topicBreakdown,
  practiceCount = 10,
  autostartPractice = false,
}: Props) {
  const weak = getWeakTopicsFromBreakdown(topicBreakdown, 70).slice(0, 5);
  if (weak.length === 0) return null;

  return (
    <section
      aria-labelledby="exam-study-links-heading"
      className={cn(feUi.panel, "p-5 sm:p-6")}
    >
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-[var(--color-accent)]" aria-hidden />
        <h2 id="exam-study-links-heading" className={feUi.sectionTitle}>
          Review weak areas
        </h2>
      </div>
      <p className={cn(feUi.sectionHint, "mt-1")}>
        Practice the topics you missed
        {examSlug === "pance" ? ", or open the PANCE Feed." : "."}
      </p>
      {examSlug === "pance" ? (
        <Link
          href={ROUTES.panceFeed}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-accent)] hover:underline"
        >
          <Layers className="h-4 w-4" aria-hidden />
          PANCE Feed
        </Link>
      ) : null}

      <ul className="mt-4 space-y-3">
        {weak.map((row) => {
          const links = getExamTopicStudyLinks(examSlug, row.topic);
          const practiceHref = (() => {
            const base = practiceTopicHref(examSlug, links.topicKey, practiceCount);
            return autostartPractice ? `${base}&autostart=1` : base;
          })();
          return (
            <li
              key={row.topic}
              className="rounded-[16px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold text-[var(--color-ink)]">{row.topic}</p>
                  <p className="text-xs text-[var(--color-ink-muted)]">
                    {row.correct}/{row.total} correct ({row.pct}%)
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={practiceHref}
                    className={cn(feUi.footerBtn, "px-3 py-1.5 text-xs")}
                  >
                    <BookOpen className="h-3.5 w-3.5" aria-hidden />
                    Practice {practiceCount}
                  </Link>
                  <RelatedAnatomyLinks
                    examSlug={examSlug}
                    structures={links.anatomyStructures}
                    variant="pill"
                  />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
