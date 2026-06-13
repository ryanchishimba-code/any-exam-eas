"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AppBreadcrumbs } from "@/components/app/AppBreadcrumbs";
import { ReferenceAiBrief } from "@/components/reference/ReferenceAiBrief";
import { ReferenceBriefCards } from "@/components/reference/ReferenceBriefCards";
import { ReferenceCardsDue } from "@/components/reference/ReferenceCardsDue";
import { ReferenceForYou } from "@/components/reference/ReferenceForYou";
import {
  ReferenceHubHeader,
  type ReferenceHubStats,
} from "@/components/reference/ReferenceHubHeader";
import { ReferenceHubNav } from "@/components/reference/ReferenceHubNav";
import { ReferenceHubSearch } from "@/components/reference/ReferenceHubSearch";
import { ReferenceQuickTools } from "@/components/reference/ReferenceQuickTools";
import { ReferenceRecentCards } from "@/components/reference/ReferenceRecentCards";
import { ReferenceTopicBanner } from "@/components/reference/ReferenceTopicBanner";
import { MemoryCardTile } from "@/components/reference/MemoryCardTile";
import { MemoryCardSheet } from "@/components/reference/MemoryCardSheet";
import { applyMasteryStore, readMasteryStore } from "@/lib/reference/card-mastery";
import { syncCardMasteryForExam } from "@/lib/reference/card-mastery-sync";
import { ROUTES } from "@/lib/routes";
import {
  countCardsNeedingReview,
  getCardsForTopicKey,
  queryMemoryCards,
} from "@/lib/reference/memory-cards";
import { rememberMemoryCard } from "@/lib/reference/recent-cards";
import type { ReferenceStudyBrief } from "@/lib/reference/study-brief-types";
import {
  MEMORY_CARD_KIND_LABELS,
  type MemoryCard,
  type MemoryCardKind,
} from "@/lib/reference/types";
import type { WeakTopicRow } from "@/lib/learning/student-dashboard";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

type Props = {
  examSlug: ExamSlug;
  cards: MemoryCard[];
  subjects: string[];
  weakTopics: WeakTopicRow[];
  hubStats: ReferenceHubStats;
  initialCardId?: string;
  topicKey?: string;
};

const KIND_OPTIONS: Array<{ value: MemoryCardKind | "all"; label: string }> = [
  { value: "all", label: "All types" },
  ...(
    Object.entries(MEMORY_CARD_KIND_LABELS) as Array<[MemoryCardKind, string]>
  ).map(([value, label]) => ({ value, label })),
];

export function ReferenceHubClient({
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
  const [brief, setBrief] = useState<ReferenceStudyBrief | null>(null);
  const [masteryTick, setMasteryTick] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const dueCount = useMemo(
    () => countCardsNeedingReview(cards, examSlug),
    [cards, examSlug, masteryTick]
  );

  useEffect(() => {
    const onMastery = () => setMasteryTick((n) => n + 1);
    window.addEventListener("aee-card-mastery-change", onMastery);
    return () => window.removeEventListener("aee-card-mastery-change", onMastery);
  }, []);

  useEffect(() => {
    void syncCardMasteryForExam({
      examSlug,
      readLocal: readMasteryStore,
      writeLocal: (slug, store) => applyMasteryStore(slug, store),
      onMerged: () => setMasteryTick((n) => n + 1),
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

  const onBriefLoaded = useCallback((next: ReferenceStudyBrief) => {
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

  const breadcrumbItems = [
    { label: "Dashboard", href: ROUTES.dashboard },
    { label: "Study Reference" },
    ...(topicKey ? [{ label: topicKey.replace(/-/g, " ") }] : []),
  ];

  return (
    <div className="space-y-6">
      <AppBreadcrumbs items={breadcrumbItems} />

      <ReferenceHubHeader examSlug={examSlug} stats={hubStats} />

      <div id="hub-search">
        <ReferenceHubSearch
          examSlug={examSlug}
          cards={cards}
          onOpenCard={openCard}
          onQueryChange={setHubSearchQuery}
          inputRef={searchInputRef}
        />
      </div>

      <ReferenceHubNav showCardsDue={dueCount > 0} />

      <ReferenceCardsDue examSlug={examSlug} cards={cards} onOpenCard={openCard} />

      <ReferenceAiBrief examSlug={examSlug} onBriefLoaded={onBriefLoaded} />

      {brief ? (
        <ReferenceBriefCards
          cards={cards}
          cardIds={brief.memoryCardIds}
          onOpenCard={openCard}
        />
      ) : null}

      <ReferenceQuickTools examSlug={examSlug} />

      <ReferenceForYou
        examSlug={examSlug}
        cards={cards}
        weakTopics={weakTopics}
        topicKey={topicKey}
        onOpenCard={openCard}
      />

      <ReferenceRecentCards examSlug={examSlug} cards={cards} onOpenCard={openCard} />

      <section id="memory-cards" aria-labelledby="memory-cards-heading" className="space-y-4">
        {topicKey ? (
          <ReferenceTopicBanner
            examSlug={examSlug}
            topicKey={topicKey}
            cardCount={scopedCards.length}
          />
        ) : null}

        <div>
          <h3 id="memory-cards-heading" className="text-lg font-bold text-[var(--color-ink)]">
            {topicKey
              ? "Topic memory cards"
              : hubSearchQuery.trim().length >= 2
                ? "Search results"
                : "All memory cards"}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-[var(--color-ink-muted)]">
            {hubSearchQuery.trim().length >= 2
              ? `${filtered.length} card(s) matching "${hubSearchQuery}"`
              : topicKey
                ? `${scopedCards.length} high-yield facts for this topic`
                : `${cards.length} high-yield facts — equations, pearls, tables, and common mistakes.`}
          </p>
        </div>

        {hubSearchQuery.trim().length < 2 && !topicKey ? (
          <div className="space-y-3">
            <div className="aee-scroll-x -mx-1 flex gap-2 px-1 pb-0.5 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
              <FilterPill
                active={subject === "all"}
                onClick={() => setSubject("all")}
                label="All subjects"
              />
              {subjects.map((s) => (
                <FilterPill key={s} active={subject === s} onClick={() => setSubject(s)} label={s} />
              ))}
            </div>
            <div className="aee-scroll-x -mx-1 flex gap-2 px-1 pb-0.5 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
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
        ) : null}

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-black/[0.1] bg-white px-6 py-12 text-center">
            <p className="text-sm font-medium text-[var(--color-ink)]">
              {topicKey ? "No memory cards mapped to this topic yet" : "No cards match your filters"}
            </p>
            <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
              {topicKey
                ? "Try practice questions for this topic, or browse all cards."
                : "Try a different subject or card type, or use the search bar above."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
        "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition",
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
