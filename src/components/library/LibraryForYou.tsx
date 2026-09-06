"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, TrendingDown } from "lucide-react";
import { MemoryCardTile } from "@/components/library/MemoryCardTile";
import { libraryTopicHref, practiceTopicHref } from "@/lib/edtech/practice-links";
import { getRecommendedMemoryCards } from "@/lib/library/memory-cards";
import { resolveCardsNeedingReview } from "@/lib/library/card-mastery";
import { getPinnedMemoryCardIds } from "@/lib/library/pinned-essentials";
import type { MemoryCard } from "@/lib/library/types";
import { filterStudentFacingWeakTopics } from "@/lib/learning/concept-labels";
import type { WeakTopicRow } from "@/lib/learning/student-dashboard";
import type { ExamSlug } from "@/types/edtech";

type Props = {
  examSlug: ExamSlug;
  cards: MemoryCard[];
  weakTopics: WeakTopicRow[];
  topicKey?: string;
  onOpenCard: (card: MemoryCard) => void;
};

export function LibraryForYou({
  examSlug,
  cards,
  weakTopics,
  topicKey,
  onOpenCard,
}: Props) {
  const pinnedIds = getPinnedMemoryCardIds(examSlug);
  const byId = new Map(cards.map((c) => [c.id, c]));
  const facingWeak = filterStudentFacingWeakTopics(weakTopics);

  const dueCards = resolveCardsNeedingReview(cards, examSlug, 3);
  const topicRecommended = getRecommendedMemoryCards(cards, topicKey);
  const weakRecommended = facingWeak.flatMap((t) =>
    getRecommendedMemoryCards(cards, t.id.replace(/^(tag|subject):/, ""))
  );
  const pinned = pinnedIds.map((id) => byId.get(id)).filter((c): c is MemoryCard => Boolean(c));

  const seen = new Set<string>();
  const forYou: MemoryCard[] = [];
  for (const card of [...dueCards, ...topicRecommended, ...weakRecommended, ...pinned]) {
    if (seen.has(card.id)) continue;
    seen.add(card.id);
    forYou.push(card);
    if (forYou.length >= 6) break;
  }

  if (forYou.length === 0 && facingWeak.length === 0) return null;

  return (
    <section id="for-you" aria-labelledby="for-you-heading" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-violet-600" aria-hidden />
          <h3 id="for-you-heading" className="text-sm font-bold text-[var(--color-ink)]">
            For you today
          </h3>
        </div>
        {facingWeak.length > 0 ? (
          <p className="text-xs text-[var(--color-ink-muted)]">
            Based on your practice analytics
          </p>
        ) : null}
      </div>

      {facingWeak.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {facingWeak.slice(0, 4).map((topic, i) => {
            const slug = topic.id.replace(/^(tag|subject):/, "");
            return (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="inline-flex items-center gap-1"
            >
              <Link
                href={libraryTopicHref(examSlug, slug)}
                className="inline-flex items-center gap-2 rounded-l-full border border-amber-200/80 bg-amber-50/80 px-3 py-1.5 text-xs font-semibold text-amber-900 transition hover:border-amber-300 hover:bg-amber-100"
              >
                <TrendingDown className="h-3.5 w-3.5 text-amber-600" aria-hidden />
                {topic.name}
                <span className="tabular-nums text-amber-700/80">{topic.masteryScore}%</span>
              </Link>
              <Link
                href={practiceTopicHref(examSlug, slug, 10)}
                className="inline-flex items-center rounded-r-full border border-l-0 border-amber-200/80 bg-amber-100/80 px-2.5 py-1.5 text-[11px] font-bold text-amber-800 transition hover:bg-amber-200"
                title={`Practice ${topic.name}`}
              >
                10 Q
                <ArrowRight className="ml-1 h-3 w-3 opacity-70" aria-hidden />
              </Link>
            </motion.div>
            );
          })}
        </div>
      ) : null}

      {forYou.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {forYou.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + i * 0.04 }}
            >
              <MemoryCardTile card={card} examSlug={examSlug} onOpen={() => onOpenCard(card)} />
            </motion.div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
