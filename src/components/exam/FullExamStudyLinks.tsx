"use client";

import Link from "next/link";
import { BookOpen, Layers, Pill, Sparkles } from "lucide-react";
import { ROUTES } from "@/lib/routes";
import { RelatedAnatomyLinks } from "@/components/anatomy/RelatedAnatomyLinks";
import { practiceTopicHref } from "@/lib/edtech/practice-links-core";
import { studyFeedForExam } from "@/lib/study-feed/catalog";
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
        {studyFeedForExam(examSlug) ? `, or open the ${studyFeedForExam(examSlug)!.label}.` : "."}
      </p>
      {studyFeedForExam(examSlug) ? (
        <Link
          href={studyFeedForExam(examSlug)!.href}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-accent)] hover:underline"
        >
          <Layers className="h-4 w-4" aria-hidden />
          {studyFeedForExam(examSlug)!.label}
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
                <Link
                  href={practiceHref}
                  className={cn(feUi.footerBtn, "px-3 py-1.5 text-xs")}
                >
                  <BookOpen className="h-3.5 w-3.5" aria-hidden />
                  Practice {practiceCount}
                </Link>
              </div>
              {examSlug === "naplex" ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  <Link href={ROUTES.drugs300} className={cn(feUi.footerBtn, "px-3 py-1.5 text-xs")}>
                    <Pill className="h-3.5 w-3.5" aria-hidden />
                    Top 500 drugs
                  </Link>
                  <Link href="/naplex/study-guide" className={cn(feUi.footerBtn, "px-3 py-1.5 text-xs")}>
                    Study guide
                  </Link>
                  <Link href="/naplex/quick-bites" className={cn(feUi.footerBtn, "px-3 py-1.5 text-xs")}>
                    Quick Bites
                  </Link>
                  <Link href={ROUTES.anatomy} className={cn(feUi.footerBtn, "px-3 py-1.5 text-xs")}>
                    Anatomy
                  </Link>
                </div>
              ) : null}
              {links.anatomyStructures.length > 0 ? (
                <div className="mt-2">
                  <RelatedAnatomyLinks
                    examSlug={examSlug}
                    structures={links.anatomyStructures}
                    variant="pill"
                  />
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
