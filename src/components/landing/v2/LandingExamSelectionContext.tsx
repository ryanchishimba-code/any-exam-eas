"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { FormatCounts } from "@/lib/inventory/active-questions";
import type { ExamSlug } from "@/types/edtech";
import { landingTrialHrefForExam } from "@/lib/landing/content";

const DEFAULT_EXAM: ExamSlug = "nclex";

type LandingExamSelectionContextValue = {
  selectedExam: ExamSlug;
  setSelectedExam: (exam: ExamSlug) => void;
  trialHref: string;
  formatsFor: (exam: string) => FormatCounts | null;
};

const LandingExamSelectionContext =
  createContext<LandingExamSelectionContextValue | null>(null);

export function LandingExamSelectionProvider({
  children,
  initialExam = DEFAULT_EXAM,
  boardFormats = null,
}: {
  children: ReactNode;
  initialExam?: ExamSlug;
  boardFormats?: Partial<Record<string, FormatCounts | null>> | null;
}) {
  const [selectedExam, setSelectedExamState] = useState<ExamSlug>(initialExam);

  const setSelectedExam = useCallback((exam: ExamSlug) => {
    setSelectedExamState(exam);
  }, []);

  const formatsFor = useCallback(
    (exam: string) => boardFormats?.[exam] ?? null,
    [boardFormats]
  );

  const value = useMemo(
    () => ({
      selectedExam,
      setSelectedExam,
      trialHref: landingTrialHrefForExam(selectedExam),
      formatsFor,
    }),
    [formatsFor, selectedExam, setSelectedExam]
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
      formatsFor: () => null,
    };
  }
  return ctx;
}
