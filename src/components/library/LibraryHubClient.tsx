"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Compass, GraduationCap, LayoutGrid, Search, Wrench, X } from "lucide-react";
import type { LibraryHubStats } from "@/components/library/LibraryHubHeader";
import { LibraryWelcome } from "@/components/library/LibraryWelcome";
import { LibraryRecommended } from "@/components/library/LibraryRecommended";
import { LibraryProgress } from "@/components/library/LibraryProgress";
import { LibrarySubjectsView } from "@/components/library/LibrarySubjectsView";
import { LibraryExamWheel } from "@/components/library/LibraryExamWheel";
import { LibraryQuickTools } from "@/components/library/LibraryQuickTools";
import { FavoriteCardTile } from "@/components/library/FavoriteCardTile";
import { SessionToneSelector } from "@/components/library/SessionToneSelector";
import { MemoryCardSheet } from "@/components/library/MemoryCardSheet";
import { StudyPageHeader } from "@/components/study/StudyPageHeader";
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
import { ROUTES } from "@/lib/routes";
import type { MemoryCard } from "@/lib/library/types";
import type { WeakTopicRow } from "@/lib/learning/student-dashboard";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

type LibraryTab = "for-you" | "subjects" | "exams" | "tools";

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

const TABS: Array<{ id: LibraryTab; label: string; icon: typeof Compass }> = [
  { id: "for-you", label: "For You", icon: Compass },
  { id: "subjects", label: "Subjects", icon: LayoutGrid },
  { id: "tools", label: "Tools", icon: Wrench },
  { id: "exams", label: "Exams", icon: GraduationCap },
];

/** Turn a topic slug deep-link into a friendly initial search query. */
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
  const [tab, setTab] = useState<LibraryTab>("for-you");
  const [query, setQuery] = useState(() => topicKeyToQuery(topicKey));
  const [selected, setSelected] = useState<MemoryCard | null>(null);
  const motionProps = useLibraryMotion();
  const favorites = useFavorites(examSlug);

  // Merge local + server card mastery once per exam.
  useEffect(() => {
    void syncCardMasteryForExam({
      examSlug,
      readLocal: readMasteryStore,
      writeLocal: (slug, store) => applyMasteryStore(slug, store),
    });
  }, [examSlug]);

  const openCard = useCallback(
    (card: MemoryCard) => {
      rememberMemoryCard(card.id, examSlug);
      setSelected(card);
    },
    [examSlug]
  );

  // Honor `?card=` deep links.
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
    // Weak-topic ids are analytics keys (e.g. "subject:cardiology"); only deep-link
    // when the slug is a real bank subject, otherwise fall back to a mixed session.
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
      ? `${usmleStepLabel} Study Library`
      : `${examName} Study Library`;

  return (
    <SessionToneProvider>
      <div className={cn(libUi.page, "space-y-4 sm:space-y-5")}>
        <StudyPageHeader
          eyebrow="Library"
          title={libraryTitle}
          subtitle={
            examSlug === "usmle" && usmleStepLabel
              ? `Memory cards, tools, and review content aligned to ${usmleStepLabel}.`
              : "Everything you need to review — organized and personal."
          }
          breadcrumbs={[{ label: "Dashboard", href: ROUTES.dashboard }]}
        />

        {/* Sticky search + segmented control — the only two pieces of chrome. */}
        <div className={libUi.stickyBar}>
          <div className="relative min-w-0">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-ink-muted)]"
              aria-hidden
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search your library…"
              aria-label="Search your library"
              className="w-full rounded-full border border-black/[0.08] bg-white py-2.5 pl-9 pr-9 text-[14px] text-[var(--color-ink)] shadow-[var(--shadow-apple-sm)] outline-none transition placeholder:text-[var(--color-ink-muted)] focus:border-[var(--color-accent)]/40 focus:shadow-[0_0_0_3px_rgba(79,70,229,0.18)]"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-[var(--color-ink-muted)] hover:bg-black/[0.05] hover:text-[var(--color-ink)]"
              >
                <X className="h-3.5 w-3.5" aria-hidden />
              </button>
            ) : null}
          </div>

          {!isSearching ? (
            <div
              role="tablist"
              aria-label="Library sections"
              className="inline-flex w-full gap-1 rounded-full border border-black/[0.06] bg-black/[0.03] p-1"
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
                    className={cn(
                      "relative flex flex-1 items-center justify-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-semibold transition-colors duration-200",
                      active
                        ? "text-[var(--color-ink)]"
                        : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                    )}
                  >
                    {active ? (
                      motionProps.reduce ? (
                        <span className="absolute inset-0 rounded-full bg-white shadow-[var(--shadow-apple-sm)]" />
                      ) : (
                        <motion.span
                          layoutId="library-section-pill"
                          transition={motionProps.spring}
                          className="absolute inset-0 rounded-full bg-white shadow-[var(--shadow-apple-sm)]"
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

        {/* Search overrides the active tab with one flat result grid. */}
        {isSearching ? (
          <section aria-label="Search results" className="space-y-3">
            <p className={libUi.sectionHint}>
              {results.length} result{results.length === 1 ? "" : "s"} for “{trimmedQuery}”
            </p>
            {results.length === 0 ? (
              <div className={libUi.emptyState}>
                <p className="text-[15px] font-medium text-[var(--color-ink)]">No matches</p>
                <p className={cn(libUi.sectionHint, "mt-1")}>Try a different word or clear search.</p>
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
        ) : tab === "for-you" ? (
          <motion.div
            variants={motionProps.container.variants}
            initial={motionProps.container.initial}
            animate={motionProps.container.animate}
            className="space-y-4 sm:space-y-6"
          >
            <motion.div variants={motionProps.item.variants}>
              <LibraryWelcome
                userName={userName}
                streakDays={hubStats.studyStreakDays}
                primaryHref={primaryHref}
              />
            </motion.div>
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
        ) : tab === "subjects" ? (
          <LibrarySubjectsView examSlug={examSlug} cards={cards} onOpenCard={openCard} />
        ) : tab === "tools" ? (
          <LibraryQuickTools examSlug={examSlug} />
        ) : (
          <LibraryExamWheel currentExam={examSlug} />
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
