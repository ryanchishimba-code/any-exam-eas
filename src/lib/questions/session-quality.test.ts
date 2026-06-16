import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import {
  normalizeQuestionOptions,
  synthesizeClinicalDistractors,
} from "@/lib/question-format";
import { prepareQuestionsForSession } from "./prepare";
import {
  assessDifficultyMix,
  balanceDifficultyMix,
  enforceSessionCount,
  optionsAreTooSimilar,
  optionsFingerprint,
  resolveDifficultyBand,
  SESSION_QUALITY_REQUIREMENTS,
} from "./session-quality";
import {
  hasAdjacentSimilarSpread,
  hasWindowSimilarOptions,
  hasWindowSimilarSpread,
  selectSpreadBankItems,
  SESSION_SPREAD_WINDOW,
  spreadGroupKeyFromBankItem,
} from "./spread-session-order";
import type { RawQuestionInput } from "./types";

function bankItem(
  id: string,
  overrides: Partial<BankItem> = {}
): BankItem {
  return {
    id,
    subjectId: "cardiology",
    question: `Stem for ${id}?`,
    vignette: `Case ${id}`,
    options: ["Metoprolol", "Lisinopril", "Furosemide", "Aspirin"],
    correctAnswer: "Metoprolol",
    explanation: "Test",
    ...overrides,
  };
}

describe("SESSION_QUALITY_REQUIREMENTS", () => {
  it("documents the five session quality gates", () => {
    expect(Object.keys(SESSION_QUALITY_REQUIREMENTS)).toHaveLength(5);
    expect(SESSION_QUALITY_REQUIREMENTS.exactCount).toMatch(/count/i);
    expect(SESSION_QUALITY_REQUIREMENTS.difficultyMix).toMatch(/easy|medium|hard/i);
    expect(SESSION_QUALITY_REQUIREMENTS.spreadSimilarOptions).toMatch(/25/i);
    expect(SESSION_QUALITY_REQUIREMENTS.strongDistractors).toMatch(/plausible/i);
    expect(SESSION_QUALITY_REQUIREMENTS.variedScenarios).toMatch(/25/i);
  });
});

describe("requirement 1 — exact question count", () => {
  it("selectSpreadBankItems returns the requested limit", () => {
    const pool = Array.from({ length: 40 }, (_, i) =>
      bankItem(`q-${i}`, {
        question: `Unique ${i}?`,
        vignette: `Vignette ${i}`,
        options: [`A${i}`, `B${i}`, `C${i}`, `D${i}`],
        correctAnswer: `A${i}`,
      })
    );
    for (const limit of [10, 25, 40]) {
      expect(selectSpreadBankItems(pool, limit)).toHaveLength(limit);
    }
  });

  it("enforceSessionCount trims prepared rows to the user limit", () => {
    const items = Array.from({ length: 30 }, (_, i) => `q-${i}`);
    expect(enforceSessionCount(items, 25)).toHaveLength(25);
  });
});

describe("requirement 2 — difficulty variety", () => {
  it("resolveDifficultyBand maps numeric and label difficulty", () => {
    expect(resolveDifficultyBand({ difficulty: 1 })).toBe("easy");
    expect(resolveDifficultyBand({ difficulty: 5 })).toBe("hard");
    expect(resolveDifficultyBand({ difficultyLabel: "Hard" })).toBe("hard");
  });

  it("balanceDifficultyMix interleaves easy, medium, and hard items", () => {
    const items = [
      ...Array.from({ length: 6 }, (_, i) => ({ id: `e-${i}`, difficulty: 1 })),
      ...Array.from({ length: 6 }, (_, i) => ({ id: `m-${i}`, difficulty: 3 })),
      ...Array.from({ length: 6 }, (_, i) => ({ id: `h-${i}`, difficulty: 5 })),
    ];
    const picked = balanceDifficultyMix(items, 9);
    const mix = assessDifficultyMix(picked);
    expect(mix.easy).toBeGreaterThan(0);
    expect(mix.medium).toBeGreaterThan(0);
    expect(mix.hard).toBeGreaterThan(0);
    expect(mix.isVaried).toBe(true);
  });

  it("selectSpreadBankItems includes multiple difficulty bands when available", () => {
    const pool = [
      ...Array.from({ length: 10 }, (_, i) =>
        bankItem(`easy-${i}`, {
          difficulty: 1,
          question: `Easy ${i}?`,
          vignette: `Easy case ${i}`,
          options: [`E${i}a`, `E${i}b`, `E${i}c`, `E${i}d`],
          correctAnswer: `E${i}a`,
        })
      ),
      ...Array.from({ length: 10 }, (_, i) =>
        bankItem(`hard-${i}`, {
          difficulty: 5,
          question: `Hard ${i}?`,
          vignette: `Hard case ${i}`,
          options: [`H${i}a`, `H${i}b`, `H${i}c`, `H${i}d`],
          correctAnswer: `H${i}a`,
        })
      ),
    ];
    const selected = selectSpreadBankItems(pool, 12);
    const mix = assessDifficultyMix(selected);
    expect(mix.isVaried).toBe(true);
  });
});

