import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import {
  alignNaplexBankItemAnswers,
  correctAnswerMatchesOption,
  explanationCorrectMismatch,
  extractExplanationCorrectText,
} from "./naplex-answer-align";
import { auditNaplexBankItem } from "./naplex-bank-audit";

describe("naplex-answer-align", () => {
  it("matches options after stripping letter prefixes", () => {
    expect(
      correctAnswerMatchesOption(
        ["A) Monitor potassium", "B) Skip labs", "C) INR daily", "D) No monitoring"],
        "Monitor potassium"
      )
    ).toBe(true);
  });

  it("canonicalizes correctAnswer to stored option text", () => {
    const item: BankItem = {
      subjectId: "pharmacology",
      question: "Which action is most appropriate?",
      options: [
        "Recheck serum potassium in 1 week",
        "Discontinue all antihypertensives",
        "Obtain INR daily",
        "No monitoring required",
      ],
      correctAnswer: "recheck serum potassium in 1 week",
      explanation: "Correct: Recheck serum potassium in 1 week. ACE inhibitors require electrolyte monitoring.",
    };
    const { item: fixed, changed } = alignNaplexBankItemAnswers(item);
    expect(changed).toBe(true);
    expect(fixed.correctAnswer).toBe("Recheck serum potassium in 1 week");
    expect(correctAnswerMatchesOption(fixed.options, fixed.correctAnswer)).toBe(true);
  });

  it("aligns correctAnswer from explanation Correct: line", () => {
    const item: BankItem = {
      subjectId: "pharmacology",
      question: "Which counseling is priority?",
      options: [
        "Take with food to reduce GI upset",
        "Stop if pregnant",
        "Double dose if a dose is missed",
        "Crush extended-release tablets",
      ],
      correctAnswer: "Wrong stored key",
      explanation:
        "Correct: Take with food to reduce GI upset. Metformin commonly causes GI side effects.",
    };
    const { item: fixed, changed } = alignNaplexBankItemAnswers(item);
    expect(changed).toBe(true);
    expect(fixed.correctAnswer).toBe("Take with food to reduce GI upset");
  });

  it("detects explanation vs stored correct mismatch", () => {
    const item: BankItem = {
      subjectId: "pharmacology",
      question: "Which is best?",
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctAnswer: "Option A",
      explanation: "Correct: Option B. Because B addresses the root cause.",
    };
    expect(extractExplanationCorrectText(item.explanation)).toBe("Option B");
    expect(explanationCorrectMismatch(item)).toBe(true);
    expect(auditNaplexBankItem(item).issues.some((i) => i.code === "explanation_correct_mismatch")).toBe(
      true
    );
  });

  it("infers correct from distractor rationales when only one option lacks rationale", () => {
    const item: BankItem = {
      subjectId: "pharmacology",
      question: "Which action?",
      options: ["Hold metformin", "Increase insulin", "Add sulfonylurea", "No change"],
      correctAnswer: "hold metformin",
      distractorRationale: {
        "Increase insulin": "Not first-line for this scenario.",
        "Add sulfonylurea": "Would increase hypoglycemia risk.",
        "No change": "Ignores contraindication.",
      },
      explanation: "Hold metformin when eGFR is below 30.",
    };
    const { item: fixed, changed } = alignNaplexBankItemAnswers(item);
    expect(changed).toBe(true);
    expect(fixed.correctAnswer).toBe("Hold metformin");
  });

  it("reclassifies mislabeled select_all when answer is a single option containing commas", () => {
    const longOption =
      "Counsel on adherence, expected benefits, monitoring, and when to call the pharmacist";
    const item: BankItem = {
      subjectId: "patient-counseling",
      itemType: "select_all",
      question: "Which counseling approach is most appropriate?",
      options: [
        longOption,
        "Encourage sharing unused tablets with family members",
        "Advise stopping without calling anyone",
        "State that no monitoring is required",
      ],
      correctAnswer: longOption,
      explanation: `Correct: ${longOption}. Allopurinol requires counseling on adherence and monitoring.`,
    };
    const { item: fixed, changed } = alignNaplexBankItemAnswers(item);
    expect(changed).toBe(true);
    expect(fixed.itemType).toBe("mcq");
    expect(correctAnswerMatchesOption(fixed.options, fixed.correctAnswer, fixed.itemType)).toBe(true);
  });
});
