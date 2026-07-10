"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Check, Loader2, Sparkles } from "lucide-react";
import type { LearningInsight, RemediationRecommendation } from "@/lib/learning/types";
import { mistakeCategoryLabel } from "@/lib/learning/mistake-analysis";
import { aiTutorExamLabel, isAiTutorFieldId } from "@/lib/learning/ai-tutor-fields";
import Link from "next/link";
import type { AiTutorRequest } from "./ai-tutor-types";
import { useAiTutorExplanation } from "./useAiTutorExplanation";

type Props = {
  insight: LearningInsight;
  remediation?: RemediationRecommendation[];
  correct: boolean;
  /** When set and field is NCLEX/NAPLEX/USMLE, shows AI Tutor coaching. */
  aiTutor?: AiTutorRequest | null;
  /** Fetch AI coaching automatically on misses (NCLEX/NAPLEX/USMLE). */
  autoFetchOnMiss?: boolean;
};

export function InsightPanel({
  insight,
  remediation,
  correct,
  aiTutor,
  autoFetchOnMiss = true,
}: Props) {
  const tutorEnabled = Boolean(aiTutor && isAiTutorFieldId(aiTutor.fieldId));
  const {
    displayInsight,
    loading,
    error,
    source,
    fetchExplanation,
    canFetch,
    hasAiEnhancement,
  } = useAiTutorExplanation(insight, tutorEnabled ? aiTutor! : null, {
    autoFetchOnMiss: tutorEnabled && autoFetchOnMiss,
    correct,
  });

  const examLabel = aiTutor ? aiTutorExamLabel(aiTutor.fieldId) : "Board exam";
  const showManualCta = tutorEnabled && canFetch && !hasAiEnhancement && !loading;
  const enriched = hasAiEnhancement && source === "ai";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 space-y-4 rounded-2xl border border-black/[0.06] bg-gradient-to-b from-[var(--color-surface)] to-white p-5"
    >
      <div className="flex items-start gap-3">
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm ${
            correct ? "a11y-correct" : "a11y-incorrect"
          }`}
          aria-hidden
        >
          {correct ? <Check className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-[var(--color-ink)]">
              {correct ? "Insight — correct" : "Learn from this miss"}
            </p>
            {enriched && (
              <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-violet-800">
                <Sparkles className="h-3 w-3" aria-hidden />
                AI Tutor
              </span>
            )}
            {loading && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-violet-700">
                <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
                Coaching…
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-[var(--color-ink-muted)]">{displayInsight.summary}</p>
          {displayInsight.mistakeAnalysis && (
            <p className="mt-2 text-xs font-medium text-[var(--a11y-warning-fg)]">
              {mistakeCategoryLabel(displayInsight.mistakeAnalysis.category)}
            </p>
          )}
        </div>
      </div>

      {showManualCta && (
        <div className="rounded-xl border border-violet-200/80 bg-violet-50/60 px-4 py-3">
          <p className="text-xs font-medium text-violet-900">
            {correct
              ? `${examLabel} AI Tutor — go deeper on the reasoning`
              : `${examLabel} AI Tutor — walk through why you missed this`}
          </p>
          <button
            type="button"
            onClick={() => void fetchExplanation()}
            className="mt-2 inline-flex items-center gap-2 rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700"
          >
            <Sparkles className="h-4 w-4" aria-hidden />
            {correct ? "Explore with AI Tutor" : "Get AI Tutor walkthrough"}
          </button>
          {error && (
            <p className="mt-2 text-xs text-red-700" role="alert">
              {error}
            </p>
          )}
        </div>
      )}

      {error && !showManualCta && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-800" role="alert">
          {error}{" "}
          <button
            type="button"
            onClick={() => void fetchExplanation()}
            className="font-semibold underline"
          >
            Try again
          </button>
        </p>
      )}

      <div
        className={`space-y-2 text-sm ${enriched ? "rounded-xl border border-violet-100 bg-violet-50/30 p-4" : ""}`}
      >
        <p>
          <span className="font-medium text-[var(--a11y-correct-fg)]">Why correct: </span>
          <span className="text-[var(--color-ink-muted)]">{displayInsight.whyCorrect}</span>
        </p>
        {!correct && Object.keys(displayInsight.whyIncorrect).length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
              Why other options fail
            </p>
            {Object.entries(displayInsight.whyIncorrect)
              .slice(0, 6)
              .map(([option, reason]) => (
                <p key={option} className="text-[var(--color-ink-muted)]">
                  <span className="font-medium text-[var(--color-ink)]">{option}: </span>
                  {reason}
                </p>
              ))}
          </div>
        )}
        {displayInsight.keyTakeaways.length > 0 && (
          <ul className="list-inside list-disc text-[var(--color-ink-muted)]">
            {displayInsight.keyTakeaways.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        )}
        {displayInsight.pearls.length > 0 && (
          <p className="rounded-lg bg-sky-50 px-3 py-2 text-xs text-sky-900">
            <span className="font-semibold">Pearl: </span>
            {displayInsight.pearls[0]}
          </p>
        )}
        {displayInsight.relatedConcepts.length > 0 && enriched && (
          <p className="text-xs text-[var(--color-ink-muted)]">
            <span className="font-semibold">Related: </span>
            {displayInsight.relatedConcepts.slice(0, 4).join(" · ")}
          </p>
        )}
      </div>

      {remediation && remediation.length > 0 && !correct && (
        <div className="border-t border-black/[0.06] pt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
            Recommended next
          </p>
          <ul className="mt-2 space-y-2">
            {remediation.slice(0, 3).map((r) => (
              <li key={r.href}>
                <Link
                  href={r.href}
                  className="block rounded-xl border border-black/[0.06] px-3 py-2 text-sm hover:bg-black/[0.02]"
                >
                  <span className="font-medium">{r.title}</span>
                  <span className="mt-0.5 block text-xs text-[var(--color-ink-muted)]">
                    {r.description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}
