"use client";

import { useEffect, useState } from "react";
import { BookMarked, CheckCircle2, ChevronRight, RotateCcw } from "lucide-react";
import { getCardMastery } from "@/lib/library/card-mastery";
import { MEMORY_CARD_KIND_LABELS, type MemoryCard } from "@/lib/library/types";
import { getMemoryCardPreview } from "@/lib/library/card-preview";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

const KIND_COLORS: Record<MemoryCard["kind"], string> = {
  equation: "bg-blue-500/10 text-blue-700",
  conversion: "bg-amber-500/10 text-amber-800",
  fact: "bg-teal-500/10 text-teal-800",
  table: "bg-violet-500/10 text-violet-800",
  mistake: "bg-rose-500/10 text-rose-800",
  pearl: "bg-emerald-500/10 text-emerald-800",
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
        "group flex h-full w-full flex-col rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4 text-left shadow-[var(--shadow-apple-sm)] transition",
        "hover:-translate-y-0.5 hover:border-[var(--color-accent)]/25 hover:shadow-[var(--shadow-apple-md)] active:scale-[0.995]"
      )}
    >
      <div className="flex flex-wrap items-center gap-1.5">
        <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold", KIND_COLORS[card.kind])}>
          {MEMORY_CARD_KIND_LABELS[card.kind]}
        </span>
        <span className="rounded-full bg-black/[0.04] px-2 py-0.5 text-[10px] font-semibold text-[var(--color-ink-muted)]">
          {card.subject}
        </span>
        {mastery === "got-it" ? (
          <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
            <CheckCircle2 className="h-3 w-3" aria-hidden />
            Got it
          </span>
        ) : null}
        {mastery === "need-review" ? (
          <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-900">
            <RotateCcw className="h-3 w-3" aria-hidden />
            Review
          </span>
        ) : null}
      </div>
      <p className="mt-2 text-[11px] font-medium uppercase tracking-wide text-[var(--color-ink-muted)]">
        {card.topic}
      </p>
      <p className="mt-0.5 text-[17px] font-semibold leading-snug text-[var(--color-ink)] group-hover:text-[var(--color-accent)]">
        {card.title}
      </p>
      <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-[var(--color-ink-muted)]">
        {card.teaser}
      </p>
      <p className="mt-3 line-clamp-2 rounded-[12px] bg-[var(--color-surface)] px-3 py-2 text-[12px] leading-relaxed text-[var(--color-ink)]">
        {getMemoryCardPreview(card)}
      </p>
      <span className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-[var(--color-accent)]">
        <BookMarked className="h-3.5 w-3.5" aria-hidden />
        Open card
        <ChevronRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" aria-hidden />
      </span>
    </button>
  );
}
