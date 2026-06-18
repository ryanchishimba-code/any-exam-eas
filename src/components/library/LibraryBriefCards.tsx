"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { MemoryCardTile } from "@/components/library/MemoryCardTile";
import type { MemoryCard } from "@/lib/library/types";

type Props = {
  cards: MemoryCard[];
  cardIds: string[];
  onOpenCard: (card: MemoryCard) => void;
};

export function LibraryBriefCards({ cards, cardIds, onOpenCard }: Props) {
  const byId = new Map(cards.map((c) => [c.id, c]));
  const recommended = cardIds
    .map((id) => byId.get(id))
    .filter((c): c is MemoryCard => Boolean(c))
    .slice(0, 6);

  if (recommended.length === 0) return null;

  return (
    <section id="brief-cards" aria-labelledby="brief-cards-heading" className="space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-violet-600" aria-hidden />
        <h3 id="brief-cards-heading" className="text-sm font-bold text-[var(--color-ink)]">
          From your AI brief
        </h3>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {recommended.map((card, i) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <MemoryCardTile
              card={card}
              examSlug={card.examSlug}
              onOpen={() => onOpenCard(card)}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
