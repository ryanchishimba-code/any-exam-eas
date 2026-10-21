import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  gradeExamAnswerRecordsWithDetails,
  gradeStudySelection,
  selectionForGrading,
  storedAnswerDetailFromStudy,
  weakAreasFromGradedAnswers,
} from "./grade-stored-answer";
import type { ExamAnswerRecord } from "@/lib/exam-sessions/service";

vi.mock("@/lib/questions/reveal-stored-item", () => ({
  loadStoredStudyQuestionsBatch: vi.fn(),
  loadStoredStudyQuestion: vi.fn(),
}));

import { loadStoredStudyQuestionsBatch } from "@/lib/questions/reveal-stored-item";
import type { StudyQuestion } from "@/lib/questions/types";

function study(partial: Partial<StudyQuestion> & Pick<StudyQuestion, "type" | "correctAnswers">): StudyQuestion {
  return {
    id: "q1",
    sourceIndex: 0,
    stem: "Which finding matters?",
    options: ["Alpha", "Beta", "Gamma"],
    explanation: "Alpha matches the chart.",
    ...partial,
  } as StudyQuestion;
}

describe("gradeStudySelection", () => {
  it("uses the stored key and ignores a client correct flag", () => {
    const item = study({ type: "multiple_choice", correctAnswers: ["Alpha"] });
    expect(gradeStudySelection(item, "Alpha")).toBe(true);
    expect(gradeStudySelection(item, "Beta")).toBe(false);
  });

  it("scores a select-all set from the stored choices", () => {
    const item = study({
      type: "select_all",
      correctAnswers: ["Alpha", "Gamma"],
    });
    expect(gradeStudySelection(item, "Gamma|||Alpha")).toBe(true);
    expect(gradeStudySelection(item, "Alpha")).toBe(false);
  });

  it("splits matrix cells that were joined with ;;", () => {
    const item = study({
      type: "matrix",
      correctAnswers: ["Fever|||Yes", "Cough|||No"],
    });
    expect(selectionForGrading("matrix", "Fever|||Yes;;Cough|||No")).toEqual([
      "Fever|||Yes",
      "Cough|||No",
    ]);
    expect(gradeStudySelection(item, "Fever|||Yes;;Cough|||No")).toBe(true);
    expect(gradeStudySelection(item, "Fever|||No;;Cough|||No")).toBe(false);
  });

  it("pairs a legacy matrix log that was joined only with |||", () => {
    expect(selectionForGrading("matrix", "Fever|||Yes|||Cough|||No")).toEqual([
      "Fever|||Yes",
      "Cough|||No",
    ]);
  });

  it("grades NAPLEX numeric entry when the study row was typed as multiple_choice", () => {
    const item = study({
      type: "multiple_choice",
      options: [],
      stem: "How many mL per hour should the IV run?",
      correctAnswers: ["250"],
    });
    expect(gradeStudySelection(item, "250")).toBe(true);
    expect(gradeStudySelection(item, "250 mL/hr")).toBe(true);
    expect(gradeStudySelection(item, "9.20")).toBe(false);
  });
});

describe("gradeExamAnswerRecordsWithDetails", () => {
  beforeEach(() => {
    vi.mocked(loadStoredStudyQuestionsBatch).mockReset();
  });

  it("grades every record with one batch load", async () => {
    const item = study({ type: "multiple_choice", correctAnswers: ["Alpha"] });
    vi.mocked(loadStoredStudyQuestionsBatch).mockResolvedValue(new Map([["bank-1", item]]));

    const records: ExamAnswerRecord[] = Array.from({ length: 5 }, (_, i) => ({
      questionIndex: i,
      questionId: "bank-1",
      selected: i % 2 === 0 ? "Alpha" : "Beta",
      correct: false,
      answeredAt: "2026-10-21T00:00:00.000Z",
    }));

    const { graded, detailsByQuestionId } = await gradeExamAnswerRecordsWithDetails(records);
    expect(loadStoredStudyQuestionsBatch).toHaveBeenCalledTimes(1);
    expect(graded.filter((r) => r.correct).length).toBe(3);
    expect(detailsByQuestionId.get("bank-1")?.correctAnswer).toBe(
      storedAnswerDetailFromStudy(item, "Alpha").correctAnswer
    );
  });
});

describe("weakAreasFromGradedAnswers", () => {
  it("counts misses from the server grade", () => {
    expect(
      weakAreasFromGradedAnswers([
        {
          questionIndex: 0,
          selected: "Beta",
          correct: false,
          topicCategory: "Safety",
          answeredAt: "2026-10-10T00:00:00.000Z",
        },
        {
          questionIndex: 1,
          selected: "Alpha",
          correct: true,
          topicCategory: "Safety",
          answeredAt: "2026-10-10T00:00:00.000Z",
        },
      ])
    ).toEqual([{ topic: "Safety", weight: 1 }]);
  });
});
