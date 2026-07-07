"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LayoutGrid, List, Search, X } from "lucide-react";
import { HighYieldDomainAccordion } from "@/components/edtech/HighYieldDomainAccordion";
import { HighYieldTopicPreviewCard } from "@/components/edtech/HighYieldTopicPreviewCard";
import { HighYieldTopicPanel } from "@/components/edtech/HighYieldTopicPanel";
import { HighYieldTopicsGuide } from "@/components/edtech/HighYieldTopicsGuide";
import { HighYieldTopicsHeader } from "@/components/edtech/HighYieldTopicsHeader";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import { filterHighYieldTopics, clampTopicIndex } from "@/lib/edtech/topic-selection";
import {
  buildTopicGroups,
  getNextTopicInPath,
} from "@/lib/edtech/topic-navigation";
import {
  groupNclexTopicsByDomain,
  NCLEX_CLIENT_NEEDS_DOMAINS,
} from "@/lib/exam-prep/nclex/topic-registry";
import {
  NCLEX_LEARNING_PATH_ORDER,
  sortTopicsByNclexPath,
} from "@/lib/exam-prep/nclex/topic-learning-path";
import {
  groupNaplexTopicsByDomain,
  NAPLEX_CONTENT_DOMAINS,
} from "@/lib/exam-prep/naplex/topic-registry";
import {
  getUsmleLearningPath,
  getNextUsmleTopicInPath,
  sortTopicsByUsmlePath,
} from "@/lib/exam-prep/usmle/topic-learning-path";
import {
  groupUsmleTopicsByDomain,
  getUsmleStudyDomains,
  usmleStepFromShortLabel,
} from "@/lib/exam-prep/usmle/topic-registry";
import { studyUi } from "@/lib/study/study-ui";
import type { ExamSlug, HighYieldTopic, TopicProgressMap } from "@/types/edtech";
import { cn } from "@/lib/utils";

type ViewMode = "guide" | "browse";

const GUIDE_EXAMS: ExamSlug[] = ["nclex", "naplex", "usmle"];
const GUIDE_TOPIC_THRESHOLD = 12;

function sortTopicsByUsmleDomain(
  topics: HighYieldTopic[],
  stepLabel?: string
): HighYieldTopic[] {
  const step = usmleStepFromShortLabel(stepLabel);
  const domainOrder = new Map(getUsmleStudyDomains(step).map((d, i) => [d.id, i]));
  return [...topics].sort((a, b) => {
    const da = domainOrder.get(a.clientNeedsDomain ?? "") ?? 99;
    const db = domainOrder.get(b.clientNeedsDomain ?? "") ?? 99;
    if (da !== db) return da - db;
    return a.title.localeCompare(b.title);
  });
}

