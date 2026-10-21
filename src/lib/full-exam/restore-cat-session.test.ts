import { describe, expect, it } from "vitest";
import { restoreCatSessionFromAnswers } from "./restore-cat-session";
import type { StudyQuestion } from "@/lib/questions/types";
import type { ExamAnswerRecord } from "@/lib/exam-sessions/service";

function q(id: string, difficulty = 0.5): StudyQuestion {
  return {
    id,
    bankItemId: id,
    sourceIndex: 0,
    type: "multiple_choice",
    stem: `Question ${id}`,
    options: ["A", "B"],
    correctAnswers: ["A"],
    explanation: "A",
    difficulty,
  } as StudyQuestion;
}

describe("restoreCatSessionFromAnswers", () => {
  it("rebuilds served items and CAT state from persisted answers", () => {
    const pool = [q("a"), q("b"), q("c")];
    const records: ExamAnswerRecord[] = [
      {
        questionIndex: 0,
        questionId: "a",
        selected: "A",
        correct: true,
        answeredAt: "2026-10-21T00:00:00.000Z",
      },
      {
        questionIndex: 1,
        questionId: "b",
        selected: "B",
        correct: false,
        answeredAt: "2026-10-21T00:01:00.000Z",
      },
    ];

    const restored = restoreCatSessionFromAnswers({
      pool,
      records,
      bandForQuestion: () => "medium",
    });

    expect(restored?.questions.map((item) => item.id)).toEqual(["a", "b"]);
    expect(restored?.committed).toBe(2);
    expect(restored?.index).toBe(1);
    expect(restored?.serverCorrect[0]).toBe(true);
    expect(restored?.serverCorrect[1]).toBe(false);
  });
});
