"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { HighYieldTopicPreviewCard } from "@/components/edtech/HighYieldTopicPreviewCard";
import { HighYieldTopicPanel } from "@/components/edtech/HighYieldTopicPanel";
import { HighYieldTopicsHeader } from "@/components/edtech/HighYieldTopicsHeader";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import { filterHighYieldTopics, clampTopicIndex } from "@/lib/edtech/topic-selection";
import { studyUi } from "@/lib/study/study-ui";
import type { ExamSlug, HighYieldTopic, TopicProgressMap } from "@/types/edtech";
import { cn } from "@/lib/utils";

export function HighYieldTopicsClient({
  examSlug,
  usmleStepLabel,
  topics,
  progressMap: initialProgress,
  initialTopicSlug,
  initialDeepDive = false,
}: {
  examSlug: ExamSlug;
  usmleStepLabel?: string;
  topics: HighYieldTopic[];
  progressMap: TopicProgressMap;
  initialTopicSlug?: string | null;
  initialDeepDive?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(initialTopicSlug ?? null);
  const [progressMap, setProgressMap] = useState(initialProgress);
  const exam = EXAM_CATALOG[examSlug];

  const categories = useMemo(() => {
    const cats = new Set(topics.map((t) => t.category));
    return [...cats].sort();
  }, [topics]);

  useEffect(() => {
    setProgressMap(initialProgress);
  }, [initialProgress]);

  const filtered = useMemo(
    () => filterHighYieldTopics(topics, query, category),
    [topics, query, category]
  );

  const grouped = useMemo(() => {
    const map = new Map<string, HighYieldTopic[]>();
    for (const topic of filtered) {
      const list = map.get(topic.category) ?? [];
      list.push(topic);
      map.set(topic.category, list);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

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
    selectedSlug !== null ? (filtered.find((t) => t.slug === selectedSlug) ?? null) : null;
  const activeIndex =
    activeTopic !== null ? filtered.findIndex((t) => t.slug === activeTopic.slug) : -1;
  const reviewedCount = topics.filter((t) => (progressMap[t.id]?.reviewCount ?? 0) > 0).length;
  const masteryPct = topics.length ? Math.round((reviewedCount / topics.length) * 100) : 0;

  const openTopic = useCallback((topic: HighYieldTopic) => {
    setSelectedSlug(topic.slug);
  }, []);

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
      <div className={studyUi.page}>
        <HighYieldTopicsHeader
          examSlug={examSlug}
          examLabel={exam.name}
          usmleStepLabel={usmleStepLabel}
          topicCount={topics.length}
          reviewedCount={reviewedCount}
          masteryPct={masteryPct}
        />

        <div className={studyUi.stickyBar}>
          <div className="relative min-w-0">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--color-ink-muted)]"
              aria-hidden
            />
            <input
              type="search"
              placeholder="Search topics…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search topics"
              className={studyUi.searchInput}
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

          <div className={studyUi.chipRow} role="group" aria-label="Filter by category">
            <FilterChip active={category === "all"} onClick={() => setCategory("all")}>
              All
            </FilterChip>
            {categories.map((cat) => (
              <FilterChip key={cat} active={category === cat} onClick={() => setCategory(cat)}>
                {cat.replace(/^Step \d — /, "")}
              </FilterChip>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className={studyUi.emptyState}>
            No topics match your search. Try a different keyword or category.
          </p>
        ) : category === "all" && grouped.length > 1 ? (
          <div className="space-y-5 px-0.5">
            {grouped.map(([cat, catTopics]) => (
              <section key={cat} aria-labelledby={`topic-cat-${cat}`}>
                <h2 id={`topic-cat-${cat}`} className={cn(studyUi.sectionTitle, "mb-2 px-1")}>
                  {cat}
                </h2>
                <ul className={studyUi.listSurface}>
                  {catTopics.map((topic) => (
                    <li key={topic.id}>
                      <HighYieldTopicPreviewCard
                        topic={topic}
                        examSlug={examSlug}
                        progress={progressMap[topic.id]}
                        onViewSummary={() => openTopic(topic)}
                        compact
                      />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        ) : (
          <ul className={cn(studyUi.listSurface, "mx-0.5")} aria-label="Topics">
            {filtered.map((topic) => (
              <li key={topic.id}>
                <HighYieldTopicPreviewCard
                  topic={topic}
                  examSlug={examSlug}
                  progress={progressMap[topic.id]}
                  onViewSummary={() => openTopic(topic)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

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
        initialReviewCount={activeTopic ? (progressMap[activeTopic.id]?.reviewCount ?? 0) : 0}
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
