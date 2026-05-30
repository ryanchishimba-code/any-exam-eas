"use client";

import { cleanOptionText } from "@/lib/question-format";
import type { StudyQuestion } from "@/lib/questions/types";

type OptionProps = {
  question: StudyQuestion;
  selected: string[];
  revealed: boolean;
  onToggle: (option: string) => void;
};

export function McqOptions({ question, selected, revealed, onToggle }: OptionProps) {
  return (
    <ul className="mt-6 space-y-2.5">
      {question.options.map((opt, i) => (
        <OptionRow
          key={i}
          index={i}
          option={opt}
          selected={selected.includes(opt)}
          revealed={revealed}
          isCorrect={question.correctAnswers.some(
            (c) => cleanOptionText(c).toLowerCase() === cleanOptionText(opt).toLowerCase()
          )}
          multi={false}
          onToggle={() => onToggle(opt)}
        />
      ))}
    </ul>
  );
}

export function SelectAllOptions({ question, selected, revealed, onToggle }: OptionProps) {
  return (
    <>
      <p className="mt-4 text-xs text-[var(--color-ink-muted)]">
        Select all that apply — tap each correct choice.
      </p>
      <ul className="mt-3 space-y-2.5">
        {question.options.map((opt, i) => (
          <OptionRow
            key={i}
            index={i}
            option={opt}
            selected={selected.includes(opt)}
            revealed={revealed}
            isCorrect={question.correctAnswers.some(
              (c) => cleanOptionText(c).toLowerCase() === cleanOptionText(opt).toLowerCase()
            )}
            multi
            onToggle={() => onToggle(opt)}
          />
        ))}
      </ul>
    </>
  );
}

export function OrderedResponseOptions({
  question,
  selected,
  revealed,
  onToggle,
}: OptionProps) {
  return (
    <>
      <p className="mt-4 text-xs text-[var(--color-ink-muted)]">
        Tap options in priority order ({question.correctAnswers.length} steps).
      </p>
      {selected.length > 0 && (
        <ol className="mt-3 flex flex-wrap gap-2">
          {selected.map((opt, i) => (
            <li
              key={`${opt}-${i}`}
              className="rounded-full border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 px-3 py-1 text-xs font-medium"
            >
              {i + 1}. {cleanOptionText(opt)}
            </li>
          ))}
        </ol>
      )}
      <ul className="mt-4 space-y-2">
        {question.options.map((opt, i) => {
          const used = selected.includes(opt);
          return (
            <li key={i}>
              <button
                type="button"
                disabled={revealed || used}
                onClick={() => onToggle(opt)}
                className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
                  used
                    ? "border-black/5 opacity-40"
                    : "border-black/[0.08] bg-[var(--color-surface)] hover:border-[var(--color-accent)]/40"
                }`}
              >
                {cleanOptionText(opt)}
              </button>
            </li>
          );
        })}
      </ul>
      {!revealed && selected.length > 0 && (
        <button
          type="button"
          onClick={() => onToggle("__clear__")}
          className="mt-2 text-xs text-[var(--color-accent)] hover:underline"
        >
          Clear order
        </button>
      )}
    </>
  );
}

function OptionRow({
  index,
  option,
  selected,
  revealed,
  isCorrect,
  multi,
  onToggle,
}: {
  index: number;
  option: string;
  selected: boolean;
  revealed: boolean;
  isCorrect: boolean;
  multi?: boolean;
  onToggle: () => void;
}) {
  let row = "border-black/[0.08] bg-[var(--color-surface)]";
  if (revealed) {
    row = isCorrect
      ? "border-emerald-300 bg-emerald-50 dark:bg-emerald-950/30"
      : selected
        ? "border-red-300 bg-red-50 dark:bg-red-950/30"
        : "border-black/5 opacity-50";
  } else if (selected) {
    row = multi
      ? "border-[var(--color-accent)] bg-sky-50 ring-2 ring-sky-200/80 dark:bg-sky-950/20"
      : "border-[var(--color-accent)] bg-sky-50 ring-2 ring-sky-200 dark:bg-sky-950/20";
  }

  return (
    <li>
      <button
        type="button"
        disabled={revealed}
        onClick={onToggle}
        className={`flex w-full gap-3 rounded-xl border px-4 py-3.5 text-left text-sm transition ${row}`}
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-black/[0.05] text-xs font-semibold dark:bg-white/10">
          {multi && selected ? "✓" : index + 1}
        </span>
        {cleanOptionText(option)}
      </button>
    </li>
  );
}
