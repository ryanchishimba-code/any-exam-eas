"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";

type AnatomyPointerContextValue = {
  /** Increment/decrement hover depth — cursor stays pointer until all meshes release. */
  setHovering: (active: boolean) => void;
  registerHoverReset: (fn: () => void) => () => void;
  resetAllHovers: () => void;
};

const AnatomyPointerContext = createContext<AnatomyPointerContextValue | null>(null);

export function AnatomyPointerProvider({ children }: { children: ReactNode }) {
  const depthRef = useRef(0);
  const resetListenersRef = useRef(new Set<() => void>());

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

  const registerHoverReset = useCallback((fn: () => void) => {
    resetListenersRef.current.add(fn);
    return () => {
      resetListenersRef.current.delete(fn);
    };
  }, []);

  const resetAllHovers = useCallback(() => {
    resetListenersRef.current.forEach((fn) => fn());
    depthRef.current = 0;
    if (typeof document !== "undefined") {
      document.body.style.cursor = "auto";
    }
  }, []);

  const value = useMemo(
    () => ({ setHovering, registerHoverReset, resetAllHovers }),
    [registerHoverReset, resetAllHovers, setHovering]
  );

  return (
    <AnatomyPointerContext.Provider value={value}>{children}</AnatomyPointerContext.Provider>
  );
}

export function useAnatomyPointer() {
  const ctx = useContext(AnatomyPointerContext);
  return (
    ctx ?? {
      setHovering: () => {},
      registerHoverReset: () => () => {},
      resetAllHovers: () => {},
    }
  );
}

/** Clear local mesh hover when the pointer leaves the canvas or orbit drag starts. */
export function useAnatomyHoverReset(onReset: () => void) {
  const { registerHoverReset } = useAnatomyPointer();
  useEffect(() => registerHoverReset(onReset), [onReset, registerHoverReset]);
}
