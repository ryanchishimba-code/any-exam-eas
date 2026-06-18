"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LibraryAiBrief } from "@/components/library/LibraryAiBrief";
import {
  LibraryHubHeader,
  type LibraryHubStats,
} from "@/components/library/LibraryHubHeader";
import { LibraryHubNav } from "@/components/library/LibraryHubNav";
import { LibraryHubSearch } from "@/components/library/LibraryHubSearch";
import { LibraryQuickTools } from "@/components/library/LibraryQuickTools";
import { LibraryExternalResources } from "@/components/library/LibraryExternalResources";
import { LibraryCalculators } from "@/components/library/LibraryCalculators";
import { LibraryTodayRow } from "@/components/library/LibraryTodayRow";
import { LibraryTopicBanner } from "@/components/library/LibraryTopicBanner";
import { MemoryCardTile } from "@/components/library/MemoryCardTile";
import { MemoryCardSheet } from "@/components/library/MemoryCardSheet";
import { applyMasteryStore, readMasteryStore } from "@/lib/library/card-mastery";
import { syncCardMasteryForExam } from "@/lib/library/card-mastery-sync";
import {
  getCardsForTopicKey,
  queryMemoryCards,
} from "@/lib/library/memory-cards";
import { rememberMemoryCard } from "@/lib/library/recent-cards";
import { libUi } from "@/lib/library/library-ui";
import type { LibraryStudyBrief } from "@/lib/library/study-brief-types";
import {
  MEMORY_CARD_KIND_LABELS,
  type MemoryCard,
  type MemoryCardKind,
} from "@/lib/library/types";
import type { WeakTopicRow } from "@/lib/learning/student-dashboard";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

type Props = {
  examSlug: ExamSlug;
  cards: MemoryCard[];
  subjects: string[];
  weakTopics: WeakTopicRow[];
  hubStats: LibraryHubStats;
  initialCardId?: string;
  topicKey?: string;
};

const KIND_OPTIONS: Array<{ value: MemoryCardKind | "all"; label: string }> = [
  { value: "all", label: "All types" },
  ...(
    Object.entries(MEMORY_CARD_KIND_LABELS) as Array<[MemoryCardKind, string]>
  ).map(([value, label]) => ({ value, label })),
];

