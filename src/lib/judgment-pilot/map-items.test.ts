import { describe, expect, it } from "vitest";
import { examQuestionToStudy, isAnswerCorrect } from "@/lib/questions/prepare";
import { bankItemToExamQuestion } from "@/lib/exam-prep/ngn-bank-bridge";
import {
  loadJudgmentItems,
  mapAllJudgmentItems,
} from "../../../scripts/data/judgment10-20261025/map-judgment-items";

describe("judgment10 item mapping", () => {
  const mapped = mapAllJudgmentItems(loadJudgmentItems());

  it("maps all 10 supported formats", () => {
    expect(mapped).toHaveLength(10);
    expect(new Set(mapped.map((m) => m.fieldId))).toEqual(new Set(["nursing", "pharmacy"]));
  });

  it("grades each mapped key without shuffling", () => {
    for (const row of mapped) {
      const exam = bankItemToExamQuestion(
        { ...row.bankItem, id: row.pilotId, subjectId: row.bankItem.subjectId },
        0
      );
      const study = examQuestionToStudy({ ...exam, field: row.fieldId }, 0, { shuffleOptions: false });
      expect(isAnswerCorrect(study, study.correctAnswers)).toBe(true);
    }
  });
});
