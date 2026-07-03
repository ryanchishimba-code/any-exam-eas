"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { LayoutGrid, Search, Sparkles, Wrench, X } from "lucide-react";
import type { LibraryHubStats } from "@/components/library/LibraryHubHeader";
import { LibraryHeader } from "@/components/library/LibraryHeader";
import { LibraryRecommended } from "@/components/library/LibraryRecommended";
import { LibraryProgress } from "@/components/library/LibraryProgress";
import { LibrarySubjectsView } from "@/components/library/LibrarySubjectsView";
import { LibraryExamWheel } from "@/components/library/LibraryExamWheel";
import { LibraryQuickTools } from "@/components/library/LibraryQuickTools";
import { FavoriteCardTile } from "@/components/library/FavoriteCardTile";
import { SessionToneSelector } from "@/components/library/SessionToneSelector";
import { MemoryCardSheet } from "@/components/library/MemoryCardSheet";
import { practiceTopicHref } from "@/lib/edtech/practice-links";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import { getSubjectsForFieldId } from "@/lib/subjects/registry";
import { isUsmleStep1Subject } from "@/lib/subjects/medicine/subject-splits";
import { applyMasteryStore, readMasteryStore } from "@/lib/library/card-mastery";
import { syncCardMasteryForExam } from "@/lib/library/card-mastery-sync";
import { queryMemoryCards } from "@/lib/library/memory-cards";
import { rememberMemoryCard } from "@/lib/library/recent-cards";
import { SessionToneProvider } from "@/lib/library/session-tone";
import { useFavorites } from "@/lib/library/use-favorites";
import { useLibraryMotion } from "@/lib/library/use-library-motion";
import { libUi } from "@/lib/library/library-ui";
import type { MemoryCard } from "@/lib/library/types";
import type { WeakTopicRow } from "@/lib/learning/student-dashboard";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

type LibraryTab = "home" | "browse" | "tools";

type Props = {
  examSlug: ExamSlug;
  usmleStepLabel?: string;
  userName?: string | null;
  cards: MemoryCard[];
  weakTopics: WeakTopicRow[];
  hubStats: LibraryHubStats;
  initialCardId?: string;
  topicKey?: string;
};

const TABS: Array<{ id: LibraryTab; label: string; icon: typeof Sparkles }> = [
  { id: "home", label: "Home", icon: Sparkles },
  { id: "browse", label: "Browse", icon: LayoutGrid },
  { id: "tools", label: "Tools", icon: Wrench },
];

function topicKeyToQuery(topicKey?: string): string {
  if (!topicKey) return "";
  return topicKey
    .replace(/^(tag|subject):/, "")
    .replace(/[-_]+/g, " ")
    .trim();
}

