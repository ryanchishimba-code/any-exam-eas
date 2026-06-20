"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { MemoryCardTile } from "@/components/library/MemoryCardTile";
import { useLibraryMotion } from "@/lib/library/use-library-motion";
import type { MemoryCard } from "@/lib/library/types";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

/**
 * A memory-card tile with a corner favorite toggle. Presentational — the parent
 * owns favorite state so a single listener keeps the whole view in sync.
 */
export function FavoriteCardTile({
  card,
  examSlug,
  isFavorite,
  onOpen,
  onToggleFavorite,
}: {
  card: MemoryCard;
  examSlug: ExamSlug;
  isFavorite: boolean;
  onOpen: () => void;
  onToggleFavorite: () => void;
}) {
  const { spring, tap } = useLibraryMotion();
  return (
    <div className="relative">
      <MemoryCardTile card={card} examSlug={examSlug} onOpen={onOpen} />
      <motion.button
        type="button"
        aria-label={isFavorite ? "Remove from favorites" : "Save to favorites"}
        aria-pressed={isFavorite}
        whileTap={tap}
        transition={spring}
        onClick={onToggleFavorite}
        className="absolute right-2.5 top-2.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[var(--color-ink-muted)] shadow-[var(--shadow-apple-sm)] backdrop-blur-sm transition-colors hover:text-amber-500"
      >
        <Star
          className={cn("h-4 w-4 transition-colors", isFavorite && "fill-amber-400 text-amber-500")}
          aria-hidden
        />
      </motion.button>
    </div>
  );
}
