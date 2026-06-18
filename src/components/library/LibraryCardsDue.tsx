"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { MemoryCardTile } from "@/components/reference/MemoryCardTile";
import { resolveCardsNeedingReview } from "@/lib/reference/card-mastery";
import type { MemoryCard } from "@/lib/reference/types";
import type { ExamSlug } from "@/types/edtech";

const MASTERY_EVENT = "aee-card-mastery-change";

export function ReferenceCardsDue({
  examSlug,
  cards,
  onOpenCard,
}: {
  examSlug: ExamSlug;
  cards: MemoryCard[];
  onOpenCard: (card: MemoryCard) => void;
}) {
  const [due, setDue] = useState<MemoryCard[]>([]);

  const refresh = useCallback(() => {
    setDue(resolveCardsNeedingReview(cards, examSlug, 4));
  }, [cards, examSlug]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const onMastery = (e: Event) => {
      const detail = (e as CustomEvent<{ examSlug: ExamSlug }>).detail;
      if (detail?.examSlug === examSlug) refresh();
    };
    window.addEventListener(MASTERY_EVENT, onMastery);
    return () => window.removeEventListener(MASTERY_EVENT, onMastery);
  }, [examSlug, refresh]);

  if (due.length === 0) return null;

  return (
    <section id="cards-due" aria-labelledby="cards-due-heading" className="space-y-3">
      <div className="flex items-center gap-2">
        <AlertCircle className="h-4 w-4 text-amber-600" aria-hidden />
        <h3 id="cards-due-heading" className="text-sm font-bold text-[var(--color-ink)]">
          Cards due for review
        </h3>
        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
          {due.length}
        </span>
      </div>
      <p className="text-xs text-[var(--color-ink-muted)]">
        You marked these as needing another pass — flip and practice while they&apos;re fresh.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {due.map((card, i) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <MemoryCardTile card={card} examSlug={examSlug} onOpen={() => onOpenCard(card)} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
