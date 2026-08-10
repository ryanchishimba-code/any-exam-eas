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
  Lock,
  Pill,
  Zap,
} from "lucide-react";
import { RelatedAnatomyLinks } from "@/components/anatomy/RelatedAnatomyLinks";
import { DeepDiveReviewPlayer } from "@/components/edtech/DeepDiveReviewPlayer";
import {
  ReviewModuleScrollView,
  type ReviewModuleScrollProgress,
} from "@/components/edtech/ReviewModuleScrollView";
import { RelatedMemoryCardsCollapsible } from "@/components/edtech/RelatedMemoryCardsCollapsible";
import { highYieldTopicPracticeHref } from "@/lib/edtech/practice-links";
import {
  buildTopicDrugClassLinks,
  buildTopicDrugLinks,
  buildTopicPresetLinks,
} from "@/lib/exam-prep/nclex/topic-drug-links";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import { getRelatedMemoryCards } from "@/lib/edtech/topic-graph";
import { getAnatomyDiseasePearlsForReviewModule, getAnatomyStructuresForTopicSlug } from "@/lib/anatomy/topic-links";
import { recordTopicReview, recordTopicPractice } from "@/lib/edtech/topic-actions";
import type { ExamSlug, HighYieldTopic } from "@/types/edtech";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { studyUi } from "@/lib/study/study-ui";
import { cn } from "@/lib/utils";

type ViewMode = "scroll" | "deep";

