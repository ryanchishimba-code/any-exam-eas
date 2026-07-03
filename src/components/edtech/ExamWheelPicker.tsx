"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowRight, Loader2, RefreshCw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  pickerWheelScrollerClassName,
  usePickerWheelScroll,
} from "@/hooks/usePickerWheelScroll";
import { prepareClientForExamSwitch } from "@/lib/client/exam-switch-reset";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { Skeleton } from "@/components/ui/skeleton";
import type {
  UsmleExamOption,
  UsmleExamOptionsPayload,
} from "@/lib/exam-prep/usmle/exam-options";
import { persistUsmleStepPreference } from "@/lib/edtech/actions";
import { navigateHard } from "@/lib/client/navigate-hard";
import { cn } from "@/lib/utils";

type Props = {
  /** Server-rendered options with counts — instant first paint, no flash. */
  initialPayload: UsmleExamOptionsPayload;
  /** Which option to center on first paint (defaults to Step 2 CK). */
  initialLevel?: UsmleExamOption["level"];
};

/** Pixel height of a single wheel row — must match the row markup below. */
const ITEM_H = 88;
/** Odd number of rows visible so one is always dead-center. */
const VISIBLE = 5;
const WHEEL_H = ITEM_H * VISIBLE;
const PAD = (WHEEL_H - ITEM_H) / 2;

function formatCount(n: number): string {
  return n > 0 ? `${n.toLocaleString("en-US")} questions` : "Bank loading…";
}