function sortTopicsByNaplexDomain(topics: HighYieldTopic[]): HighYieldTopic[] {
  const domainOrder = new Map(NAPLEX_CONTENT_DOMAINS.map((d, i) => [d.id, i]));
  return [...topics].sort((a, b) => {
    const da = domainOrder.get(a.clientNeedsDomain ?? "") ?? 99;
    const db = domainOrder.get(b.clientNeedsDomain ?? "") ?? 99;
    if (da !== db) return da - db;
    return a.title.localeCompare(b.title);
  });
}

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
  const supportsGuide =
    GUIDE_EXAMS.includes(examSlug) && topics.length >= GUIDE_TOPIC_THRESHOLD;

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(supportsGuide ? "guide" : "browse");
  const [focusedDomainId, setFocusedDomainId] = useState<string | null>(null);
  const [expandedDomainIds, setExpandedDomainIds] = useState<Set<string>>(() => new Set());
  const [selectedSlug, setSelectedSlug] = useState<string | null>(initialTopicSlug ?? null);
  const [progressMap, setProgressMap] = useState(initialProgress);
  const exam = EXAM_CATALOG[examSlug];
  const initializedExpand = useRef(false);

  const usmleStep = usmleStepFromShortLabel(usmleStepLabel);

  const categories = useMemo(() => {
    if (examSlug === "nclex") {
      return NCLEX_CLIENT_NEEDS_DOMAINS.map((d) => d.label);
    }
    if (examSlug === "naplex") {
      return NAPLEX_CONTENT_DOMAINS.map((d) => d.label);
    }
    if (examSlug === "usmle") {
      return getUsmleStudyDomains(usmleStep).map((d) => d.label);
    }
    const cats = new Set(topics.map((t) => t.category));
    return [...cats].sort();
  }, [examSlug, topics, usmleStep]);

  useEffect(() => {
    setProgressMap(initialProgress);
  }, [initialProgress]);

  const filtered = useMemo(
    () => filterHighYieldTopics(topics, query, category ?? "all"),
    [topics, query, category]
  );

  const isFiltering = query.trim().length > 0 || (category !== null && category !== "all");
  const effectiveView: ViewMode = supportsGuide && !isFiltering ? viewMode : "browse";

  const pathOrderMap = useMemo(() => {
    if (examSlug === "nclex") {
      return new Map(NCLEX_LEARNING_PATH_ORDER.map((slug, index) => [slug, index]));
    }
    if (examSlug === "usmle") {
      return new Map(getUsmleLearningPath(usmleStep).map((slug, index) => [slug, index]));
    }
    return undefined;
  }, [examSlug, usmleStep]);

  const topicGroups = useMemo(() => {
    if (examSlug === "nclex") {
      const grouped = groupNclexTopicsByDomain(filtered);
      return buildTopicGroups(grouped, progressMap, sortTopicsByNclexPath);
    }
    if (examSlug === "naplex") {
      const grouped = groupNaplexTopicsByDomain(filtered);
      return buildTopicGroups(grouped, progressMap, sortTopicsByNaplexDomain);
    }
    if (examSlug === "usmle") {
      const grouped = groupUsmleTopicsByDomain(filtered, usmleStep);
      return buildTopicGroups(grouped, progressMap, (t) => sortTopicsByUsmlePath(t, usmleStep));
    }
    return [];
  }, [examSlug, filtered, progressMap, usmleStep]);

  const displayGroups = useMemo(() => {
    if (!focusedDomainId) return topicGroups;
    return topicGroups.filter((g) => g.id === focusedDomainId);
  }, [topicGroups, focusedDomainId]);

  const navigationTopics = useMemo(() => {
    if (isFiltering) return filtered;
    if (examSlug === "nclex") return sortTopicsByNclexPath(filtered);
    if (examSlug === "naplex") return sortTopicsByNaplexDomain(filtered);
    if (examSlug === "usmle") return sortTopicsByUsmlePath(filtered, usmleStep);
    return filtered;
  }, [examSlug, filtered, isFiltering, usmleStep]);

  const nextTopic = useMemo(() => {
    if (examSlug === "nclex") {
      return getNextTopicInPath(topics, progressMap, NCLEX_LEARNING_PATH_ORDER);
    }
    if (examSlug === "naplex") {
      const ordered = sortTopicsByNaplexDomain(topics);
      return ordered.find((t) => (progressMap[t.id]?.reviewCount ?? 0) === 0) ?? ordered[0] ?? null;
    }
    if (examSlug === "usmle") {
      return getNextUsmleTopicInPath(topics, progressMap, usmleStep);
    }
    return null;
  }, [examSlug, topics, progressMap, usmleStep]);

  const grouped = useMemo(() => {
    if (examSlug === "nclex" && (category === null || category === "all")) {
      return groupNclexTopicsByDomain(filtered).map(({ domain, topics: domainTopics }) => [
        domain.weightPct > 0 ? `${domain.label} (${domain.weightPct}%)` : domain.label,
        sortTopicsByNclexPath(domainTopics),
      ] as const);
    }
    if (examSlug === "naplex" && (category === null || category === "all")) {
      return groupNaplexTopicsByDomain(filtered).map(({ domain, topics: domainTopics }) => [
        domain.weightPct > 0 ? domain.label : domain.label,
        sortTopicsByNaplexDomain(domainTopics),
      ] as const);
    }
    if (examSlug === "usmle" && (category === null || category === "all")) {
      return groupUsmleTopicsByDomain(filtered, usmleStep).map(({ domain, topics: domainTopics }) => [
        domain.label,
        sortTopicsByUsmlePath(domainTopics, usmleStep),
      ] as const);
    }
    const map = new Map<string, HighYieldTopic[]>();
    for (const topic of filtered) {
      const list = map.get(topic.category) ?? [];
      list.push(topic);
      map.set(topic.category, list);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [examSlug, filtered, category, usmleStep]);

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
    if (navigationTopics.some((t) => t.slug === initialTopicSlug)) {
      setSelectedSlug(initialTopicSlug);
    }
  }, [initialTopicSlug, navigationTopics]);

  useEffect(() => {
    if (!supportsGuide || initializedExpand.current || topicGroups.length === 0) return;
    initializedExpand.current = true;
    const firstIncomplete = topicGroups.find((g) => g.reviewed < g.total);
    const seed = firstIncomplete?.id ?? topicGroups[0]?.id;
    if (seed) setExpandedDomainIds(new Set([seed]));
  }, [supportsGuide, topicGroups]);

  const activeTopic =
    selectedSlug !== null
      ? (navigationTopics.find((t) => t.slug === selectedSlug) ?? null)
      : null;
  const activeIndex =
    activeTopic !== null
      ? navigationTopics.findIndex((t) => t.slug === activeTopic.slug)
      : -1;
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

  const toggleDomain = useCallback((domainId: string) => {
    setExpandedDomainIds((prev) => {
      const next = new Set(prev);
      if (next.has(domainId)) next.delete(domainId);
      else next.add(domainId);
      return next;
    });
  }, []);

  const handleSelectDomain = useCallback((domainId: string | null) => {
    setFocusedDomainId(domainId);
    if (domainId) {
      setExpandedDomainIds(new Set([domainId]));
      requestAnimationFrame(() => {
        document
          .getElementById(`topic-domain-${domainId}`)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, []);

  const handleContinue = useCallback(() => {
    if (nextTopic) openTopic(nextTopic);
  }, [nextTopic, openTopic]);

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
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative min-w-0 flex-1">
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

            {supportsGuide ? (
              <div
                className="inline-flex shrink-0 rounded-xl border border-[var(--color-border)]/80 bg-[var(--color-surface)]/50 p-0.5"
                role="tablist"
                aria-label="Topics layout"
              >
                <ViewToggle
                  active={effectiveView === "guide"}
                  onClick={() => setViewMode("guide")}
                  icon={LayoutGrid}
                  label="Guide"
                />
                <ViewToggle
                  active={effectiveView === "browse"}
                  onClick={() => setViewMode("browse")}
                  icon={List}
                  label="Browse"
                />
              </div>
            ) : null}
          </div>

          {effectiveView === "browse" ? (
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
          ) : null}
        </div>

        {filtered.length === 0 ? (
          <p className={studyUi.emptyState}>
            No topics match your search. Try a different keyword or category.
          </p>
        ) : effectiveView === "guide" && topicGroups.length > 0 ? (
          <div className="space-y-5">
            <HighYieldTopicsGuide
              nextTopic={nextTopic}
              groups={topicGroups}
              focusedDomainId={focusedDomainId}
              onContinue={handleContinue}
              onSelectDomain={handleSelectDomain}
            />
            <HighYieldDomainAccordion
              examSlug={examSlug}
              groups={displayGroups}
              progressMap={progressMap}
              expandedDomainIds={expandedDomainIds}
              onToggleDomain={toggleDomain}
              onOpenTopic={openTopic}
              showStepNumbers={examSlug === "nclex"}
              pathOrder={pathOrderMap}
            />
          </div>
        ) : (category === null || category === "all") && grouped.length > 1 ? (
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
                        stepNumber={
                          examSlug === "nclex" && pathOrderMap?.has(topic.slug)
                            ? pathOrderMap.get(topic.slug)! + 1
                            : undefined
                        }
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
        topicCount={navigationTopics.length}
        onNavigate={(index) => {
          const next = navigationTopics[clampTopicIndex(index, navigationTopics.length)];
          if (next) setSelectedSlug(next.slug);
        }}
        initialReviewCount={activeTopic ? (progressMap[activeTopic.id]?.reviewCount ?? 0) : 0}
        initialDeepDive={initialDeepDive}
        onReviewRecorded={handleReviewRecorded}
      />
    </>
  );
}

function ViewToggle({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof LayoutGrid;
  label: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-semibold transition",
        active
          ? "bg-[var(--color-accent)] text-white shadow-sm"
          : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {label}
    </button>
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
