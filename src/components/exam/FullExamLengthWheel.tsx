"use client";

import { feUi } from "@/lib/study/full-exam-ui";
import type { LengthOption } from "@/lib/full-exam/config";
import type { FullExamLengthPreset } from "@/types/full-exam";
import { cn } from "@/lib/utils";

type Props = {
  options: LengthOption[];
  value: FullExamLengthPreset;
  onChange: (preset: FullExamLengthPreset) => void;
  /** Replaces the "85 Q" badge on the Full preset. */
  fullBadge?: string;
  /** Short hint under the Full preset. */
  fullHint?: string;
};

function primaryLabel(option: LengthOption): string {
  if (option.preset === "full") return "Full";
  return String(option.questionCount);
}

/** Tap-to-select exam length — 50 / 100 / full presets. */
export function FullExamLengthWheel({ options, value, onChange, fullBadge, fullHint }: Props) {
  const resolvedPreset =
    options.find((o) => o.preset === value)?.preset ?? options[0]?.preset ?? value;

  return (
    <div
      className={cn(feUi.segmentTrack, "grid w-full gap-1")}
      style={{ gridTemplateColumns: `repeat(${Math.max(options.length, 1)}, minmax(0, 1fr))` }}
      role="radiogroup"
      aria-label="Exam length"
    >
      {options.map((option) => {
        const active = option.preset === resolvedPreset;
        return (
          <button
            key={option.preset}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.preset)}
            className={cn(
              "flex min-h-[4.5rem] flex-col items-center justify-center rounded-[11px] px-2 py-2.5 transition active:scale-[0.98]",
              active ? feUi.segmentBtnActive : feUi.segmentBtn
            )}
          >
            <span
              className={cn(
                "font-extrabold tabular-nums tracking-tight",
                active ? "text-xl text-[var(--color-accent)]" : "text-lg text-[var(--color-ink-muted)]"
              )}
            >
              {primaryLabel(option)}
            </span>
            {option.preset === "full" ? (
              <span
                className={cn(
                  "mt-0.5 text-[11px] font-semibold tabular-nums tracking-tight",
                  active ? "text-[var(--color-accent)]" : "text-[var(--color-ink-muted)]"
                )}
              >
                {fullBadge ?? `${option.questionCount} Q`}
              </span>
            ) : null}
            <span
              className={cn(
                "mt-1 line-clamp-2 text-center text-[10px] font-medium leading-tight",
                active ? "text-[var(--color-ink)]" : "text-[var(--color-ink-muted)]"
              )}
            >
              {option.preset === "full" ? (fullHint ?? "Full-length adaptive") : option.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}
