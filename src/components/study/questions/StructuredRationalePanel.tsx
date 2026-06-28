"use client";

import { parseRationaleForDisplay } from "@/lib/engine/rationale/parse-rationale-display";
import { cleanOptionText } from "@/lib/question-format";
import type { StudyQuestion } from "@/lib/questions/types";

function renderInlineBold(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-[var(--color-ink)]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function StructuredRationalePanel({ question }: { question: StudyQuestion }) {
  const parsed = parseRationaleForDisplay(question.explanation);

  if (!parsed.isStructured) {
    return (
      <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink)] whitespace-pre-wrap">
        {question.explanation}
      </p>
    );
  }

  return (
    <div className="mt-3 space-y-4">
      {parsed.whyCorrectHeadline && (
        <p className="text-sm leading-relaxed text-[var(--color-ink)]">
          {renderInlineBold(parsed.whyCorrectHeadline)}
        </p>
      )}

      {parsed.conceptBullets.length > 0 && (
        <ul className="list-inside list-disc space-y-1.5 text-sm text-[var(--color-ink-muted)]">
          {parsed.conceptBullets.map((bullet) => (
            <li key={bullet}>{renderInlineBold(bullet)}</li>
          ))}
        </ul>
      )}

      {parsed.clinicalContext && (
        <p className="rounded-lg border border-[var(--color-accent)]/15 bg-[var(--color-accent)]/5 px-3 py-2 text-sm text-[var(--color-ink)]">
          <span className="font-semibold text-[var(--color-accent)]">In practice: </span>
          {parsed.clinicalContext}
        </p>
      )}

      {parsed.wrongOptions.length > 0 && (
        <div className="space-y-3 border-t border-black/[0.06] pt-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
            Why the other options are wrong
          </p>
          {parsed.wrongOptions.map(({ option, body }) => (
            <div
              key={option}
              className="rounded-lg border border-black/[0.06] bg-[var(--color-surface)]/60 px-3 py-2.5"
            >
              <p className="text-sm font-semibold text-[var(--color-ink)]">
                {cleanOptionText(option)}
              </p>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-[var(--color-ink-muted)]">
                {renderInlineBold(body)}
              </p>
            </div>
          ))}
        </div>
      )}

      {parsed.keyTakeaway && (
        <div className="rounded-xl border border-emerald-200/60 bg-emerald-50/50 px-4 py-3 dark:border-emerald-900/40 dark:bg-emerald-950/30">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
            Key takeaway
          </p>
          <p className="mt-1.5 text-sm font-medium leading-relaxed text-[var(--color-ink)]">
            {parsed.keyTakeaway}
          </p>
        </div>
      )}

      {parsed.memoryHook && (
        <p className="rounded-lg bg-sky-50 px-3 py-2 text-sm text-sky-900 dark:bg-sky-950/40 dark:text-sky-100">
          <span className="font-semibold">Memory hook: </span>
          {parsed.memoryHook}
        </p>
      )}
    </div>
  );
}
