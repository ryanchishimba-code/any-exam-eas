import { describe, expect, it } from "vitest";
import {
  gradeNumericAnswer,
  numericGradeRule,
  parseNumericEntry,
} from "./numeric-grade";
import { isAnswerCorrect } from "./prepare";
import type { StudyQuestion } from "./types";

function numericQuestion(stem: string, key: string, type: StudyQuestion["type"] = "short_answer"): StudyQuestion {
  return {
    id: "n1",
    sourceIndex: 0,
    type,
    stem,
    options: [],
    correctAnswers: [key],
    explanation: "",
  };
}

describe("parseNumericEntry", () => {
  it("parses a fraction instead of concatenating the digits", () => {
    expect(parseNumericEntry("1/2")).toBe(0.5);
    expect(parseNumericEntry("1/2 mL")).toBe(0.5);
    expect(parseNumericEntry("1 1/2")).toBe(1.5);
    expect(parseNumericEntry("12")).toBe(12);
  });

  it("rejects a slash that is not one fraction", () => {
    expect(parseNumericEntry("1/2/3")).toBeNull();
    expect(parseNumericEntry("1/0")).toBeNull();
    expect(parseNumericEntry("1/")).toBeNull();
  });

  it("keeps a unit slash out of the number", () => {
    expect(parseNumericEntry("1000 mg/day")).toBe(1000);
    expect(parseNumericEntry("10 mL/hr")).toBe(10);
    expect(parseNumericEntry("1,250")).toBe(1250);
    expect(parseNumericEntry("8.0 units")).toBe(8);
  });
});

describe("numericGradeRule", () => {
  it("reads the item rounding instruction", () => {
    expect(numericGradeRule("Round to the nearest whole number.")).toEqual({ kind: "round", places: 0 });
    expect(numericGradeRule("Round to nearest whole mg.")).toEqual({ kind: "round", places: 0 });
    expect(numericGradeRule("Round to one decimal.")).toEqual({ kind: "round", places: 1 });
    expect(numericGradeRule("Round to the nearest tenth.")).toEqual({ kind: "round", places: 1 });
    expect(numericGradeRule("Round to two decimal places.")).toEqual({ kind: "round", places: 2 });
    expect(numericGradeRule("What is the dose?")).toEqual({ kind: "exact" });
  });
});

describe("gradeNumericAnswer", () => {
  it("does not treat 9.25 as 9.2 unless the item's rounding says so", () => {
    expect(gradeNumericAnswer("9.25", "9.2", "What is the rate?")).toBe(false);
    expect(gradeNumericAnswer("9.2", "9.20", "What is the rate?")).toBe(true);
    expect(gradeNumericAnswer("9.25", "9.2", "Round to one decimal place.")).toBe(false);
    expect(gradeNumericAnswer("9.24", "9.2", "Round to one decimal place.")).toBe(true);
    expect(gradeNumericAnswer("9.4", "9", "Round to the nearest whole number.")).toBe(true);
    expect(gradeNumericAnswer("9.6", "9", "Round to the nearest whole number.")).toBe(false);
  });

  it("scores a fraction against the key value", () => {
    expect(gradeNumericAnswer("1/2", "0.5", "What fraction of the tablet?")).toBe(true);
    expect(gradeNumericAnswer("1/2", "12", "What fraction of the tablet?")).toBe(false);
  });

  it("accepts an inclusive stored range", () => {
    expect(gradeNumericAnswer("1700", "1600-1800 mg", "Calculate the dose.")).toBe(true);
    expect(gradeNumericAnswer("1500", "1600-1800 mg", "Calculate the dose.")).toBe(false);
  });
});

describe("isAnswerCorrect numeric agreement", () => {
  it("uses the shared grader for scoring", () => {
    const exact = numericQuestion("What is the infusion rate?", "9.2");
    expect(isAnswerCorrect(exact, ["9.25"])).toBe(false);
    expect(isAnswerCorrect(exact, ["9.2 mL"])).toBe(true);
    expect(isAnswerCorrect(exact, ["1/2"])).toBe(false);

    const tenth = numericQuestion("What is the infusion rate? Round to one decimal place.", "9.2");
    expect(isAnswerCorrect(tenth, ["9.25"])).toBe(false);
    expect(isAnswerCorrect(tenth, ["9.24"])).toBe(true);

    const half = numericQuestion("What fraction of the tablet remains?", "0.5");
    expect(isAnswerCorrect(half, ["1/2"])).toBe(true);
    expect(isAnswerCorrect(numericQuestion("Enter the count.", "12"), ["1/2"])).toBe(false);

    const insulin = numericQuestion(
      "Total rapid-acting insulin units for correction plus meal? (Round to one decimal.)",
      "8.0"
    );
    expect(isAnswerCorrect(insulin, ["8.0 units"])).toBe(true);
  });

  it("scores both boxes with the same rounding rule", () => {
    const q = numericQuestion(
      "Calculate the total daily dose in milligrams and the volume of each dose in milliliters. Round to the nearest whole number.",
      "1000 mg/day; 10 mL per dose"
    );
    expect(isAnswerCorrect(q, ["1000.4|||10.4"])).toBe(true);
    expect(isAnswerCorrect(q, ["1000|||9.2"])).toBe(false);
    expect(isAnswerCorrect(q, ["1/2|||10"])).toBe(false);
  });

  it("grades calculation items with the same rule", () => {
    const q = numericQuestion("Round to the nearest whole number.", "30", "calculation");
    expect(isAnswerCorrect(q, ["30.4"])).toBe(true);
    expect(isAnswerCorrect(q, ["29.4"])).toBe(false);
  });
});
