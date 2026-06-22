"use client";

import { Check } from "lucide-react";

/**
 * Student-facing question preview for the admin GUI.
 *
 * Mirrors the MCQ layout used in practice (`NgnOptionLists.McqOptions`).
 * Extend this component when adding new item types (select-all, bow-tie, etc.):
 * branch on `itemType` and render the matching option list + reveal rules.
 */

export type QuestionPreviewProps = {
  scenario?: string;
  stem: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  /** Optional diagram stored in generationMeta.diagramUrl */
  diagramUrl?: string | null;
  examLabel?: string;
  /** When true, highlights the correct answer and shows the rationale. */
  revealed?: boolean;
};

export function QuestionStudentPreview({
  scenario,
  stem,
  options,
  correctAnswer,
  explanation,
  diagramUrl,
  examLabel,
  revealed = false,
}: QuestionPreviewProps) {
  const cleaned = options.map((o) => o.trim()).filter(Boolean);

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5 shadow-[var(--shadow-apple-sm)]">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
        Student preview {examLabel ? `· ${examLabel}` : ""}
      </p>

      {scenario?.trim() ? (
        <p className="mt-3 whitespace-pre-wrap rounded-xl bg-slate-50 px-4 py-3 text-sm leading-relaxed text-[var(--color-ink-muted)] dark:bg-zinc-800/80">
          {scenario.trim()}
        </p>
      ) : null}

      {diagramUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={diagramUrl}
          alt="Question diagram"
          className="mt-4 max-h-48 w-full rounded-xl border border-black/[0.06] object-contain bg-white"
        />
      ) : null}

      <p className="mt-4 text-base font-medium leading-relaxed text-[var(--color-ink)]">
        {stem.trim() || "Question stem will appear here."}
      </p>

      <ul className="mt-4 space-y-2">
        {cleaned.length === 0 ? (
          <li className="text-sm text-[var(--color-ink-muted)]">Add answer options to preview.</li>
        ) : (
          cleaned.map((opt, i) => {
            const isCorrect =
              revealed &&
              opt.toLowerCase() === correctAnswer.trim().toLowerCase();
            const row = revealed
              ? isCorrect
                ? "a11y-correct border-emerald-300 bg-emerald-50"
                : "border-black/5 opacity-60"
              : "border-black/[0.08] bg-[var(--color-surface)]";

            return (
              <li key={`${i}-${opt.slice(0, 12)}`}>
                <div className={`flex w-full gap-3 rounded-xl border px-4 py-3 text-left text-sm ${row}`}>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-black/[0.05] text-xs font-semibold">
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    {opt}
                    {isCorrect ? (
                      <span className="mt-1 flex items-center gap-1 text-xs font-semibold text-emerald-700">
                        <Check className="h-3.5 w-3.5" aria-hidden />
                        Correct answer
                      </span>
                    ) : null}
                  </span>
                </div>
              </li>
            );
          })
        )}
      </ul>

      {revealed && explanation?.trim() ? (
        <div className="mt-4 rounded-xl border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/[0.06] px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-accent)]">
            Rationale
          </p>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[var(--color-ink-muted)]">
            {explanation.trim()}
          </p>
        </div>
      ) : null}
    </div>
  );
}
