import { describe, expect, it } from "vitest";
import { normalizeQuestionFromAi } from "./normalize-ai-output";

describe("normalizeQuestionFromAi", () => {
  it("converts object options to strings and correctAnswer", () => {
    const q = normalizeQuestionFromAi({
      id: 1,
      type: "multiple_choice",
      question: "Which organelle produces ATP?",
      options: [
        { text: "Mitochondria", isCorrect: true },
        { text: "Ribosome", isCorrect: false },
        { text: "Golgi apparatus", isCorrect: false },
        { text: "Lysosome", isCorrect: false },
      ] as unknown as string[],
      correctAnswer: "",
      explanation: "Mitochondria are the site of oxidative phosphorylation.",
    });
    expect(q.options).toEqual([
      "Mitochondria",
      "Ribosome",
      "Golgi apparatus",
      "Lysosome",
    ]);
    expect(q.correctAnswer).toBe("Mitochondria");
  });
});
