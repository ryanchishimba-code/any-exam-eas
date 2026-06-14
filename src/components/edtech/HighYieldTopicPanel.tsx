"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import {
  X,
  Star,
  Lightbulb,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  Eye,
  ChevronLeft,
  ChevronRight,
  Layers,
  List,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DeepDiveReviewPlayer } from "@/components/edtech/DeepDiveReviewPlayer";
import {
  ReviewModuleScrollView,
  type ReviewModuleScrollProgress,
} from "@/components/edtech/ReviewModuleScrollView";
import { RelatedMemoryCardsCollapsible } from "@/components/edtech/RelatedMemoryCardsCollapsible";
import { practiceTopicHref } from "@/lib/edtech/practice-links";
import { getRelatedMemoryCards } from "@/lib/edtech/topic-graph";
import { recordTopicReview, recordTopicPractice } from "@/lib/edtech/topic-actions";
import type { ExamSlug, HighYieldTopic } from "@/types/edtech";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { cn } from "@/lib/utils";

type ViewMode = "scroll" | "deep";

export function HighYieldTopicPanel({
  topic,
  examSlug,
  open,
  onClose,
  topicIndex,
  topicCount,
  onNavigate,
  initialReviewCount = 0,
  onReviewRecorded,
  initialDeepDive = false,
}: {
  topic: HighYieldTopic | null;
  examSlug: ExamSlug;
  open: boolean;
  onClose: () => void;
  topicIndex: number;
  topicCount: number;
  onNavigate: (index: number) => void;
  initialReviewCount?: number;
  onReviewRecorded?: (topicId: string, reviewCount: number) => void;
  initialDeepDive?: boolean;
}) {
  const [reviewCount, setReviewCount] = useState(initialReviewCount);
  const [, startTransition] = useTransition();
  const [viewMode, setViewMode] = useState<ViewMode>(
    initialDeepDive ? "deep" : "scroll"
  );
  const scrollRef = useRef<HTMLDivElement>(null);
  const [moduleProgress, setModuleProgress] = useState<ReviewModuleScrollProgress | null>(
    null
  );
  const practiceQuestionCount = 10;

  const handleModuleProgress = useCallback((progress: ReviewModuleScrollProgress) => {
    setModuleProgress(progress);
  }, []);

  const relatedCards = useMemo(
    () =>
      topic?.reviewModule && topic.slug
        ? getRelatedMemoryCards(examSlug, topic.slug)
        : [],
    [examSlug, topic?.reviewModule, topic?.slug]
  );

  useBodyScrollLock(open);

  useEffect(() => {
    setReviewCount(initialReviewCount);
  }, [initialReviewCount, topic?.id]);

  useEffect(() => {
    if (topic?.reviewModule) {
      setViewMode(initialDeepDive ? "deep" : "scroll");
    } else {
      setViewMode("scroll");
    }
    setModuleProgress(null);
  }, [topic?.id, topic?.reviewModule, initialDeepDive]);

  useEffect(() => {
    if (!open || !topic) return;

    let cancelled = false;
    startTransition(async () => {
      try {
        const result = await recordTopicReview(topic.id);
        if (!cancelled && result) {
          setReviewCount(result.reviewCount);
          onReviewRecorded?.(topic.id, result.reviewCount);
        }
      } catch {
        /* progress tracking is non-blocking */
      }
    });
    return () => {
      cancelled = true;
    };
  }, [open, topic?.id, onReviewRecorded]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && topicIndex > 0) onNavigate(topicIndex - 1);
      if (e.key === "ArrowRight" && topicIndex < topicCount - 1) onNavigate(topicIndex + 1);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose, topicIndex, topicCount, onNavigate]);

  if (!open || !topic) return null;

  const practiceHref = practiceTopicHref(
    examSlug,
    topic.practiceTopicSlug,
    practiceQuestionCount,
    {
      topicSlug: topic.slug,
      topicTitle: topic.title,
      deepDive: viewMode === "deep",
    }
  );
  const hasPrev = topicIndex > 0;
  const hasNext = topicIndex < topicCount - 1;

  function trackPracticeLaunch() {
    startTransition(async () => {
      await recordTopicPractice(topic!.id);
    });
  }

  return (
    <div className="fixed inset-0 z-[180]">
      <button
        type="button"
        aria-label="Close topic summary"
        className="absolute inset-0 bg-slate-900/45 backdrop-blur-[3px]"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="topic-panel-title"
        className="absolute inset-y-0 right-0 flex h-full w-full max-w-2xl flex-col border-l border-slate-200/80 bg-white shadow-2xl"
      >
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 bg-gradient-to-r from-white to-slate-50/80 px-5 py-5 sm:px-6">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="bg-teal-50 text-teal-800">{topic.category}</Badge>
                  {topic.reviewModule ? (
                    <Badge className="bg-violet-50 text-violet-800">Textbook module</Badge>
                  ) : null}
                  <span className="text-xs font-medium text-slate-400">
                    {topicIndex + 1} of {topicCount}
                  </span>
                </div>
                <h2 id="topic-panel-title" className="mt-2 text-xl font-semibold leading-snug text-slate-900">
                  {topic.title}
                </h2>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                  <Eye className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  {reviewCount === 0
                    ? "First review — great place to start"
                    : `You've reviewed this topic ${reviewCount} time${reviewCount === 1 ? "" : "s"}`}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-6 pb-28 sm:px-6">
              {topic.reviewModule ? (
                <div className="mb-4 flex rounded-xl border border-slate-200 bg-slate-50 p-1">
                  <button
                    type="button"
                    onClick={() => setViewMode("deep")}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition",
                      viewMode === "deep"
                        ? "bg-white text-violet-800 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    )}
                  >
                    <Layers className="h-3.5 w-3.5" aria-hidden />
                    Deep dive
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("scroll")}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition",
                      viewMode === "scroll"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    )}
                  >
                    <List className="h-3.5 w-3.5" aria-hidden />
                    Full scroll
                  </button>
                </div>
              ) : null}

              {topic.reviewModule && viewMode === "deep" ? (
                <DeepDiveReviewPlayer
                  content={topic.reviewModule}
                  memoryCards={relatedCards}
                  practiceHref={practiceHref}
                  onPracticeClick={trackPracticeLaunch}
                />
              ) : topic.reviewModule ? (
                <ReviewModuleScrollView
                  content={topic.reviewModule}
                  practiceHref={practiceHref}
                  topicTitle={topic.title}
                  questionCount={practiceQuestionCount}
                  onPracticeClick={trackPracticeLaunch}
                  scrollRootRef={scrollRef}
                  onProgressChange={handleModuleProgress}
                />
              ) : null}

              {topic.reviewModule && relatedCards.length > 0 ? (
                <RelatedMemoryCardsCollapsible
                  examSlug={examSlug}
                  cards={relatedCards}
                  className="mb-6 mt-6"
                />
              ) : null}

              {!topic.reviewModule ? (
                <>
              <section className="rounded-2xl border border-slate-200/60 bg-gradient-to-br from-[#f0f7fa] to-white p-5 shadow-sm">
                <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <BookOpen className="h-4 w-4 text-teal-600" aria-hidden />
                  Book summary
                </h3>
                <div className="mt-3 space-y-3 text-[0.9375rem] leading-[1.65] text-slate-700">
                  {topic.summary.split("\n\n").map((para) => (
                    <p key={para.slice(0, 48)}>{para}</p>
                  ))}
                </div>
              </section>

              <Section title="Key concepts" className="mt-6">
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600">
                  {topic.keyConcepts.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Section>

              {topic.mustKnowFacts.length > 0 ? (
                <section className="mt-6 rounded-2xl border border-amber-200/80 bg-amber-50/90 p-5">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-amber-950">
                    <Star className="h-4 w-4 text-amber-600" aria-hidden />
                    High-yield facts
                  </h3>
                  <ul className="mt-3 space-y-2 text-sm leading-relaxed text-amber-950/90">
                    {topic.mustKnowFacts.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="font-bold text-amber-600">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {topic.pearls.length > 0 ? (
                <Section title="Clinical pearls" className="mt-6" icon={Lightbulb} iconClass="text-teal-600">
                  <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-600">
                    {topic.pearls.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="text-teal-500">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Section>
              ) : null}

              {topic.pitfalls.length > 0 ? (
                <Section title="Common pitfalls" className="mt-6" icon={AlertTriangle} iconClass="text-rose-500">
                  <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-600">
                    {topic.pitfalls.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="text-rose-400">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Section>
              ) : null}
                </>
              ) : null}
            </div>

            <div className="space-y-3 border-t border-slate-100 bg-white px-5 py-4 sm:px-6">
              {topic.reviewModule && viewMode === "scroll" && moduleProgress ? (
                <p className="flex items-center justify-center gap-2 text-xs font-medium text-slate-500">
                  {moduleProgress.complete ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 text-teal-600" aria-hidden />
                      <span className="text-teal-800">All sections reviewed</span>
                    </>
                  ) : (
                    <>
                      <span className="tabular-nums">
                        {moduleProgress.viewedCount}/{moduleProgress.totalCount} sections read
                      </span>
                      <span aria-hidden>·</span>
                      <span>Jump to any section above</span>
                    </>
                  )}
                </p>
              ) : null}
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  disabled={!hasPrev}
                  onClick={() => onNavigate(topicIndex - 1)}
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" /> Previous topic
                </button>
                <button
                  type="button"
                  disabled={!hasNext}
                  onClick={() => onNavigate(topicIndex + 1)}
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-40"
                >
                  Next topic <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <Link
                href={practiceHref}
                onClick={trackPracticeLaunch}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
              >
                {topic.reviewModule && moduleProgress?.complete
                  ? `Practice ${practiceQuestionCount} questions on ${topic.title}`
                  : `Practice ${practiceQuestionCount} related questions`}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </aside>
    </div>
  );
}

function Section({
  title,
  children,
  className,
  icon: Icon,
  iconClass,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  icon?: typeof Star;
  iconClass?: string;
}) {
  return (
    <section className={className}>
      <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
        {Icon ? <Icon className={`h-4 w-4 ${iconClass ?? ""}`} aria-hidden /> : null}
        {title}
      </h3>
      {children}
    </section>
  );
}
