"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal, Star } from "lucide-react";
import { MemoryCardTile } from "@/components/library/MemoryCardTile";
import {
  FAVORITE_CHANGE_EVENT,
  readFavorites,
  toggleFavorite,
} from "@/lib/library/favorites";
import { getCardsForTopicKey, queryMemoryCards } from "@/lib/library/memory-cards";
import { groupCardsBySubject } from "@/lib/library/arrange";
import { useSessionTone } from "@/lib/library/session-tone";
import { useLibraryMotion } from "@/lib/library/use-library-motion";
import { libUi } from "@/lib/library/library-ui";
import {
  MEMORY_CARD_KIND_LABELS,
  type MemoryCard,
  type MemoryCardKind,
} from "@/lib/library/types";
import type { WeakTopicRow } from "@/lib/learning/student-dashboard";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

type CollectionTab = "all" | "weak" | "favorites";

type Props = {
  examSlug: ExamSlug;
  cards: MemoryCard[];
  subjects: string[];
  weakTopics: WeakTopicRow[];
  /** Instant search query from the header (filters the visible list live). */
  query: string;
  onOpenCard: (card: MemoryCard) => void;
};

const TABS: Array<{ id: CollectionTab; label: string }> = [
  { id: "all", label: "All" },
  { id: "weak", label: "Weak Areas" },
  { id: "favorites", label: "Favorites" },
];

const KIND_OPTIONS: Array<{ value: MemoryCardKind | "all"; label: string }> = [
  { value: "all", label: "All types" },
  ...(Object.entries(MEMORY_CARD_KIND_LABELS) as Array<[MemoryCardKind, string]>).map(
    ([value, label]) => ({ value, label })
  ),
];

