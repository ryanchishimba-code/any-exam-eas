"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, ChevronRight, RotateCcw } from "lucide-react";
import { getCardMastery } from "@/lib/library/card-mastery";
import { MEMORY_CARD_KIND_LABELS, type MemoryCard } from "@/lib/library/types";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

const KIND_DOT: Record<MemoryCard["kind"], string> = {
  equation: "bg-blue-500",
  conversion: "bg-amber-500",
  fact: "bg-teal-500",
  table: "bg-violet-500",
  mistake: "bg-rose-500",
  pearl: "bg-emerald-500",
};

export function MemoryCardTile({
  card,
  examSlug,
  onOpen,
}: {
  card: MemoryCard;
  examSlug?: ExamSlug;
  onOpen: () => void;
}) {
  const [mastery, setMastery] = useState<ReturnType<typeof getCardMastery>>(null);

  useEffect(() => {
    if (!examSlug) return;
    setMastery(getCardMastery(card.id, examSlug));
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<{ examSlug: ExamSlug; cardId?: string; hydrated?: boolean }>)
        .detail;
      if (detail?.examSlug !== examSlug) return;
      if (detail.hydrated || detail.cardId === card.id) {
        setMastery(getCardMastery(card.id, examSlug));
      }
    };
    window.addEventListener("aee-card-mastery-change", onChange);
    return () => window.removeEventListener("aee-card-mastery-change", onChange);
  }, [card.id, examSlug]);

  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "group flex h-full w-full flex-col rounded-2xl border border-[var(--color-border)]/60 bg-[var(--color-surface-elevated)] p-3.5 text-left transition",
        "hover:border-[var(--color-accent)]/20 hover:bg-[var(--color-surface)]/40 active:scale-[0.995]"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", KIND_DOT[card.kind])}
            title={MEMORY_CARD_KIND_LABELS[card.kind]}
            aria-hidden
          />
          <div className="min-w-0">
            <p className="truncate text-[11px] font-medium text-[var(--color-ink-muted)]">
              {card.subject} · {card.topic}
            </p>
            <p className="mt-0.5 line-clamp-2 text-[15px] font-semibold leading-snug text-[var(--color-ink)] group-hover:text-[var(--color-accent)]">
              {card.title}
            </p>
          </div>
        </div>
        <ChevronRight
          className="mt-1 h-4 w-4 shrink-0 text-[var(--color-ink-muted)]/50 transition group-hover:text-[var(--color-accent)]"
          aria-hidden
        />
      </div>

      <p className="mt-2 line-clamp-2 text-[12px] leading-relaxed text-[var(--color-ink-muted)]">
        {card.teaser}
      </p>

      {mastery === "got-it" ? (
        <span className="mt-2 inline-flex w-fit items-center gap-1 text-[10px] font-semibold text-emerald-700">
          <CheckCircle2 className="h-3 w-3" aria-hidden />
          Got it
        </span>
      ) : mastery === "need-review" ? (
        <span className="mt-2 inline-flex w-fit items-center gap-1 text-[10px] font-semibold text-amber-800">
          <RotateCcw className="h-3 w-3" aria-hidden />
          Review
        </span>
      ) : null}
    </button>
  );
}
