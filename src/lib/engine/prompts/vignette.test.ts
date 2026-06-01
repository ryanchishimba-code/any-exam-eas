import { describe, expect, it } from "vitest";
import type { ExamQuestion } from "../../ai";
import {
  isVignetteRich,
  scoreVignetteRichness,
  splitCombinedStem,
  vignetteHasEtiologyClues,
  vignetteHasHistoryClues,
} from "./vignette";

describe("clinical vignette rules", () => {
  it("detects rich vignettes with history and etiology", () => {
    const v =
      "A 68-year-old client with long-standing type 2 diabetes is admitted to med-surg after starting lisinopril 3 days ago. BP 168/94, reports dry cough and dizziness. Cr 1.8 mg/dL (baseline 1.1).";
    expect(isVignetteRich(v)).toBe(true);
    expect(vignetteHasHistoryClues(v)).toBe(true);
    expect(vignetteHasEtiologyClues(v)).toBe(true);
  });

  it("splits combined stem into vignette and lead-in", () => {
    const q: ExamQuestion = {
      id: 1,
      type: "multiple_choice",
      question:
        "A 45-year-old client reports chest pressure and diaphoresis for 2 hours. BP 92/58, HR 118. History of hypertension.\n\nWhich action should the nurse take first?",
      options: ["A", "B", "C", "D"],
      correctAnswer: "A",
      explanation: "Unstable perfusion requires immediate intervention.",
    };
    const split = splitCombinedStem(q);
    expect(split.vignette).toContain("45-year-old");
    expect(split.question).toMatch(/Which action/);
  });

  it("scores higher when vignette field is present and rich", () => {
    const withVignette: ExamQuestion = {
      id: 1,
      type: "multiple_choice",
      vignette:
        "A 30-year-old client, 2 days post-appendectomy, reports abdominal pain and fever 101.8°F. WBC 14,000; wound erythematous with purulent drainage.",
      question: "Which finding requires immediate follow-up?",
      options: ["A", "B", "C", "D"],
      correctAnswer: "A",
      explanation: "Purulent drainage suggests surgical site infection.",
    };
    const without: ExamQuestion = { ...withVignette, vignette: undefined };
    expect(scoreVignetteRichness(withVignette)).toBeGreaterThan(scoreVignetteRichness(without));
  });
});
