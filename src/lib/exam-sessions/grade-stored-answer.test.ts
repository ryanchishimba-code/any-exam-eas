import { describe, expect, it } from "vitest";
import { gradeStudySelection, selectionForGrading, weakAreasFromGradedAnswers } from "./grade-stored-answer";
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