export function LibraryHubClient({
  examSlug,
  cards,
  subjects,
  weakTopics,
  hubStats,
  initialCardId,
  topicKey,
}: Props) {
  const [subject, setSubject] = useState<string>("all");
  const [kind, setKind] = useState<MemoryCardKind | "all">("all");
  const [hubSearchQuery, setHubSearchQuery] = useState("");
  const [selected, setSelected] = useState<MemoryCard | null>(null);
  const [brief, setBrief] = useState<LibraryStudyBrief | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    void syncCardMasteryForExam({
      examSlug,
      readLocal: readMasteryStore,
      writeLocal: (slug, store) => applyMasteryStore(slug, store),
    });
  }, [examSlug]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openCard = useCallback(
    (card: MemoryCard) => {
      rememberMemoryCard(card.id, examSlug);
      setSelected(card);
    },
    [examSlug]
  );

  const onBriefLoaded = useCallback((next: LibraryStudyBrief) => {
    setBrief(next);
  }, []);

  useEffect(() => {
    if (!initialCardId) return;
    const match = cards.find((c) => c.id === initialCardId);
    if (match) openCard(match);
  }, [cards, initialCardId, openCard]);

  useEffect(() => {
    if (!topicKey) return;
    const el = document.getElementById("memory-cards");
    if (!el) return;
    const timer = window.setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 400);
    return () => window.clearTimeout(timer);
  }, [topicKey]);

  const scopedCards = useMemo(
    () => (topicKey ? getCardsForTopicKey(cards, topicKey) : cards),
    [cards, topicKey]
  );

  const filtered = useMemo(
    () =>
      queryMemoryCards(scopedCards, {
        subject,
        kind,
        query: hubSearchQuery.trim().length >= 2 ? hubSearchQuery : undefined,
      }),
    [scopedCards, subject, kind, hubSearchQuery]
  );

  const showLibraryFilters = hubSearchQuery.trim().length < 2 && !topicKey;

  return (
    <div className={libUi.page}>
      <LibraryHubHeader examSlug={examSlug} stats={hubStats} />

      <div className={libUi.stickyBar}>
        <LibraryHubSearch
          examSlug={examSlug}
          cards={cards}
          onOpenCard={openCard}
          onQueryChange={setHubSearchQuery}
          inputRef={searchInputRef}
        />
        <LibraryHubNav examSlug={examSlug} />
      </div>

      <div className={libUi.pageShell}>
        <div className={libUi.panel}>
          <div className={libUi.panelSection}>
            <LibraryAiBrief examSlug={examSlug} onBriefLoaded={onBriefLoaded} />
          </div>

          <div className={cn(libUi.sectionDivider, libUi.panelSection)}>
            <LibraryTodayRow
              examSlug={examSlug}
              cards={cards}
              weakTopics={weakTopics}
              topicKey={topicKey}
              briefCardIds={brief?.memoryCardIds}
              onOpenCard={openCard}
            />
          </div>

          <div className={cn(libUi.sectionDivider, libUi.panelSection)}>
            <LibraryQuickTools examSlug={examSlug} />
            <LibraryCalculators examSlug={examSlug} />
            <LibraryExternalResources examSlug={examSlug} />
          </div>

          <section
            id="memory-cards"
            aria-labelledby="memory-cards-heading"
            className={cn(libUi.sectionDivider, libUi.panelSection, "space-y-4")}
          >
            {topicKey ? (
              <LibraryTopicBanner
                examSlug={examSlug}
                topicKey={topicKey}
                cardCount={scopedCards.length}
                memoryCardIds={scopedCards.map((c) => c.id)}
              />
            ) : null}

            <div>
              <h2 id="memory-cards-heading" className={libUi.sectionTitle}>
                {topicKey
                  ? "Topic library"
                  : hubSearchQuery.trim().length >= 2
                    ? "Search results"
                    : "Memory card library"}
              </h2>
              <p className={cn(libUi.sectionHint, "mt-0.5")}>
                {hubSearchQuery.trim().length >= 2
                  ? `${filtered.length} card(s) matching "${hubSearchQuery}"`
                  : topicKey
                    ? `${scopedCards.length} high-yield facts for this topic`
                    : `${cards.length} facts — equations, pearls, tables, and common mistakes.`}
              </p>
            </div>

            {showLibraryFilters ? (
              <div className="space-y-2.5">
                <div className={libUi.chipRow}>
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
                <div className={libUi.chipRow}>
                  {KIND_OPTIONS.map((opt) => (
                    <FilterPill
                      key={opt.value}
                      active={kind === opt.value}
                      onClick={() => setKind(opt.value)}
                      label={opt.label}
                      compact
                    />
                  ))}
                </div>
              </div>
            ) : null}

            {filtered.length === 0 ? (
              <div className={libUi.emptyState}>
                <p className="text-[15px] font-medium text-[var(--color-ink)]">
                  {topicKey ? "No memory cards mapped to this topic yet" : "No cards match your filters"}
                </p>
                <p className={cn(libUi.sectionHint, "mt-1")}>
                  {topicKey
                    ? "Try practice questions for this topic, or browse all cards."
                    : "Try a different subject or card type, or use search above."}
                </p>
              </div>
            ) : (
              <div className={libUi.cardGrid}>
                {filtered.map((card) => (
                  <MemoryCardTile
                    key={card.id}
                    card={card}
                    examSlug={examSlug}
                    onOpen={() => openCard(card)}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      <MemoryCardSheet
        card={selected}
        allCards={cards}
        examSlug={examSlug}
        open={selected !== null}
        onClose={() => setSelected(null)}
        onOpenRelated={openCard}
      />
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  label,
  compact = false,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        libUi.filterPill,
        compact && "text-[11px]",
        active
          ? "bg-[var(--color-accent)] text-white shadow-[var(--shadow-apple-sm)]"
          : "bg-black/[0.04] text-[var(--color-ink-muted)] hover:bg-black/[0.06] hover:text-[var(--color-ink)]"
      )}
    >
      {label}
    </button>
  );
}
