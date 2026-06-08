"use client";

import { BookMarked, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MEMORY_CARD_KIND_LABELS, type MemoryCard } from "@/lib/reference/types";
import { cn } from "@/lib/utils";

const KIND_COLORS: Record<MemoryCard["kind"], string> = {
  equation: "bg-blue-50 text-blue-800",
  conversion: "bg-amber-50 text-amber-800",
  fact: "bg-teal-50 text-teal-800",
  table: "bg-violet-50 text-violet-800",
  mistake: "bg-rose-50 text-rose-800",
  pearl: "bg-emerald-50 text-emerald-800",
};

export function MemoryCardTile({
  card,
  onOpen,
}: {
  card: MemoryCard;
  onOpen: () => void;
}) {
  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      className={cn(
        "group flex h-full cursor-pointer flex-col overflow-hidden border-black/[0.06] transition duration-200",
        "hover:-translate-y-0.5 hover:border-[var(--color-accent)]/30 hover:shadow-lg hover:shadow-teal-50/40"
      )}
    >
      <CardHeader className="flex-1 pb-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className={KIND_COLORS[card.kind]}>{MEMORY_CARD_KIND_LABELS[card.kind]}</Badge>
          <Badge className="bg-slate-100 text-slate-600">
            {card.subject}
          </Badge>
          {card.reviewModuleSlug ? (
            <Badge className="bg-violet-50 text-violet-700">Deep Dive</Badge>
          ) : null}
        </div>
        <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
          {card.topic}
        </p>
        <CardTitle className="mt-1 text-lg leading-snug text-[var(--color-ink)] group-hover:text-[var(--color-accent)]">
          {card.title}
        </CardTitle>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">
          {card.teaser}
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="line-clamp-3 rounded-xl bg-[var(--color-surface)] px-3 py-2.5 font-mono text-xs leading-relaxed text-[var(--color-ink)]">
          {card.body || card.bullets?.[0] || "Tap to view"}
        </p>
        <div className="mt-3 flex items-center justify-between text-xs font-semibold text-[var(--color-accent)]">
          <span className="inline-flex items-center gap-1">
            <BookMarked className="h-3.5 w-3.5" aria-hidden />
            Open card
          </span>
          <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
        </div>
      </CardContent>
    </Card>
  );
}
