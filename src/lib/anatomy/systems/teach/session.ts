import { ANATOMY_QUIZ_QUESTIONS, getTourById } from "../../tours";
import type { AnatomyQuizQuestion, AnatomyTour } from "../../types";
import {
  INITIAL_TEACH_STATE,
  type StructureSelectResult,
  type TeachMode,
  type TeachState,
  type TeachViewModel,
} from "./types";

export function createInitialTeachState(): TeachState {
  return { ...INITIAL_TEACH_STATE };
}

export function getTeachTour(state: TeachState): AnatomyTour | null {
  if (!state.tourId) return null;
  return getTourById(state.tourId) ?? null;
}

export function getTeachCurrentStep(state: TeachState) {
  const tour = getTeachTour(state);
  if (!tour || state.mode !== "tour") return null;
  return tour.steps[state.tourStepIndex] ?? null;
}

export function getTeachCurrentQuiz(state: TeachState): AnatomyQuizQuestion | null {
  if (state.mode !== "quiz") return null;
  return ANATOMY_QUIZ_QUESTIONS[state.quizIndex] ?? null;
}

export function buildTeachViewModel(state: TeachState): TeachViewModel {
  const tour = getTeachTour(state);
  const currentStep = getTeachCurrentStep(state);
  const currentQuiz = getTeachCurrentQuiz(state);
  const quizTotal = ANATOMY_QUIZ_QUESTIONS.length;
  const tourFinished =
    state.mode === "tour" && tour !== null && state.tourStepIndex + 1 >= tour.steps.length;
  const quizComplete = Boolean(state.quizFeedback?.startsWith("Quiz complete"));

  return {
    state,
    mode: state.mode,
    tour,
    currentStep,
    tourProgress: tour ? `${state.tourStepIndex + 1} / ${tour.steps.length}` : null,
    tourFinished,
    currentQuiz,
    quizTotal,
    quizComplete,
    quizActive: state.mode === "quiz" && !quizComplete,
  };
}

export function startTeachTour(state: TeachState, tourId: string): StructureSelectResult {
  const tour = getTourById(tourId);
  const first = tour?.steps[0];
  const next: TeachState = {
    ...createInitialTeachState(),
    mode: "tour",
    tourId,
    tourStepIndex: 0,
    highlightedStructureId: first?.structureId ?? null,
  };
  return {
    state: next,
    navigateToStructureId: first?.structureId ?? null,
    quizAttemptHandled: false,
  };
}

export function advanceTeachTour(state: TeachState): StructureSelectResult {
  const tour = getTeachTour(state);
  if (!tour || state.mode !== "tour") {
    return { state, navigateToStructureId: null, quizAttemptHandled: false };
  }

  const nextIndex = state.tourStepIndex + 1;
  if (nextIndex >= tour.steps.length) {
    return {
      state: { ...createInitialTeachState() },
      navigateToStructureId: null,
      quizAttemptHandled: false,
    };
  }

  const step = tour.steps[nextIndex];
  return {
    state: {
      ...state,
      tourStepIndex: nextIndex,
      highlightedStructureId: step.structureId,
    },
    navigateToStructureId: step.structureId,
    quizAttemptHandled: false,
  };
}

export function finishTeachTour(state: TeachState): TeachState {
  if (state.mode !== "tour") return state;
  return { ...createInitialTeachState() };
}

export function startTeachQuiz(state: TeachState): StructureSelectResult {
  return {
    state: {
      ...createInitialTeachState(),
      mode: "quiz",
      quizIndex: 0,
      quizScore: 0,
    },
    navigateToStructureId: null,
    quizAttemptHandled: false,
  };
}

export function resetTeachSession(): TeachState {
  return createInitialTeachState();
}

/** Handle structure pick from sidebar, viewport, or keyboard — surface-agnostic. */
export function handleTeachStructureSelect(
  state: TeachState,
  structureId: string
): StructureSelectResult {
  if (state.mode === "quiz") {
    return handleTeachQuizAttempt(state, structureId);
  }
  return { state, navigateToStructureId: null, quizAttemptHandled: false };
}

export function handleTeachQuizAttempt(
  state: TeachState,
  structureId: string
): StructureSelectResult {
  if (state.mode !== "quiz") {
    return { state, navigateToStructureId: null, quizAttemptHandled: false };
  }

  const currentQuiz = getTeachCurrentQuiz(state);
  if (!currentQuiz) {
    return { state, navigateToStructureId: null, quizAttemptHandled: false };
  }

  const quizTotal = ANATOMY_QUIZ_QUESTIONS.length;

  if (structureId !== currentQuiz.structureId) {
    return {
      state: { ...state, quizFeedback: "Not quite — try again." },
      navigateToStructureId: null,
      quizAttemptHandled: true,
    };
  }

  const nextScore = state.quizScore + 1;
  const nextIndex = state.quizIndex + 1;

  if (nextIndex >= quizTotal) {
    return {
      state: {
        mode: "off",
        tourId: null,
        tourStepIndex: 0,
        quizIndex: nextIndex - 1,
        quizScore: nextScore,
        quizFeedback: `Quiz complete — ${nextScore}/${quizTotal}`,
        highlightedStructureId: structureId,
      },
      navigateToStructureId: structureId,
      quizAttemptHandled: true,
    };
  }

  return {
    state: {
      ...state,
      quizIndex: nextIndex,
      quizScore: nextScore,
      quizFeedback: "Correct!",
      highlightedStructureId: structureId,
    },
    navigateToStructureId: structureId,
    quizAttemptHandled: true,
  };
}

/** Advance quiz after showing correct feedback (UI timer). */
export function clearTeachQuizFeedback(state: TeachState): TeachState {
  if (state.mode !== "quiz" || state.quizFeedback !== "Correct!") return state;
  return { ...state, quizFeedback: null, highlightedStructureId: null };
}

export function isTeachModeActive(mode: TeachMode): boolean {
  return mode !== "off";
}
