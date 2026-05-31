"use client";

import { cleanOptionText } from "@/lib/question-format";
import {
  bowTieSelectionValid,
  parseBowTieLayout,
  parseHighlightLayout,
  parseMatrixKey,
  parseMatrixLayout,
} from "@/lib/questions/ngn-structures";
import type { StudyQuestion } from "@/lib/questions/types";
import { Check, X } from "lucide-react";

type BaseProps = {
  question: StudyQuestion;
  selected: string[];
  revealed: boolean;
  onToggle: (option: string) => void;
};

function revealedClass(selected: boolean, isCorrect: boolean, revealed: boolean): string {
  if (!revealed) {
    return selected
      ? "border-[var(--color-accent)] bg-sky-50 ring-2 ring-sky-200/80"
      : "border-black/[0.08] bg-[var(--color-surface)] hover:border-[var(--color-accent)]/40";
  }
  if (isCorrect) return "a11y-correct";
  if (selected) return "a11y-incorrect";
  return "border-black/5 opacity-50";
}

export function BowTieQuestion({ question, selected, revealed, onToggle }: BaseProps) {
  const layout = parseBowTieLayout(question);

  function toggleBowTie(opt: string, pool: "action" | "monitor") {
    if (revealed) return;

    if (selected.includes(opt)) {
      onToggle(opt);
      return;
    }

    if (pool === "action") {
      for (const s of selected.filter((x) => layout.actions.includes(x))) {
        onToggle(s);
      }
      onToggle(opt);
      return;
    }

    const monitors = selected.filter((s) => layout.monitors.includes(s));
    if (monitors.length >= layout.monitorPickCount) {
      onToggle(monitors[0]);
    }
    onToggle(opt);
  }

  const valid = bowTieSelectionValid(selected, layout);

  return (
    <div className="mt-6 space-y-4">
      <p className="text-xs text-[var(--color-ink-muted)]">
        Select <strong>one action</strong> and{" "}
        <strong>{layout.monitorPickCount} conditions to monitor</strong>.
      </p>

      <div className="grid gap-3 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
        <div className="rounded-xl border border-black/[0.08] bg-[var(--color-surface)] p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-accent)]">
            Actions to take
          </p>
          <ul className="mt-3 space-y-2">
            {layout.actions.map((opt) => {
              const isSelected = selected.includes(opt);
              const isCorrect = question.correctAnswers.some(
                (c) => cleanOptionText(c).toLowerCase() === opt.toLowerCase()
              );
              return (
                <li key={opt}>
                  <button
                    type="button"
                    disabled={revealed}
                    onClick={() => toggleBowTie(opt, "action")}
                    className={`w-full rounded-lg border px-3 py-2.5 text-left text-sm transition ${revealedClass(isSelected, isCorrect, revealed)}`}
                  >
                    {opt}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex items-center justify-center lg:px-2">
          <div className="w-full rounded-xl border-2 border-dashed border-[var(--color-accent)]/35 bg-[var(--color-accent)]/5 px-4 py-5 text-center lg:max-w-[200px]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
              Condition
            </p>
            <p className="mt-2 text-sm font-semibold leading-snug text-[var(--color-ink)]">
              {layout.condition}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-black/[0.08] bg-[var(--color-surface)] p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
            Conditions to monitor
          </p>
          <ul className="mt-3 space-y-2">
            {layout.monitors.map((opt) => {
              const isSelected = selected.includes(opt);
              const isCorrect = question.correctAnswers.some(
                (c) => cleanOptionText(c).toLowerCase() === opt.toLowerCase()
              );
              return (
                <li key={opt}>
                  <button
                    type="button"
                    disabled={revealed}
                    onClick={() => toggleBowTie(opt, "monitor")}
                    className={`w-full rounded-lg border px-3 py-2.5 text-left text-sm transition ${revealedClass(isSelected, isCorrect, revealed)}`}
                  >
                    {opt}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {!revealed && (
        <p className="text-xs text-[var(--color-ink-muted)]">
          {valid
            ? "Selection complete — submit when ready."
            : `Pick 1 action and ${layout.monitorPickCount} monitors.`}
        </p>
      )}
    </div>
  );
}

export function MatrixQuestion({ question, selected, revealed, onToggle }: BaseProps) {
  const layout = parseMatrixLayout(question);

  function toggleCell(row: string, col: string) {
    if (revealed) return;
    const key = `${row}|||${col}`;
    onToggle(key);
  }

  return (
    <div className="mt-6 overflow-x-auto">
      <p className="mb-3 text-xs text-[var(--color-ink-muted)]">
        Select the best column for each clinical finding.
      </p>
      <table className="w-full min-w-[480px] border-collapse text-sm">
        <thead>
          <tr>
            <th className="border border-black/10 bg-black/[0.03] px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
              Finding
            </th>
            {layout.columns.map((col) => (
              <th
                key={col}
                className="border border-black/10 bg-black/[0.03] px-3 py-2 text-center text-xs font-semibold text-[var(--color-ink)]"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {layout.rows.map((row) => (
            <tr key={row}>
              <td className="border border-black/10 px-3 py-2 font-medium text-[var(--color-ink)]">
                {row}
              </td>
              {layout.columns.map((col) => {
                const key = `${row}|||${col}`;
                const isSelected = selected.includes(key);
                const isCorrect = question.correctAnswers.some(
                  (c) => c.toLowerCase() === key.toLowerCase()
                );
                return (
                  <td key={col} className="border border-black/10 p-1">
                    <button
                      type="button"
                      disabled={revealed}
                      aria-pressed={isSelected}
                      aria-label={`${row}: ${col}`}
                      onClick={() => toggleCell(row, col)}
                      className={`flex h-10 w-full items-center justify-center rounded-lg border transition ${revealedClass(isSelected, isCorrect, revealed)}`}
                    >
                      {revealed && isCorrect && (
                        <Check className="h-4 w-4 a11y-correct-text" aria-hidden />
                      )}
                      {revealed && isSelected && !isCorrect && (
                        <X className="h-4 w-4 a11y-incorrect-text" aria-hidden />
                      )}
                      {!revealed && isSelected && (
                        <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-accent)]" />
                      )}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function HighlightQuestion({ question, selected, revealed, onToggle }: BaseProps) {
  const layout = parseHighlightLayout(question);

  return (
    <div className="mt-6">
      <p className="mb-3 text-xs text-[var(--color-ink-muted)]">
        Tap the sentence(s) that answer the question.
      </p>
      <div className="space-y-2 rounded-xl border border-black/[0.08] bg-[var(--color-surface)] p-4">
        {layout.segments.map((seg) => {
          const isSelected = selected.includes(seg.text);
          const isCorrect = question.correctAnswers.some(
            (c) => cleanOptionText(c).toLowerCase() === seg.text.toLowerCase()
          );
          return (
            <button
              key={seg.id}
              type="button"
              disabled={revealed}
              onClick={() => onToggle(seg.text)}
              className={`block w-full rounded-lg border px-3 py-2 text-left text-sm leading-relaxed transition ${revealedClass(isSelected, isCorrect, revealed)}`}
            >
              {seg.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function UnfoldingCaseBanner({ question }: { question: StudyQuestion }) {
  if (question.type !== "unfolding_case" && question.ngnFormat !== "unfolding_case") {
    return null;
  }
  const step = question.caseStep ?? 1;
  return (
    <div className="mb-4 flex items-center gap-2 rounded-xl border border-sky-200/80 bg-sky-50/80 px-4 py-2.5">
      <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700">
        Unfolding case
      </span>
      <span className="text-xs text-[var(--color-ink-muted)]">·</span>
      <span className="text-xs font-medium text-[var(--color-ink)]">
        Step {step} — new data may appear as the case progresses
      </span>
    </div>
  );
}

/** Matrix answer keys for display in explanations. */
export function formatMatrixAnswer(key: string): string {
  const { row, col } = parseMatrixKey(key);
  return `${row} → ${col}`;
}
