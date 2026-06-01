"use client";

import { useCallback, useLayoutEffect, useState, type CSSProperties, type RefObject } from "react";

type FloatingPosition = CSSProperties & {
  width: number;
};

/** Position a portaled panel below an anchor element; updates on scroll/resize. */
export function useFloatingPosition(
  anchorRef: RefObject<HTMLElement | null>,
  open: boolean,
  gap = 8
) {
  const [position, setPosition] = useState<FloatingPosition | null>(null);

  const update = useCallback(() => {
    const anchor = anchorRef.current;
    if (!anchor) {
      setPosition(null);
      return;
    }

    const rect = anchor.getBoundingClientRect();
    setPosition({
      position: "fixed",
      top: rect.bottom + gap,
      left: rect.left,
      width: rect.width,
      zIndex: 120,
    });
  }, [anchorRef, gap]);

  useLayoutEffect(() => {
    if (!open) {
      setPosition(null);
      return;
    }

    update();

    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open, update]);

  return position;
}
