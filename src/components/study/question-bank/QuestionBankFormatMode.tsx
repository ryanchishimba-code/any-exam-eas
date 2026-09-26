"use client";

import type { FormatCounts } from "@/lib/inventory/active-questions";
import { practiceFormatChooser } from "@/lib/study/offered-formats";
import {
  practiceFormatTitle,
  type PracticeFormatMode,
} from "@/lib/study/practice-format";
import { cn } from "@/lib/utils";

type Props = {
  value: PracticeFormatMode;
  onChange: (format: PracticeFormatMode) => void;
  formats: FormatCounts | null;
  /** Bank total when the format split has not loaded. */
  totalActive?: number | null;
  countsLoading?: boolean;
  ngnLabel?: string;
  /** Current topic. Blank or mixed means the set draws from the whole bank. */
  subjectId?: string | null;
  /** Blueprint-area practice serves every format in that area. */
  lockToAll?: boolean;
};

function countFor(id: PracticeFormatMode, formats: FormatCounts): number {
  if (id === "ngn") return formats.ngn;
  if (id === "case") return formats.case;
  return formats.mcq + formats.ngn + formats.case;
}

export function QuestionBankFormatMode({
  value,
  onChange,
  formats,
  countsLoading = false,
  ngnLabel = "NGN",
  subjectId = null,
  lockToAll = false,
}: Props) {
  const chooser = practiceFormatChooser({
    formats: countsLoading ? null : formats,
    ngnLabel,
    subjectId,
    lockToAll,
  });
  if (!chooser || !formats) return null;

  const selected =
    value === "ngn" || value === "case" || value === "all"
      ? chooser.choices.includes(value)
        ? value
        : "all"
      : "all";

  return (
    <section className="space-y-4" aria-labelledby="practice-format-heading">
      <div className="space-y-1.5 px-0.5">
        <h3
          id="practice-format-heading"
          className="text-[22px] font-semibold tracking-[-0.03em] text-[var(--color-ink)]"
        >
          Question format
        </h3>
        <p className="max-w-xl text-[15px] leading-relaxed text-[var(--color-ink-muted)]">
          {chooser.intro}
        </p>
      </div>
      <div
        className={cn(
          "grid gap-3",
          chooser.columns === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"
        )}
        role="radiogroup"
        aria-label="Question format"
      >
        {chooser.choices.map((id) => {
          const active = selected === id;
          const count = countFor(id, formats);
          const hint =
            id === "ngn"
              ? "Clinical judgment formats"
              : id === "case"
                ? "Case studies"
                : "Any published item";
          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={active}
              data-practice-format={id}
              data-format-count={count}
              onClick={() => onChange(id)}
              className={cn(
                "flex min-h-[8.5rem] flex-col rounded-[22px] border px-5 py-5 text-left transition",
                active
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)]/[0.07]"
                  : "border-[var(--color-border)]/80 bg-[var(--color-surface-elevated)] hover:border-[var(--color-accent)]/35"
              )}
            >
              <span className="text-[15px] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
                {practiceFormatTitle(id, ngnLabel)}
              </span>
              <span className="mt-5 text-[32px] font-semibold leading-none tracking-[-0.045em] text-[var(--color-ink)] tabular-nums">
                {count.toLocaleString("en-US")}
              </span>
              <span className="mt-2 text-[13px] leading-snug text-[var(--color-ink-muted)]">
                {hint}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
