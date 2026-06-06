import { describe, expect, it } from "vitest";
import { examQuestionToStudy, prepareQuestionsForSession } from "./prepare";
import {
  buildQuestionBlocks,
  getSequentialSetContext,
  shufflePreservingSequentialSets,
} from "./sequential-sets";
import type { RawQuestionInput, StudyQuestion } from "./types";

function seqRaw(
  setId: string,
  step: number,
  total: number,
  stem: string
): RawQuestionInput {
  return {
    id: `${setId}-${step}`,
    type: "multiple_choice",
    question: stem,
    options: ["A", "B", "C", "D"],
    correctAnswer: "A",
    explanation: "x",
    ngnFormat: "sequential",
    ngnPayload: { kind: "sequential", setId, stepIndex: step, totalSteps: total },
    vignette: "Shared vignette text",
  };
}

describe("shufflePreservingSequentialSets", () => {
  it("keeps sequential set members adjacent in step order", () => {
    const raw = [
      seqRaw("set-a", 1, 2, "Q1"),
      { id: "solo", type: "multiple_choice", question: "Solo?", options: ["A", "B", "C", "D"], correctAnswer: "A", explanation: "" },
      seqRaw("set-a", 2, 2, "Q2"),
      seqRaw("set-b", 1, 2, "B1"),
      seqRaw("set-b", 2, 2, "B2"),
    ];
    const prepared = prepareQuestionsForSession(raw, { shuffleOrder: false });

    for (let trial = 0; trial < 40; trial++) {
      const shuffled = shufflePreservingSequentialSets(prepared);
      const blocks = buildQuestionBlocks(shuffled);
      const setABlock = blocks.find((b) =>
        b.some((q) => (q.ngnPayload as { setId?: string })?.setId === "set-a")
      );
      expect(setABlock).toHaveLength(2);
      expect((setABlock![0].ngnPayload as { stepIndex?: number }).stepIndex).toBe(1);
      expect((setABlock![1].ngnPayload as { stepIndex?: number }).stepIndex).toBe(2);
    }
  });

  it("is used by prepareQuestionsForSession when shuffleOrder is true", () => {
    const raw = [seqRaw("set-x", 1, 2, "One"), seqRaw("set-x", 2, 2, "Two")];
    const shuffled = prepareQuestionsForSession(raw, { shuffleOrder: true });
    expect((shuffled[0].ngnPayload as { stepIndex?: number }).stepIndex).toBe(1);
    expect((shuffled[1].ngnPayload as { stepIndex?: number }).stepIndex).toBe(2);
  });
});

describe("getSequentialSetContext", () => {
  it("flags unanswered prior step in a set", () => {
    const q1 = examQuestionToStudy(seqRaw("set-z", 1, 2, "First"), 0);
    const q2 = examQuestionToStudy(seqRaw("set-z", 2, 2, "Second"), 1);
    const list: StudyQuestion[] = [q1, q2];
    const ctx = getSequentialSetContext(q2, list, {});
    expect(ctx?.priorStepUnanswered).toBe(true);
    expect(ctx?.stepIndex).toBe(2);
    expect(ctx?.vignette).toBe("Shared vignette text");
  });
});
