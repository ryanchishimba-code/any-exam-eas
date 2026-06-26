import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import { validateClinicalVignette, vignetteHasHistoryClues } from "@/lib/engine/prompts/vignette";
import {
  expandPipeDelimitedVignette,
  fixUsmleEditorialGaps,
  splitUsmleCombinedQuestion,
} from "./usmle-editorial-gap-fixes";

describe("expandPipeDelimitedVignette", () => {
  it("expands pipe-delimited chart strings", () => {
    const item: BankItem = {
      subjectId: "pathology",
      scenario: "Bone marrow | 70 y/o | Pancytopenia | Hypocellular marrow with fat replacement",
      question: "What is the most likely diagnosis?",
      options: ["Aplastic anemia", "AML", "MM", "Iron deficiency"],
      correctAnswer: "Aplastic anemia",
      explanation: "Marrow failure pattern.",
      tags: [],
    };

    const fixed = expandPipeDelimitedVignette(item);
    expect(fixed?.vignette).toContain("70-year-old");
    expect(fixed?.vignette).toContain("Pancytopenia");
  });
});

describe("splitUsmleCombinedQuestion", () => {
  it("splits embedded clinical text from the question column", () => {
    const item: BankItem = {
      subjectId: "anatomy",
      question:
        "A 19-year-old linebacker is tackled with his neck laterally flexed and shoulder depressed. He has right arm weakness and loss of pain/temperature on the left arm. Which pattern best explains these findings?",
      options: ["Brown-Séquard", "Central cord", "Anterior cord", "Cauda equina"],
      correctAnswer: "Brown-Séquard",
      explanation: "Hemisection pattern.",
      tags: [],
    };

    const fixed = splitUsmleCombinedQuestion(item);
    expect(fixed?.vignette).toContain("19-year-old");
    expect(fixed?.question).toContain("this patient's presentation");
  });
});

describe("fixUsmleEditorialGaps", () => {
  it("passes history validation for standard ED presentation vignettes", () => {
    const vignette =
      "A 47-year-old man presents to the emergency department with severe epigastric pain radiating to the back after heavy alcohol use.";
    expect(vignetteHasHistoryClues(vignette)).toBe(true);

    const item: BankItem = {
      subjectId: "pharmacology",
      vignette,
      question: "Which mechanism of action best explains the therapeutic effect?",
      options: ["A", "B", "C", "D"],
      correctAnswer: "A",
      explanation: "Mechanism explanation with enough length to satisfy editorial review for testing purposes here.",
      tags: [],
    };

    const issues = validateClinicalVignette({
      id: 1,
      type: "multiple_choice",
      vignette,
      question: item.question,
      options: item.options,
      correctAnswer: item.correctAnswer,
      explanation: item.explanation,
    });
    expect(issues.some((issue) => issue.includes("pertinent patient history"))).toBe(false);

    const { item: fixed } = fixUsmleEditorialGaps(item);
    expect(fixed.question.endsWith("?")).toBe(true);
  });
});
