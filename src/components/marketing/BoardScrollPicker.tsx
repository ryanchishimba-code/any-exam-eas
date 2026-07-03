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

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion } from "framer-motion";
import {
  pickerWheelScrollerClassName,
  usePickerWheelScroll,
} from "@/hooks/usePickerWheelScroll";

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
const VISIBLE_ROWS = 5;
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
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const suppressSelectRef = useRef(false);

  const initialIndex = Math.max(
    0,
    items.findIndex((item) => item.id === selectedId)
  );
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [center, setCenter] = useState(initialIndex);

  const paintDepth = useCallback(
    (pos = center) => {
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
    },
    [center, reduceMotion]
  );

  const handleIndexChange = useCallback(
    (index: number) => {
      setActiveIndex(index);
      if (!suppressSelectRef.current) onSelect(items[index].id);
    },
    [items, onSelect]
  );

  const {
    containerRef,
    scrollToIndex: hookScrollToIndex,
    handleScroll,
    onPointerDown,
    onPointerUp,
    onPointerCancel,
    onTouchStart,
    onTouchEnd,
    makeKeyDownHandler,
  } = usePickerWheelScroll({
    itemHeight: ITEM_HEIGHT,
    itemCount: items.length,
    selectedIndex: activeIndex,
    onSelectedIndexChange: handleIndexChange,
    onCenterChange: (next) => {
      setCenter(next);
      paintDepth(next);
    },
    reduceMotion,
  });

  const scrollToIndex = useCallback(
    (index: number, smooth: boolean) => {
      suppressSelectRef.current = true;
      hookScrollToIndex(index, smooth && !reduceMotion ? "smooth" : "auto");
      window.setTimeout(
        () => {
          suppressSelectRef.current = false;
        },
        smooth && !reduceMotion ? 480 : 60
      );
    },
    [hookScrollToIndex, reduceMotion]
  );

  useEffect(() => {
    scrollToIndex(initialIndex, false);
    paintDepth(initialIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const index = items.findIndex((item) => item.id === selectedId);
    if (index >= 0 && index !== activeIndex) {
      setActiveIndex(index);
      setCenter(index);
      scrollToIndex(index, true);
      paintDepth(index);
    }
  }, [activeIndex, items, paintDepth, scrollToIndex, selectedId]);

  const selectIndex = useCallback(
    (index: number) => {
      const clamped = clamp(index, 0, items.length - 1);
      setActiveIndex(clamped);
      setCenter(clamped);
      onSelect(items[clamped].id);
      scrollToIndex(clamped, true);
    },
    [items, onSelect, scrollToIndex]
  );

  const onKeyDown = useMemo(
    () =>
      makeKeyDownHandler((e) => {
        if (e.key === "Home") {
          e.preventDefault();
          selectIndex(0);
        } else if (e.key === "End") {
          e.preventDefault();
          selectIndex(items.length - 1);
        }
      }),
    [items.length, makeKeyDownHandler, selectIndex]
  );

  const activeAccent = items[activeIndex]?.accent ?? "var(--color-accent)";

  return (
    <div
      className={`aee-board-picker overscroll-y-contain ${className}`.trim()}
      style={{ ["--picker-accent" as string]: activeAccent } as CSSProperties}
    >
      <div className="aee-board-picker__band" aria-hidden />

      <div
        ref={containerRef}
        role="listbox"
        aria-label={ariaLabel}
        tabIndex={0}
        onScroll={handleScroll}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onKeyDown={onKeyDown}
        className={`aee-board-picker__scroller ${pickerWheelScrollerClassName}`}
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
              className="aee-board-picker__item touch-manipulation"
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
              <span className="aee-board-picker__count aee-landing-question-count">
                {item.count}
              </span>
            </button>
          );
        })}
        <div style={{ height: EDGE_PADDING }} aria-hidden />
      </div>
    </div>
  );
}
