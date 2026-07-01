import { describe, expect, it } from "vitest";
import { resolveFieldIds } from "./exam-config";
import { runHeuristicPrefilter } from "./heuristic-prefilter";
import { parseLlmResponse } from "./llm-provider";
import { serializeBankRowForQa } from "./serialize-item";
import {
  stemIsSelfContainedCalc,
  isGenericBlueprintCalcStem,
} from "@/lib/exam-prep/naplex-format-coherence";
import type { BankItem } from "@/lib/question-bank";

describe("qa-scan exam-config", () => {
  it("maps naplex to pharmacy field", () => {
    expect(resolveFieldIds("naplex")).toEqual(["pharmacy"]);
  });

  it("maps usmle to three step fields", () => {
    expect(resolveFieldIds("usmle")).toHaveLength(3);
  });
});

describe("qa-scan calc stem helpers", () => {
  it("detects self-contained tablet dispense stems", () => {
    expect(
      stemIsSelfContainedCalc(
        "How many tablets of ezetimibe should be dispensed for a 30-day supply at a dose of 10 mg daily?"
      )
    ).toBe(true);
  });

  it("rejects bare generic volume stem", () => {
    expect(isGenericBlueprintCalcStem("What is the total volume in mL?")).toBe(true);
    expect(stemIsSelfContainedCalc("What is the total volume in mL?")).toBe(false);
  });
});

describe("qa-scan serialize", () => {
  it("includes format notes for constructed response", () => {
    const row = {
      id: "test-id",
      fieldId: "pharmacy",
      subjectId: "compounding-calculations",
      itemType: "constructed_response",
      question: "Calculate the dose in mg.",
      options: JSON.stringify({ kind: "constructed", unit: "mg", options: [] }),
      correctAnswer: "500",
      explanation: "Explanation text here with enough length for audit.",
      scenario: "Order: 250 mg in 500 mL D5W",
      tags: JSON.stringify(["case-calculation"]),
    };
    const item: BankItem = {
      subjectId: "compounding-calculations",
      question: row.question,
      scenario: row.scenario,
      options: [],
      correctAnswer: "500",
      explanation: row.explanation,
      itemType: "constructed_response",
      ngnPayload: { kind: "constructed", unit: "mg" },
    };
    const serialized = serializeBankRowForQa(row, item);
    expect(serialized.formatNotes.some((n) => n.includes("constructed response"))).toBe(true);
    expect(serialized.vignette).toContain("250 mg");
  });
});

describe("qa-scan heuristic prefilter", () => {
  it("flags MCQ with missing correct option", () => {
    const item: BankItem = {
      subjectId: "cardiovascular-rx",
      vignette: "A 55-year-old man with chest pain and diaphoresis. BP 90/60, HR 110.",
      question: "What is the most appropriate next step?",
      options: ["Option A text here", "Option B text here", "Option C text here", "Option D text here"],
      correctAnswer: "Not an option",
      explanation:
        "Correct answer should match an option. This explanation is long enough to pass minimum length checks for most gates.",
    };
    const result = runHeuristicPrefilter(item, "pharmacy", "ai-curated");
    expect(result.ok).toBe(false);
    expect(result.issues.some((i) => i.code === "correct_not_in_options")).toBe(true);
  });
});

describe("qa-scan parseLlmResponse", () => {
  const items = [
    {
      id: "abc123",
      fieldId: "pharmacy",
      subjectId: "test",
      itemType: "mcq",
      vignette: "",
      stem: "Test?",
      options: ["A", "B"],
      correctAnswer: "A",
      explanation: "Because A.",
      tags: [],
      formatNotes: [],
    },
  ];

  it("passes high-scoring items", () => {
    const evals = parseLlmResponse(items, {
      items: [
        {
          itemId: "abc123",
          pass: true,
          verdict: "pass",
          singleCorrectAnswer: true,
          scores: {
            logicClarity: 9,
            answerValidity: 9,
            boardQuality: 8,
            distractorQuality: 8,
            rationaleQuality: 8,
          },
          overallScore: 8.4,
          issues: [],
          suggestedFixes: [],
        },
      ],
    });
    expect(evals[0]?.pass).toBe(true);
    expect(evals[0]?.verdict).toBe("pass");
  });

  it("fills review stub when LLM omits an item", () => {
    const evals = parseLlmResponse(items, { items: [] });
    expect(evals[0]?.verdict).toBe("review");
    expect(evals[0]?.pass).toBe(false);
    expect(evals[0]?.issues[0]).toContain("missing");
  });
});
