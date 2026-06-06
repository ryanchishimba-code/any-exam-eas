import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import {
  assignMpjeDifficulty,
  orderMpjeExamQuestions,
} from "./build-practice-exam";
import { MPJE_PRACTICE_EXAM_PRETEST_COUNT } from "./practice-exam-config";

function item(subjectId: string, n: number): BankItem {
  return {
    subjectId,
    question: `${subjectId} question ${n}`,
    options: ["A", "B", "C", "D"],
    correctAnswer: "A",
    explanation: "Because law.",
  };
}

describe("orderMpjeExamQuestions", () => {
  it("returns 120 questions with last 20 marked pretest", () => {
    const pool: BankItem[] = [];
    for (let i = 0; i < 150; i++) {
      pool.push(item("controlled-substances", i));
    }
    const ordered = orderMpjeExamQuestions(pool, 120);
    expect(ordered).toHaveLength(120);
    const pretest = ordered.filter((q) => q.isPretest);
    expect(pretest).toHaveLength(MPJE_PRACTICE_EXAM_PRETEST_COUNT);
  });

  it("places easier subjects before harder ones on average", () => {
    const pool = [
      ...Array.from({ length: 20 }, (_, i) => item("pharmacy-ethics", i)),
      ...Array.from({ length: 20 }, (_, i) => item("state-practice-act", i)),
    ];
    const ordered = orderMpjeExamQuestions(pool, 40);
    const firstHalf = ordered.slice(0, 20);
    const easyInFirst = firstHalf.filter((q) => q.difficulty === "easy").length;
    expect(easyInFirst).toBeGreaterThan(0);
  });
});

describe("assignMpjeDifficulty", () => {
  it("marks ethics as easy and controlled substances as hard", () => {
    expect(assignMpjeDifficulty("pharmacy-ethics")).toBe("easy");
    expect(assignMpjeDifficulty("controlled-substances")).toBe("hard");
  });
});
