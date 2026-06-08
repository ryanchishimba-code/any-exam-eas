"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { practiceTopicHref } from "@/lib/edtech/practice-links";
import { recordTopicReview } from "@/lib/edtech/topic-actions";
import { ReviewModuleRenderer } from "@/components/edtech/ReviewModuleRenderer";
import type { ExamSlug, HighYieldTopic } from "@/types/edtech";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

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
}) {
  const [reviewCount, setReviewCount] = useState(initialReviewCount);
  const [, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);

  useBodyScrollLock(open);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setReviewCount(initialReviewCount);
  }, [initialReviewCount, topic?.id]);

  useEffect(() => {
    if (!open || !topic) return;

    let cancelled = false;
    startTransition(async () => {
      const result = await recordTopicReview(topic.id);
      if (!cancelled && result) {
        setReviewCount(result.reviewCount);
        onReviewRecorded?.(topic.id, result.reviewCount);
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

  if (!mounted || !topic) return null;

  const practiceHref = practiceTopicHref(examSlug, topic.practiceTopicSlug, 10);
  const hasPrev = topicIndex > 0;
  const hasNext = topicIndex < topicCount - 1;

  return createPortal(
    <AnimatePresence mode="wait">
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="Close topic summary"
            className="fixed inset-0 z-[180] bg-slate-900/45 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            key={topic.id}
            role="dialog"
            aria-modal="true"
            aria-labelledby="topic-panel-title"
            className="fixed inset-y-0 right-0 z-[190] flex w-full flex-col border-l border-slate-200/80 bg-white shadow-2xl sm:max-w-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
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

            <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-6">
              {topic.reviewModule ? (
                <ReviewModuleRenderer content={topic.reviewModule} />
              ) : (
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
              )}
            </div>

            <div className="space-y-3 border-t border-slate-100 bg-white px-5 py-4 sm:px-6">
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
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
              >
                Practice 10 related questions
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>,
    document.body
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
