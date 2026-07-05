"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import {
  pickerWheelScrollerClassName,
  usePickerWheelScroll,
} from "@/hooks/usePickerWheelScroll";
import { EXAM_CATALOG, EXAM_SLUGS } from "@/lib/edtech/exams";
import { navigateHard } from "@/lib/client/navigate-hard";
import { ROUTES } from "@/lib/routes";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

/** Pixel height of a single wheel row — must match the row markup below. */
const ITEM_H = 84;
const VISIBLE = 5;
const WHEEL_H = ITEM_H * VISIBLE;
const PAD = (WHEEL_H - ITEM_H) / 2;

type Props = {
  /** The exam whose library is currently open. */
  currentExam: ExamSlug;
};

/**
 * Exams tab — a tactile scroll wheel (matching the select-exam picker) for
 * switching which exam's library you're viewing. Snaps to the centered exam;
 * the CTA opens that exam's library.
 */
export function LibraryExamWheel({ currentExam }: Props) {
  const reduceMotion = useReducedMotion();

  const options = EXAM_SLUGS;
  const startIndex = Math.max(0, options.indexOf(currentExam));

  const [center, setCenter] = useState(startIndex);
  const [pending, setPending] = useState(false);
  const selectedIndex = Math.min(options.length - 1, Math.max(0, Math.round(center)));
  const selected = options[selectedIndex];

  const {
    containerRef,
    scrollToIndex,
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
    onSelectedIndexChange: setCenter,
    onCenterChange: setCenter,
    reduceMotion,
  });

  useEffect(() => {
    scrollToIndex(startIndex, "auto");
    setCenter(startIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const open = useCallback(() => {
    if (!selected) return;
    if (selected === currentExam) return;
    setPending(true);
    navigateHard(`${ROUTES.library}?exam=${selected}`);
  }, [selected, currentExam]);

  const onKeyDown = useMemo(
    () =>
      makeKeyDownHandler((e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      }),
    [makeKeyDownHandler, open]
  );

  const isCurrent = selected === currentExam;

  return (
    <section aria-label="Switch exam" className="mx-auto flex max-w-md flex-col items-center py-2">
      <div
        className="relative w-full select-none overscroll-y-contain"
        style={{ height: WHEEL_H, perspective: "1000px" }}
      >
        <div
          className="pointer-events-none absolute inset-x-2 top-1/2 -translate-y-1/2 rounded-2xl border border-[var(--color-accent)]/40 bg-[var(--color-accent)]/[0.06] shadow-[0_0_30px_-8px_rgba(99,102,241,0.4)] ring-1 ring-inset ring-white/40"
          style={{ height: ITEM_H }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-[var(--color-bg)] to-transparent"
          style={{ height: PAD }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-[var(--color-bg)] to-transparent"
          style={{ height: PAD }}
          aria-hidden
        />

        <div
          ref={containerRef}
          role="listbox"
          aria-label="Choose an exam"
          aria-activedescendant={selected ? `library-exam-${selected}` : undefined}
          tabIndex={0}
          onScroll={handleScroll}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onKeyDown={onKeyDown}
          className={cn(
            pickerWheelScrollerClassName,
            "rounded-[28px] focus-visible:ring-[var(--color-accent)]/70"
          )}
          style={{ paddingTop: PAD, paddingBottom: PAD }}
        >
          {options.map((slug, i) => {
            const exam = EXAM_CATALOG[slug];
            const distance = i - center;
            const abs = Math.abs(distance);
            const isSelected = i === selectedIndex;
            const scale = reduceMotion ? 1 : Math.max(0.8, 1 - abs * 0.12);
            const opacity = Math.max(0.32, 1 - abs * 0.34);
            const rotateX = reduceMotion ? 0 : Math.max(-55, Math.min(55, -distance * 22));
            return (
              <div
                key={slug}
                id={`library-exam-${slug}`}
                role="option"
                aria-selected={isSelected}
                onClick={() => scrollToIndex(i, "smooth")}
                className="flex snap-center items-center justify-center touch-manipulation"
                style={{ height: ITEM_H }}
              >
                <div
                  className={cn(
                    "flex w-full cursor-pointer items-center justify-between gap-3 rounded-2xl px-5 py-3",
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
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "truncate font-bold tracking-tight",
                          isSelected ? "text-2xl sm:text-[26px]" : "text-lg"
                        )}
                      >
                        {exam.shortName}
                      </span>
                      {slug === currentExam ? (
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[var(--color-accent)]/12 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--color-accent)]">
                          <Check className="h-3 w-3" aria-hidden />
                          Current
                        </span>
                      ) : null}
                    </div>
                    {isSelected ? (
                      <p className="mt-0.5 line-clamp-1 text-sm text-[var(--color-ink-muted)]">
                        {exam.description}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 w-full text-center" aria-live="polite">
        <button
          type="button"
          onClick={open}
          disabled={pending || isCurrent}
          className={cn(
            "inline-flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-[15px] font-semibold transition",
            isCurrent
              ? "cursor-default bg-black/[0.05] text-[var(--color-ink-muted)]"
              : "bg-[var(--color-accent)] text-white shadow-[var(--shadow-apple-btn)] hover:opacity-95 active:scale-[0.99]"
          )}
        >
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Opening…
            </>
          ) : isCurrent ? (
            <>
              <Check className="h-4 w-4" aria-hidden />
              Viewing {selected ? EXAM_CATALOG[selected].shortName : ""} library
            </>
          ) : (
            <>
              Open {selected ? EXAM_CATALOG[selected].shortName : ""} library
              <ArrowRight className="h-4 w-4" aria-hidden />
            </>
          )}
        </button>
        <p className="mt-3 text-xs text-[var(--color-ink-muted)]">
          Scroll or use ↑ ↓ to choose · Enter to open
        </p>
      </div>
    </section>
  );
}
