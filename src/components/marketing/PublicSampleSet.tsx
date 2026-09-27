"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { StudyUseNote } from "@/components/legal/StudyUseNote";
import { QuestionIssueFooter } from "@/components/study/QuestionIssueFooter";
import type { PublicSampleQuestion } from "@/lib/marketing/public-sample";
import { cn } from "@/lib/utils";

const LETTERS = ["A", "B", "C", "D", "E", "F"] as const;

function SampleCard({ item }: { item: PublicSampleQuestion }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const correct = revealed && selected === item.correct;

  return (
    <article className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5 shadow-[var(--shadow-apple-sm)] sm:p-6">
      <header className="flex items-center justify-between gap-3">
        <span className="rounded-full bg-teal-500/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-teal-800">
          {item.examLabel}
        </span>
        <span className="text-xs font-medium text-[var(--color-ink-muted)]">Sample · no sign-up</span>
      </header>
      <p className="mt-4 text-base leading-relaxed text-[var(--color-ink)]">{item.stem}</p>
      <ul className="mt-4 space-y-2" aria-label={`${item.examLabel} answer choices`}>
        {item.options.map((option, index) => {
          const isSelected = selected === option;
          const showCorrect = revealed && option === item.correct;
          const showWrong = revealed && isSelected && option !== item.correct;
          return (
            <li key={option}>
              <button
                type="button"
                aria-pressed={isSelected}
                disabled={revealed}
                onClick={() => setSelected(option)}
                className={cn(
                  "flex min-h-11 w-full items-start gap-3 rounded-2xl border px-3 py-3 text-left text-sm leading-relaxed transition",
                  showCorrect && "border-teal-500 bg-teal-50 text-teal-950",
                  showWrong && "border-rose-300 bg-rose-50 text-rose-950",
                  !showCorrect && !showWrong && isSelected && "border-teal-600 bg-teal-500/5",
                  !showCorrect && !showWrong && !isSelected && "border-[var(--color-border)] hover:border-teal-600/40"
                )}
              >
                <span className="mt-0.5 w-5 shrink-0 font-semibold text-[var(--color-ink-muted)]" aria-hidden>
                  {LETTERS[index] ?? index + 1}
                </span>
                <span className="flex-1">{option}</span>
                {showCorrect ? <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" aria-hidden /> : null}
              </button>
            </li>
          );
        })}
      </ul>
      {!revealed ? (
        <button
          type="button"
          disabled={!selected}
          onClick={() => setRevealed(true)}
          className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--color-accent)] px-5 text-sm font-semibold text-white disabled:opacity-40"
        >
          Check answer
        </button>
      ) : (
        <div className="mt-5">
          <p className="text-sm font-semibold text-[var(--color-ink)]">
            {correct ? "Correct." : "Not this one."} The keyed answer is marked.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink)]">
            <span className="font-semibold">Rationale. </span>
            {item.rationale}
          </p>
          <StudyUseNote className="mt-2" />
          <ul className="mt-3 space-y-1" aria-label="Sources stored on this question">
            {item.sources.map((source) => (
              <li key={source} className="text-xs leading-relaxed text-[var(--color-ink-muted)]">
                <span className="font-semibold uppercase tracking-[0.08em] text-[var(--color-accent)]">
                  Source
                </span>
                {" · "}
                <cite className="not-italic">{source}</cite>
              </li>
            ))}
          </ul>
          <QuestionIssueFooter
            report={{
              bankItemId: item.id,
              questionKey: item.id,
              fieldId: item.fieldId,
              stemPreview: item.stem.slice(0, 500),
              options: item.options,
              correctAnswer: item.correct,
              selectedAnswer: selected ?? undefined,
            }}
          />
        </div>
      )}
    </article>
  );
}

/** Interactive bank items. Renders nothing when the live sample is empty. */
export function PublicSampleSet({
  items,
  onlyField,
  limit,
  compact = false,
}: {
  items: PublicSampleQuestion[];
  onlyField?: string;
  /** Cap how many cards render. NCLEX items stay first. */
  limit?: number;
  compact?: boolean;
}) {
  const filtered = onlyField ? items.filter((item) => item.fieldId === onlyField) : items;
  const visible = [...filtered]
    .sort((a, b) => Number(a.fieldId !== "nursing") - Number(b.fieldId !== "nursing"))
    .slice(0, limit ?? filtered.length);
  if (visible.length === 0) return null;

  return (
    <section
      id="try-questions"
      className={
        compact
          ? "scroll-mt-24 bg-[var(--color-bg)] py-10 sm:py-12"
          : "scroll-mt-24 border-t border-[var(--color-border)] bg-[var(--color-bg)] py-16 sm:py-20"
      }
      aria-labelledby="try-questions-heading"
    >
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-accent)]">
          Free sample
        </p>
        <h2
          id="try-questions-heading"
          className="mt-3 text-[clamp(1.75rem,4vw,2.5rem)] font-bold tracking-tight text-[var(--color-ink)]"
        >
          Try sample questions. No account.
        </h2>
        <p className="mt-3 text-base leading-relaxed text-[var(--color-ink-muted)]">
          These are student-eligible items from the live bank. The rationale and sources are the
          ones stored on each question. We do not rewrite them for the marketing page.
        </p>
        <div className="mt-8 space-y-5">
          {visible.map((item) => (
            <SampleCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
