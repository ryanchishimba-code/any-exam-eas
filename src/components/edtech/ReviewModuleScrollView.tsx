"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import {
  getOrderedSections,
  ReviewModuleRenderer,
} from "@/components/edtech/ReviewModuleRenderer";
import {
  REVIEW_MODULE_DEFAULT_TITLES,
  type ReviewModuleContent,
  type ReviewModuleSectionId,
} from "@/lib/edtech/review-modules/types";
import { cn } from "@/lib/utils";

const SECTION_SHORT_LABELS: Record<ReviewModuleSectionId, string> = {
  "why-it-matters": "Why",
  "core-concepts": "Core",
  "clinical-applications": "Clinical",
  comparisons: "Compare",
  "visual-aids": "Visuals",
  misconceptions: "Traps",
  pearls: "Pearls",
  "quick-summary": "Summary",
};

export type ReviewModuleScrollProgress = {
  viewedCount: number;
  totalCount: number;
  complete: boolean;
};

type Props = {
  content: ReviewModuleContent;
  practiceHref: string;
  topicTitle: string;
  questionCount?: number;
  onPracticeClick?: () => void;
  scrollRootRef: React.RefObject<HTMLElement | null>;
  onProgressChange?: (progress: ReviewModuleScrollProgress) => void;
};

export function ReviewModuleScrollView({
  content,
  practiceHref,
  topicTitle,
  questionCount = 10,
  onPracticeClick,
  scrollRootRef,
  onProgressChange,
}: Props) {
  const sections = useMemo(() => getOrderedSections(content), [content]);
  const [activeId, setActiveId] = useState<ReviewModuleSectionId | null>(
    sections[0]?.id ?? null
  );
  const [viewedIds, setViewedIds] = useState<Set<ReviewModuleSectionId>>(() => new Set());

  const progress = useMemo(
    (): ReviewModuleScrollProgress => ({
      viewedCount: viewedIds.size,
      totalCount: sections.length,
      complete: sections.length > 0 && viewedIds.size >= sections.length,
    }),
    [viewedIds, sections.length]
  );

  useEffect(() => {
    onProgressChange?.(progress);
  }, [progress, onProgressChange]);

  useEffect(() => {
    setViewedIds(new Set());
    setActiveId(sections[0]?.id ?? null);
  }, [content, sections]);

  useEffect(() => {
    const root = scrollRootRef.current;
    if (!root || sections.length === 0) return;

    const nodes = sections
      .map((s) => root.querySelector<HTMLElement>(`[data-review-section="${s.id}"]`))
      .filter(Boolean) as HTMLElement[];

    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting && e.intersectionRatio >= 0.08)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target instanceof HTMLElement) {
          const id = visible[0].target.dataset.reviewSection as ReviewModuleSectionId;
          if (id) setActiveId(id);
        }

        for (const entry of entries) {
          if (
            !entry.isIntersecting ||
            entry.intersectionRatio < 0.08 ||
            !(entry.target instanceof HTMLElement)
          ) {
            continue;
          }
          const id = entry.target.dataset.reviewSection as ReviewModuleSectionId;
          if (id) {
            setViewedIds((prev) => {
              if (prev.has(id)) return prev;
              const next = new Set(prev);
              next.add(id);
              return next;
            });
          }
        }
      },
      { root, threshold: [0, 0.08, 0.25, 0.5, 0.75] }
    );

    for (const node of nodes) observer.observe(node);
    return () => observer.disconnect();
  }, [scrollRootRef, sections]);

  const scrollToSection = useCallback(
    (id: ReviewModuleSectionId) => {
      const root = scrollRootRef.current;
      const el = root?.querySelector<HTMLElement>(`[data-review-section="${id}"]`);
      if (!root || !el) return;

      const stickyOffset = 96;
      const rootTop = root.getBoundingClientRect().top;
      const elTop = el.getBoundingClientRect().top;
      root.scrollTo({
        top: root.scrollTop + (elTop - rootTop) - stickyOffset,
        behavior: "smooth",
      });
      setActiveId(id);
      setViewedIds((prev) => {
        if (prev.has(id)) return prev;
        const next = new Set(prev);
        next.add(id);
        return next;
      });
    },
    [scrollRootRef]
  );

  const pct =
    progress.totalCount > 0
      ? Math.round((progress.viewedCount / progress.totalCount) * 100)
      : 0;

  return (
    <div className="space-y-4">
      <nav
        aria-label="Module sections"
        className="sticky top-0 z-10 -mx-5 border-b border-slate-200/80 bg-white/95 px-5 py-3 backdrop-blur-md sm:-mx-6 sm:px-6"
      >
        <div className="flex items-center justify-between gap-3">
          <p className="shrink-0 text-xs font-semibold text-slate-600">
            {progress.viewedCount}/{progress.totalCount} sections
          </p>
          <div
            className="h-1.5 min-w-[4rem] flex-1 overflow-hidden rounded-full bg-slate-100"
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Module reading progress"
          >
            <div
              className={cn(
                "h-full rounded-full transition-all duration-300",
                progress.complete ? "bg-teal-500" : "bg-[var(--color-accent)]"
              )}
              style={{ width: `${pct}%` }}
            />
          </div>
          {progress.complete ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-600" aria-hidden />
          ) : null}
        </div>

        <div className="mt-2.5 flex gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {sections.map((section) => {
            const label =
              SECTION_SHORT_LABELS[section.id] ??
              REVIEW_MODULE_DEFAULT_TITLES[section.id];
            const isActive = activeId === section.id;
            const isViewed = viewedIds.has(section.id);
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => scrollToSection(section.id)}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "shrink-0 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition",
                  isActive
                    ? "bg-teal-600 text-white shadow-sm"
                    : isViewed
                      ? "bg-teal-50 text-teal-800 ring-1 ring-teal-200/80"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </nav>

      <ReviewModuleRenderer content={content} anchorSections />

      {progress.complete ? (
        <PracticeReadyBanner
          practiceHref={practiceHref}
          topicTitle={topicTitle}
          questionCount={questionCount}
          onPracticeClick={onPracticeClick}
        />
      ) : progress.viewedCount >= Math.max(1, progress.totalCount - 1) ? (
        <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-3 text-center text-xs text-slate-500">
          Finish the last section to unlock the practice shortcut below.
        </p>
      ) : null}
    </div>
  );
}

function PracticeReadyBanner({
  practiceHref,
  topicTitle,
  questionCount,
  onPracticeClick,
}: {
  practiceHref: string;
  topicTitle: string;
  questionCount: number;
  onPracticeClick?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-teal-200/70 bg-gradient-to-br from-teal-50/90 to-white p-5 shadow-sm">
      <p className="flex items-center gap-2 text-sm font-semibold text-teal-900">
        <CheckCircle2 className="h-4 w-4 text-teal-600" aria-hidden />
        Module complete — ready to practice
      </p>
      <p className="mt-1.5 text-sm text-slate-600">
        Apply what you reviewed with {questionCount} board-style questions on{" "}
        <span className="font-medium text-slate-800">{topicTitle}</span>.
      </p>
      <Link
        href={practiceHref}
        onClick={onPracticeClick}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 sm:w-auto"
      >
        Practice {questionCount} questions
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </div>
  );
}
