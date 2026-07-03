"use client";

import type { QuestionBankCountOption } from "@/lib/study/question-bank-setup";
import { qbUi } from "@/lib/study/question-bank-ui";
import { cn } from "@/lib/utils";

type Props = {
  options: QuestionBankCountOption[];
  value: number;
  onChange: (count: number) => void;
};

/** Tap-to-select question count — 25 / 50 / 75 presets. */
export function QuestionBankCountWheel({ options, value, onChange }: Props) {
  const resolvedValue =
    options.find((o) => o.value === value)?.value ??
    options.filter((o) => o.value <= value).at(-1)?.value ??
    options[0]?.value ??
    value;

  return (
    <div className="space-y-2">
      <div
        className={cn(qbUi.segmentTrack, "grid w-full gap-1")}
        style={{ gridTemplateColumns: `repeat(${Math.max(options.length, 1)}, minmax(0, 1fr))` }}
        role="radiogroup"
        aria-label="Number of Questions"
      >
        {options.map((option) => {
          const active = option.value === resolvedValue;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(option.value)}
              className={cn(
                "flex min-h-[3.25rem] flex-col items-center justify-center rounded-lg px-2 py-2.5 transition active:scale-[0.98]",
                active ? qbUi.segmentBtnActive : qbUi.segmentBtn
              )}
            >
              <span
                className={cn(
                  "font-extrabold tabular-nums tracking-tight",
                  active ? "text-xl text-[var(--color-accent)]" : "text-lg text-[var(--color-ink-muted)]"
                )}
              >
                {option.value}
              </span>
              <span
                className={cn(
                  "mt-0.5 line-clamp-1 text-center text-[10px] font-medium leading-tight",
                  active ? "text-[var(--color-ink-muted)]" : "text-[var(--color-ink-muted)]/70"
                )}
              >
                {option.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
