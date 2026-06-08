"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Search, Sparkles, ChevronRight } from "lucide-react";
import { HighYieldTopicPreviewCard } from "@/components/edtech/HighYieldTopicPreviewCard";
import { HighYieldTopicPanel } from "@/components/edtech/HighYieldTopicPanel";
import { ExamSwitcher } from "@/components/edtech/ExamSwitcher";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import { getTopicCategories } from "@/lib/edtech/seeds";
import {
  filterHighYieldTopics,
  clampTopicIndex,
} from "@/lib/edtech/topic-selection";
import { ROUTES } from "@/lib/routes";
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

  // Reset selection when filters change — skip initial mount so deep links and Open module work
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
        <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
          <ol className="flex flex-wrap items-center gap-1">
            <li>
              <Link href={ROUTES.practiceHub} className="text-[var(--color-accent)] hover:underline">
                Study Hub
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="inline h-3.5 w-3.5" />
            </li>
            <li className="font-medium text-slate-700">High-Yield Topics</li>
          </ol>
        </nav>

        <header className="space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-2xl">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-accent)]">
                <Sparkles className="h-3.5 w-3.5" aria-hidden />
                Premium study summaries & textbook modules
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                High-Yield Topics
              </h1>
              <p className="mt-3 text-lg leading-relaxed text-slate-600">
                The {topics.length} topics that matter most on{" "}
                <span className="font-semibold text-slate-900">{exam.name}</span>
                <span className="text-slate-500">
                  {" "}
                  — including full Review Modules with 8-section textbook depth. Filter by{" "}
                  <strong className="font-semibold text-slate-700">Review Modules</strong> to start
                  there.
                </span>
              </p>
            </div>
            <ExamSwitcher currentExam={examSlug} />
          </div>

          <div className="flex flex-wrap gap-3 text-sm">
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-600 shadow-sm">
              {topics.length} exam-specific topics
            </span>
            {reviewedCount > 0 ? (
              <span className="rounded-full bg-teal-50 px-3 py-1 font-medium text-teal-700">
                {reviewedCount} reviewed
              </span>
            ) : (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-500">
                Tap any card to start
              </span>
            )}
          </div>
        </header>

        <div className="space-y-4">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden
            />
            <input
              type="search"
              placeholder="Search topics, categories, or keywords…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm shadow-sm transition focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
            />
          </div>

          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
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

        {filtered.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center text-sm text-slate-600">
            No topics match your search. Try a different keyword or category.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((topic) => (
              <HighYieldTopicPreviewCard
                key={topic.id}
                topic={topic}
                progress={progressMap[topic.id]}
                onViewSummary={() => openTopic(topic)}
              />
            ))}
          </div>
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
        "rounded-full px-3.5 py-1.5 text-xs font-medium transition",
        active
          ? "bg-[var(--color-accent)] text-white shadow-sm"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
      )}
    >
      {children}
    </button>
  );
}
