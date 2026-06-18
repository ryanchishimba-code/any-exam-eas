"use client";

import Link from "next/link";
import { BookMarked, BookOpen, GraduationCap, Sparkles } from "lucide-react";
import { RelatedAnatomyLinks } from "@/components/anatomy/RelatedAnatomyLinks";
import {
  getExamTopicStudyLinks,
  getWeakTopicsFromBreakdown,
} from "@/lib/library/exam-topic-bridge";
import type { FullExamTopicBreakdown } from "@/types/full-exam";
import type { ExamSlug } from "@/types/edtech";

type Props = {
  examSlug: ExamSlug;
  topicBreakdown: FullExamTopicBreakdown[];
};

export function FullExamStudyLinks({ examSlug, topicBreakdown }: Props) {
  const weak = getWeakTopicsFromBreakdown(topicBreakdown, 70).slice(0, 5);
  if (weak.length === 0) return null;

  return (
    <section
      aria-labelledby="exam-study-links-heading"
      className="rounded-2xl border border-violet-200/80 bg-violet-50/60 p-5"
    >
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-violet-600" aria-hidden />
        <h2 id="exam-study-links-heading" className="text-base font-bold text-slate-900">
          Study these weak areas
        </h2>
      </div>
      <p className="mt-1 text-sm text-slate-600">
        Jump to your Library — memory cards, review modules, and targeted practice.
      </p>

      <ul className="mt-4 space-y-3">
        {weak.map((row) => {
          const links = getExamTopicStudyLinks(examSlug, row.topic);
          return (
            <li
              key={row.topic}
              className="rounded-xl border border-violet-200/60 bg-white px-4 py-3 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold text-slate-900">{row.topic}</p>
                  <p className="text-xs text-slate-500">
                    {row.correct}/{row.total} correct ({row.pct}%)
                    {links.memoryCardIds.length > 0
                      ? ` · ${links.memoryCardIds.length} memory card(s)`
                      : ""}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={links.libraryHref}
                    className="inline-flex items-center gap-1 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-violet-700"
                  >
                    <Sparkles className="h-3.5 w-3.5" aria-hidden />
                    Library
                  </Link>
                  <Link
                    href={links.practiceHref}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-800 hover:bg-slate-100"
                  >
                    <BookOpen className="h-3.5 w-3.5" aria-hidden />
                    Practice 10
                  </Link>
                  {links.firstCardHref ? (
                    <Link
                      href={links.firstCardHref}
                      className="inline-flex items-center gap-1 rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-100"
                    >
                      <BookMarked className="h-3.5 w-3.5" aria-hidden />
                      Memory card
                    </Link>
                  ) : null}
                  {links.deepDiveHref ? (
                    <Link
                      href={links.deepDiveHref}
                      className="inline-flex items-center gap-1 rounded-lg border border-violet-300 bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-900 hover:bg-violet-100"
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
