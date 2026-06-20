"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useReducedMotion } from "framer-motion";
import { Check, Loader2, Sparkles } from "lucide-react";
import { EXAM_CATALOG, EXAM_SLUGS } from "@/lib/edtech/exams";
import { HIGH_YIELD_BY_EXAM } from "@/lib/edtech/seeds";
import { ROUTES } from "@/lib/routes";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

/** Compact wheel: 3 visible rows. */
const ITEM_H = 72;
const VISIBLE = 3;
const WHEEL_H = ITEM_H * VISIBLE;
const PAD = (WHEEL_H - ITEM_H) / 2;

export function HighYieldExamWheel({ currentExam }: { currentExam: ExamSlug }) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const options = EXAM_SLUGS;
  const startIndex = Math.max(0, options.indexOf(currentExam));

  const [center, setCenter] = useState(startIndex);
  const [pending, setPending] = useState(false);

  const selectedIndex = Math.min(options.length - 1, Math.max(0, Math.round(center)));
  const selected = options[selectedIndex]!;
  const isCurrent = selected === currentExam;

  const scrollToIndex = useCallback(
    (index: number, behavior: ScrollBehavior) => {
      const el = containerRef.current;
      if (!el) return;
      const clamped = Math.min(options.length - 1, Math.max(0, index));
      el.scrollTo({ top: clamped * ITEM_H, behavior });
    },
    [options.length]
  );

  useEffect(() => {
    scrollToIndex(startIndex, "auto");
    setCenter(startIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el || rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      setCenter(el.scrollTop / ITEM_H);
    });
  }, []);

  const navigate = useCallback(() => {
    if (!selected || selected === currentExam) return;
    setPending(true);
    router.push(`${ROUTES.highYieldTopics}?exam=${selected}`);
  }, [router, selected, currentExam]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        scrollToIndex(selectedIndex + 1, "smooth");
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        scrollToIndex(selectedIndex - 1, "smooth");
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        navigate();
      }
    },
    [selectedIndex, scrollToIndex, navigate]
  );

  return (
    <section
      aria-label="Choose exam for High-Yield Topics"
      className="mx-auto flex max-w-sm flex-col items-center"
    >
      {/* Wheel */}
      <div
        className="relative w-full select-none"
        style={{ height: WHEEL_H, perspective: "900px" }}
      >
        {/* Selection highlight */}
        <div
          className="pointer-events-none absolute inset-x-2 top-1/2 -translate-y-1/2 rounded-2xl border border-[var(--color-accent)]/40 bg-[var(--color-accent)]/[0.06] shadow-[0_0_28px_-8px_rgba(99,102,241,0.35)] ring-1 ring-inset ring-white/40"
          style={{ height: ITEM_H }}
          aria-hidden
        />
        {/* Fade top */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-[var(--color-bg)] to-transparent"
          style={{ height: PAD }}
          aria-hidden
        />
        {/* Fade bottom */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-[var(--color-bg)] to-transparent"
          style={{ height: PAD }}
          aria-hidden
        />

        <div
          ref={containerRef}
          role="listbox"
          aria-label="Choose an exam"
          aria-activedescendant={`hy-wheel-exam-${selected}`}
          tabIndex={0}
          onScroll={handleScroll}
          onKeyDown={onKeyDown}
          className={cn(
            "h-full w-full overflow-y-auto overscroll-contain",
            "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            "snap-y snap-mandatory scroll-smooth rounded-[24px]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/70"
          )}
          style={{ paddingTop: PAD, paddingBottom: PAD }}
        >
          {options.map((slug, i) => {
            const exam = EXAM_CATALOG[slug];
            const topicCount = HIGH_YIELD_BY_EXAM[slug]?.length ?? 0;
            const distance = i - center;
            const abs = Math.abs(distance);
            const isSelected = i === selectedIndex;
            const scale = reduceMotion ? 1 : Math.max(0.78, 1 - abs * 0.13);
            const opacity = Math.max(0.3, 1 - abs * 0.38);
            const rotateX = reduceMotion ? 0 : Math.max(-52, Math.min(52, -distance * 24));

            return (
              <div
                key={slug}
                id={`hy-wheel-exam-${slug}`}
                role="option"
                aria-selected={isSelected}
                onClick={() => scrollToIndex(i, "smooth")}
                className="flex snap-center items-center justify-center"
                style={{ height: ITEM_H }}
              >
                <div
                  className={cn(
                    "flex w-full cursor-pointer items-center justify-between gap-3 rounded-2xl px-5 py-2",
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
                          isSelected ? "text-xl sm:text-[22px]" : "text-base"
                        )}
                      >
                        {exam.shortName}
                      </span>
                      {slug === currentExam && (
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[var(--color-accent)]/12 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--color-accent)]">
                          <Check className="h-2.5 w-2.5" aria-hidden />
                          Current
                        </span>
                      )}
                    </div>
                    {isSelected && (
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-[var(--color-ink-muted)]">
                        <Sparkles className="h-3 w-3 shrink-0" aria-hidden />
                        {topicCount} high-yield topics
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-5 w-full" aria-live="polite">
        <button
          type="button"
          onClick={navigate}
          disabled={pending || isCurrent}
          className={cn(
            "inline-flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3 text-[14px] font-semibold transition",
            isCurrent
              ? "cursor-default bg-black/[0.05] text-[var(--color-ink-muted)]"
              : "bg-[var(--color-accent)] text-white shadow-[var(--shadow-apple-btn)] hover:opacity-95 active:scale-[0.99]"
          )}
        >
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Loading…
            </>
          ) : isCurrent ? (
            <>
              <Check className="h-4 w-4" aria-hidden />
              Viewing {EXAM_CATALOG[selected]?.shortName} topics
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" aria-hidden />
              View {EXAM_CATALOG[selected]?.shortName} topics
            </>
          )}
        </button>
        <p className="mt-2.5 text-center text-[11px] text-[var(--color-ink-muted)]">
          Scroll or use ↑ ↓ to choose · Enter to open
        </p>
      </div>
    </section>
  );
}
