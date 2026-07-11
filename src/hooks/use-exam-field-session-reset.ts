"use client";

import { useEffect, useRef } from "react";
import {
  EXAM_SWITCH_EVENT,
  type ExamSwitchDetail,
} from "@/lib/client/exam-switch-reset";

type ResetSessionState = () => void;

/**
 * Clears in-memory practice session state when the active exam field changes or
 * when a global exam-switch event fires (dropdown / select-exam flow).
 */
export function useExamFieldSessionReset(
  scopeKey: string,
  reset: ResetSessionState
): void {
  const resetRef = useRef(reset);
  resetRef.current = reset;

  const prevScopeRef = useRef(scopeKey);

  useEffect(() => {
    if (prevScopeRef.current === scopeKey) return;
    prevScopeRef.current = scopeKey;
    resetRef.current();
  }, [scopeKey]);

  useEffect(() => {
    const onExamSwitch = (event: Event) => {
      const detail = (event as CustomEvent<ExamSwitchDetail>).detail;
      if (!detail?.examSlug) return;
      // Always reset on a global exam switch — scopeKey may still hold the old
      // field during the optimistic transition (e.g. naplex:nursing).
      resetRef.current();
    };
    window.addEventListener(EXAM_SWITCH_EVENT, onExamSwitch);
    return () => window.removeEventListener(EXAM_SWITCH_EVENT, onExamSwitch);
  }, []);
}
