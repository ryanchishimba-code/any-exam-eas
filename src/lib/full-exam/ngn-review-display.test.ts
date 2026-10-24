import { describe, expect, it } from "vitest";
import {
  formatAnswerDisplay,
  ngnReviewLines,
  shouldUseNgnReviewDisplay,
} from "./ngn-review-display";

describe("ngn-review-display", () => {
  it("formats matrix keys with arrows instead of ||| blobs", () => {
    const stored = '["Fever|||Yes","Cough|||No"]';
    expect(formatAnswerDisplay(stored, "matrix")).toBe("Fever → Yes; Cough → No");
  });

  it("builds per-row your vs correct lines for matrix review", () => {
    const lines = ngnReviewLines({
      ngnFormat: "matrix",
      selected: '["Fever|||Yes","Cough|||Yes"]',
      correctAnswer: "Fever|||Yes;;Cough|||No",
    });
    expect(lines).toEqual([
      {
        label: "Fever",
        yourText: "Fever → Yes",
        correctText: "Fever → Yes",
        match: true,
      },
      {
        label: "Cough",
        yourText: "Cough → Yes",
        correctText: "Cough → No",
        match: false,
      },
    ]);
  });

  it("formats drag-drop pairs readably", () => {
    expect(
      formatAnswerDisplay("Hypoxia|||Give oxygen|||Sepsis|||Start fluids", "drag_drop")
    ).toContain("Hypoxia → Give oxygen");
  });

  it("detects legacy matrix answers joined only with |||", () => {
    expect(
      shouldUseNgnReviewDisplay({
        ngnFormat: undefined,
        optionsLength: 4,
        selected: "Fever|||Yes|||Cough|||No",
        correctAnswer: "Fever|||Yes;;;",
      })
    ).toBe(true);
  });
});
