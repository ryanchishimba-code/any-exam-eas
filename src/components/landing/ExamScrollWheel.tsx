"use client";

/**
 * ExamScrollWheel — premium horizontal snap-scroll exam picker.
 *
 * Design: iOS-picker feel; center card is active + highlighted with an
 * accent ring; animated summary card below shows full details + CTA.
 * Reusable: used on the landing page and the USMLE marketing page.
 */

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type ExamWheelItem = {
  id: string;
  /** Full display label shown in the summary card */
  label: string;
  /** Short label shown in the wheel card header */
  shortLabel: string;
  /** One-liner shown inside the wheel card */
  description: string;
  /** e.g. "11K+ questions" */
  countLabel: string;
  href: string;
  icon: LucideIcon;
  color: string;
};

type Props = {
  items: ExamWheelItem[];
  initialIndex?: number;
  className?: string;
};

export function ExamScrollWheel({ items, initialIndex = 0, className }: Props) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const prefersReduced = useReducedMotion();

  /** Scroll the track so card[idx] is centred, update active state. */
  const scrollToIndex = useCallback(
    (idx: number) => {
      const clamped = Math.max(0, Math.min(items.length - 1, idx));
      setActiveIndex(clamped);
      const card = cardRefs.current[clamped];
      const track = trackRef.current;
      if (!card || !track) return;
      const scrollTarget =
        card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2;
      track.scrollTo({
        left: scrollTarget,
        behavior: prefersReduced ? "auto" : "smooth",
      });
    },
    [items.length, prefersReduced],
  );

  /** Keep activeIndex in sync as the user drags/swipes. */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const center = track.scrollLeft + track.clientWidth / 2;
        let closest = 0;
        let closestDist = Infinity;
        cardRefs.current.forEach((card, idx) => {
          if (!card) return;
          const dist = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
          if (dist < closestDist) {
            closestDist = dist;
            closest = idx;
          }
        });
        setActiveIndex(closest);
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  /** Scroll to initial card on mount without animation. */
  useEffect(() => {
    const card = cardRefs.current[initialIndex];
    const track = trackRef.current;
    if (!card || !track) return;
    const target = card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2;
    track.scrollLeft = target;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const active = items[activeIndex] ?? items[0]!;

  return (
    <div className={cn("w-full select-none", className)}>
      {/* ── Scroll track ─────────────────────────────────────────────── */}
      <div className="relative">
        {/* Edge fade masks */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-14 bg-gradient-to-r from-[var(--color-bg)] to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-gradient-to-l from-[var(--color-bg)] to-transparent"
          aria-hidden
        />

        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 pt-1"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            paddingInline: "calc(50% - 105px)",
          }}
          role="listbox"
          aria-label="Choose your exam"
        >
          {items.map((item, idx) => {
            const Icon = item.icon;
            const isActive = idx === activeIndex;
            return (
              <button
                key={item.id}
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                className={cn(
                  "snap-center shrink-0 rounded-2xl border p-4 text-left",
                  "w-[210px] transition-all duration-300",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]",
                  isActive
                    ? "scale-[1.04] border-transparent bg-[var(--color-surface-elevated)]"
                    : "scale-100 border-[var(--color-border)] bg-[var(--color-surface)] opacity-55 hover:opacity-80",
                )}
                style={
                  isActive
                    ? {
                        boxShadow: `0 0 0 1.5px ${item.color}55, 0 4px 20px rgba(0,0,0,0.09)`,
                      }
                    : {}
                }
                onClick={() => scrollToIndex(idx)}
                role="option"
                aria-selected={isActive}
              >
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{ background: `${item.color}1a` }}
                >
                  <Icon
                    className="h-5 w-5"
                    style={{ color: item.color }}
                    strokeWidth={1.75}
                    aria-hidden
                  />
                </span>
                <p
                  className="mt-3 text-xs font-extrabold leading-tight"
                  style={{ color: isActive ? item.color : "var(--color-ink)" }}
                >
                  {item.shortLabel}
                </p>
                <p className="mt-1.5 line-clamp-2 text-[11px] leading-snug text-[var(--color-ink-muted)]">
                  {item.description}
                </p>
                <p
                  className="mt-2.5 text-[10px] font-bold tracking-wide"
                  style={{
                    color: isActive ? item.color : "var(--color-ink-muted)",
                    opacity: isActive ? 1 : 0.7,
                  }}
                >
                  {item.countLabel}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Dot indicators + nav arrows ──────────────────────────────── */}
      <div className="mt-3 flex items-center justify-center gap-3">
        <button
          onClick={() => scrollToIndex(activeIndex - 1)}
          disabled={activeIndex === 0}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface-elevated)] text-[var(--color-ink-muted)] transition hover:bg-[var(--color-surface)] disabled:opacity-25"
          aria-label="Previous exam"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>

        <div className="flex items-center gap-1.5" role="tablist" aria-label="Exam indicators">
          {items.map((item, idx) => (
            <button
              key={item.id}
              role="tab"
              aria-selected={idx === activeIndex}
              onClick={() => scrollToIndex(idx)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                idx === activeIndex ? "w-5" : "w-1.5",
              )}
              style={{
                background:
                  idx === activeIndex ? active.color : "var(--color-ink-muted, #94a3b8)",
                opacity: idx === activeIndex ? 1 : 0.28,
              }}
              aria-label={items[idx]!.shortLabel}
            />
          ))}
        </div>

        <button
          onClick={() => scrollToIndex(activeIndex + 1)}
          disabled={activeIndex === items.length - 1}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface-elevated)] text-[var(--color-ink-muted)] transition hover:bg-[var(--color-surface)] disabled:opacity-25"
          aria-label="Next exam"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* ── Animated summary card ─────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={prefersReduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReduced ? false : { opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)]"
          style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
        >
          {/* Accent bar */}
          <div
            className="h-[3px] w-full"
            style={{ background: `linear-gradient(90deg, ${active.color}, ${active.color}50)` }}
            aria-hidden
          />
          <div className="p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p
                  className="text-[10px] font-extrabold uppercase tracking-widest"
                  style={{ color: active.color }}
                >
                  Board exam
                </p>
                <h3 className="mt-0.5 text-base font-bold text-[var(--color-ink)] sm:text-lg">
                  {active.label}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-[var(--color-ink-muted)]">
                  {active.description}
                </p>
              </div>
              <span
                className="shrink-0 self-start rounded-full px-3 py-1 text-xs font-bold"
                style={{ background: `${active.color}18`, color: active.color }}
              >
                {active.countLabel}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Link
                href={active.href}
                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 active:scale-95"
                style={{ background: active.color }}
              >
                Start studying
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href={active.href}
                className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-ink-muted)] transition-colors hover:text-[var(--color-ink)]"
              >
                Learn more
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
