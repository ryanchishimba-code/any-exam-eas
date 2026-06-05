import { describe, expect, it } from "vitest";
import type { ExamQuestion } from "@/lib/ai";
import {
  ensureClinicalVignette,
  hasOrphanDeicticStem,
  normalizeLeadInStem,
  splitCombinedStem,
  validateClinicalVignette,
} from "./vignette";

const richVignette =
  "A 58-year-old man presents to the emergency department with crushing chest pain for 45 minutes. " +
  "He has hypertension and smokes 1 pack per day. BP 158/94, HR 102, diaphoretic. " +
  "ECG shows ST elevation in leads II, III, aVF. Troponin is elevated.";

function baseQuestion(overrides: Partial<ExamQuestion>): ExamQuestion {
  return {
    id: 1,
    type: "multiple_choice",
    question: "Which pathophysiologic process is most likely responsible for these findings?",
    options: ["A", "B", "C", "D"],
    correctAnswer: "A",
    explanation: "Test",
    ...overrides,
  };
}

describe("vignette quality", () => {
  it("flags orphan deictic stems without vignette", () => {
    expect(hasOrphanDeicticStem(baseQuestion({}))).toBe(true);
  });

  it("accepts pathophys stem when vignette is rich", () => {
    const q = baseQuestion({
      vignette: richVignette,
      question:
        "Which pathophysiologic process is most likely responsible for this patient's presentation?",
    });
    expect(hasOrphanDeicticStem(q)).toBe(false);
  });

  it("normalizes dangling 'these findings' stems", () => {
    expect(normalizeLeadInStem("Which process explains these findings?")).toContain(
      "this patient's presentation"
    );
  });

  it("splits combined vignette and lead-in", () => {
    const combined = `${richVignette}\n\nWhat is the most likely diagnosis?`;
    const split = splitCombinedStem(baseQuestion({ question: combined }));
    expect(split.vignette).toContain("58-year-old");
    expect(split.question).toMatch(/most likely diagnosis/i);
  });

  it("repairs orphan stems via ensureClinicalVignette", () => {
    const repaired = ensureClinicalVignette(baseQuestion({}));
    expect(repaired.question).not.toMatch(/these findings/i);
  });

  it("validates missing vignette", () => {
    const issues = validateClinicalVignette(baseQuestion({}));
    expect(issues.some((i) => i.includes("Missing vignette"))).toBe(true);
  });
});
