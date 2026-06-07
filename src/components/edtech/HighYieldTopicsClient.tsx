"use client";

import { useMemo, useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { HighYieldTopicPreviewCard } from "@/components/edtech/HighYieldTopicPreviewCard";
import { HighYieldTopicPanel } from "@/components/edtech/HighYieldTopicPanel";
import { ExamSwitcher } from "@/components/edtech/ExamSwitcher";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import { getTopicCategories } from "@/lib/edtech/seeds";
import type { ExamSlug, HighYieldTopic, TopicProgressMap } from "@/types/edtech";
import { cn } from "@/lib/utils";

export function HighYieldTopicsClient({
  examSlug,
  topics,
  progressMap,
}: {
  examSlug: ExamSlug;
  topics: HighYieldTopic[];
  progressMap: TopicProgressMap;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [activeTopic, setActiveTopic] = useState<HighYieldTopic | null>(null);
  const categories = useMemo(() => getTopicCategories(examSlug), [examSlug]);
  const exam = EXAM_CATALOG[examSlug];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return topics.filter((t) => {
      if (category !== "all" && t.category !== category) return false;
      if (!q) return true;
      return (
        t.title.toLowerCase().includes(q) ||
        t.overview.toLowerCase().includes(q) ||
        t.summary.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
    });
  }, [topics, query, category]);

  const reviewedCount = topics.filter((t) => (progressMap[t.id]?.reviewCount ?? 0) > 0).length;

  return (
    <>
      <div className="space-y-8">
        <header className="space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-2xl">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-accent)]">
                <Sparkles className="h-3.5 w-3.5" aria-hidden />
                Study Hub
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                High-Yield Topics
              </h1>
              <p className="mt-3 text-lg text-slate-600">
                The {topics.length} topics that matter most on{" "}
                <span className="font-semibold text-slate-900">{exam.name}</span>
              </p>
            </div>
            <ExamSwitcher currentExam={examSlug} />
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-slate-500">
            <span className="rounded-full bg-slate-100 px-3 py-1">
              {topics.length} condensed summaries
            </span>
            {reviewedCount > 0 ? (
              <span className="rounded-full bg-teal-50 px-3 py-1 text-teal-700">
                {reviewedCount} reviewed
              </span>
            ) : null}
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

          <div className="flex flex-wrap gap-2">
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
                onViewSummary={() => setActiveTopic(topic)}
              />
            ))}
          </div>
        )}
      </div>

      <HighYieldTopicPanel
        topic={activeTopic}
        examSlug={examSlug}
        open={activeTopic !== null}
        onClose={() => setActiveTopic(null)}
        initialReviewCount={activeTopic ? progressMap[activeTopic.id]?.reviewCount ?? 0 : 0}
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
