"use client";

import { createContext, useCallback, useContext, useMemo, useRef, type ReactNode } from "react";

type AnatomyPointerContextValue = {
  /** Increment/decrement hover depth — cursor stays pointer until all meshes release. */
  setHovering: (active: boolean) => void;
};

const AnatomyPointerContext = createContext<AnatomyPointerContextValue | null>(null);

export function AnatomyPointerProvider({ children }: { children: ReactNode }) {
  const depthRef = useRef(0);

  const setHovering = useCallback((active: boolean) => {
    if (typeof document === "undefined") return;
    if (active) {
      depthRef.current += 1;
      document.body.style.cursor = "pointer";
      return;
    }
    depthRef.current = Math.max(0, depthRef.current - 1);
    if (depthRef.current === 0) {
      document.body.style.cursor = "auto";
    }
  }, []);

  const value = useMemo(() => ({ setHovering }), [setHovering]);

  return (
    <AnatomyPointerContext.Provider value={value}>{children}</AnatomyPointerContext.Provider>
  );
}

export function useAnatomyPointer() {
  const ctx = useContext(AnatomyPointerContext);
  return ctx ?? { setHovering: () => {} };
}
