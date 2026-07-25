"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ExamSlug } from "@/types/edtech";
import { landingTrialHrefForExam } from "@/lib/landing/content";

const DEFAULT_EXAM: ExamSlug = "nclex";

type LandingExamSelectionContextValue = {
  selectedExam: ExamSlug;
  setSelectedExam: (exam: ExamSlug) => void;
  trialHref: string;
};

const LandingExamSelectionContext =
  createContext<LandingExamSelectionContextValue | null>(null);

export function LandingExamSelectionProvider({
  children,
  initialExam = DEFAULT_EXAM,
}: {
  children: ReactNode;
  initialExam?: ExamSlug;
}) {
  const [selectedExam, setSelectedExamState] = useState<ExamSlug>(initialExam);

  const setSelectedExam = useCallback((exam: ExamSlug) => {
    setSelectedExamState(exam);
  }, []);

  const value = useMemo(
    () => ({
      selectedExam,
      setSelectedExam,
      trialHref: landingTrialHrefForExam(selectedExam),
    }),
    [selectedExam, setSelectedExam]
  );

  return (
    <LandingExamSelectionContext.Provider value={value}>
      {children}
    </LandingExamSelectionContext.Provider>
  );
}

export function useLandingExamSelection(): LandingExamSelectionContextValue {
  const ctx = useContext(LandingExamSelectionContext);
  if (!ctx) {
    return {
      selectedExam: DEFAULT_EXAM,
      setSelectedExam: () => undefined,
      trialHref: landingTrialHrefForExam(DEFAULT_EXAM),
    };
  }
  return ctx;
}
