"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/** Row height — 44px keeps iOS-friendly touch targets while staying compact. */
const ITEM_H = 44;
const VISIBLE = 3;
const WHEEL_H = ITEM_H * VISIBLE;
const PAD = (WHEEL_H - ITEM_H) / 2;

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export function todayIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Suggested preview when no date chosen yet (~3 months out). */
export function defaultExamDatePreview(from = todayIso()): string {
  const d = new Date(`${from}T12:00:00`);
  d.setDate(d.getDate() + 90);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Latest DOB that satisfies 18+ (inclusive). */
export function eighteenYearsAgoIso(from = todayIso()): string {
  const d = new Date(`${from}T12:00:00`);
  d.setFullYear(d.getFullYear() - 18);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Earliest selectable birth year (~100 years). */
export function oldestBirthDateIso(from = todayIso()): string {
  const d = new Date(`${from}T12:00:00`);
  d.setFullYear(d.getFullYear() - 100);
  return `${d.getFullYear()}-01-01`;
}

/** Suggested DOB preview (~25 years old). */
export function defaultBirthDatePreview(from = todayIso()): string {
  const d = new Date(`${from}T12:00:00`);
  d.setFullYear(d.getFullYear() - 25);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function daysInMonth(month: number, year: number): number {
  return new Date(year, month, 0).getDate();
}

function parseIso(iso: string): { month: number; day: number; year: number } {
  const [y, m, d] = iso.split("-").map(Number);
  const now = new Date();
  return {
    month: m >= 1 && m <= 12 ? m : now.getMonth() + 1,
    day: d >= 1 && d <= 31 ? d : now.getDate(),
    year: Number.isFinite(y) ? y : now.getFullYear(),
  };
}

function toIso(month: number, day: number, year: number): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function clampParts(
  month: number,
  day: number,
  year: number,
  min?: { month: number; day: number; year: number },
  max?: { month: number; day: number; year: number }
): { month: number; day: number; year: number } {
  let y = year;
  let m = month;
  let d = day;

  if (min) {
    y = Math.max(y, min.year);
    if (y === min.year && m < min.month) m = min.month;
    if (y === min.year && m === min.month && d < min.day) d = min.day;
  }

  if (max) {
    y = Math.min(y, max.year);
    if (y === max.year && m > max.month) m = max.month;
    if (y === max.year && m === max.month && d > max.day) d = max.day;
  }

  const dim = daysInMonth(m, y);
  if (d > dim) d = dim;

  return { month: m, day: d, year: y };
}

type WheelColumnProps = {
  label: string;
  options: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  compact?: boolean;
};

function WheelColumn({ label, options, selectedIndex, onSelect, compact }: WheelColumnProps) {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const programmaticRef = useRef(false);
  const [center, setCenter] = useState(selectedIndex);

  const scrollToIndex = useCallback(
    (index: number, behavior: ScrollBehavior) => {
      const el = containerRef.current;
      if (!el) return;
      const clamped = Math.min(options.length - 1, Math.max(0, index));
      programmaticRef.current = true;
      el.scrollTo({ top: clamped * ITEM_H, behavior });
      window.setTimeout(() => {
        programmaticRef.current = false;
      }, behavior === "smooth" ? 360 : 0);
    },
    [options.length]
  );

  useEffect(() => {
    scrollToIndex(selectedIndex, "auto");
    setCenter(selectedIndex);
  }, [selectedIndex, options.length, scrollToIndex]);

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el || rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const idx = Math.min(options.length - 1, Math.max(0, Math.round(el.scrollTop / ITEM_H)));
      setCenter(el.scrollTop / ITEM_H);
      onSelect(idx);
    });
  }, [onSelect, options.length]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        scrollToIndex(selectedIndex + 1, "smooth");
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        scrollToIndex(selectedIndex - 1, "smooth");
      }
    },
    [selectedIndex, scrollToIndex]
  );

  const roundedCenter = Math.min(options.length - 1, Math.max(0, Math.round(center)));

  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-0.5">
      <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
        {label}
      </span>
      <div className="relative w-full select-none" style={{ height: WHEEL_H }}>
        <div
          className="pointer-events-none absolute inset-x-1 top-1/2 z-0 -translate-y-1/2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]/80"
          style={{ height: ITEM_H }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-[var(--color-surface-elevated)] via-[var(--color-surface-elevated)]/90 to-transparent"
          style={{ height: PAD }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-[var(--color-surface-elevated)] via-[var(--color-surface-elevated)]/90 to-transparent"
          style={{ height: PAD }}
          aria-hidden
        />
        <div
          ref={containerRef}
          role="listbox"
          aria-label={label}
          tabIndex={0}
          onScroll={handleScroll}
          onKeyDown={onKeyDown}
          className={cn(
            "relative z-[1] h-full w-full overflow-y-auto overscroll-contain",
            "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            "snap-y snap-mandatory scroll-smooth rounded-xl",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/35"
          )}
          style={{ paddingTop: PAD, paddingBottom: PAD }}
        >
          {options.map((option, i) => {
            const distance = i - center;
            const abs = Math.abs(distance);
            const isSelected = i === roundedCenter;
            const scale = reduceMotion ? 1 : Math.max(0.86, 1 - abs * 0.1);
            const opacity = Math.max(0.35, 1 - abs * 0.32);
            const rotateX = reduceMotion ? 0 : Math.max(-28, Math.min(28, -distance * 14));
            return (
              <div
                key={`${label}-${option}-${i}`}
                role="option"
                aria-selected={isSelected}
                onClick={() => scrollToIndex(i, "smooth")}
                className="flex min-h-[44px] snap-center cursor-pointer items-center justify-center touch-manipulation"
                style={{ height: ITEM_H }}
              >
                <span
                  className={cn(
                    "truncate px-0.5 tabular-nums tracking-tight",
                    compact ? "text-xs" : "text-sm",
                    isSelected
                      ? "font-semibold text-[var(--color-ink)]"
                      : "font-medium text-[var(--color-ink-muted)]"
                  )}
                  style={{
                    opacity,
                    transform: reduceMotion ? undefined : `rotateX(${rotateX}deg) scale(${scale})`,
                    transformOrigin: "center",
                    transition: reduceMotion
                      ? "opacity 120ms linear"
                      : "transform 140ms ease-out, opacity 140ms ease-out",
                  }}
                >
                  {option}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

type ExamDateWheelPickerProps = {
  value: string;
  onChange: (isoDate: string) => void;
  /** Earliest selectable date (exam dates — today or later). */
  minDate?: string;
  /** Latest selectable date (birth dates — 18+ cap). */
  maxDate?: string;
  className?: string;
  id?: string;
  /** Accessible name for the wheel group. */
  ariaLabel?: string;
};

/** Compact iOS-style month / day / year wheels for signup dates. */
export function ExamDateWheelPicker({
  value,
  minDate,
  maxDate,
  onChange,
  className,
  id,
  ariaLabel,
}: ExamDateWheelPickerProps) {
  const min = useMemo(
    () => (minDate ? parseIso(minDate) : undefined),
    [minDate]
  );
  const max = useMemo(
    () => (maxDate ? parseIso(maxDate) : undefined),
    [maxDate]
  );
  const parsed = useMemo(() => parseIso(value), [value]);
  const clamped = useMemo(
    () => clampParts(parsed.month, parsed.day, parsed.year, min, max),
    [parsed, min, max]
  );

  const [month, setMonth] = useState(clamped.month);
  const [day, setDay] = useState(clamped.day);
  const [year, setYear] = useState(clamped.year);

  useEffect(() => {
    setMonth(clamped.month);
    setDay(clamped.day);
    setYear(clamped.year);
  }, [clamped.month, clamped.day, clamped.year]);

  const years = useMemo(() => {
    if (min && max) {
      const start = min.year;
      const end = max.year;
      return Array.from({ length: end - start + 1 }, (_, i) => String(start + i));
    }
    if (min) {
      const end = min.year + 3;
      return Array.from({ length: end - min.year + 1 }, (_, i) => String(min.year + i));
    }
    if (max) {
      const start = max.year - 100;
      return Array.from({ length: max.year - start + 1 }, (_, i) => String(start + i));
    }
    const now = new Date().getFullYear();
    return Array.from({ length: 4 }, (_, i) => String(now + i));
  }, [min, max]);

  const maxDay = daysInMonth(month, year);
  const days = useMemo(
    () => Array.from({ length: maxDay }, (_, i) => String(i + 1)),
    [maxDay]
  );

  const emit = useCallback(
    (nextMonth: number, nextDay: number, nextYear: number) => {
      const parts = clampParts(nextMonth, nextDay, nextYear, min, max);
      const iso = toIso(parts.month, parts.day, parts.year);
      setMonth(parts.month);
      setDay(parts.day);
      setYear(parts.year);
      if (iso !== value) onChange(iso);
    },
    [min, max, onChange, value]
  );

  const label = ariaLabel ?? (maxDate && !minDate ? "Date of birth" : "Exam date");

  return (
    <div
      id={id}
      className={cn(
        "rounded-xl border border-black/[0.06] bg-[var(--color-surface)]/60 p-2 sm:p-2.5",
        className
      )}
      aria-label={label}
    >
      <div className="flex items-stretch gap-0.5 sm:gap-1">
        <WheelColumn
          label="Month"
          options={[...MONTHS]}
          selectedIndex={month - 1}
          onSelect={(i) => emit(i + 1, day, year)}
        />
        <div className="w-px shrink-0 self-center bg-[var(--color-border)]/40" aria-hidden />
        <WheelColumn
          label="Day"
          options={days}
          selectedIndex={Math.min(day - 1, days.length - 1)}
          onSelect={(i) => emit(month, i + 1, year)}
          compact
        />
        <div className="w-px shrink-0 self-center bg-[var(--color-border)]/40" aria-hidden />
        <WheelColumn
          label="Year"
          options={years}
          selectedIndex={Math.max(0, years.indexOf(String(year)))}
          onSelect={(i) => emit(month, day, Number(years[i]))}
          compact
        />
      </div>
    </div>
  );
}
