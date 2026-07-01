import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import {
  candidateViolatesExamRules,
  resolveExamUniquenessPolicy,
} from "./exam-similarity";

function item(id: string, topic: string, question: string, options: string[]): BankItem {
  return {
    id,
    subjectId: "geriatrics",
    blueprintTopic: topic,
    blueprintDomain: "assess",
    question,
    options,
    correctAnswer: options[0]!,
    explanation: "Board-style rationale with enough clinical teaching detail for review.",
  };
}

describe("resolveExamUniquenessPolicy", () => {
  it("allows 2 per concept for 135-Q exams when pool has enough topics", () => {
    const pool = Array.from({ length: 200 }, (_, i) =>
      item(`q-${i}`, `topic-${i % 100}`, `Unique vignette ${i} with clinical detail.`, [
        `A-${i}`,
        `B-${i}`,
        `C-${i}`,
        `D-${i}`,
      ])
    );
    const policy = resolveExamUniquenessPolicy(135, pool);
    expect(policy.maxPerConcept).toBeGreaterThanOrEqual(2);
    expect(policy.blockOptionOverlapInSelection).toBe(true);
  });

  it("still blocks duplicate clinical cases under relaxed policy", () => {
    const policy = resolveExamUniquenessPolicy(135, []);
    const shared = "Same vignette text with enough detail for case separation.";
    const a = item("a", "dementia", `${shared}\nWhat is the best next step?`, [
      "Donepezil",
      "B",
      "C",
      "D",
    ]);
    const b = item("b", "dementia", `${shared}\nWhat is the best next step?`, [
      "Memantine",
      "B",
      "C",
      "D",
    ]);
    expect(candidateViolatesExamRules(b, [a], policy)).toBe(true);
  });
});
