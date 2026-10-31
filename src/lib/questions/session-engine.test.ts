import { describe, expect, it } from "vitest";
import {
  advanceSession,
  createStudySession,
  flagUnansweredQuestion,
  recordSessionAnswer,
  summarizeSession,
} from "./session-engine";
import type { RawQuestionInput } from "./types";

const questions: RawQuestionInput[] = [
  {
    id: 1,
    type: "multiple_choice",
    question: "2 + 2 = ?",
    options: ["3", "4", "5", "6"],
    correctAnswer: "4",
    explanation: "Basic arithmetic.",
  },
  {
    id: 2,
    type: "multiple_choice",
    question: "Capital of France?",
    options: ["London", "Paris", "Berlin", "Madrid"],
    correctAnswer: "Paris",
    explanation: "Paris is the capital.",
  },
];

describe("createStudySession", () => {
  it("tracks answers and computes summary accuracy", () => {
    const { session, questions: prepared } = createStudySession({
      questions,
      field: "Math",
      sourceType: "bank",
      mode: "rapid",
      shuffleOrder: false,
    });

    const q0 = prepared[0];
    let state = recordSessionAnswer(session, q0, [q0.correctAnswers[0]], {
      durationMs: 1000,
    });
    expect(state.answers[q0.id]?.correct).toBe(true);

    state = advanceSession(state, 1);
    const q1 = prepared[1];
    state = recordSessionAnswer(state, q1, ["London"], { durationMs: 800 });
    expect(state.answers[q1.id]?.correct).toBe(false);

    const summary = summarizeSession(state, prepared);
    expect(summary.total).toBe(2);
    expect(summary.correct).toBe(1);
    expect(summary.accuracy).toBe(50);
  });

  it("keeps an unanswered question in the order and flags it", () => {
    const { session, questions: prepared } = createStudySession({
      questions,
      field: "Math",
      sourceType: "bank",
      mode: "practice",
      shuffleOrder: false,
    });
    const flagged = flagUnansweredQuestion(session, prepared[0]!.id);
    const next = advanceSession(flagged, 1);
    expect(next.order).toEqual(session.order);
    expect(next.currentIndex).toBe(1);
    expect(flagged.answers[prepared[0]!.id]).toMatchObject({
      revealed: false,
      unanswered: true,
    });
    expect(summarizeSession(next, prepared).answered).toBe(0);

    const checked = recordSessionAnswer(next, prepared[0]!, [prepared[0]!.correctAnswers[0]!]);
    expect(checked.answers[prepared[0]!.id]?.unanswered).toBe(false);
    expect(checked.answers[prepared[0]!.id]?.revealed).toBe(true);
  });
});