export function ExamWheelPicker({ initialPayload, initialLevel = "step2" }: Props) {
  const reduceMotion = useReducedMotion();
  const queryClient = useQueryClient();

  const [payload, setPayload] = useState<UsmleExamOptionsPayload>(initialPayload);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const options = payload.options;
  const startIndex = Math.max(
    0,
    options.findIndex((o) => o.level === initialLevel)
  );

  // One accent badge: "Recommended" on Step 2 CK, "Largest bank" on the biggest.
  const maxLevel = useMemo(() => {
    const top = options.reduce<UsmleExamOption | null>(
      (best, o) => (!best || o.questionCount > best.questionCount ? o : best),
      null
    );
    return top && top.questionCount > 0 ? top.level : null;
  }, [options]);

  const badgeFor = useCallback(
    (option: UsmleExamOption): string | undefined => {
      if (option.level === maxLevel) return "Largest bank";
      if (option.level === "step2") return "Recommended";
      return undefined;
    },
    [maxLevel]
  );

  const [activeIndex, setActiveIndex] = useState(startIndex === -1 ? 0 : startIndex);
  const [center, setCenter] = useState<number>(startIndex === -1 ? 0 : startIndex);
  const selectedIndex = activeIndex;
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
    onSelectedIndexChange: (idx) => {
      setActiveIndex(idx);
      setCenter(idx);
    },
    onCenterChange: setCenter,
    reduceMotion,
  });

  useEffect(() => {
    scrollToIndex(startIndex === -1 ? 0 : startIndex, "auto");
    setActiveIndex(startIndex === -1 ? 0 : startIndex);
    setCenter(startIndex === -1 ? 0 : startIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    try {
      const res = await fetch("/api/exams/usmle", { cache: "no-store" });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const data = (await res.json()) as UsmleExamOptionsPayload;
      setPayload(data);
      if (data.degraded && !data.options.some((o) => o.questionCount > 0)) {
        setError("Live question counts are temporarily unavailable.");
      }
    } catch {
      if (!initialPayload.options.some((o) => o.questionCount > 0)) {
        setError("We couldn't load question counts. Please try again.");
      }
    } finally {
      setRefreshing(false);
    }
  }, [initialPayload]);

  const start = useCallback(async () => {
    if (!selected) return;
    setPending(true);
    setError(null);
    const result = await persistUsmleStepPreference(selected.fieldId);
    if (!result.ok) {
      setError(result.error);
      setPending(false);
      return;
    }
    prepareClientForExamSwitch(queryClient, "usmle");
    navigateHard(selected.practiceHref);
  }, [selected]);

  const onKeyDown = useMemo(
    () =>
      makeKeyDownHandler((e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          void start();
        }
      }),
    [makeKeyDownHandler, start]
  );

  // Refresh once on mount so counts are live even if the page was cached.
  const didFetch = useRef(false);
  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;
    void refresh();
  }, [refresh]);

  const hasData = options.length > 0;

  if (!hasData) {
    return (
      <div className="mx-auto max-w-md">
        <Skeleton className="h-[440px] w-full rounded-[28px]" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-md flex-col items-center">
      {error ? (
        <div className="mb-5 w-full">
          <StatusMessage variant="error">
            <span className="flex flex-wrap items-center gap-2">
              {error}
              <button
                type="button"
                onClick={() => void refresh()}
                className="inline-flex items-center gap-1.5 font-semibold underline underline-offset-2"
              >
                <RefreshCw className="h-3.5 w-3.5" aria-hidden />
                Retry
              </button>
            </span>
          </StatusMessage>
        </div>
      ) : null}

      {/* Wheel */}
      <div
        className="relative w-full select-none overscroll-y-contain"
        style={{ height: WHEEL_H, perspective: "1000px" }}
      >
        {/* Center selection band */}
        <div
          className="pointer-events-none absolute inset-x-2 top-1/2 -translate-y-1/2 rounded-2xl border border-indigo-400/40 bg-indigo-500/[0.06] shadow-[0_0_30px_-8px_rgba(99,102,241,0.45)] ring-1 ring-inset ring-white/40 dark:ring-white/5"
          style={{ height: ITEM_H }}
          aria-hidden
        />
        {/* Top & bottom fade masks */}
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
          aria-label="Choose your USMLE step"
          aria-activedescendant={selected ? `usmle-wheel-${selected.level}` : undefined}
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
            "rounded-[28px] focus-visible:ring-indigo-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
          )}
          style={{ paddingTop: PAD, paddingBottom: PAD }}
        >
          {options.map((option, i) => {
            const isSelected = i === activeIndex;
            const distance = i - center;
            const abs = Math.abs(distance);
            const scale = reduceMotion ? 1 : Math.max(0.78, 1 - abs * 0.13);
            const opacity = Math.max(0.32, 1 - abs * 0.34);
            const rotateX = reduceMotion ? 0 : Math.max(-55, Math.min(55, -distance * 22));

            return (
              <div
                key={option.level}
                id={`usmle-wheel-${option.level}`}
                role="option"
                aria-selected={isSelected}
                onClick={() => scrollToIndex(i, "smooth")}
                className="flex snap-center items-center justify-center touch-manipulation"
                style={{ height: ITEM_H }}
              >
                <div
                  className={cn(
                    "flex w-full cursor-pointer items-center justify-between gap-3 rounded-2xl px-5 py-3 transition-colors",
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
                    <div className="flex items-baseline gap-2">
                      <span
                        className={cn(
                          "truncate font-bold tracking-tight",
                          isSelected ? "text-2xl sm:text-[28px]" : "text-xl"
                        )}
                      >
                        {option.examTypeLabel}
                      </span>
                      {isSelected && badgeFor(option) ? (
                        <span className="shrink-0 rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                          {badgeFor(option)}
                        </span>
                      ) : null}
                    </div>
                    <p
                      className={cn(
                        "truncate",
                        isSelected ? "text-sm text-[var(--color-ink-muted)]" : "text-xs"
                      )}
                    >
                      {option.tagline}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p
                      className={cn(
                        "font-extrabold tabular-nums",
                        isSelected ? "text-lg text-indigo-600 dark:text-indigo-400" : "text-sm"
                      )}
                    >
                      {option.questionCount > 0
                        ? option.questionCount.toLocaleString("en-US")
                        : "—"}
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

      {/* Selected summary + CTA */}
      <div className="mt-7 w-full text-center" aria-live="polite">
        <p className="text-sm font-medium text-[var(--color-ink-muted)]">
          {selected ? (
            <>
              {selected.name} · {formatCount(selected.questionCount)}
            </>
          ) : null}
        </p>
        <button
          type="button"
          onClick={start}
          disabled={pending || !selected}
          className={cn(
            "mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-indigo-600/25 transition",
            "hover:bg-indigo-700 hover:gap-3 active:scale-[0.99]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]",
            "disabled:cursor-not-allowed disabled:opacity-60"
          )}
        >
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Starting…
            </>
          ) : (
            <>
              Start {selected?.examTypeLabel} practice
              <ArrowRight className="h-4 w-4" aria-hidden />
            </>
          )}
        </button>
        {refreshing ? (
          <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-ink-muted)]">
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
            Updating live counts…
          </p>
        ) : (
          <p className="mt-3 text-xs text-[var(--color-ink-muted)]">
            Scroll or use ↑ ↓ to choose · Enter to start
          </p>
        )}
      </div>
    </div>
  );
}
