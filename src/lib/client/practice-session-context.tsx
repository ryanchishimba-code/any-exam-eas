"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type PracticeSessionContextValue = {
  active: boolean;
  setActive: (active: boolean) => void;
};

const PracticeSessionContext = createContext<PracticeSessionContextValue | null>(null);

export function PracticeSessionProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(false);
  const value = useMemo(() => ({ active, setActive }), [active]);
  return (
    <PracticeSessionContext.Provider value={value}>{children}</PracticeSessionContext.Provider>
  );
}

export function usePracticeSessionActive(): boolean {
  return useContext(PracticeSessionContext)?.active ?? false;
}

/** Mark the tree as an in-progress question session so chrome can clear the answers. */
export function useHoldPracticeSession(active = true) {
  const setActive = useContext(PracticeSessionContext)?.setActive;
  useEffect(() => {
    if (!setActive || !active) return;
    setActive(true);
    return () => setActive(false);
  }, [active, setActive]);
}