describe("requirement 3 — similar answer choices spread apart", () => {
  it("detects identical option sets", () => {
    const opts = ["Metoprolol", "Lisinopril", "Furosemide", "Aspirin"];
    expect(optionsFingerprint(opts)).toBe(optionsFingerprint([...opts].reverse()));
    expect(optionsAreTooSimilar(opts, [...opts])).toBe(true);
  });

  it("selectSpreadBankItems separates questions sharing answer choices", () => {
    const sharedOptions = [
      "Start IV heparin",
      "Order CT angiography",
      "Give nitroglycerin",
      "Obtain echocardiography",
    ];
    const clustered = [
      bankItem("a1", {
        question: "First step for chest pain?",
        vignette: "Case A",
        options: sharedOptions,
        correctAnswer: "Start IV heparin",
      }),
      bankItem("a2", {
        question: "Next step after ECG?",
        vignette: "Case B",
        options: sharedOptions,
        correctAnswer: "Order CT angiography",
      }),
      bankItem("b1", {
        question: "AKI management?",
        vignette: "Renal case",
        options: ["IV fluids", "Furosemide", "Dialysis", "Stop ACE inhibitor"],
        correctAnswer: "IV fluids",
      }),
      bankItem("b2", {
        question: "Hyperkalemia treatment?",
        vignette: "Renal case 2",
        options: ["Calcium gluconate", "Insulin", "Kayexalate", "Dialysis"],
        correctAnswer: "Calcium gluconate",
      }),
    ];

    const selected = selectSpreadBankItems(clustered, 4);
    expect(
      hasWindowSimilarOptions(selected, (item) => item.options, SESSION_SPREAD_WINDOW)
    ).toBe(false);
    expect(
      hasWindowSimilarSpread(selected, spreadGroupKeyFromBankItem, SESSION_SPREAD_WINDOW)
    ).toBe(false);
  });

  it("prepareQuestionsForSession spreads overlapping options", () => {
    const shared = ["Morphine", "Oxygen", "Nitroglycerin", "Aspirin"];
    const raw: RawQuestionInput[] = [
      {
        id: 1,
        type: "multiple_choice",
        question: "Immediate therapy?",
        vignette: "STEMI presentation",
        options: shared,
        correctAnswer: "Morphine",
        explanation: "one",
        subjectId: "cardiology",
      },
      {
        id: 2,
        type: "multiple_choice",
        question: "Adjunct therapy?",
        vignette: "Different STEMI",
        options: shared,
        correctAnswer: "Aspirin",
        explanation: "two",
        subjectId: "cardiology",
      },
      {
        id: 3,
        type: "multiple_choice",
        question: "AKI step?",
        vignette: "Renal vignette",
        options: ["Fluids", "Diuretic", "Dialysis", "Stop nephrotoxin"],
        correctAnswer: "Fluids",
        explanation: "three",
        subjectId: "nephrology",
      },
    ];

    const prepared = prepareQuestionsForSession(raw, { shuffleOrder: true });
    expect(
      hasWindowSimilarOptions(prepared, (q) => q.options, SESSION_SPREAD_WINDOW)
    ).toBe(false);
  });
});

describe("requirement 4 — strong answer choice generation", () => {
  it("synthesizeClinicalDistractors avoids generic Alternative labels", () => {
    const added = synthesizeClinicalDistractors(["Correct answer"], "Correct answer", 3);
    expect(added).toHaveLength(3);
    expect(added.every((o) => !/^alternative \d+$/i.test(o))).toBe(true);
  });

  it("normalizeQuestionOptions fills missing slots with clinical distractors", () => {
    const { options } = normalizeQuestionOptions(["Give aspirin"], "Give aspirin");
    expect(options).toHaveLength(4);
    expect(options.every((o) => !/^alternative \d+$/i.test(o))).toBe(true);
    expect(options).toContain("Give aspirin");
  });
});
