import { describe, expect, it } from "vitest";
import { examQuestionToStudy, isAnswerCorrect } from "@/lib/questions/prepare";
import {
  parseStudySelectedAnswer,
  resolveAttemptCorrect,
  serializeStudySelectedAnswer,
} from "./attempt-selection";

describe("attempt selection integrity", () => {
  it("round-trips multi-select and matrix selections for storage", () => {
    const selectAll = examQuestionToStudy(
      {
        id: 1,
        type: "select_all",
        question: "Which findings matter?",
        options: ["Fever", "Warm skin", "Quiet room"],
        correctAnswer: "Fever|||Warm skin",
      },
      0,
      { shuffleOptions: false }
    );
    const picked = ["Fever", "Warm skin"];
    const stored = serializeStudySelectedAnswer(selectAll, picked);
    expect(stored).toBe("Fever|||Warm skin");
    expect(parseStudySelectedAnswer(selectAll, stored)).toEqual(picked);
    expect(isAnswerCorrect(selectAll, parseStudySelectedAnswer(selectAll, stored))).toBe(true);

    const matrix = examQuestionToStudy(
      {
        id: 2,
        type: "matrix",
        question: "Match findings.",
        options: ["Fever|||Yes", "Cough|||No"],
        correctAnswer: "Fever|||Yes;;Cough|||No",
      },
      0,
      { shuffleOptions: false }
    );
    const matrixPick = ["Fever|||Yes", "Cough|||No"];
    const matrixStored = serializeStudySelectedAnswer(matrix, matrixPick);
    expect(parseStudySelectedAnswer(matrix, matrixStored)).toEqual(matrixPick);
    expect(isAnswerCorrect(matrix, parseStudySelectedAnswer(matrix, matrixStored))).toBe(true);
  });

  it("recovers legacy comma-joined select-all attempts", () => {
    const study = examQuestionToStudy(
      {
        id: 3,
        type: "select_all",
        question: "Select all that apply.",
        options: ["Alpha", "Beta", "Gamma"],
        correctAnswer: "Alpha|||Gamma",
      },
      0,
      { shuffleOptions: false }
    );
    const legacy = "Alpha, Gamma";
    expect(parseStudySelectedAnswer(study, legacy)).toEqual(["Alpha", "Gamma"]);
    expect(resolveAttemptCorrect(study, legacy, false)).toBe(true);
  });

  it("prefers the stored key over a tampered client correct flag", () => {
    const study = examQuestionToStudy(
      {
        id: 4,
        type: "multiple_choice",
        question: "Pick one.",
        options: ["Right", "Wrong"],
        correctAnswer: "Right",
      },
      0,
      { shuffleOptions: false }
    );
    expect(resolveAttemptCorrect(study, "Wrong", true)).toBe(false);
    expect(resolveAttemptCorrect(study, "Right", false)).toBe(true);
  });
});