export function LibraryCollection({
  examSlug,
  cards,
  subjects,
  weakTopics,
  query,
  onOpenCard,
}: Props) {
  const { copy } = useSessionTone();
  const { reduce, spring, tap } = useLibraryMotion();
  const [tab, setTab] = useState<CollectionTab>("all");
  const [subject, setSubject] = useState<string>("all");
  const [kind, setKind] = useState<MemoryCardKind | "all">("all");
  const [showFilters, setShowFilters] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  // Keep favorites in sync with localStorage + cross-component toggles.
  useEffect(() => {
    setFavoriteIds(readFavorites(examSlug));
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<{ examSlug: ExamSlug }>).detail;
      if (detail?.examSlug === examSlug) setFavoriteIds(readFavorites(examSlug));
    };
    window.addEventListener(FAVORITE_CHANGE_EVENT, onChange);
    return () => window.removeEventListener(FAVORITE_CHANGE_EVENT, onChange);
  }, [examSlug]);

  const favoriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  // Cards mapped to the learner's weak topics (recommended-map + slug/topic match).
  const weakCards = useMemo(() => {
    const collected = new Map<string, MemoryCard>();
    for (const topic of weakTopics) {
      const slug = topic.id.replace(/^(tag|subject):/, "");
      for (const card of getCardsForTopicKey(cards, slug)) collected.set(card.id, card);
    }
    return [...collected.values()];
  }, [cards, weakTopics]);

  const trimmedQuery = query.trim();
  const isSearching = trimmedQuery.length >= 2;

  const baseList = useMemo(() => {
    if (tab === "weak") return weakCards;
    if (tab === "favorites") return cards.filter((c) => favoriteSet.has(c.id));
    return cards;
  }, [tab, weakCards, cards, favoriteSet]);

  const filtered = useMemo(
    () =>
      queryMemoryCards(baseList, {
        subject,
        kind,
        query: isSearching ? trimmedQuery : undefined,
      }),
    [baseList, subject, kind, isSearching, trimmedQuery]
  );

  // Browse the full "All" view as clean subject sections; keep search / weak /
  // favorites as flat lists since those are smaller, contextual sets.
  const grouped = tab === "all" && !isSearching;
  const groups = useMemo(
    () => (grouped ? groupCardsBySubject(filtered) : []),
    [grouped, filtered]
  );

  const renderCard = (card: MemoryCard) => {
    const isFav = favoriteSet.has(card.id);
    return (
      <div key={card.id} className="relative">
        <MemoryCardTile card={card} examSlug={examSlug} onOpen={() => onOpenCard(card)} />
        <motion.button
          type="button"
          aria-label={isFav ? "Remove from favorites" : "Save to favorites"}
          aria-pressed={isFav}
          whileTap={tap}
          transition={spring}
          onClick={() => toggleFavorite(examSlug, card.id)}
          className="absolute right-2.5 top-2.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[var(--color-ink-muted)] shadow-[var(--shadow-apple-sm)] backdrop-blur-sm transition-colors hover:text-amber-500"
        >
          <Star
            className={cn("h-4 w-4 transition-colors", isFav && "fill-amber-400 text-amber-500")}
            aria-hidden
          />
        </motion.button>
      </div>
    );
  };

  return (
    <section
      id="library-collection"
      aria-labelledby="library-collection-heading"
      className={cn(libUi.panel, "space-y-4 p-4 sm:p-5")}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="library-collection-heading" className={libUi.sectionTitle}>
          Your library
        </h2>
        <button
          type="button"
          onClick={() => setShowFilters((v) => !v)}
          aria-expanded={showFilters}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold transition",
            showFilters
              ? "bg-[var(--color-accent)]/[0.1] text-[var(--color-accent)]"
              : "bg-black/[0.04] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
          )}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden />
          Filters
        </button>
      </div>

      {/* Tabs — predictable, scannable, three options only. */}
      <div
        role="tablist"
        aria-label="Library view"
        className="inline-flex w-full gap-1 rounded-full border border-black/[0.06] bg-black/[0.03] p-1 sm:w-auto"
      >
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={active}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "relative flex-1 rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors duration-200 sm:flex-none",
                active ? "text-[var(--color-ink)]" : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
              )}
            >
              {active ? (
                reduce ? (
                  <span className="absolute inset-0 rounded-full bg-white shadow-[var(--shadow-apple-sm)]" />
                ) : (
                  <motion.span
                    layoutId="library-tab-pill"
                    transition={spring}
                    className="absolute inset-0 rounded-full bg-white shadow-[var(--shadow-apple-sm)]"
                  />
                )
              ) : null}
              <span className="relative z-10">{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Subject quick-nav: always visible on the All tab so any subject is one
          tap to find — no need to open the Filters panel. */}
      {tab === "all" && !isSearching ? (
        <div className={libUi.chipRow} role="group" aria-label="Jump to subject">
          <FilterPill active={subject === "all"} onClick={() => setSubject("all")} label="All subjects" />
          {subjects.map((s) => (
            <FilterPill key={s} active={subject === s} onClick={() => setSubject(s)} label={s} />
          ))}
        </div>
      ) : null}

      {/* Progressive disclosure: advanced filters stay hidden until requested. */}
      {showFilters ? (
        <div className="space-y-2.5 rounded-[16px] bg-black/[0.02] p-3">
          {/* Subject pills only needed here when the inline quick-nav is hidden. */}
          {tab !== "all" || isSearching ? (
            <div className={libUi.chipRow}>
              <FilterPill active={subject === "all"} onClick={() => setSubject("all")} label="All subjects" />
              {subjects.map((s) => (
                <FilterPill key={s} active={subject === s} onClick={() => setSubject(s)} label={s} />
              ))}
            </div>
          ) : null}
          <div className={libUi.chipRow}>
            {KIND_OPTIONS.map((opt) => (
              <FilterPill
                key={opt.value}
                active={kind === opt.value}
                onClick={() => setKind(opt.value)}
                label={opt.label}
              />
            ))}
          </div>
        </div>
      ) : null}

      <p className={libUi.sectionHint}>
        {isSearching
          ? `${filtered.length} result${filtered.length === 1 ? "" : "s"} for “${trimmedQuery}”`
          : `${filtered.length} card${filtered.length === 1 ? "" : "s"}`}
      </p>

      {filtered.length === 0 ? (
        <div className={libUi.emptyState}>
          <p className="text-[15px] font-medium text-[var(--color-ink)]">
            {tab === "favorites"
              ? "No favorites yet"
              : tab === "weak"
                ? "No weak-area cards to show"
                : copy.emptyLibrary}
          </p>
          <p className={cn(libUi.sectionHint, "mt-1")}>
            {tab === "favorites"
              ? "Tap the star on any card to save it here for quick access."
              : tab === "weak"
                ? "Keep practicing — your weak areas will surface here as you learn."
                : "Try a different search or clear your filters."}
          </p>
        </div>
      ) : grouped ? (
        <motion.div
          key={`grouped:${subject}:${kind}`}
          initial={reduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-6"
        >
          {groups.map((group) => (
            <section key={group.key} id={`subject-${group.key}`} aria-label={group.subject}>
              <div className="mb-2.5 flex items-baseline gap-2">
                <h3 className="text-[14px] font-semibold tracking-tight text-[var(--color-ink)]">
                  {group.subject}
                </h3>
                <span className="text-[12px] tabular-nums text-[var(--color-ink-muted)]">
                  {group.cards.length}
                </span>
              </div>
              <div className={libUi.cardGrid}>{group.cards.map(renderCard)}</div>
            </section>
          ))}
        </motion.div>
      ) : (
        <motion.div
          key={`${tab}:${trimmedQuery}:${subject}:${kind}`}
          initial={reduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className={libUi.cardGrid}
        >
          {filtered.map(renderCard)}
        </motion.div>
      )}
    </section>
  );
}

function FilterPill({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        libUi.filterPill,
        active
          ? "bg-[var(--color-accent)] text-white shadow-[var(--shadow-apple-sm)]"
          : "bg-black/[0.04] text-[var(--color-ink-muted)] hover:bg-black/[0.06] hover:text-[var(--color-ink)]"
      )}
    >
      {label}
    </button>
  );
}
