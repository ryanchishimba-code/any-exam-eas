import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import {
  selectSpreadBankItems,
  selectSpreadRawInputs,
  spreadGroupKeyFromBankItem,
  spreadStudyQuestions,
} from "./spread-session-order";
import { prepareQuestionsForSession } from "./prepare";
import type { RawQuestionInput } from "./types";

function bankItem(
  id: string,
  subjectId: string,
  question: string,
  vignette?: string,
  options: string[] = ["A", "B", "C", "D"]
): BankItem {
  return {
    id,
    subjectId,
    question,
    vignette,
    options,
    correctAnswer: options[0] ?? "A",
    explanation: "Test",
  };
}

describe("selectSpreadBankItems", () => {
  it("returns exactly the requested limit when NGN rows share a generic stem", () => {
    const sharedStem = "Match each finding to the column.";
    const items = Array.from({ length: 30 }, (_, i) =>
      bankItem(`ngn-${i}`, "med-surg", sharedStem, `Unique vignette ${i}`, [
        `Option A-${i}`,
        `Option B-${i}`,
        `Option C-${i}`,
        `Option D-${i}`,
      ])
    );
    expect(selectSpreadBankItems(items, 25)).toHaveLength(25);
  });

  it("returns exactly the requested limit when enough unique items exist", () => {
    const items = Array.from({ length: 30 }, (_, i) =>
      bankItem(`q-${i}`, "med-surg", `Unique stem ${i}?`, `Vignette ${i}`)
    );
    expect(selectSpreadBankItems(items, 25)).toHaveLength(25);
    expect(selectSpreadBankItems(items, 10)).toHaveLength(10);
  });

  it("selectSpreadRawInputs returns the requested count", () => {
    const raw: RawQuestionInput[] = Array.from({ length: 40 }, (_, i) => ({
      id: i + 1,
      type: "multiple_choice" as const,
      bankItemId: `raw-${i}`,
      question: `Question ${i}?`,
      vignette: i % 5 === 0 ? "Shared look-alike vignette prefix" : `Unique case ${i}`,
      options: [`A-${i}`, `B-${i}`, `C-${i}`, `D-${i}`],
      correctAnswer: `A-${i}`,
      explanation: "Why.",
      subjectId: i % 2 === 0 ? "assess" : "plan",
    }));
    const selected = selectSpreadRawInputs(raw, 25);
    expect(selected).toHaveLength(25);
  });

  it("returns fewer than limit when the pool is smaller", () => {
    const items = [bankItem("a", "med-surg", "One?"), bankItem("b", "med-surg", "Two?")];
    expect(selectSpreadBankItems(items, 25)).toHaveLength(2);
  });

  it("returns requested count from clustered same-case pools", () => {
    const clustered = [
      bankItem(
        "a1",
        "cardiology",
        "Which action first?",
        "Male with crushing chest pain and diaphoresis",
        ["Activate cath lab", "Give aspirin", "Obtain troponin", "Start heparin"]
      ),
      bankItem(
        "a2",
        "cardiology",
        "Which action next?",
        "Male with crushing chest pain and diaphoresis",
        ["Order echocardiogram", "Repeat ECG", "Start nitroglycerin", "Admit to ICU"]
      ),
      bankItem(
        "a3",
        "cardiology",
        "Which medication?",
        "Male with crushing chest pain and diaphoresis",
        ["Metoprolol", "Morphine", "Clopidogrel", "Atorvastatin"]
      ),
      bankItem("b1", "nephrology", "Best next step?", "Rising creatinine after contrast", [
        "IV fluids",
        "Furosemide",
        "Dialysis",
        "Stop ACE inhibitor",
      ]),
      bankItem("b2", "nephrology", "Best fluid?", "Oliguria after major surgery", [
        "Normal saline bolus",
        "D5W infusion",
        "Hypertonic saline",
        "Free water restriction",
      ]),
      bankItem("b3", "nephrology", "Best electrolyte fix?", "Hyperkalemia with AKI", [
        "Calcium gluconate",
        "Insulin and dextrose",
        "Sodium polystyrene",
        "Emergent dialysis",
      ]),
    ];

    expect(selectSpreadBankItems(clustered, 6)).toHaveLength(6);
  });

  it("dedupes by bank item id before limiting", () => {
    const sharedVignette = "Male with crushing chest pain and diaphoresis";
    const items = Array.from({ length: 50 }, (_, i) =>
      bankItem(
        `q-${i}`,
        i % 5 === 0 ? "cardiology" : "nephrology",
        `Question ${i}?`,
        i % 10 === 0 ? sharedVignette : `Unique vignette ${i}`
      )
    );

    const selected = selectSpreadBankItems(items, 40);
    expect(selected).toHaveLength(40);
    expect(new Set(selected.map((item) => item.id)).size).toBe(40);
  });
});

