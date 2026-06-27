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

export function LibrarySubjectsView({ examSlug, cards, onOpenCard }: Props) {
  const { reduce } = useLibraryMotion();
  const favorites = useFavorites(examSlug);
  const [active, setActive] = useState<string | null>(null);

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

  if (active) {
    const isFavView = active === FAVORITES_KEY;
    const group = groups.find((g) => g.key === active);
    const title = isFavView ? "Favorites" : (group?.subject ?? "Subject");
    const detailCards = isFavView ? favoriteCards : (group?.cards ?? []);

    return (
      <section aria-label={title} className="space-y-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActive(null)}
            className="inline-flex h-8 items-center gap-0.5 rounded-lg px-2 text-[12px] font-semibold text-[var(--color-ink-muted)] transition hover:bg-[var(--color-surface)] hover:text-[var(--color-ink)]"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
            All subjects
          </button>
          <span className="text-[var(--color-border)]" aria-hidden>
            /
          </span>
          <h2 className="truncate text-[15px] font-semibold text-[var(--color-ink)]">{title}</h2>
          <span className={cn(libUi.sectionHint, "ml-auto")}>{detailCards.length} cards</span>
        </div>

        {detailCards.length === 0 ? (
          <div className={libUi.emptyState}>
            <p className="text-[14px] font-medium text-[var(--color-ink)]">No cards yet</p>
            <p className={cn(libUi.sectionHint, "mt-1")}>
              {isFavView
                ? "Star any card to save it here."
                : "Cards for this subject will appear here."}
            </p>
          </div>
        ) : (
          <motion.div
            key={active}
            initial={reduce ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
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

  return (
    <section aria-label="Browse by subject" className="space-y-2">
      <p className={cn(libUi.sectionHint, "px-0.5")}>
        {groups.length} subjects · {cards.length} cards
      </p>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3" role="list" aria-label="Subjects">
        {favoriteCards.length > 0 ? (
          <SmartFavoritesTile count={favoriteCards.length} onClick={() => setActive(FAVORITES_KEY)} />
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
                libUi.surface,
                "group flex items-center gap-3 p-3.5 text-left transition",
                "hover:border-[var(--color-accent)]/20 hover:bg-[var(--color-surface)]/40 active:scale-[0.995]"
              )}
            >
              <span
                className={cn(
                  "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                  tint
                )}
              >
                <Icon className="h-[18px] w-[18px]" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-[14px] font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-accent)]">
                  {group.subject}
                </h3>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="h-1 flex-1 overflow-hidden rounded-full bg-[var(--color-surface)]">
                    <span
                      className="block h-full rounded-full bg-[var(--color-accent)]/60 transition-[width] duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </span>
                  <span className="shrink-0 text-[10px] font-medium tabular-nums text-[var(--color-ink-muted)]">
                    {total}
                  </span>
                </div>
              </div>
              <ChevronRight
                className="h-4 w-4 shrink-0 text-[var(--color-ink-muted)]/40 group-hover:text-[var(--color-accent)]"
                aria-hidden
              />
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
        "flex items-center gap-3 rounded-2xl border border-amber-200/50 bg-amber-50/40 p-3.5 text-left transition",
        "hover:border-amber-300/60 hover:bg-amber-50/70 active:scale-[0.995]"
      )}
    >
      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400/15 text-amber-600">
        <Star className="h-[18px] w-[18px] fill-amber-400 text-amber-500" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="text-[14px] font-semibold text-amber-900">Favorites</h3>
        <p className="text-[11px] text-amber-800/70">{count} saved</p>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-amber-600/50" aria-hidden />
    </button>
  );
}