function withAutostart(href: string): string {
  const url = new URL(href, "https://anyexameasy.local");
  url.searchParams.set("autostart", "1");
  return `${url.pathname}?${url.searchParams.toString()}`;
}

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
  // Deep Dive closes the loop with a short retest; scroll mode keeps a 10Q drill.
  const practiceQuestionCount = viewMode === "deep" ? 5 : 10;

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

  const anatomyStructures = useMemo(() => {
    if (!topic?.slug) return [];
    const cardIds = relatedCards.map((c) => c.id);
    const cardStructureIds = relatedCards.flatMap((c) => c.structureIds ?? []);
    return getAnatomyStructuresForTopicSlug(topic.slug, {
      memoryCardIds: cardIds,
      structureIds: [...(topic.relatedStructureIds ?? []), ...cardStructureIds],
    });
  }, [topic?.slug, topic?.relatedStructureIds, relatedCards]);

  const diseasePearls = useMemo(() => {
    if (!topic?.slug) return [];
    return getAnatomyDiseasePearlsForReviewModule(topic.slug);
  }, [topic?.slug]);

  const drugLinks = useMemo(() => (topic ? buildTopicDrugLinks(topic) : []), [topic]);
  const drugClassLinks = useMemo(() => (topic ? buildTopicDrugClassLinks(topic) : []), [topic]);
  const presetLinks = useMemo(
    () =>
      topic && (examSlug === "nclex" || examSlug === "usmle")
        ? buildTopicPresetLinks(examSlug, topic)
        : [],
    [topic, examSlug]
  );
  const showStudyDrugLinks = examSlug === "nclex" || examSlug === "usmle";

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

  const returnTo = {
    topicSlug: topic.slug,
    topicTitle: topic.title,
    deepDive: viewMode === "deep",
  };
  const practiceHrefRaw = highYieldTopicPracticeHref(
    examSlug,
    topic,
    practiceQuestionCount,
    returnTo
  );
  const practiceHref =
    viewMode === "deep" ? withAutostart(practiceHrefRaw) : practiceHrefRaw;
  const practiceBlockHref =
    viewMode === "deep"
      ? withAutostart(highYieldTopicPracticeHref(examSlug, topic, 25, returnTo))
      : null;
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
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="topic-panel-title"
        className={studyUi.sheet}
      >
            <div className={cn(studyUi.sheetHeader, "flex items-start justify-between gap-4")}>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="rounded-full bg-[var(--color-surface)] px-2.5 py-0.5 text-[10px] font-semibold text-[var(--color-ink-muted)]">
                    {topic.category}
                  </span>
                  {topic.reviewModule ? (
                    <span className="rounded-full bg-violet-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-violet-700">
                      Module
                    </span>
                  ) : null}
                  <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-surface)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
                    <Lock className="h-2.5 w-2.5" aria-hidden />
                    {EXAM_CATALOG[examSlug]?.shortName ?? examSlug}
                  </span>
                  <span className="text-[11px] font-medium text-[var(--color-ink-muted)]">
                    {topicIndex + 1} / {topicCount}
                  </span>
                </div>
                <h2
                  id="topic-panel-title"
                  className="mt-2 text-lg font-semibold leading-snug text-[var(--color-ink)] sm:text-xl"
                >
                  {topic.title}
                </h2>
                <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-[var(--color-ink-muted)]">
                  <Eye className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  {reviewCount === 0
                    ? "First review — great place to start"
                    : `Reviewed ${reviewCount} time${reviewCount === 1 ? "" : "s"}`}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 rounded-lg p-2 text-[var(--color-ink-muted)] transition hover:bg-[var(--color-surface)] hover:text-[var(--color-ink)]"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 pb-28 sm:px-5">
              {topic.reviewModule ? (
                <div className="mb-4 grid grid-cols-2 gap-0.5 rounded-xl bg-[var(--color-surface)]/80 p-0.5">
                  <button
                    type="button"
                    onClick={() => setViewMode("deep")}
                    className={cn(
                      "flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-[11px] font-semibold transition",
                      viewMode === "deep"
                        ? "bg-[var(--color-surface-elevated)] text-violet-800 shadow-sm"
                        : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                    )}
                  >
                    <Layers className="h-3.5 w-3.5" aria-hidden />
                    Deep dive
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("scroll")}
                    className={cn(
                      "flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-[11px] font-semibold transition",
                      viewMode === "scroll"
                        ? "bg-[var(--color-surface-elevated)] text-[var(--color-ink)] shadow-sm"
                        : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
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
                  practiceSecondaryHref={practiceBlockHref ?? undefined}
                  practiceLabel={`Retest ${practiceQuestionCount} questions`}
                  practiceSecondaryLabel="Practice 25"
                  onPracticeClick={trackPracticeLaunch}
                  examSlug={examSlug}
                  moduleSlug={topic.slug}
                  anatomyStructures={anatomyStructures}
                  diseasePearls={diseasePearls}
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
                  examSlug={examSlug}
                  anatomyStructures={anatomyStructures}
                  diseasePearls={diseasePearls}
                />
              ) : null}

              {topic.reviewModule && relatedCards.length > 0 ? (
                <RelatedMemoryCardsCollapsible
                  examSlug={examSlug}
                  cards={relatedCards}
                  className="mb-6 mt-6"
                />
              ) : null}

              {showStudyDrugLinks &&
              (drugLinks.length > 0 || drugClassLinks.length > 0 || presetLinks.length > 0) ? (
                <section className="mb-6 mt-6 space-y-3 rounded-2xl border border-teal-200/60 bg-teal-50/40 p-4">
                  <h3 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-teal-900">
                    <Pill className="h-3.5 w-3.5" aria-hidden />
                    Integrated study links
                  </h3>
                  {drugClassLinks.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {drugClassLinks.map((link) => (
                        <Link
                          key={link.classId}
                          href={link.href}
                          className="rounded-full border border-teal-300/80 bg-white px-3 py-1 text-[11px] font-semibold text-teal-900 hover:bg-teal-100"
                        >
                          {link.label} flashcards
                        </Link>
                      ))}
                    </div>
                  ) : null}
                  {drugLinks.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {drugLinks.map((link) => (
                        <Link
                          key={link.id}
                          href={link.href}
                          className="rounded-lg bg-white px-2.5 py-1 text-[11px] font-medium text-teal-800 ring-1 ring-teal-200/80 hover:bg-teal-100"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                  {presetLinks.length > 0 ? (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {presetLinks.map((link) => (
                        <Link
                          key={link.id}
                          href={link.href}
                          className="inline-flex items-center gap-1 rounded-full bg-teal-700 px-3 py-1 text-[11px] font-semibold text-white hover:bg-teal-800"
                        >
                          <Zap className="h-3 w-3" aria-hidden />
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </section>
              ) : null}

              {!topic.reviewModule ? (
                <>
              <section className={cn(studyUi.surface, "p-4")}>
                <h3 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
                  <BookOpen className="h-3.5 w-3.5 text-[var(--color-accent)]" aria-hidden />
                  Summary
                </h3>
                <div className="mt-3 space-y-3 text-[14px] leading-relaxed text-[var(--color-ink)]">
                  {topic.summary.split("\n\n").map((para) => (
                    <p key={para.slice(0, 48)}>{para}</p>
                  ))}
                </div>
              </section>

              <Section title="Key concepts" className="mt-5">
                <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[13px] leading-relaxed text-[var(--color-ink-muted)]">
                  {topic.keyConcepts.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Section>

              {topic.mustKnowFacts.length > 0 ? (
                <section className="mt-5 rounded-2xl border border-amber-200/50 bg-amber-50/50 p-4">
                  <h3 className="flex items-center gap-2 text-[13px] font-semibold text-amber-950">
                    <Star className="h-4 w-4 text-amber-600" aria-hidden />
                    High-yield facts
                  </h3>
                  <ul className="mt-2 space-y-1.5 text-[13px] leading-relaxed text-amber-950/90">
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
                <Section title="Clinical pearls" className="mt-5" icon={Lightbulb} iconClass="text-[var(--color-accent)]">
                  <ul className="mt-2 space-y-1.5 text-[13px] leading-relaxed text-[var(--color-ink-muted)]">
                    {topic.pearls.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="text-[var(--color-accent)]">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Section>
              ) : null}

              {topic.pitfalls.length > 0 ? (
                <Section title="Common pitfalls" className="mt-5" icon={AlertTriangle} iconClass="text-rose-500">
                  <ul className="mt-2 space-y-1.5 text-[13px] leading-relaxed text-[var(--color-ink-muted)]">
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

            <div className={cn(studyUi.sheetFooter, "space-y-3")}>
              {topic.reviewModule && viewMode === "scroll" && moduleProgress ? (
                <p className="flex items-center justify-center gap-2 text-[11px] font-medium text-[var(--color-ink-muted)]">
                  {moduleProgress.complete ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" aria-hidden />
                      <span className="text-emerald-800">All sections reviewed</span>
                    </>
                  ) : (
                    <>
                      <span className="tabular-nums">
                        {moduleProgress.viewedCount}/{moduleProgress.totalCount} sections read
                      </span>
                    </>
                  )}
                </p>
              ) : null}
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  disabled={!hasPrev}
                  onClick={() => onNavigate(topicIndex - 1)}
                  className={cn(studyUi.ghostBtn, "px-2.5 py-1.5 text-[11px] disabled:opacity-40")}
                >
                  <ChevronLeft className="h-4 w-4" /> Prev
                </button>
                <button
                  type="button"
                  disabled={!hasNext}
                  onClick={() => onNavigate(topicIndex + 1)}
                  className={cn(studyUi.ghostBtn, "px-2.5 py-1.5 text-[11px] disabled:opacity-40")}
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <Link
                href={practiceHref}
                onClick={trackPracticeLaunch}
                className={cn(studyUi.primaryBtn, "w-full py-3")}
              >
                {topic.reviewModule && moduleProgress?.complete
                  ? viewMode === "deep"
                    ? `Retest ${practiceQuestionCount} questions`
                    : `Practice ${practiceQuestionCount} questions`
                  : `Practice ${practiceQuestionCount} related questions`}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              {anatomyStructures.length > 0 ? (
                <div className="rounded-xl border border-sky-200/50 bg-sky-50/40 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-sky-800">
                    Visualize the anatomy
                  </p>
                  <RelatedAnatomyLinks
                    examSlug={examSlug}
                    structures={anatomyStructures}
                    className="mt-2"
                  />
                </div>
              ) : null}
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
      <h3 className="flex items-center gap-2 text-[13px] font-semibold text-[var(--color-ink)]">
        {Icon ? <Icon className={`h-4 w-4 ${iconClass ?? ""}`} aria-hidden /> : null}
        {title}
      </h3>
      {children}
    </section>
  );
}
