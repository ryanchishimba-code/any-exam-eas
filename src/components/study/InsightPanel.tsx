"use client";

import { motion } from "framer-motion";
import { Check, AlertTriangle } from "lucide-react";
import type { LearningInsight, RemediationRecommendation } from "@/lib/learning/types";
import { mistakeCategoryLabel } from "@/lib/learning/mistake-analysis";
import Link from "next/link";

type Props = {
  insight: LearningInsight;
  remediation?: RemediationRecommendation[];
  correct: boolean;
};

export function InsightPanel({ insight, remediation, correct }: Props) {
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
        <div>
          <p className="text-sm font-semibold text-[var(--color-ink)]">
            {correct ? "Insight — correct" : "Learn from this miss"}
          </p>
          <p className="mt-1 text-sm text-[var(--color-ink-muted)]">{insight.summary}</p>
          {insight.mistakeAnalysis && (
            <p className="mt-2 text-xs font-medium text-[var(--a11y-warning-fg)]">
              {mistakeCategoryLabel(insight.mistakeAnalysis.category)}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <p>
          <span className="font-medium text-[var(--a11y-correct-fg)]">Why correct: </span>
          <span className="text-[var(--color-ink-muted)]">{insight.whyCorrect}</span>
        </p>
        {insight.keyTakeaways.length > 0 && (
          <ul className="list-inside list-disc text-[var(--color-ink-muted)]">
            {insight.keyTakeaways.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        )}
        {insight.pearls.length > 0 && (
          <p className="rounded-lg bg-sky-50 px-3 py-2 text-xs text-sky-900">
            <span className="font-semibold">Pearl: </span>
            {insight.pearls[0]}
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
