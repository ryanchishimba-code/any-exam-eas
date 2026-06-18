"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, TrendingDown } from "lucide-react";
import { MemoryCardCompactTile } from "@/components/reference/MemoryCardCompactTile";
import { practiceTopicHref, referenceTopicHref } from "@/lib/edtech/practice-links";
import { resolveCardsNeedingReview } from "@/lib/reference/card-mastery";
import { getRecommendedMemoryCards } from "@/lib/reference/memory-cards";
import { getPinnedMemoryCardIds } from "@/lib/reference/pinned-essentials";
import { resolveRecentMemoryCards } from "@/lib/reference/recent-cards";
import { refUi } from "@/lib/reference/reference-ui";
import type { WeakTopicRow } from "@/lib/learning/student-dashboard";
import type { MemoryCard } from "@/lib/reference/types";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

type Props = {
  examSlug: ExamSlug;
  cards: MemoryCard[];
  weakTopics: WeakTopicRow[];
  topicKey?: string;
  briefCardIds?: string[];
  onOpenCard: (card: MemoryCard) => void;
};

type PickedCard = { card: MemoryCard; badge?: string };

function buildPickedCards(
  cards: MemoryCard[],
  examSlug: ExamSlug,
  weakTopics: WeakTopicRow[],
  topicKey?: string,
  briefCardIds?: string[]
): PickedCard[] {
  const byId = new Map(cards.map((c) => [c.id, c]));
  const dueIds = new Set(resolveCardsNeedingReview(cards, examSlug, 8).map((c) => c.id));
  const recentIds = new Set(
    resolveRecentMemoryCards(cards, examSlug).slice(0, 4).map((c) => c.id)
  );
  const pinnedIds = new Set(getPinnedMemoryCardIds(examSlug));

  const ordered: PickedCard[] = [];
  const seen = new Set<string>();

  const push = (card: MemoryCard | undefined, badge?: string) => {
    if (!card || seen.has(card.id)) return;
    seen.add(card.id);
    ordered.push({ card, badge });
  };

  for (const id of briefCardIds ?? []) {
    push(byId.get(id), "Brief");
  }
  for (const card of cards) {
    if (dueIds.has(card.id)) push(card, "Due");
  }
  for (const card of getRecommendedMemoryCards(cards, topicKey)) {
    push(card, topicKey ? "Topic" : undefined);
  }
  for (const topic of weakTopics) {
    const slug = topic.id.replace(/^(tag|subject):/, "");
    for (const card of getRecommendedMemoryCards(cards, slug)) {
      push(card, "Weak area");
    }
  }
  for (const id of pinnedIds) {
    push(byId.get(id), "Essential");
  }
  for (const card of cards) {
    if (recentIds.has(card.id)) push(card, "Recent");
  }

  return ordered.slice(0, 6);
}

export function ReferenceTodayRow({
  examSlug,
  cards,
  weakTopics,
  topicKey,
  briefCardIds,
  onOpenCard,
}: Props) {
  const picked = buildPickedCards(cards, examSlug, weakTopics, topicKey, briefCardIds);

  if (picked.length === 0 && weakTopics.length === 0) return null;

  return (
    <section id="hub-picks" aria-labelledby="hub-picks-heading" className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[var(--color-accent)]" aria-hidden />
            <h2 id="hub-picks-heading" className={refUi.sectionTitle}>
              Picked for you
            </h2>
          </div>
          <p className={cn(refUi.sectionHint, "mt-0.5")}>
            Due cards and weak areas — tap to open.
          </p>
        </div>
      </div>

      {weakTopics.length > 0 ? (
        <div className={refUi.chipRow}>
          {weakTopics.slice(0, 4).map((topic) => {
            const slug = topic.id.replace(/^(tag|subject):/, "");
            return (
              <div key={topic.id} className="inline-flex shrink-0 snap-start items-center overflow-hidden rounded-full border border-amber-200/70 bg-amber-50/80">
                <Link
                  href={referenceTopicHref(examSlug, slug)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold text-amber-950"
                >
                  <TrendingDown className="h-3.5 w-3.5 text-amber-600" aria-hidden />
                  {topic.name}
                  <span className="tabular-nums text-amber-700/80">{topic.masteryScore}%</span>
                </Link>
                <Link
                  href={practiceTopicHref(examSlug, slug, 10)}
                  className="border-l border-amber-200/70 px-2.5 py-2 text-[11px] font-bold text-amber-800 hover:bg-amber-100/80"
                >
                  Practice
                  <ArrowRight className="ml-0.5 inline h-3 w-3" aria-hidden />
                </Link>
              </div>
            );
          })}
        </div>
      ) : null}

      {picked.length > 0 ? (
        <div className={cn(refUi.chipRow, "snap-x snap-mandatory px-0.5")}>
          {picked.map(({ card, badge }) => (
            <MemoryCardCompactTile
              key={card.id}
              card={card}
              badge={badge}
              onOpen={() => onOpenCard(card)}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
