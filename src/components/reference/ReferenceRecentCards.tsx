"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { MemoryCardTile } from "@/components/reference/MemoryCardTile";
import { resolveRecentMemoryCards } from "@/lib/reference/recent-cards";
import type { MemoryCard } from "@/lib/reference/types";
import type { ExamSlug } from "@/types/edtech";

export function ReferenceRecentCards({
  examSlug,
  cards,
  onOpenCard,
}: {
  examSlug: ExamSlug;
  cards: MemoryCard[];
  onOpenCard: (card: MemoryCard) => void;
}) {
  const [recent, setRecent] = useState<MemoryCard[]>([]);

  useEffect(() => {
    setRecent(resolveRecentMemoryCards(cards, examSlug));
  }, [cards, examSlug]);

  if (recent.length === 0) return null;

  return (
    <section id="recent-cards" aria-labelledby="recent-cards-heading" className="space-y-3">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-[var(--color-ink-muted)]" aria-hidden />
        <h3 id="recent-cards-heading" className="text-sm font-bold text-[var(--color-ink)]">
          Recently viewed
        </h3>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {recent.slice(0, 3).map((card, i) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <MemoryCardTile card={card} examSlug={examSlug} onOpen={() => onOpenCard(card)} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
