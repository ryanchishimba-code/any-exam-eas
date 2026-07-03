"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type TouchEvent,
} from "react";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { cn } from "@/lib/utils";

/** Shared scroll viewport styles — isolation without `scroll-smooth` (programmatic only). */
export const pickerWheelScrollerClassName = cn(
  "h-full w-full overflow-y-auto",
  "overscroll-y-contain [overscroll-behavior:contain]",
  "touch-pan-y touch-manipulation",
  "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
  "snap-y snap-mandatory [-webkit-overflow-scrolling:touch]",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/60"
);

export type UsePickerWheelScrollOptions = {
  itemHeight: number;
  itemCount: number;
  /** Index driven by parent when the wheel is controlled externally. */
  selectedIndex: number;
  onSelectedIndexChange: (index: number) => void;
  /** Fractional scroll position for depth / tilt visuals. */
  onCenterChange?: (center: number) => void;
  reduceMotion?: boolean | null;
  /** Debounce before snapping after user scroll (ms). */
  settleDelayMs?: number;
};

export function usePickerWheelScroll({
  itemHeight,
  itemCount,
  selectedIndex,
  onSelectedIndexChange,
  onCenterChange,
  reduceMotion = false,
  settleDelayMs = 100,
}: UsePickerWheelScrollOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const settleTimerRef = useRef<number | null>(null);
  const programmaticRef = useRef(false);
  const interactingRef = useRef(false);
  const touchLastYRef = useRef(0);
  const [interacting, setInteracting] = useState(false);

  useBodyScrollLock(interacting);

  const clampIndex = useCallback(
    (index: number) => Math.min(Math.max(0, index), Math.max(0, itemCount - 1)),
    [itemCount]
  );

  const readCenter = useCallback(() => {
    const el = containerRef.current;
    if (!el || itemHeight <= 0) return 0;
    return el.scrollTop / itemHeight;
  }, [itemHeight]);

  const publishCenter = useCallback(() => {
    onCenterChange?.(readCenter());
  }, [onCenterChange, readCenter]);

  const scrollToIndex = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const el = containerRef.current;
      if (!el || itemCount <= 0 || itemHeight <= 0) return;
      const clamped = clampIndex(index);
      programmaticRef.current = true;
      el.scrollTo({
        top: clamped * itemHeight,
        behavior: reduceMotion ? "auto" : behavior,
      });
      onCenterChange?.(clamped);
      window.setTimeout(() => {
        programmaticRef.current = false;
      }, behavior === "smooth" && !reduceMotion ? 380 : 48);
    },
    [clampIndex, itemCount, itemHeight, onCenterChange, reduceMotion]
  );

  const snapToNearest = useCallback(
    (behavior: ScrollBehavior = "auto") => {
      const el = containerRef.current;
      if (!el || itemCount <= 0 || itemHeight <= 0) return;
      const idx = clampIndex(Math.round(el.scrollTop / itemHeight));
      const targetTop = idx * itemHeight;
      if (Math.abs(el.scrollTop - targetTop) > 1) {
        programmaticRef.current = true;
        el.scrollTo({
          top: targetTop,
          behavior: reduceMotion ? "auto" : behavior,
        });
        window.setTimeout(() => {
          programmaticRef.current = false;
        }, behavior === "smooth" && !reduceMotion ? 320 : 48);
      }
      onCenterChange?.(idx);
      if (idx !== selectedIndex) onSelectedIndexChange(idx);
    },
    [
      clampIndex,
      itemCount,
      itemHeight,
      onCenterChange,
      onSelectedIndexChange,
      reduceMotion,
      selectedIndex,
    ]
  );

  const scheduleSettle = useCallback(() => {
    if (programmaticRef.current) return;
    if (settleTimerRef.current != null) {
      window.clearTimeout(settleTimerRef.current);
    }
    settleTimerRef.current = window.setTimeout(() => {
      settleTimerRef.current = null;
      snapToNearest("auto");
    }, settleDelayMs);
  }, [settleDelayMs, snapToNearest]);

  const handleScroll = useCallback(() => {
    if (rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      publishCenter();
    });
    if (!programmaticRef.current) scheduleSettle();
  }, [publishCenter, scheduleSettle]);

  const beginInteraction = useCallback(() => {
    interactingRef.current = true;
    setInteracting(true);
  }, []);

  const endInteraction = useCallback(() => {
    interactingRef.current = false;
    setInteracting(false);
    snapToNearest(reduceMotion ? "auto" : "smooth");
  }, [reduceMotion, snapToNearest]);

  const onPointerDown = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      beginInteraction();
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [beginInteraction]
  );

  const onPointerUp = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
      endInteraction();
    },
    [endInteraction]
  );

  const onPointerCancel = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
      endInteraction();
    },
    [endInteraction]
  );

  const onTouchStart = useCallback((e: TouchEvent<HTMLDivElement>) => {
    beginInteraction();
    touchLastYRef.current = e.touches[0]?.clientY ?? 0;
  }, [beginInteraction]);

  const onTouchEnd = useCallback(() => {
    endInteraction();
  }, [endInteraction]);

  const makeKeyDownHandler = useCallback(
    (extra?: (e: KeyboardEvent<HTMLDivElement>) => void) =>
      (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "ArrowDown" || e.key === "ArrowRight") {
          e.preventDefault();
          scrollToIndex(selectedIndex + 1, "smooth");
        } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
          e.preventDefault();
          scrollToIndex(selectedIndex - 1, "smooth");
        } else if (e.key === "Home") {
          e.preventDefault();
          scrollToIndex(0, "smooth");
        } else if (e.key === "End") {
          e.preventDefault();
          scrollToIndex(itemCount - 1, "smooth");
        } else {
          extra?.(e);
        }
      },
    [itemCount, scrollToIndex, selectedIndex]
  );

  // Trap mouse wheel inside the picker — stops page scroll / bounce.
  useEffect(() => {
    const el = containerRef.current;
    if (!el || itemCount <= 0) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const maxScroll = Math.max(0, (itemCount - 1) * itemHeight);
      el.scrollTop = Math.min(maxScroll, Math.max(0, el.scrollTop + e.deltaY));
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [itemCount, itemHeight]);

  // Stop scroll chaining at top/bottom during touch drags.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onTouchMove = (e: Event) => {
      if (!interactingRef.current) return;
      const touch = (e as TouchEvent).touches[0];
      const y = touch?.clientY ?? touchLastYRef.current;
      const deltaY = touchLastYRef.current - y;
      touchLastYRef.current = y;

      const { scrollTop, scrollHeight, clientHeight } = el;
      const atTop = scrollTop <= 0;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 1;
      const scrollingUp = deltaY < 0;
      const scrollingDown = deltaY > 0;

      if ((atTop && scrollingUp) || (atBottom && scrollingDown)) {
        e.preventDefault();
      }
    };

    el.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => el.removeEventListener("touchmove", onTouchMove);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScrollEnd = () => snapToNearest("auto");
    el.addEventListener("scrollend", onScrollEnd);
    return () => el.removeEventListener("scrollend", onScrollEnd);
  }, [snapToNearest]);

  useEffect(
    () => () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      if (settleTimerRef.current != null) window.clearTimeout(settleTimerRef.current);
    },
    []
  );

  return {
    containerRef,
    scrollToIndex,
    snapToNearest,
    programmaticRef,
    handleScroll,
    onPointerDown,
    onPointerUp,
    onPointerCancel,
    onTouchStart,
    onTouchEnd,
    makeKeyDownHandler,
  };
}
