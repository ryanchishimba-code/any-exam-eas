"use client";

import { formatNgnLabel } from "@/lib/questions/ngn-map";
import type { StudyQuestion } from "@/lib/questions/types";

export function NgnFormatBadge({ question }: { question: StudyQuestion }) {
  const label = formatNgnLabel(question.type, question.ngnFormat);
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/8 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-accent)]">
      {label}
      {question.caseStep != null && (
        <span className="text-[var(--color-ink-muted)]">· Step {question.caseStep}</span>
      )}
    </span>
  );
}

export function VignetteBlock({ text }: { text: string }) {
  return (
    <div className="mb-5 rounded-xl border border-black/[0.06] bg-[var(--color-surface)] px-4 py-3.5">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
        Clinical scenario
      </p>
      <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink)] whitespace-pre-wrap">
        {text}
      </p>
    </div>
  );
}
