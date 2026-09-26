"use client";

import type { FormatCounts } from "@/lib/inventory/active-questions";
import {
  isMixedPracticeSubject,
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

type FormatOption = {
  id: PracticeFormatMode;
  count: number | null;
  hint: string;
  disabled: boolean;
};

function countLabel(count: number | null, loading: boolean): string {
  if (loading) return "…";
  if (count == null) return "—";
  return count.toLocaleString("en-US");
}

export function QuestionBankFormatMode({
  value,
  onChange,
  formats,
  totalActive = null,
  countsLoading = false,
  ngnLabel = "NGN",
  subjectId = null,
  lockToAll = false,
}: Props) {
  const allCount = formats
    ? formats.mcq + formats.ngn + formats.case
    : totalActive;
  const ngnCount = formats ? formats.ngn : null;
  const caseCount = formats ? formats.case : null;

  const options: FormatOption[] = [
    {
      id: "all",
      count: allCount,
      hint: "Any published item",
      disabled: false,
    },
    {
      id: "ngn",
      count: ngnCount,
      hint: lockToAll
        ? "Pick one topic for this format"
        : countsLoading
          ? "Checking the bank"
          : ngnCount == null
            ? "Count unavailable"
            : ngnCount > 0
              ? "Clinical judgment formats"
              : isMixedPracticeSubject(subjectId)
                ? "Coming soon"
                : "None in this topic",
      disabled: lockToAll || countsLoading || ngnCount == null,
    },
    {
      id: "case",
      count: caseCount,
      hint: lockToAll
        ? "Pick one topic for this format"
        : countsLoading
          ? "Checking the bank"
          : caseCount == null
            ? "Count unavailable"
            : caseCount > 0
              ? "Case studies"
              : isMixedPracticeSubject(subjectId)
                ? "Coming soon"
                : "None in this topic",
      disabled: lockToAll || countsLoading || caseCount == null,
    },
  ];
  const mixedScope = isMixedPracticeSubject(subjectId);
  const selectedNoun = value === "case" ? "case" : ngnLabel;
  const selectedCount = value === "case" ? caseCount : value === "ngn" ? ngnCount : allCount;

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
          {lockToAll
            ? "This area practices every published format together."
            : mixedScope
              ? `${ngnLabel} and case sets draw eligible items from every topic. The numbers are the questions this session can use.`
              : `${ngnLabel} and case sets draw eligible items from this topic. The numbers are the questions this session can use.`}
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Question format">
        {options.map((option) => {
          const active = value === option.id;
          const title = practiceFormatTitle(option.id, ngnLabel);
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={active}
              aria-disabled={option.disabled}
              disabled={option.disabled}
              data-practice-format={option.id}
              data-format-count={option.count ?? ""}
              onClick={() => onChange(option.id)}
              className={cn(
                "flex min-h-[8.5rem] flex-col rounded-[22px] border px-5 py-5 text-left transition",
                active
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)]/[0.07]"
                  : "border-[var(--color-border)]/80 bg-[var(--color-surface-elevated)] hover:border-[var(--color-accent)]/35",
                option.disabled && "cursor-not-allowed opacity-55 hover:border-[var(--color-border)]/80"
              )}
            >
              <span className="text-[15px] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
                {title}
              </span>
              <span className="mt-5 text-[32px] font-semibold leading-none tracking-[-0.045em] text-[var(--color-ink)] tabular-nums">
                {countLabel(option.count, countsLoading && option.id !== "all")}
              </span>
              <span className="mt-2 text-[13px] leading-snug text-[var(--color-ink-muted)]">
                {option.hint}
              </span>
            </button>
          );
        })}
      </div>
      {value !== "all" && selectedCount != null && selectedCount > 0 ? (
        <p className="max-w-xl px-0.5 text-[15px] leading-relaxed text-[var(--color-ink-muted)]">
          {mixedScope
            ? `This set draws eligible ${selectedNoun} items from every topic. The number on the card is that pool.`
            : `This set draws eligible ${selectedNoun} items from this topic. The number on the card is that pool.`}
        </p>
      ) : null}
    </section>
  );
}
