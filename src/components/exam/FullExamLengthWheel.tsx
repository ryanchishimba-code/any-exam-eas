"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const scrollEndTimerRef = useRef<number | null>(null);
  const programmaticRef = useRef(false);

  const syncPresetFromScroll = useCallback(
    (behavior: ScrollBehavior) => {
      const el = containerRef.current;
      if (!el) return;
      const idx = Math.min(options.length - 1, Math.max(0, Math.round(el.scrollTop / ITEM_H)));
      const opt = options[idx];
      if (!opt) return;
      if (opt.preset !== value) onChange(opt.preset);
      if (behavior === "smooth") {
        window.setTimeout(() => {
          const settled = containerRef.current;
          if (!settled) return;
          const settledIdx = Math.min(
            options.length - 1,
            Math.max(0, Math.round(settled.scrollTop / ITEM_H))
          );
          const settledOpt = options[settledIdx];
          if (settledOpt && settledOpt.preset !== value) onChange(settledOpt.preset);
        }, 380);
      }
    },
    [onChange, options, value]
  );

  const startIndex = Math.max(0, options.findIndex((o) => o.preset === value));
  const [center, setCenter] = useState(startIndex === -1 ? 0 : startIndex);
  const selectedIndex = Math.min(options.length - 1, Math.max(0, Math.round(center)));

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

  // Center the initial option without animation.
  useEffect(() => {
    scrollToIndex(startIndex === -1 ? 0 : startIndex, "auto");
    setCenter(startIndex === -1 ? 0 : startIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the wheel in sync if the preset is changed elsewhere (e.g. deep link).
  useEffect(() => {
    const idx = options.findIndex((o) => o.preset === value);
    if (idx >= 0 && idx !== selectedIndex && !programmaticRef.current) {
      scrollToIndex(idx, "smooth");
      setCenter(idx);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, options]);

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el || rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      setCenter(el.scrollTop / ITEM_H);
    });
    if (programmaticRef.current) return;
    if (scrollEndTimerRef.current != null) {
      window.clearTimeout(scrollEndTimerRef.current);
    }
    scrollEndTimerRef.current = window.setTimeout(() => {
      scrollEndTimerRef.current = null;
      syncPresetFromScroll("auto");
    }, 120);
  }, [syncPresetFromScroll]);

  const handleScrollEnd = useCallback(() => {
    syncPresetFromScroll("auto");
  }, [syncPresetFromScroll]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        scrollToIndex(selectedIndex + 1, "smooth");
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        scrollToIndex(selectedIndex - 1, "smooth");
      }
    },
    [selectedIndex, scrollToIndex]
  );

  return (
    <div className="relative mx-auto w-full max-w-sm select-none" style={{ height: WHEEL_H, perspective: "1000px" }}>
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
        onPointerUp={handleScrollEnd}
        onTouchEnd={handleScrollEnd}
        onKeyDown={onKeyDown}
        className={cn(
          "h-full w-full overflow-y-auto overscroll-contain",
          "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          "snap-y snap-mandatory scroll-smooth rounded-[24px]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/60"
        )}
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
              className="flex snap-center items-center justify-center"
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
