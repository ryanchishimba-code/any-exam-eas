"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { CalendarDays } from "lucide-react";
import {
  addMonthsToIso,
  calendarDaysUntil,
  defaultBirthDatePreview,
  formatDdmmyyyyDigits,
  formatExamDateLong,
  formatExamDateShort,
  isoToDdmmyyyy,
  isIsoWithinBounds,
  parseDdmmyyyy,
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
  return "Enter your exam date";
}

function typedInputError(
  raw: string,
  options: { minDate?: string; maxDate?: string; isBirthDate?: boolean }
): string | null {
  const { minDate, maxDate, isBirthDate } = options;
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 0) return null;
  if (digits.length < 8) return null;
  const iso = parseDdmmyyyy(raw);
  if (!iso) return "Enter a valid date (dd/mm/yyyy)";
  if (!isIsoWithinBounds(iso, { minDate, maxDate })) {
    if (isBirthDate && maxDate && iso > maxDate) return "You must be at least 18 years old";
    if (isBirthDate && minDate && iso < minDate) return "Enter a valid birth year";
    if (minDate && iso < minDate) return "Choose today or a future date";
    if (maxDate && iso > maxDate) return "Date is outside the allowed range";
  }
  return null;
}

/** Exam / DOB date entry — typed dd/mm/yyyy with auto-formatting (works on mobile). */
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
  const isBirthDate = Boolean(maxDate);
  const isExamDate = Boolean(minDate && !maxDate);
  const showQuickPicks = isExamDate && variant === "default";
  const compact = variant === "compact";

  const label = ariaLabel ?? (isBirthDate ? "Date of birth" : "Exam date");
  const today = useMemo(() => todayIso(), []);
  const quickBase = minDate ?? today;
  const birthExample = useMemo(() => defaultBirthDatePreview(today), [today]);

  const [typed, setTyped] = useState(() => (value ? isoToDdmmyyyy(value) : ""));

  useEffect(() => {
    setTyped(value ? isoToDdmmyyyy(value) : "");
  }, [value]);

  const quickOptions = useMemo(
    () =>
      EXAM_QUICK_PICKS.map((pick) => ({
        ...pick,
        iso: addMonthsToIso(quickBase, pick.months),
      })),
    [quickBase]
  );

  const digits = typed.replace(/\D/g, "");
  const inputError = typedInputError(typed, { minDate, maxDate, isBirthDate });
  const parsedIso = digits.length === 8 ? parseDdmmyyyy(typed) : null;
  const displayIso =
    parsedIso && isIsoWithinBounds(parsedIso, { minDate, maxDate }) ? parsedIso : value;

  function commitTypedValue(raw: string) {
    const d = raw.replace(/\D/g, "");
    if (d.length !== 8) return;
    const iso = parseDdmmyyyy(raw);
    if (iso && isIsoWithinBounds(iso, { minDate, maxDate })) {
      onChange(iso);
    }
  }

  function handleTypedChange(raw: string) {
    const formatted = formatDdmmyyyyDigits(raw);
    setTyped(formatted);
    commitTypedValue(formatted);
  }

  return (
      <div className={cn("space-y-3", className)}>
        <div
          className={cn(
            "relative overflow-hidden rounded-2xl border transition-colors",
            compact
              ? "border-black/[0.08] bg-[var(--color-surface-elevated)] focus-within:border-[var(--color-accent)]/35"
              : "border-[var(--color-border)]/60 bg-[var(--color-surface)]/60 focus-within:border-teal-400/35"
          )}
        >
          {!compact ? (
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-br from-teal-500/[0.04] via-transparent to-cyan-500/[0.06]"
              aria-hidden
            />
          ) : null}

          <div
            className={cn(
              "relative flex items-start gap-3",
              compact ? "px-3.5 py-3" : "px-4 py-3.5 sm:px-5 sm:py-4"
            )}
          >
            <span
              className={cn(
                "mt-0.5 flex shrink-0 items-center justify-center rounded-xl",
                compact
                  ? "h-9 w-9 bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                  : "h-11 w-11 bg-gradient-to-br from-teal-500/15 to-cyan-500/15 text-teal-600 dark:text-teal-400"
              )}
            >
              <CalendarDays className={compact ? "h-4 w-4" : "h-5 w-5"} aria-hidden />
            </span>

            <div className="min-w-0 flex-1">
              <label
                htmlFor={inputId}
                className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]"
              >
                {label}
              </label>
              <input
                ref={inputRef}
                id={inputId}
                type="text"
                inputMode="numeric"
                autoComplete={isBirthDate ? "bday" : "off"}
                enterKeyHint="done"
                spellCheck={false}
                value={typed}
                placeholder="dd/mm/yyyy"
                onChange={(e) => handleTypedChange(e.target.value)}
                onBlur={() => commitTypedValue(typed)}
                aria-label={label}
                aria-invalid={inputError ? true : undefined}
                aria-describedby={inputError ? `${inputId}-error` : `${inputId}-hint`}
                className={cn(
                  "mt-1 min-h-[44px] w-full touch-manipulation bg-transparent font-mono text-[16px] font-semibold tracking-[0.04em] text-[var(--color-ink)] outline-none placeholder:font-sans placeholder:font-normal placeholder:tracking-normal placeholder:text-[var(--color-ink-muted)]/70 sm:text-base",
                  inputError && "text-rose-600 dark:text-rose-400"
                )}
              />
              {inputError ? (
                <p id={`${inputId}-error`} className="mt-1 text-[12px] font-medium text-rose-600">
                  {inputError}
                </p>
              ) : displayIso ? (
                <p id={`${inputId}-hint`} className="mt-1 text-[12px] text-[var(--color-ink-muted)]">
                  {formatExamDateLong(displayIso)}
                  {!compact && isExamDate ? ` · ${relativeHint(displayIso, minDate)}` : ""}
                  {!compact && isBirthDate ? " · Must be 18 or older" : ""}
                </p>
              ) : (
                <p id={`${inputId}-hint`} className="mt-1 text-[12px] text-[var(--color-ink-muted)]">
                  {isBirthDate ? (
                    <>
                      Example: {isoToDdmmyyyy(birthExample)} ({formatExamDateShort(birthExample)})
                    </>
                  ) : (
                    <>
                      Example: {isoToDdmmyyyy(addMonthsToIso(today, 3))} (
                      {formatExamDateShort(addMonthsToIso(today, 3))})
                    </>
                  )}
                </p>
              )}
            </div>
          </div>
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
