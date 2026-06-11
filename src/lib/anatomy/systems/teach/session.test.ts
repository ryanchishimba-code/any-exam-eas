import { describe, expect, it } from "vitest";
import { ANATOMY_QUIZ_QUESTIONS } from "../../tours";
import {
  advanceTeachTour,
  createInitialTeachState,
  handleTeachQuizAttempt,
  handleTeachStructureSelect,
  resetTeachSession,
  startTeachQuiz,
  startTeachTour,
} from "./session";
import { buildTeachViewModel } from "./session";

describe("teach session — tour (surface-agnostic)", () => {
  it("starts a tour and navigates to the first structure", () => {
    const result = startTeachTour(createInitialTeachState(), "usmle-heart-anatomy");
    expect(result.state.mode).toBe("tour");
    expect(result.state.tourId).toBe("usmle-heart-anatomy");
    expect(result.navigateToStructureId).toBe("heart");
    expect(result.state.highlightedStructureId).toBe("heart");
  });

  it("advances tour steps and resets when finished", () => {
    let state = startTeachTour(createInitialTeachState(), "usmle-heart-anatomy").state;
    const tour = buildTeachViewModel(state).tour!;
    expect(tour.steps.length).toBeGreaterThan(1);

    for (let i = 0; i < tour.steps.length - 1; i++) {
      const next = advanceTeachTour(state);
      state = next.state;
      expect(next.navigateToStructureId).toBeTruthy();
    }

    const finished = advanceTeachTour(state);
    expect(finished.state.mode).toBe("off");
    expect(finished.navigateToStructureId).toBeNull();
  });
});

describe("teach session — quiz (sidebar or viewport)", () => {
  it("starts quiz without requiring a viewport", () => {
    const result = startTeachQuiz(createInitialTeachState());
    expect(result.state.mode).toBe("quiz");
    expect(result.navigateToStructureId).toBeNull();
    expect(buildTeachViewModel(result.state).currentQuiz).toBeTruthy();
  });

  it("scores correct sidebar picks", () => {
    let state = startTeachQuiz(createInitialTeachState()).state;
    const q = buildTeachViewModel(state).currentQuiz!;

    const wrong = handleTeachQuizAttempt(state, "skull");
    expect(wrong.state.quizFeedback).toBe("Not quite — try again.");
    expect(wrong.quizAttemptHandled).toBe(true);

    const right = handleTeachQuizAttempt(state, q.structureId);
    expect(right.state.quizFeedback).toBe("Correct!");
    expect(right.state.quizScore).toBe(1);
    expect(right.quizAttemptHandled).toBe(true);
  });

  it("routes structure select through quiz handler when active", () => {
    let state = startTeachQuiz(createInitialTeachState()).state;
    const q = ANATOMY_QUIZ_QUESTIONS[0];
    const result = handleTeachStructureSelect(state, q.structureId);
    expect(result.quizAttemptHandled).toBe(true);
    expect(result.state.quizScore).toBe(1);
  });

  it("completes quiz on last correct answer", () => {
    let state = startTeachQuiz(createInitialTeachState()).state;
    for (let i = 0; i < ANATOMY_QUIZ_QUESTIONS.length; i++) {
      const q = ANATOMY_QUIZ_QUESTIONS[i];
      const result = handleTeachQuizAttempt(state, q.structureId);
      state = result.state;
    }
    expect(state.mode).toBe("off");
    expect(state.quizFeedback).toMatch(/^Quiz complete/);
  });
});

describe("teach session — reset", () => {
  it("clears active tour or quiz", () => {
    const touring = startTeachTour(createInitialTeachState(), "usmle-heart-anatomy").state;
    expect(resetTeachSession()).toEqual(createInitialTeachState());
    expect(touring.mode).toBe("tour");
  });
});
