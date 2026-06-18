"use client";

import { ChevronRight } from "lucide-react";
import { MEMORY_CARD_KIND_LABELS, type MemoryCard } from "@/lib/library/types";
import { getMemoryCardPreview } from "@/lib/library/card-preview";
import { libUi } from "@/lib/library/library-ui";
import { cn } from "@/lib/utils";

export function MemoryCardCompactTile({
  card,
  badge,
  onOpen,
}: {
  card: MemoryCard;
  badge?: string;
  onOpen: () => void;
}) {
  return (
    <button type="button" onClick={onOpen} className={libUi.cardCompact}>
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-[var(--color-accent)]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--color-accent)]">
          {MEMORY_CARD_KIND_LABELS[card.kind]}
        </span>
        {badge ? (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
            {badge}
          </span>
        ) : null}
      </div>
      <p className="mt-2 line-clamp-1 text-[11px] font-medium uppercase tracking-wide text-[var(--color-ink-muted)]">
        {card.subject}
      </p>
      <p className="mt-0.5 line-clamp-2 text-left text-[15px] font-semibold leading-snug text-[var(--color-ink)]">
        {card.title}
      </p>
      <p className="mt-2 line-clamp-2 text-left text-[12px] leading-relaxed text-[var(--color-ink-muted)]">
        {getMemoryCardPreview(card)}
      </p>
      <span
        className={cn(
          "mt-3 inline-flex items-center gap-0.5 text-[12px] font-semibold text-[var(--color-accent)]"
        )}
      >
        Open
        <ChevronRight className="h-3.5 w-3.5" aria-hidden />
      </span>
    </button>
  );
}
