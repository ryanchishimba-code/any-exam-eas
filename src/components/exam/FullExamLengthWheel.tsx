"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";
import {
  pickerWheelScrollerClassName,
  usePickerWheelScroll,
} from "@/hooks/usePickerWheelScroll";
import type { LengthOption } from "@/lib/full-exam/config";
import type { FullExamLengthPreset } from "@/types/full-exam";
import { cn } from "@/lib/utils";

/** Pixel height of a single wheel row — must match the row markup below. */
const ITEM_H = 84;
const VISIBLE = 3;
const WHEEL_H = ITEM_H * VISIBLE;
const PAD = (WHEEL_H - ITEM_H) / 2;

type Props = {
  options: LengthOption[];
  value: FullExamLengthPreset;
  onChange: (preset: FullExamLengthPreset) => void;
};

/**
 * Tactile scroll-wheel length selector for the Full Exam launcher — matches the
 * Library exam wheel (center band, fade masks, depth tilt) so the platform feels
 * consistent. Snaps to the centered option and reports it via `onChange`.
 */
export function FullExamLengthWheel({ options, value, onChange }: Props) {
  const reduceMotion = useReducedMotion();

  const startIndex = Math.max(0, options.findIndex((o) => o.preset === value));
  const [center, setCenter] = useState(startIndex === -1 ? 0 : startIndex);
  const selectedIndex = Math.min(options.length - 1, Math.max(0, Math.round(center)));

  const handleIndexChange = useCallback(
    (index: number) => {
      const opt = options[index];
      if (opt && opt.preset !== value) onChange(opt.preset);
    },
    [onChange, options, value]
  );

  const {
    containerRef,
    scrollToIndex,
    programmaticRef,
    handleScroll,
    onPointerDown,
    onPointerUp,
    onPointerCancel,
    onTouchStart,
    onTouchEnd,
    makeKeyDownHandler,
  } = usePickerWheelScroll({
    itemHeight: ITEM_H,
    itemCount: options.length,
    selectedIndex,
    onSelectedIndexChange: handleIndexChange,
    onCenterChange: setCenter,
    reduceMotion,
  });

  useEffect(() => {
    scrollToIndex(startIndex === -1 ? 0 : startIndex, "auto");
    setCenter(startIndex === -1 ? 0 : startIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const idx = options.findIndex((o) => o.preset === value);
    if (idx >= 0 && idx !== selectedIndex && !programmaticRef.current) {
      scrollToIndex(idx, "smooth");
      setCenter(idx);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, options]);

  const onKeyDown = useMemo(() => makeKeyDownHandler(), [makeKeyDownHandler]);

  return (
    <div
      className="relative mx-auto w-full max-w-sm select-none overscroll-y-contain"
      style={{ height: WHEEL_H, perspective: "1000px" }}
    >
      <div
        className="pointer-events-none absolute inset-x-1 top-1/2 -translate-y-1/2 rounded-2xl border border-[var(--color-accent)]/40 bg-[var(--color-accent)]/[0.06] shadow-[0_0_30px_-8px_rgba(99,102,241,0.4)] ring-1 ring-inset ring-white/40"
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
        aria-label="Exam length"
        tabIndex={0}
        onScroll={handleScroll}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onKeyDown={onKeyDown}
        className={cn(pickerWheelScrollerClassName, "rounded-[24px]")}
        style={{ paddingTop: PAD, paddingBottom: PAD }}
      >
        {options.map((option, i) => {
          const distance = i - center;
          const abs = Math.abs(distance);
          const isSelected = i === selectedIndex;
          const scale = reduceMotion ? 1 : Math.max(0.82, 1 - abs * 0.12);
          const opacity = Math.max(0.34, 1 - abs * 0.36);
          const rotateX = reduceMotion ? 0 : Math.max(-55, Math.min(55, -distance * 24));
          return (
            <div
              key={option.preset}
              role="option"
              aria-selected={isSelected}
              onClick={() => {
                onChange(option.preset);
                scrollToIndex(i, "smooth");
              }}
              className="flex snap-center items-center justify-center touch-manipulation"
              style={{ height: ITEM_H }}
            >
              <div
                className={cn(
                  "flex w-full cursor-pointer items-center justify-between gap-3 px-5",
                  isSelected ? "text-[var(--color-ink)]" : "text-[var(--color-ink-muted)]"
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
                <div className="min-w-0 text-left">
                  <p className={cn("truncate font-bold tracking-tight", isSelected ? "text-xl" : "text-base")}>
                    {option.label}
                  </p>
                  {isSelected ? (
                    <p className="mt-0.5 line-clamp-1 text-[12px] text-[var(--color-ink-muted)]">
                      {option.description}
                    </p>
                  ) : null}
                </div>
                <div className="shrink-0 text-right">
                  <p
                    className={cn(
                      "font-extrabold tabular-nums",
                      isSelected ? "text-lg text-[var(--color-accent)]" : "text-sm"
                    )}
                  >
                    {option.questionCount}
                  </p>
                  <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--color-ink-muted)]">
                    questions
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
