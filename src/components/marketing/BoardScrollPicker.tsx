"use client";

/**
 * BoardScrollPicker — a tactile, iOS-style vertical picker wheel.
 *
 * Reusable across marketing surfaces (landing "Pick your board" + USMLE step
 * selector). The wheel snaps to the centered row, fades + scales rows toward the
 * edges for depth, and reports the centered item via `onSelect`. It's a
 * controlled component: the parent owns `selectedId` and renders the summary
 * card beside it.
 *
 * Accessibility: rendered as a `listbox` of `option`s with full keyboard support
 * (Up/Down/Home/End). Respects `prefers-reduced-motion` by dropping the 3-D
 * transforms and snap easing while keeping selection fully functional.
 */

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion } from "framer-motion";

export type BoardPickerItem = {
  /** Stable id (exam slug or step level). */
  id: string;
  /** Primary label, e.g. "USMLE" or "Step 2 CK". */
  name: string;
  /** One-line descriptor shown under the name. */
  description: string;
  /** Compact live count, e.g. "11K+". */
  count: string;
  /** Brand accent (hex) used for the active row + selection band. */
  accent: string;
};

type BoardScrollPickerProps = {
  items: BoardPickerItem[];
  selectedId: string;
  onSelect: (id: string) => void;
  ariaLabel: string;
  className?: string;
};

const ITEM_HEIGHT = 70;
const VISIBLE_ROWS = 5; // odd → one centered row
const CONTAINER_HEIGHT = ITEM_HEIGHT * VISIBLE_ROWS;
const EDGE_PADDING = (CONTAINER_HEIGHT - ITEM_HEIGHT) / 2;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function BoardScrollPicker({
  items,
  selectedId,
  onSelect,
  ariaLabel,
  className = "",
}: BoardScrollPickerProps) {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const activeIndexRef = useRef(0);
  const suppressSelectRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const settleRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const initialIndex = Math.max(
    0,
    items.findIndex((item) => item.id === selectedId)
  );
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  // Paint depth (scale / rotate / fade) directly on refs to avoid re-render churn.
  const paintDepth = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const pos = container.scrollTop / ITEM_HEIGHT;

    itemRefs.current.forEach((el, index) => {
      if (!el) return;
      const delta = index - pos;
      const absDelta = Math.min(Math.abs(delta), 3);

      if (reduceMotion) {
        el.style.transform = "none";
        el.style.opacity = String(1 - Math.min(absDelta * 0.26, 0.66));
        return;
      }

      const scale = 1 - Math.min(absDelta * 0.11, 0.32);
      const rotateX = clamp(delta, -2.4, 2.4) * 15;
      el.style.transform = `perspective(720px) rotateX(${rotateX}deg) scale(${scale})`;
      el.style.opacity = String(1 - Math.min(absDelta * 0.3, 0.72));
    });
  }, [reduceMotion]);

  const handleScroll = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      paintDepth();
      const container = containerRef.current;
      if (!container) return;
      const index = clamp(
        Math.round(container.scrollTop / ITEM_HEIGHT),
        0,
        items.length - 1
      );
      if (index !== activeIndexRef.current) {
        activeIndexRef.current = index;
        setActiveIndex(index);
        if (!suppressSelectRef.current) onSelect(items[index].id);
      }
    });
  }, [paintDepth, items, onSelect]);

  const scrollToIndex = useCallback(
    (index: number, smooth: boolean) => {
      const container = containerRef.current;
      if (!container) return;
      suppressSelectRef.current = true;
      container.scrollTo({
        top: index * ITEM_HEIGHT,
        behavior: smooth && !reduceMotion ? "smooth" : "auto",
      });
      if (settleRef.current) clearTimeout(settleRef.current);
      settleRef.current = setTimeout(
        () => {
          suppressSelectRef.current = false;
        },
        smooth && !reduceMotion ? 480 : 60
      );
    },
    [reduceMotion]
  );

  // Initial position (no animation) + first depth paint.
  useEffect(() => {
    activeIndexRef.current = initialIndex;
    scrollToIndex(initialIndex, false);
    paintDepth();
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (settleRef.current) clearTimeout(settleRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the wheel in sync when the parent changes the selection (segmented control, card, etc.).
  useEffect(() => {
    const index = items.findIndex((item) => item.id === selectedId);
    if (index >= 0 && index !== activeIndexRef.current) {
      activeIndexRef.current = index;
      setActiveIndex(index);
      scrollToIndex(index, true);
    }
  }, [selectedId, items, scrollToIndex]);

  const selectIndex = useCallback(
    (index: number) => {
      const clamped = clamp(index, 0, items.length - 1);
      setActiveIndex(clamped);
      activeIndexRef.current = clamped;
      onSelect(items[clamped].id);
      scrollToIndex(clamped, true);
    },
    [items, onSelect, scrollToIndex]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      switch (event.key) {
        case "ArrowDown":
        case "ArrowRight":
          event.preventDefault();
          selectIndex(activeIndexRef.current + 1);
          break;
        case "ArrowUp":
        case "ArrowLeft":
          event.preventDefault();
          selectIndex(activeIndexRef.current - 1);
          break;
        case "Home":
          event.preventDefault();
          selectIndex(0);
          break;
        case "End":
          event.preventDefault();
          selectIndex(items.length - 1);
          break;
        default:
          break;
      }
    },
    [items.length, selectIndex]
  );

  const activeAccent = items[activeIndex]?.accent ?? "var(--color-accent)";

  return (
    <div
      className={`aee-board-picker ${className}`.trim()}
      style={{ ["--picker-accent" as string]: activeAccent } as CSSProperties}
    >
      {/* Center selection band — colored by the active item's accent. */}
      <div className="aee-board-picker__band" aria-hidden />

      <div
        ref={containerRef}
        role="listbox"
        aria-label={ariaLabel}
        tabIndex={0}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        className="aee-board-picker__scroller"
        style={{
          height: CONTAINER_HEIGHT,
          scrollSnapType: reduceMotion ? "none" : "y mandatory",
        }}
      >
        <div style={{ height: EDGE_PADDING }} aria-hidden />
        {items.map((item, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={item.id}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              type="button"
              role="option"
              aria-selected={isActive}
              onClick={() => selectIndex(index)}
              className="aee-board-picker__item"
              data-active={isActive}
              style={
                {
                  height: ITEM_HEIGHT,
                  scrollSnapAlign: "center",
                  ["--row-accent" as string]: item.accent,
                } as CSSProperties
              }
            >
              <span className="aee-board-picker__dot" aria-hidden />
              <span className="aee-board-picker__text">
                <span className="aee-board-picker__name">{item.name}</span>
                <span className="aee-board-picker__desc">{item.description}</span>
              </span>
              <span className="aee-board-picker__count">{item.count}</span>
            </button>
          );
        })}
        <div style={{ height: EDGE_PADDING }} aria-hidden />
      </div>
    </div>
  );
}
