import { describe, expect, it } from "vitest";
import { mergeExamAnswers } from "@/lib/exam-sessions/scoring";
import type { ExamAnswerRecord } from "@/lib/exam-sessions/service";

function row(index: number, selected: string, persistSeq?: number): ExamAnswerRecord {
  return {
    questionIndex: index,
    selected,
    correct: false,
    answeredAt: "2026-10-22T00:00:00.000Z",
    persistSeq,
  };
}

describe("exam answer autosave ordering", () => {
  it("keeps the newest autosave when an older PATCH finishes last", () => {
    let log = mergeExamAnswers([], row(3, "Option B", 2));
    log = mergeExamAnswers(log, row(3, "Option C", 3));
    log = mergeExamAnswers(log, row(3, "Option A", 1));
    expect(log).toHaveLength(1);
    expect(log[0]?.selected).toBe("Option C");
  });
});
