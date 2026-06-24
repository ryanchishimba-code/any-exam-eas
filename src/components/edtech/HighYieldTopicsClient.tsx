"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Search, Sparkles, ChevronRight } from "lucide-react";
import { HighYieldTopicPreviewCard } from "@/components/edtech/HighYieldTopicPreviewCard";
import { HighYieldTopicPanel } from "@/components/edtech/HighYieldTopicPanel";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import { getTopicCategories } from "@/lib/edtech/seeds";
import {
  filterHighYieldTopics,
  clampTopicIndex,
} from "@/lib/edtech/topic-selection";
import { ROUTES } from "@/lib/routes";
import { studyUi } from "@/lib/study/study-ui";
import type { ExamSlug, HighYieldTopic, TopicProgressMap } from "@/types/edtech";
import { cn } from "@/lib/utils";

export function HighYieldTopicsClient({
  examSlug,
  topics,
  progressMap: initialProgress,
  initialTopicSlug,
  initialDeepDive = false,
}: {
  examSlug: ExamSlug;
  topics: HighYieldTopic[];
  progressMap: TopicProgressMap;
  initialTopicSlug?: string | null;
  initialDeepDive?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(initialTopicSlug ?? null);
  const [progressMap, setProgressMap] = useState(initialProgress);
  const categories = useMemo(() => getTopicCategories(examSlug), [examSlug]);
  const exam = EXAM_CATALOG[examSlug];

  useEffect(() => {
    setProgressMap(initialProgress);
  }, [initialProgress]);

  const filtered = useMemo(
    () => filterHighYieldTopics(topics, query, category),
    [topics, query, category]
  );

  const skipFilterReset = useRef(true);

  useEffect(() => {
    if (skipFilterReset.current) {
      skipFilterReset.current = false;
      return;
    }
    setSelectedSlug(null);
  }, [query, category, examSlug]);

  useEffect(() => {
    if (!initialTopicSlug) return;
    if (filtered.some((t) => t.slug === initialTopicSlug)) {
      setSelectedSlug(initialTopicSlug);
    }
  }, [initialTopicSlug, filtered]);

  const activeTopic =
    selectedSlug !== null
      ? filtered.find((t) => t.slug === selectedSlug) ?? null
      : null;
  const activeIndex =
    activeTopic !== null ? filtered.findIndex((t) => t.slug === activeTopic.slug) : -1;
  const reviewedCount = topics.filter((t) => (progressMap[t.id]?.reviewCount ?? 0) > 0).length;

  function openTopic(topic: HighYieldTopic) {
    setSelectedSlug(topic.slug);
  }

  const handleReviewRecorded = useCallback((topicId: string, reviewCount: number) => {
    setProgressMap((prev) => ({
      ...prev,
      [topicId]: {
        ...prev[topicId],
        reviewCount,
        practiceCount: prev[topicId]?.practiceCount ?? 0,
        lastViewedAt: new Date().toISOString(),
      },
    }));
  }, []);

  return (
    <>
      <div className="space-y-8">
        {/* ── Breadcrumb ── */}
        <nav aria-label="Breadcrumb" className={studyUi.sectionHint}>
          <ol className="flex flex-wrap items-center gap-1">
            <li>
              <Link href={ROUTES.practiceHub} className="text-[var(--color-accent)] hover:underline">
                Study Hub
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="inline h-3.5 w-3.5" />
            </li>
            <li className="font-medium text-[var(--color-ink)]">High-Yield Topics</li>
          </ol>
        </nav>

        {/* ── Page header ── */}
        <header className="space-y-2">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-accent)]">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Premium study summaries &amp; textbook modules
          </p>
          <h1 className={studyUi.title}>High-Yield Topics</h1>
          <p className={studyUi.subtitle}>
            Focus on the {topics.length} topics that matter most — with Review Modules,
            clinical pearls, and practice questions curated for{" "}
            <span className="font-semibold text-[var(--color-ink)]">{exam.name}</span>.
          </p>
        </header>

        {/* ── Exam context ── */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-[var(--color-border)]" />
          <div className="flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3.5 py-1.5">
            <Sparkles className="h-3.5 w-3.5 text-[var(--color-accent)]" aria-hidden />
            <span className="text-[12px] font-semibold text-[var(--color-ink)]">
              {exam.shortName}
            </span>
            <span className="text-[12px] text-[var(--color-ink-muted)]">
              · {topics.length} topics
              {reviewedCount > 0 && (
                <span className="ml-1 text-[var(--color-accent)]">· {reviewedCount} reviewed</span>
              )}
            </span>
          </div>
          <div className="h-px flex-1 bg-[var(--color-border)]" />
        </div>

        {/* ── Search + category chips (sticky while browsing) ── */}
        <div className={studyUi.stickyBar}>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-ink-muted)]"
              aria-hidden
            />
            <input
              type="search"
              placeholder="Search topics, categories, or keywords…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={studyUi.searchInput}
            />
          </div>

          <div className={studyUi.chipRow} role="group" aria-label="Filter by category">
            <FilterChip active={category === "all"} onClick={() => setCategory("all")}>
              All
            </FilterChip>
            {categories.map((cat) => (
              <FilterChip key={cat} active={category === cat} onClick={() => setCategory(cat)}>
                {cat}
              </FilterChip>
            ))}
          </div>
        </div>

        {/* ── Topic grid ── */}
        {filtered.length === 0 ? (
          <p className={studyUi.emptyState}>
            No topics match your search. Try a different keyword or category.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((topic) => (
              <HighYieldTopicPreviewCard
                key={topic.id}
                topic={topic}
                examSlug={examSlug}
                progress={progressMap[topic.id]}
                onViewSummary={() => openTopic(topic)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Topic detail panel ── */}
      <HighYieldTopicPanel
        topic={activeTopic}
        examSlug={examSlug}
        open={activeTopic !== null}
        onClose={() => setSelectedSlug(null)}
        topicIndex={activeIndex >= 0 ? activeIndex : 0}
        topicCount={filtered.length}
        onNavigate={(index) => {
          const next = filtered[clampTopicIndex(index, filtered.length)];
          if (next) setSelectedSlug(next.slug);
        }}
        initialReviewCount={
          activeTopic ? progressMap[activeTopic.id]?.reviewCount ?? 0 : 0
        }
        initialDeepDive={initialDeepDive}
        onReviewRecorded={handleReviewRecorded}
      />
    </>
  );
}

function FilterChip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        studyUi.filterPill,
        active ? studyUi.filterPillActive : studyUi.filterPillIdle
      )}
    >
      {children}
    </button>
  );
}
