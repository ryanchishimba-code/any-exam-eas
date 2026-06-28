"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const ITEM_H = 48;
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
  min: { month: number; day: number; year: number }
): { month: number; day: number; year: number } {
  let y = Math.max(year, min.year);
  let m = month;
  let d = day;

  if (y === min.year && m < min.month) m = min.month;
  if (y === min.year && m === min.month && d < min.day) d = min.day;

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
    <div className="flex min-w-0 flex-1 flex-col items-center gap-1">
      <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
        {label}
      </span>
      <div className="relative w-full select-none" style={{ height: WHEEL_H, perspective: "900px" }}>
        <div
          className="pointer-events-none absolute inset-x-0.5 top-1/2 z-0 -translate-y-1/2 rounded-xl border border-teal-400/35 bg-teal-500/[0.08] shadow-[0_0_24px_-6px_rgba(20,184,166,0.45)] ring-1 ring-inset ring-white/30 dark:ring-white/10"
          style={{ height: ITEM_H }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-[var(--color-surface-elevated)] to-transparent"
          style={{ height: PAD }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-[var(--color-surface-elevated)] to-transparent"
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
            "snap-y snap-mandatory scroll-smooth rounded-2xl",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/50"
          )}
          style={{ paddingTop: PAD, paddingBottom: PAD }}
        >
          {options.map((option, i) => {
            const distance = i - center;
            const abs = Math.abs(distance);
            const isSelected = i === roundedCenter;
            const scale = reduceMotion ? 1 : Math.max(0.78, 1 - abs * 0.14);
            const opacity = Math.max(0.28, 1 - abs * 0.38);
            const rotateX = reduceMotion ? 0 : Math.max(-50, Math.min(50, -distance * 22));
            return (
              <div
                key={`${label}-${option}-${i}`}
                role="option"
                aria-selected={isSelected}
                onClick={() => scrollToIndex(i, "smooth")}
                className="flex snap-center cursor-pointer items-center justify-center"
                style={{ height: ITEM_H }}
              >
                <span
                  className={cn(
                    "truncate px-1 font-bold tabular-nums tracking-tight",
                    compact ? "text-sm" : "text-[15px]",
                    isSelected
                      ? "bg-gradient-to-br from-teal-600 to-cyan-500 bg-clip-text text-transparent dark:from-teal-300 dark:to-cyan-300"
                      : "text-[var(--color-ink-muted)]"
                  )}
                  style={{
                    opacity,
                    transform: `rotateX(${rotateX}deg) scale(${scale})`,
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
  minDate: string;
  onChange: (isoDate: string) => void;
  className?: string;
  id?: string;
};

/** iOS-style month / day / year wheels for exam date selection. */
export function ExamDateWheelPicker({ value, minDate, onChange, className, id }: ExamDateWheelPickerProps) {
  const min = useMemo(() => parseIso(minDate), [minDate]);
  const parsed = useMemo(() => parseIso(value), [value]);
  const clamped = useMemo(
    () => clampParts(parsed.month, parsed.day, parsed.year, min),
    [parsed, min]
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
    const end = min.year + 3;
    return Array.from({ length: end - min.year + 1 }, (_, i) => String(min.year + i));
  }, [min.year]);

  const maxDay = daysInMonth(month, year);
  const days = useMemo(
    () => Array.from({ length: maxDay }, (_, i) => String(i + 1)),
    [maxDay]
  );

  const emit = useCallback(
    (nextMonth: number, nextDay: number, nextYear: number) => {
      const parts = clampParts(nextMonth, nextDay, nextYear, min);
      const iso = toIso(parts.month, parts.day, parts.year);
      setMonth(parts.month);
      setDay(parts.day);
      setYear(parts.year);
      if (iso !== value) onChange(iso);
    },
    [min, onChange, value]
  );

  return (
    <div
      id={id}
      className={cn(
        "rounded-2xl border border-teal-500/15 bg-gradient-to-br from-teal-500/[0.06] via-[var(--color-surface-elevated)] to-violet-500/[0.05] p-3 shadow-[0_12px_40px_-16px_rgba(20,184,166,0.35)] sm:p-4",
        className
      )}
      aria-label="Exam date"
    >
      <div className="flex items-stretch gap-1 sm:gap-2">
        <WheelColumn
          label="Month"
          options={[...MONTHS]}
          selectedIndex={month - 1}
          onSelect={(i) => emit(i + 1, day, year)}
        />
        <div className="w-px shrink-0 self-center bg-[var(--color-border)]/50" aria-hidden />
        <WheelColumn
          label="Day"
          options={days}
          selectedIndex={Math.min(day - 1, days.length - 1)}
          onSelect={(i) => emit(month, i + 1, year)}
          compact
        />
        <div className="w-px shrink-0 self-center bg-[var(--color-border)]/50" aria-hidden />
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
