"use client";

import { useId, useMemo, useRef } from "react";
import { CalendarDays, ChevronRight } from "lucide-react";
import {
  addMonthsToIso,
  calendarDaysUntil,
  formatExamDateLong,
  formatExamDateShort,
  todayIso,
} from "@/lib/edtech/exam-date-utils";
import { cn } from "@/lib/utils";

export type ExamDatePickerProps = {
  value: string;
  onChange: (isoDate: string) => void;
  /** Earliest selectable date (exam dates — today or later). */
  minDate?: string;
  /** Latest selectable date (birth dates — 18+ cap). */
  maxDate?: string;
  className?: string;
  id?: string;
  /** Accessible name for the control group. */
  ariaLabel?: string;
  /** Compact layout for signup — no quick-pick chips. */
  variant?: "default" | "compact";
};

const EXAM_QUICK_PICKS = [
  { label: "3 months", months: 3 },
  { label: "6 months", months: 6 },
  { label: "1 year", months: 12 },
] as const;

function relativeHint(iso: string, minDate?: string): string {
  const days = calendarDaysUntil(iso);
  if (minDate && iso < minDate) return "Choose a future date";
  if (days === 0) return "Test day is today";
  if (days === 1) return "1 day away";
  if (days > 0 && days <= 30) return `${days} days away`;
  if (days > 0) return `${Math.round(days / 30)} months away`;
  if (days < 0) return "Date is in the past";
  return "Tap to choose a date";
}

/** Modern exam / DOB date entry — native picker with a polished card shell. */
export function ExamDatePicker({
  value,
  minDate,
  maxDate,
  onChange,
  className,
  id,
  ariaLabel,
  variant = "default",
}: ExamDatePickerProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const inputRef = useRef<HTMLInputElement>(null);
  const isBirthDate = Boolean(maxDate && !minDate);
  const isExamDate = Boolean(minDate && !maxDate);
  const showQuickPicks = isExamDate && variant === "default";
  const compact = variant === "compact";

  const label = ariaLabel ?? (isBirthDate ? "Date of birth" : "Exam date");
  const today = useMemo(() => todayIso(), []);
  const quickBase = minDate ?? today;

  const quickOptions = useMemo(
    () =>
      EXAM_QUICK_PICKS.map((pick) => ({
        ...pick,
        iso: addMonthsToIso(quickBase, pick.months),
      })),
    [quickBase]
  );

  function openPicker() {
    const el = inputRef.current;
    if (!el) return;
    try {
      el.showPicker?.();
    } catch {
      el.focus();
      el.click();
    }
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div
        className={cn(
          "group relative overflow-hidden rounded-2xl border transition-colors",
          compact
            ? "border-black/[0.08] bg-[var(--color-surface-elevated)] hover:border-[var(--color-accent)]/25"
            : "border-[var(--color-border)]/60 bg-[var(--color-surface)]/60 hover:border-teal-400/35"
        )}
      >
        {!compact ? (
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-teal-500/[0.04] via-transparent to-cyan-500/[0.06]"
            aria-hidden
          />
        ) : null}

        <button
          type="button"
          onClick={openPicker}
          className={cn(
            "relative flex w-full items-center gap-3 text-left transition active:scale-[0.995]",
            compact ? "px-3.5 py-3" : "px-4 py-3.5 sm:px-5 sm:py-4"
          )}
          aria-labelledby={`${inputId}-label`}
        >
          <span
            className={cn(
              "flex shrink-0 items-center justify-center rounded-xl",
              compact
                ? "h-9 w-9 bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                : "h-11 w-11 bg-gradient-to-br from-teal-500/15 to-cyan-500/15 text-teal-600 dark:text-teal-400"
            )}
          >
            <CalendarDays className={compact ? "h-4 w-4" : "h-5 w-5"} aria-hidden />
          </span>

          <span className="min-w-0 flex-1">
            <span
              id={`${inputId}-label`}
              className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]"
            >
              {label}
            </span>
            <span className="mt-0.5 block truncate text-[15px] font-semibold tracking-tight text-[var(--color-ink)] sm:text-base">
              {value ? formatExamDateLong(value) : "Select a date"}
            </span>
            {!compact && value ? (
              <span className="mt-0.5 block text-[12px] text-[var(--color-ink-muted)]">
                {relativeHint(value, minDate)}
                {isExamDate ? ` · ${formatExamDateShort(value)}` : ""}
              </span>
            ) : null}
          </span>

          <ChevronRight
            className="h-4 w-4 shrink-0 text-[var(--color-ink-muted)] transition group-hover:translate-x-0.5 group-hover:text-[var(--color-accent)]"
            aria-hidden
          />
        </button>

        <input
          ref={inputRef}
          id={inputId}
          type="date"
          value={value}
          min={minDate}
          max={maxDate}
          onChange={(e) => {
            if (e.target.value) onChange(e.target.value);
          }}
          aria-label={label}
          className="sr-only"
        />
      </div>

      {showQuickPicks ? (
        <div className="flex flex-wrap gap-2">
          <span className="sr-only">Quick picks</span>
          {quickOptions.map((pick) => {
            const selected = value === pick.iso;
            return (
              <button
                key={pick.label}
                type="button"
                onClick={() => onChange(pick.iso)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-[12px] font-semibold transition",
                  selected
                    ? "border-teal-500/40 bg-teal-500/12 text-teal-800 dark:text-teal-200"
                    : "border-[var(--color-border)]/70 bg-[var(--color-surface-elevated)] text-[var(--color-ink-muted)] hover:border-teal-400/30 hover:text-[var(--color-ink)]"
                )}
                aria-pressed={selected}
              >
                {pick.label}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
