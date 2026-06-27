"use client";

import Link from "next/link";
import { ArrowRight, BookMarked, ChevronRight, GraduationCap } from "lucide-react";
import { practiceTopicHref } from "@/lib/edtech/practice-links";
import { getExamTopicStudyLinks } from "@/lib/library/exam-topic-bridge";
import { getPinnedMemoryCardIds } from "@/lib/library/pinned-essentials";
import { useSessionTone } from "@/lib/library/session-tone";
import { libUi } from "@/lib/library/library-ui";
import type { WeakTopicRow } from "@/lib/learning/student-dashboard";
import type { MemoryCard } from "@/lib/library/types";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

type Props = {
  examSlug: ExamSlug;
  weakTopics: WeakTopicRow[];
  cards: MemoryCard[];
  onOpenCard: (card: MemoryCard) => void;
};

const MAX_RECOMMENDATIONS = 4;

type Recommendation =
  | {
      kind: "topic";
      key: string;
      title: string;
      slug: string;
      mastery: number;
      deepDiveHref?: string;
    }
  | { kind: "card"; key: string; title: string; subject: string; card: MemoryCard };

function buildRecommendations(
  examSlug: ExamSlug,
  weakTopics: WeakTopicRow[],
  cards: MemoryCard[]
): Recommendation[] {
  const recs: Recommendation[] = [];

  for (const topic of weakTopics.slice(0, MAX_RECOMMENDATIONS)) {
    const slug = topic.id.replace(/^(tag|subject):/, "");
    const links = getExamTopicStudyLinks(examSlug, topic.name);
    recs.push({
      kind: "topic",
      key: topic.id,
      title: topic.name,
      slug,
      mastery: topic.masteryScore,
      deepDiveHref: links.deepDiveHref,
    });
  }

  if (recs.length < MAX_RECOMMENDATIONS) {
    const byId = new Map(cards.map((c) => [c.id, c]));
    for (const id of getPinnedMemoryCardIds(examSlug)) {
      if (recs.length >= MAX_RECOMMENDATIONS) break;
      const card = byId.get(id);
      if (!card) continue;
      recs.push({ kind: "card", key: card.id, title: card.title, subject: card.subject, card });
    }
  }

  return recs.slice(0, MAX_RECOMMENDATIONS);
}

export function LibraryRecommended({ examSlug, weakTopics, cards, onOpenCard }: Props) {
  const { copy } = useSessionTone();
  const recommendations = buildRecommendations(examSlug, weakTopics, cards);

  if (recommendations.length === 0) return null;

  return (
    <section aria-labelledby="library-recommended-heading" className="space-y-2.5">
      <h2 id="library-recommended-heading" className={cn(libUi.sectionTitle, "px-0.5")}>
        {copy.recommendedHeading}
      </h2>

      <ul className={libUi.listSurface}>
        {recommendations.map((rec) =>
          rec.kind === "topic" ? (
            <li key={rec.key}>
              <div className={cn(libUi.listRow, "flex-col items-stretch gap-3 sm:flex-row sm:items-center")}>
                <div className="min-w-0 flex-1">
                  <p className={libUi.eyebrow}>Focus next</p>
                  <p className="mt-0.5 truncate text-[15px] font-semibold text-[var(--color-ink)]">
                    {rec.title}
                  </p>
                  <p className={cn(libUi.sectionHint, "mt-0.5 line-clamp-1")}>
                    {copy.recommendationReason(rec.title, rec.mastery)}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2 sm:flex-row sm:items-center">
                  <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-amber-800">
                    {rec.mastery}%
                  </span>
                  <div className="flex gap-1.5">
                    <Link
                      href={practiceTopicHref(examSlug, rec.slug, 10)}
                      className={libUi.primaryBtn}
                    >
                      Practice
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                    </Link>
                    {rec.deepDiveHref ? (
                      <Link href={rec.deepDiveHref} className={libUi.ghostBtn} title="Deep dive">
                        <GraduationCap className="h-3.5 w-3.5" aria-hidden />
                        <span className="sr-only sm:not-sr-only">Review</span>
                      </Link>
                    ) : null}
                  </div>
                </div>
              </div>
            </li>
          ) : (
            <li key={rec.key}>
              <button type="button" onClick={() => onOpenCard(rec.card)} className={libUi.listRow}>
                <div className="min-w-0 flex-1 text-left">
                  <p className={libUi.eyebrow}>Essential · {rec.subject}</p>
                  <p className="mt-0.5 truncate text-[15px] font-semibold text-[var(--color-ink)]">
                    {rec.title}
                  </p>
                  <p className={cn(libUi.sectionHint, "mt-0.5")}>{copy.essentialReason}</p>
                </div>
                <BookMarked className="h-4 w-4 shrink-0 text-[var(--color-accent)]" aria-hidden />
                <ChevronRight className="h-4 w-4 shrink-0 text-[var(--color-ink-muted)]" aria-hidden />
              </button>
            </li>
          )
        )}
      </ul>
    </section>
  );
}