export function LibraryHubClient({
  examSlug,
  usmleStepLabel,
  userName,
  cards,
  weakTopics,
  hubStats,
  initialCardId,
  topicKey,
}: Props) {
  const [tab, setTab] = useState<LibraryTab>("home");
  const [query, setQuery] = useState(() => topicKeyToQuery(topicKey));
  const [selected, setSelected] = useState<MemoryCard | null>(null);
  const motionProps = useLibraryMotion();
  const favorites = useFavorites(examSlug);

  useEffect(() => {
    void syncCardMasteryForExam({
      examSlug,
      readLocal: readMasteryStore,
      writeLocal: (slug, store) => applyMasteryStore(slug, store),
    });
  }, [examSlug]);

  useEffect(() => {
    setTab("home");
    setQuery("");
    setSelected(null);
  }, [examSlug]);

  const openCard = useCallback(
    (card: MemoryCard) => {
      rememberMemoryCard(card.id, examSlug);
      setSelected(card);
    },
    [examSlug]
  );

  useEffect(() => {
    if (!initialCardId) return;
    const match = cards.find((c) => c.id === initialCardId);
    if (match) openCard(match);
  }, [cards, initialCardId, openCard]);

  const trimmedQuery = query.trim();
  const isSearching = trimmedQuery.length >= 2;

  const results = useMemo(
    () => (isSearching ? queryMemoryCards(cards, { query: trimmedQuery }) : []),
    [cards, isSearching, trimmedQuery]
  );

  const primaryHref = useMemo(() => {
    const weakestSlug = weakTopics[0]?.id.replace(/^(tag|subject):/, "");
    const fieldId = EXAM_CATALOG[examSlug]?.fieldId;
    const isValidTopic =
      !!weakestSlug &&
      !!fieldId &&
      (getSubjectsForFieldId(fieldId).some((s) => s.id === weakestSlug) ||
        (fieldId.startsWith("usmle") && isUsmleStep1Subject(weakestSlug)));
    return practiceTopicHref(examSlug, isValidTopic ? weakestSlug! : "mixed", 10);
  }, [examSlug, weakTopics]);

  const examName = EXAM_CATALOG[examSlug]?.shortName ?? examSlug.toUpperCase();
  const libraryTitle =
    examSlug === "usmle" && usmleStepLabel
      ? `${usmleStepLabel} Library`
      : `${examName} Library`;

  return (
    <SessionToneProvider>
      <div className={libUi.page}>
        <LibraryHeader
          title={libraryTitle}
          usmleStepLabel={usmleStepLabel}
          userName={userName}
          streakDays={hubStats.studyStreakDays}
          readinessScore={hubStats.readinessScore}
          cardCount={cards.length}
          primaryHref={primaryHref}
        />

        <div className={libUi.stickyBar}>
          <div className="relative min-w-0">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--color-ink-muted)]"
              aria-hidden
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search cards…"
              aria-label="Search memory cards"
              className={libUi.searchInput}
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-lg text-[var(--color-ink-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-ink)]"
              >
                <X className="h-3.5 w-3.5" aria-hidden />
              </button>
            ) : null}
          </div>

          {!isSearching ? (
            <div
              role="tablist"
              aria-label="Library sections"
              className="grid grid-cols-3 gap-0.5 rounded-xl bg-[var(--color-surface-elevated)]/50 p-0.5"
            >
              {TABS.map((t) => {
                const active = tab === t.id;
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    role="tab"
                    aria-selected={active}
                    type="button"
                    onClick={() => setTab(t.id)}
                    className={cn(libUi.tab, active ? libUi.tabActive : libUi.tabIdle)}
                  >
                    {active ? (
                      motionProps.reduce ? (
                        <span className={libUi.tabIndicator} />
                      ) : (
                        <motion.span
                          layoutId="library-tab-indicator"
                          transition={motionProps.spring}
                          className={libUi.tabIndicator}
                        />
                      )
                    ) : null}
                    <Icon className="relative z-10 h-3.5 w-3.5" aria-hidden />
                    <span className="relative z-10">{t.label}</span>
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>

        {isSearching ? (
          <section aria-label="Search results" className="space-y-3 px-0.5">
            <p className={libUi.sectionHint}>
              {results.length} result{results.length === 1 ? "" : "s"} for “{trimmedQuery}”
            </p>
            {results.length === 0 ? (
              <div className={libUi.emptyState}>
                <p className="text-[14px] font-medium text-[var(--color-ink)]">No matches</p>
                <p className={cn(libUi.sectionHint, "mt-1")}>Try another term or clear search.</p>
              </div>
            ) : (
              <div className={libUi.cardGrid}>
                {results.map((card) => (
                  <FavoriteCardTile
                    key={card.id}
                    card={card}
                    examSlug={examSlug}
                    isFavorite={favorites.isFavorite(card.id)}
                    onOpen={() => openCard(card)}
                    onToggleFavorite={() => favorites.toggle(card.id)}
                  />
                ))}
              </div>
            )}
          </section>
        ) : tab === "home" ? (
          <motion.div
            variants={motionProps.container.variants}
            initial={motionProps.container.initial}
            animate={motionProps.container.animate}
            className="space-y-5 px-0.5"
          >
            <motion.div variants={motionProps.item.variants}>
              <LibraryRecommended
                examSlug={examSlug}
                weakTopics={weakTopics}
                cards={cards}
                onOpenCard={openCard}
              />
            </motion.div>
            <motion.div variants={motionProps.item.variants}>
              <LibraryProgress examSlug={examSlug} weakTopics={weakTopics} stats={hubStats} />
            </motion.div>
            <motion.div variants={motionProps.item.variants} className="flex justify-end">
              <SessionToneSelector />
            </motion.div>
          </motion.div>
        ) : tab === "browse" ? (
          <div className="px-0.5">
            <LibrarySubjectsView examSlug={examSlug} cards={cards} onOpenCard={openCard} />
          </div>
        ) : (
          <div className="space-y-8 px-0.5">
            <LibraryQuickTools examSlug={examSlug} />
            <LibraryExamWheel currentExam={examSlug} />
          </div>
        )}

        <MemoryCardSheet
          card={selected}
          allCards={cards}
          examSlug={examSlug}
          open={selected !== null}
          onClose={() => setSelected(null)}
          onOpenRelated={openCard}
        />
      </div>
    </SessionToneProvider>
  );
}
