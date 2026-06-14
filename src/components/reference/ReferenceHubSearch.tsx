"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import Link from "next/link";
import { Bone, BookMarked, GraduationCap, Pill, Search, Syringe, X } from "lucide-react";
import {
  anatomyHref,
  anatomyProcedureHref,
  deepDiveTopicHref,
  top500Href,
} from "@/lib/edtech/practice-links";
import { hubSearchHasResults, searchReferenceHub } from "@/lib/reference/hub-search";
import { isMpjeExam } from "@/lib/edtech/exam-content-scope";
import type { MemoryCard } from "@/lib/reference/types";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

type Props = {
  examSlug: ExamSlug;
  cards: MemoryCard[];
  onOpenCard: (card: MemoryCard) => void;
  onQueryChange?: (query: string) => void;
  inputRef?: RefObject<HTMLInputElement | null>;
};

export function ReferenceHubSearch({ examSlug, cards, onOpenCard, onQueryChange, inputRef }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const localInputRef = useRef<HTMLInputElement>(null);
  const resolvedInputRef = inputRef ?? localInputRef;

  const results = useMemo(
    () => (query.trim().length >= 2 ? searchReferenceHub(cards, examSlug, query) : null),
    [cards, examSlug, query]
  );

  const hasResults = results != null && hubSearchHasResults(results);

  useEffect(() => {
    onQueryChange?.(query);
  }, [query, onQueryChange]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <label className="relative block">
        <span className="sr-only">Search knowledge hub</span>
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--color-ink-muted)]"
          aria-hidden
        />
        <input
          ref={resolvedInputRef}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={
            isMpjeExam(examSlug)
              ? "Search cards and review modules…"
              : "Search cards, drugs, anatomy, procedures…"
          }
          className={cn(
            "w-full rounded-[14px] border-0 bg-black/[0.04] py-3 pl-11 pr-24 text-[15px] text-[var(--color-ink)]",
            "outline-none transition placeholder:text-[var(--color-ink-muted)]",
            "focus:bg-white focus:shadow-[0_0_0_3px_rgba(79,70,229,0.18)]"
          )}
        />
        <kbd className="pointer-events-none absolute right-12 top-1/2 hidden -translate-y-1/2 rounded-md border border-black/[0.08] bg-[var(--color-surface)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--color-ink-muted)] sm:inline">
          ⌘K
        </kbd>
        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-[var(--color-ink-muted)] hover:bg-[var(--color-surface)]"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        ) : null}
      </label>

      {open && query.trim().length >= 2 ? (
        <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-xl">
          {!hasResults ? (
            <p className="px-4 py-6 text-center text-sm text-[var(--color-ink-muted)]">
              No matches for &ldquo;{query}&rdquo;
            </p>
          ) : (
            <div className="max-h-[min(60vh,480px)] overflow-y-auto p-2">
              {results!.cards.length > 0 ? (
                <SearchSection title="Memory cards" count={results!.cards.length}>
                  {results!.cards.map((card) => (
                    <li key={card.id}>
                      <button
                        type="button"
                        onClick={() => {
                          onOpenCard(card);
                          setOpen(false);
                          setQuery("");
                        }}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-[var(--color-surface)]"
                      >
                        <BookMarked className="h-4 w-4 shrink-0 text-[var(--color-accent)]" aria-hidden />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[var(--color-ink)]">
                            {card.title}
                          </p>
                          <p className="truncate text-xs text-[var(--color-ink-muted)]">
                            {card.subject} · {card.topic}
                          </p>
                        </div>
                      </button>
                    </li>
                  ))}
                </SearchSection>
              ) : null}

              {results!.modules.length > 0 ? (
                <SearchSection title="Review modules" count={results!.modules.length}>
                  {results!.modules.map((mod) => (
                    <li key={mod.slug}>
                      <Link
                        href={deepDiveTopicHref(examSlug, mod.slug)}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-[var(--color-surface)]"
                      >
                        <GraduationCap className="h-4 w-4 shrink-0 text-violet-600" aria-hidden />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[var(--color-ink)]">
                            {mod.title}
                          </p>
                          <p className="line-clamp-1 text-xs text-[var(--color-ink-muted)]">
                            {mod.overview}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </SearchSection>
              ) : null}

              {results!.anatomy.length > 0 ? (
                <SearchSection title="Anatomy" count={results!.anatomy.length}>
                  {results!.anatomy.map((structure) => (
                    <li key={structure.id}>
                      <Link
                        href={anatomyHref(examSlug, structure.id)}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-[var(--color-surface)]"
                      >
                        <Bone className="h-4 w-4 shrink-0 text-rose-600" aria-hidden />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[var(--color-ink)]">
                            {structure.name}
                          </p>
                          <p className="truncate text-xs capitalize text-[var(--color-ink-muted)]">
                            {structure.system}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </SearchSection>
              ) : null}

              {results!.procedures.length > 0 ? (
                <SearchSection title="Procedures" count={results!.procedures.length}>
                  {results!.procedures.map((proc) => (
                    <li key={proc.id}>
                      <Link
                        href={anatomyProcedureHref(proc.id, examSlug)}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-[var(--color-surface)]"
                      >
                        <Syringe className="h-4 w-4 shrink-0 text-indigo-600" aria-hidden />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[var(--color-ink)]">
                            {proc.name}
                          </p>
                          <p className="line-clamp-1 text-xs text-[var(--color-ink-muted)]">
                            {proc.indication}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </SearchSection>
              ) : null}

              {results!.drugs.length > 0 ? (
                <SearchSection title="Top 500 drugs" count={results!.drugs.length}>
                  {results!.drugs.map((drug) => (
                    <li key={drug.id}>
                      <Link
                        href={`${top500Href(examSlug)}&drug=${encodeURIComponent(drug.id)}`}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-[var(--color-surface)]"
                      >
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: drug.drugClassColor }}
                          aria-hidden
                        />
                        <Pill className="h-4 w-4 shrink-0 text-violet-600" aria-hidden />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[var(--color-ink)]">
                            {drug.generic}
                          </p>
                          <p className="truncate text-xs text-[var(--color-ink-muted)]">
                            {drug.brand} · {drug.drugClassLabel}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </SearchSection>
              ) : null}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

function SearchSection({
  title,
  count,
  children,
}: {
  title: string;
  count?: number;
  children: ReactNode;
}) {
  return (
    <div className="mb-2">
      <p className="flex items-center gap-2 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-[var(--color-ink-muted)]">
        {title}
        {count != null ? (
          <span className="rounded-full bg-[var(--color-surface)] px-1.5 py-0.5 tabular-nums">
            {count}
          </span>
        ) : null}
      </p>
      <ul>{children}</ul>
    </div>
  );
}
