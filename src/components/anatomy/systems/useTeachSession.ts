"use client";

import { useCallback, useEffect, useMemo, useReducer } from "react";
import type { TeachState } from "@/lib/anatomy/systems/teach/types";
import {
  advanceTeachTour,
  buildTeachViewModel,
  clearTeachQuizFeedback,
  createInitialTeachState,
  handleTeachStructureSelect,
  resetTeachSession,
  startTeachQuiz,
  startTeachTour,
} from "@/lib/anatomy/systems/teach/session";
import { getToursForExam } from "@/lib/anatomy/systems/teach";
import type { ExamSlug } from "@/types/edtech";

type Action =
  | { type: "SET"; state: TeachState }
  | { type: "CLEAR_CORRECT_FEEDBACK" }
  | { type: "RESET" };

function teachReducer(state: TeachState, action: Action): TeachState {
  switch (action.type) {
    case "SET":
      return action.state;
    case "CLEAR_CORRECT_FEEDBACK":
      return clearTeachQuizFeedback(state);
    case "RESET":
      return resetTeachSession();
    default:
      return state;
  }
}

type Options = {
  examSlug: ExamSlug;
  onNavigateToStructure: (structureId: string) => void;
  /** When true, quiz hints mention sidebar instead of clicking the body. */
  catalogOnly?: boolean;
};

export function useTeachSession({ examSlug, onNavigateToStructure, catalogOnly = false }: Options) {
  const [state, dispatch] = useReducer(teachReducer, undefined, createInitialTeachState);

  const view = useMemo(() => buildTeachViewModel(state), [state]);
  const tours = useMemo(() => getToursForExam(examSlug), [examSlug]);

  const applyResult = useCallback(
    (result: ReturnType<typeof startTeachTour>) => {
      dispatch({ type: "SET", state: result.state });
      if (result.navigateToStructureId) {
        onNavigateToStructure(result.navigateToStructureId);
      }
    },
    [onNavigateToStructure]
  );

  const startTour = useCallback(
    (tourId: string) => {
      applyResult(startTeachTour(state, tourId));
    },
    [applyResult, state]
  );

  const advanceTour = useCallback(() => {
    applyResult(advanceTeachTour(state));
  }, [applyResult, state]);

  const startQuiz = useCallback(() => {
    applyResult(startTeachQuiz(state));
  }, [applyResult, state]);

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  const handleStructureSelect = useCallback(
    (structureId: string) => {
      const result = handleTeachStructureSelect(state, structureId);
      dispatch({ type: "SET", state: result.state });
      if (result.navigateToStructureId) {
        onNavigateToStructure(result.navigateToStructureId);
      }
      return result.quizAttemptHandled;
    },
    [onNavigateToStructure, state]
  );

  useEffect(() => {
    if (state.quizFeedback !== "Correct!") return;
    const timer = window.setTimeout(() => {
      dispatch({ type: "CLEAR_CORRECT_FEEDBACK" });
    }, 900);
    return () => window.clearTimeout(timer);
  }, [state.quizFeedback]);

  const quizHint = catalogOnly
    ? "Pick the matching structure from the sidebar."
    : "Switch to the right view if needed, then click the matching part — or pick from the sidebar.";

  return {
    ...view,
    tours,
    startTour,
    advanceTour,
    startQuiz,
    reset,
    handleStructureSelect,
    quizHint,
    highlightedId: state.highlightedStructureId,
  };
}
