"use client";

import { useState } from "react";
import Link from "next/link";
import { BookMarked, ChevronDown } from "lucide-react";
import { libraryCardHref } from "@/lib/edtech/practice-links";
import type { ExamSlug } from "@/types/edtech";
import type { MemoryCard } from "@/lib/library/types";
import { cn } from "@/lib/utils";

type Props = {
  examSlug: ExamSlug;
  cards: MemoryCard[];
  className?: string;
};

export function RelatedMemoryCardsCollapsible({ examSlug, cards, className }: Props) {
  const [expanded, setExpanded] = useState(false);

  if (cards.length === 0) return null;

  return (
    <section
      className={cn(
        "rounded-2xl border border-teal-200/60 bg-teal-50/40 p-4",
        className
      )}
    >
      <button
        type="button"
        onClick={() => setExpanded((open) => !open)}
        aria-expanded={expanded}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-800">
          <BookMarked className="h-4 w-4 shrink-0" aria-hidden />
          Related memory cards ({cards.length})
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-teal-700 transition-transform",
            expanded && "rotate-180"
          )}
          aria-hidden
        />
      </button>

      {expanded ? (
        <ul className="mt-3 space-y-2">
          {cards.map((card) => (
            <li key={card.id}>
              <Link
                href={libraryCardHref(examSlug, card.id)}
                className="block rounded-xl bg-white px-3 py-2 text-sm font-medium text-slate-800 ring-1 ring-teal-200/80 transition hover:bg-teal-50"
              >
                {card.title}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-xs text-teal-900/70">
          Expand to review {cards.length} linked flashcards in Library.
        </p>
      )}
    </section>
  );
}
