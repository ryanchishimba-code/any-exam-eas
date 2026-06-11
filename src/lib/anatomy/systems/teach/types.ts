import type { AnatomyQuizQuestion, AnatomyTour, AnatomyTourStep } from "../../types";

export type TeachMode = "off" | "tour" | "quiz";

export type TeachState = {
  mode: TeachMode;
  tourId: string | null;
  tourStepIndex: number;
  quizIndex: number;
  quizScore: number;
  quizFeedback: string | null;
  highlightedStructureId: string | null;
};

export type TeachViewModel = {
  state: TeachState;
  mode: TeachMode;
  tour: AnatomyTour | null;
  currentStep: AnatomyTourStep | null;
  tourProgress: string | null;
  tourFinished: boolean;
  currentQuiz: AnatomyQuizQuestion | null;
  quizTotal: number;
  quizComplete: boolean;
  quizActive: boolean;
};

export type StructureSelectResult = {
  state: TeachState;
  /** When teach mode navigates to a structure, shell should open detail panel. */
  navigateToStructureId: string | null;
  /** Quiz attempt consumed — shell should not double-handle. */
  quizAttemptHandled: boolean;
};

export const INITIAL_TEACH_STATE: TeachState = {
  mode: "off",
  tourId: null,
  tourStepIndex: 0,
  quizIndex: 0,
  quizScore: 0,
  quizFeedback: null,
  highlightedStructureId: null,
};
