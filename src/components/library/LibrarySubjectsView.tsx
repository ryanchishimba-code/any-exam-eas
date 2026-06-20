"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { FavoriteCardTile } from "@/components/library/FavoriteCardTile";
import { groupCardsBySubject, compareCardsWithinSubject } from "@/lib/library/arrange";
import { readMasteryStore } from "@/lib/library/card-mastery";
import { subjectVisual } from "@/lib/library/subject-icon";
import { useFavorites } from "@/lib/library/use-favorites";
import { useLibraryMotion } from "@/lib/library/use-library-motion";
import { libUi } from "@/lib/library/library-ui";
import type { MemoryCard } from "@/lib/library/types";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

const FAVORITES_KEY = "__favorites__";

type Props = {
  examSlug: ExamSlug;
  cards: MemoryCard[];
  onOpenCard: (card: MemoryCard) => void;
};

/**
 * Subjects tab — a calm, spacious grid of subject cards (icon · name · count ·
 * mastery), drilling into a focused detail grid of that subject's cards.
 */
export function LibrarySubjectsView({ examSlug, cards, onOpenCard }: Props) {
  const { reduce } = useLibraryMotion();
  const favorites = useFavorites(examSlug);
  const [active, setActive] = useState<string | null>(null);

  // Mastery is client-only; re-read when it changes so subject rings stay live.
  const [masteryTick, setMasteryTick] = useState(0);
  useEffect(() => {
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<{ examSlug: ExamSlug }>).detail;
      if (detail?.examSlug === examSlug) setMasteryTick((t) => t + 1);
    };
    window.addEventListener("aee-card-mastery-change", onChange);
    return () => window.removeEventListener("aee-card-mastery-change", onChange);
  }, [examSlug]);

  const groups = useMemo(() => groupCardsBySubject(cards), [cards]);

  // got-it count per subject for a subtle mastery bar.
  const masteryBySubject = useMemo(() => {
    void masteryTick;
    const store = readMasteryStore(examSlug);
    const out: Record<string, number> = {};
    for (const group of groups) {
      out[group.key] = group.cards.reduce(
        (n, c) => n + (store[c.id]?.status === "got-it" ? 1 : 0),
        0
      );
    }
    return out;
  }, [groups, examSlug, masteryTick]);

  const favoriteCards = useMemo(
    () =>
      cards
        .filter((c) => favorites.isFavorite(c.id))
        .sort(compareCardsWithinSubject),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cards, favorites.favoriteIds]
  );

  // ---- Detail view ----
  if (active) {
    const isFavView = active === FAVORITES_KEY;
    const group = groups.find((g) => g.key === active);
    const title = isFavView ? "Favorites" : group?.subject ?? "Subject";
    const detailCards = isFavView ? favoriteCards : group?.cards ?? [];

    return (
      <section aria-label={title} className="space-y-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActive(null)}
            className="inline-flex h-9 items-center gap-1 rounded-full bg-black/[0.04] pl-2 pr-3.5 text-[13px] font-semibold text-[var(--color-ink)] transition hover:bg-black/[0.07]"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
            Subjects
          </button>
          <div className="min-w-0">
            <h2 className="truncate text-[20px] font-semibold tracking-tight text-[var(--color-ink)]">
              {title}
            </h2>
            <p className={libUi.sectionHint}>
              {detailCards.length} {detailCards.length === 1 ? "card" : "cards"}
            </p>
          </div>
        </div>

        {detailCards.length === 0 ? (
          <div className={libUi.emptyState}>
            <p className="text-[15px] font-medium text-[var(--color-ink)]">No cards yet</p>
            <p className={cn(libUi.sectionHint, "mt-1")}>
              {isFavView
                ? "Tap the star on any card to save it here."
                : "Cards for this subject will appear here."}
            </p>
          </div>
        ) : (
          <motion.div
            key={active}
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className={libUi.cardGrid}
          >
            {detailCards.map((card) => (
              <FavoriteCardTile
                key={card.id}
                card={card}
                examSlug={examSlug}
                isFavorite={favorites.isFavorite(card.id)}
                onOpen={() => onOpenCard(card)}
                onToggleFavorite={() => favorites.toggle(card.id)}
              />
            ))}
          </motion.div>
        )}
      </section>
    );
  }

  // ---- Grid view ----
  return (
    <section aria-label="Browse by subject" className="space-y-4">
      <div
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        role="list"
        aria-label="Subjects"
      >
        {favoriteCards.length > 0 ? (
          <SmartFavoritesTile
            count={favoriteCards.length}
            onClick={() => setActive(FAVORITES_KEY)}
          />
        ) : null}

        {groups.map((group) => {
          const total = group.cards.length;
          const learned = masteryBySubject[group.key] ?? 0;
          const pct = total > 0 ? Math.round((learned / total) * 100) : 0;
          const { icon: Icon, tint } = subjectVisual(group.subject);
          return (
            <button
              key={group.key}
              type="button"
              role="listitem"
              onClick={() => setActive(group.key)}
              className={cn(
                "group flex flex-col rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5 text-left shadow-[var(--shadow-apple-sm)] transition",
                "hover:-translate-y-0.5 hover:border-[var(--color-accent)]/25 hover:shadow-[var(--shadow-apple-md)] active:scale-[0.99]"
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className={cn("inline-flex h-11 w-11 items-center justify-center rounded-2xl", tint)}>
                  <Icon className="h-[22px] w-[22px]" aria-hidden />
                </span>
                <ChevronRight
                  className="h-4 w-4 text-[var(--color-ink-muted)] transition group-hover:translate-x-0.5 group-hover:text-[var(--color-accent)]"
                  aria-hidden
                />
              </div>
              <h3 className="mt-4 text-[17px] font-semibold leading-snug tracking-tight text-[var(--color-ink)] group-hover:text-[var(--color-accent)]">
                {group.subject}
              </h3>
              <p className={cn(libUi.sectionHint, "mt-0.5")}>
                {total} {total === 1 ? "card" : "cards"}
              </p>
              <div className="mt-4 flex items-center gap-2">
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-black/[0.06]">
                  <span
                    className="block h-full rounded-full bg-emerald-400 transition-[width] duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </span>
                <span className="shrink-0 text-[11px] font-semibold tabular-nums text-[var(--color-ink-muted)]">
                  {pct > 0 ? `${pct}%` : "New"}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function SmartFavoritesTile({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <button
      type="button"
      role="listitem"
      onClick={onClick}
      className={cn(
        "group flex flex-col rounded-[20px] border border-amber-200/70 bg-amber-50/60 p-5 text-left shadow-[var(--shadow-apple-sm)] transition",
        "hover:-translate-y-0.5 hover:shadow-[var(--shadow-apple-md)] active:scale-[0.99]"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-400/20 text-amber-600">
          <Star className="h-[22px] w-[22px] fill-amber-400 text-amber-500" aria-hidden />
        </span>
        <ChevronRight
          className="h-4 w-4 text-amber-500/70 transition group-hover:translate-x-0.5"
          aria-hidden
        />
      </div>
      <h3 className="mt-4 text-[17px] font-semibold leading-snug tracking-tight text-amber-900">
        Favorites
      </h3>
      <p className="mt-0.5 text-[13px] text-amber-700/80">
        {count} saved {count === 1 ? "card" : "cards"}
      </p>
    </button>
  );
}