describe("spreadStudyQuestions", () => {
  it("preserves sequential set order", () => {
    const raw: RawQuestionInput[] = [
      {
        id: 1,
        type: "multiple_choice",
        question: "Step 1?",
        vignette: "Shared case A",
        options: ["A", "B", "C", "D"],
        correctAnswer: "A",
        explanation: "s1",
        ngnPayload: { kind: "sequential", setId: "case-1", stepIndex: 1, totalSteps: 2 },
        subjectId: "cardiology",
      },
      {
        id: 2,
        type: "multiple_choice",
        question: "Step 2?",
        vignette: "Shared case A",
        options: ["A", "B", "C", "D"],
        correctAnswer: "B",
        explanation: "s2",
        ngnPayload: { kind: "sequential", setId: "case-1", stepIndex: 2, totalSteps: 2 },
        subjectId: "cardiology",
      },
      {
        id: 3,
        type: "multiple_choice",
        question: "Other topic?",
        vignette: "Different renal case",
        options: ["A", "B", "C", "D"],
        correctAnswer: "C",
        explanation: "renal",
        subjectId: "nephrology",
      },
    ];

    const prepared = prepareQuestionsForSession(raw, { shuffleOrder: false });
    const spread = spreadStudyQuestions(prepared);

    expect(spread).toHaveLength(3);
    const seqIdx = spread.findIndex(
      (q) => (q.ngnPayload as { stepIndex?: number }).stepIndex === 1
    );
    const seqNext = spread[seqIdx + 1];
    expect((seqNext?.ngnPayload as { stepIndex?: number }).stepIndex).toBe(2);
  });
});

describe("prepareQuestionsForSession count", () => {
  it("returns one prepared row per raw input when shuffle is enabled", () => {
    const raw: RawQuestionInput[] = Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      type: "multiple_choice" as const,
      question: `Question ${i}?`,
      vignette: `Vignette ${i}`,
      options: ["A", "B", "C", "D"],
      correctAnswer: "A",
      explanation: `Why ${i}`,
      subjectId: i % 3 === 0 ? "cardiology" : i % 3 === 1 ? "nephrology" : "pulmonology",
    }));

    const prepared = prepareQuestionsForSession(raw, { shuffleOrder: true });
    expect(prepared).toHaveLength(15);
  });

  it("returns all items from look-alike pools when shuffle is enabled", () => {
    const raw: RawQuestionInput[] = [
      {
        id: 1,
        type: "multiple_choice",
        question: "Which action first?",
        vignette: "Shared patient scenario alpha",
        options: ["A", "B", "C", "D"],
        correctAnswer: "A",
        explanation: "one",
        subjectId: "cardiology",
      },
      {
        id: 2,
        type: "multiple_choice",
        question: "Which action next?",
        vignette: "Shared patient scenario alpha",
        options: ["A", "B", "C", "D"],
        correctAnswer: "B",
        explanation: "two",
        subjectId: "cardiology",
      },
      {
        id: 3,
        type: "multiple_choice",
        question: "Best step?",
        vignette: "Different renal scenario",
        options: ["IV fluids", "Diuretic", "Dialysis", "Stop nephrotoxin"],
        correctAnswer: "IV fluids",
        explanation: "three",
        subjectId: "nephrology",
      },
    ];

    const prepared = prepareQuestionsForSession(raw, { shuffleOrder: true });
    expect(prepared).toHaveLength(3);
  });
});
