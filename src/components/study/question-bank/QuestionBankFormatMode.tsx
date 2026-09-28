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
  /** Scored questions in this scope. The All card uses this instead of summing shells. */
  scoredTotal?: number | null;
  /** Scored items inside the case studies, when the card is the whole bank. */
  caseItemCount?: number | null;
  countsLoading?: boolean;
  ngnLabel?: string;
  /** Current topic. Blank or mixed means the set draws from the whole bank. */
  subjectId?: string | null;
  /** Blueprint-area practice serves every format in that area. */
  lockToAll?: boolean;
};

function countFor(
  id: PracticeFormatMode,
  formats: FormatCounts,
  scoredTotal?: number | null
): number {
  if (id === "ngn") return formats.ngn;
  if (id === "case") return formats.case;
  if (typeof scoredTotal === "number") return scoredTotal;
  return formats.mcq + formats.ngn + formats.case;
}

export function QuestionBankFormatMode({
  value,
  onChange,
  formats,
  scoredTotal = null,
  caseItemCount = null,
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
    <section className="space-y-2.5" aria-labelledby="practice-format-heading">
      <h3 id="practice-format-heading" className={cn("px-0.5", "text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]")}>
        Format
      </h3>
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
          const count = countFor(id, formats, id === "all" ? scoredTotal : null);
          const hint =
            id === "ngn"
              ? "Standalone NGN items"
              : id === "case"
                ? typeof caseItemCount === "number" && caseItemCount > 0
                  ? `${caseItemCount.toLocaleString("en-US")} scored items inside`
                  : "Case studies"
                : "Every scored item";
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
                "flex min-h-[6.5rem] flex-col rounded-2xl border px-4 py-4 text-left transition",
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
