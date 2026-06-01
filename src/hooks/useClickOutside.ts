"use client";

import { useEffect, useRef, type RefObject } from "react";

type RefTarget = RefObject<HTMLElement | null>;

/** Close when pointer goes down outside all `refs` (capture phase). */
export function useClickOutside(
  refs: RefTarget | RefTarget[],
  onOutside: () => void,
  enabled = true
) {
  const refsRef = useRef(refs);
  refsRef.current = refs;

  useEffect(() => {
    if (!enabled) return;

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;
      const list = Array.isArray(refsRef.current) ? refsRef.current : [refsRef.current];
      if (list.every((ref) => !ref.current?.contains(target))) {
        onOutside();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown, true);
    return () => document.removeEventListener("pointerdown", handlePointerDown, true);
  }, [enabled, onOutside]);
}
