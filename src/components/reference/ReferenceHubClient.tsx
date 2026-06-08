"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MemoryCardTile } from "@/components/reference/MemoryCardTile";
import { MemoryCardSheet } from "@/components/reference/MemoryCardSheet";
import { queryMemoryCards } from "@/lib/reference/memory-cards";
import {
  MEMORY_CARD_KIND_LABELS,
  type MemoryCard,
  type MemoryCardKind,
} from "@/lib/reference/types";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

type Props = {
  examSlug: ExamSlug;
  cards: MemoryCard[];
  subjects: string[];
  initialCardId?: string;
};

const KIND_OPTIONS: Array<{ value: MemoryCardKind | "all"; label: string }> = [
  { value: "all", label: "All types" },
  ...(
    Object.entries(MEMORY_CARD_KIND_LABELS) as Array<[MemoryCardKind, string]>
  ).map(([value, label]) => ({ value, label })),
];

export function ReferenceHubClient({ examSlug, cards, subjects, initialCardId }: Props) {
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState<string>("all");
  const [kind, setKind] = useState<MemoryCardKind | "all">("all");
  const [selected, setSelected] = useState<MemoryCard | null>(null);

  useEffect(() => {
    if (!initialCardId) return;
    const match = cards.find((c) => c.id === initialCardId);
    if (match) setSelected(match);
  }, [cards, initialCardId]);

  const filtered = useMemo(
    () => queryMemoryCards(cards, { query, subject, kind }),
    [cards, query, subject, kind]
  );

  const withDeepDive = cards.filter((c) => c.reviewModuleSlug).length;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-black/[0.06] bg-gradient-to-br from-violet-50/80 via-white to-teal-50/50 p-5 shadow-[var(--shadow-apple-sm)] sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-violet-600">
              Memory Cards
            </p>
            <h2 className="mt-1 text-xl font-bold text-[var(--color-ink)] sm:text-2xl">
              Bite-sized reference at exam speed
            </h2>
            <p className="mt-2 max-w-xl text-sm text-[var(--color-ink-muted)]">
              Equations, conversions, tables, and pearls — searchable by subject. Tap a card for
              details, then jump to practice or a deeper review module.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-white/80">
              {cards.length} cards
            </Badge>
            {withDeepDive > 0 ? (
              <Badge className="bg-violet-100 text-violet-800">
                {withDeepDive} with Deep Dive
              </Badge>
            ) : null}
          </div>
        </div>
      </div>

      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-ink-muted)]"
          aria-hidden
        />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search equations, topics, tags…"
          className="h-11 rounded-2xl border-black/[0.08] bg-white pl-10"
          aria-label="Search memory cards"
        />
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <FilterPill
            active={subject === "all"}
            onClick={() => setSubject("all")}
            label="All subjects"
          />
          {subjects.map((s) => (
            <FilterPill
              key={s}
              active={subject === s}
              onClick={() => setSubject(s)}
              label={s}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {KIND_OPTIONS.map((opt) => (
            <FilterPill
              key={opt.value}
              active={kind === opt.value}
              onClick={() => setKind(opt.value)}
              label={opt.label}
              variant="kind"
            />
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/[0.1] bg-white px-6 py-12 text-center">
          <p className="text-sm font-medium text-[var(--color-ink)]">No cards match your filters</p>
          <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
            Try clearing search or choosing a different subject.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((card) => (
            <MemoryCardTile
              key={card.id}
              card={card}
              onOpen={() => setSelected(card)}
            />
          ))}
        </div>
      )}

      <MemoryCardSheet
        card={selected}
        examSlug={examSlug}
        open={selected !== null}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  label,
  variant = "subject",
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  variant?: "subject" | "kind";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-3 py-1.5 text-xs font-semibold transition",
        variant === "kind" && "text-[11px]",
        active
          ? "bg-[var(--color-accent)] text-white shadow-sm"
          : "bg-white text-[var(--color-ink-muted)] ring-1 ring-black/[0.08] hover:bg-[var(--color-surface)]"
      )}
    >
      {label}
    </button>
  );
}
