"use client";

import Link from "next/link";
import { BookMarked, BookOpen, GraduationCap, Sparkles } from "lucide-react";
import { RelatedAnatomyLinks } from "@/components/anatomy/RelatedAnatomyLinks";
import { practiceTopicHref } from "@/lib/edtech/practice-links-core";
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
        Jump to your Library — memory cards, review modules, and targeted practice.
      </p>

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
                    {links.memoryCardIds.length > 0
                      ? ` · ${links.memoryCardIds.length} memory card(s)`
                      : ""}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={links.libraryHref}
                    className="inline-flex items-center gap-1 rounded-full bg-[var(--color-accent)] px-3 py-1.5 text-xs font-bold text-white hover:opacity-90"
                  >
                    <Sparkles className="h-3.5 w-3.5" aria-hidden />
                    Library
                  </Link>
                  <Link
                    href={practiceHref}
                    className={cn(feUi.footerBtn, "px-3 py-1.5 text-xs")}
                  >
                    <BookOpen className="h-3.5 w-3.5" aria-hidden />
                    Practice {practiceCount}
                  </Link>
                  {links.firstCardHref ? (
                    <Link
                      href={links.firstCardHref}
                      className={cn(feUi.footerBtn, "border-amber-300/60 bg-amber-500/10 px-3 py-1.5 text-xs text-amber-900")}
                    >
                      <BookMarked className="h-3.5 w-3.5" aria-hidden />
                      Memory card
                    </Link>
                  ) : null}
                  {links.deepDiveHref ? (
                    <Link
                      href={links.deepDiveHref}
                      className={cn(
                        feUi.footerBtn,
                        "border-[var(--color-accent)]/30 bg-[var(--color-accent)]/5 px-3 py-1.5 text-xs text-[var(--color-accent)]"
                      )}
                    >
                      <GraduationCap className="h-3.5 w-3.5" aria-hidden />
                      Deep dive
                    </Link>
                  ) : null}
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
