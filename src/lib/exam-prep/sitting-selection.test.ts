import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import { assignSittingClusters } from "@/lib/exam-prep/sitting-clusters";
import {
  finalizeAssembledSitting,
  selectSittingItems,
  SITTING_FRAME_CAP,
  storedFormNeedsFreshAssembly,
} from "@/lib/exam-prep/sitting-selection";
import { compareSitting, simulateCatNgnCount, simulatedBoards } from "@/lib/exam-prep/sitting-simulation";

function item(
  id: string,
  question: string,
  options: string[],
  correct = options[0] ?? "A",
  extra: Partial<BankItem> = {}
): BankItem {
  return {
    id,
    question,
    options,
    correctAnswer: correct,
    explanation: "Because this is the keyed choice for the vignette.",
    ...extra,
  };
}

const LAMO_OPTIONS = [
  "Use backup contraception; lamotrigine levels may fall",
  "Stop lamotrigine the day the contraceptive starts",
  "Double the contraceptive dose",
  "No interaction is expected",
];

const HEART_FAILURE = [
  "A 70-year-old male client with a history of heart failure is experiencing increased shortness of breath and swelling in his legs. His vital signs show BP 130/80 mmHg, HR 90 bpm, and respiratory rate of 24 breaths/min. The nurse notes bilateral crackles upon auscultation.",
  "A 60-year-old male client with a history of heart failure is admitted with worsening dyspnea and edema. His current medications include furosemide and lisinopril. Upon assessment, his blood pressure is 100/60 mmHg, heart rate is 110 bpm, and he has 3+ pitting edema in both lower extremities.",
  "A 50-year-old male client is being evaluated for potential heart failure. He reports experiencing shortness of breath with exertion, fatigue, and swelling in his legs. Upon assessment, his blood pressure is 130/80 mmHg, heart rate is 90 bpm, and he has 2+ pitting edema.",
  "A 55-year-old male client with a history of heart failure presents to the clinic with complaints of increased shortness of breath and swelling in his legs. Vital signs show a blood pressure of 110/70 mmHg.",
];

describe("selectSittingItems", () => {
  it("keeps one row from a near-duplicate template cluster", () => {
    const pool: BankItem[] = [];
    for (let copy = 0; copy < 9; copy++) {
      pool.push(
        item(
          `lamo-${copy}`,
          `A ${22 + copy}-year-old taking lamotrigine starts an oral contraceptive. Which counseling point is most appropriate?`,
          LAMO_OPTIONS
        )
      );
    }
    for (let i = 0; i < 6; i++) {
      pool.push(
        item(
          `other-${i}`,
          `Which monitoring step is required before starting agent ${i}?`,
          [`Check level ${i}`, "Ignore symptoms", "Stop all medicines", "Discharge today"],
          `Check level ${i}`
        )
      );
    }

    const selected = selectSittingItems({ pool, limit: 7, seed: 3, relax: false });
    const lamo = selected.items.filter((row) => row.id?.startsWith("lamo-"));
    expect(lamo).toHaveLength(1);
    expect(new Set(assignSittingClusters(selected.items)).size).toBe(selected.items.length);
  });

  it("clusters live heart-failure templates even when each row has its own cluster id", () => {
    const pool = HEART_FAILURE.map((scenario, index) =>
      item(
        `hf-${index}`,
        index % 2 === 0 ? "Which action should the nurse take first?" : "Which finding is the highest priority?",
        ["Sit the client upright", "Document the finding", "Encourage fluids", "Restrict visitors"],
        "Sit the client upright",
        { scenario, clusterId: `nclex-c-0000${index}` }
      )
    );
    pool.push(
      item(
        "burn",
        "Which action should the nurse take first?",
        ["Protect the airway", "Apply lotion", "Offer juice", "Ambulate"],
        "Protect the airway",
        { scenario: "A client arrives from a house fire with facial burns and a hoarse voice.", clusterId: "nclex-c-burn" }
      )
    );
    const selected = selectSittingItems({ pool, limit: 5, seed: 2, relax: false, frameCap: null });
    const hf = selected.items.filter((row) => row.id?.startsWith("hf-"));
    expect(hf).toHaveLength(1);
    expect(selected.items.some((row) => row.id === "burn")).toBe(true);
    expect(new Set(assignSittingClusters(pool.filter((row) => row.id?.startsWith("hf-")))).size).toBe(1);
    const kidney = item(
      "ckd",
      "Which finding is the highest priority?",
      ["Sit the client upright", "Document the finding", "Encourage fluids", "Restrict visitors"],
      "Sit the client upright",
      {
        scenario:
          "A 68-year-old client with chronic kidney disease presents with shortness of breath and leg swelling, crackles, and proteinuria.",
        clusterId: "nclex-c-ckd",
      }
    );
    const mixed = assignSittingClusters([...pool.filter((row) => row.id?.startsWith("hf-")), kidney]);
    expect(new Set(mixed.slice(0, 4)).size).toBe(1);
    expect(mixed[4]).not.toBe(mixed[0]);
  });

  it("caps repeated question frames when the scenarios differ", () => {
    const pool = ["atorvastatin", "metformin", "lisinopril", "warfarin", "sertraline"].map((drug) =>
      item(
        drug,
        "Which action should the pharmacist take first?",
        [`Hold ${drug}`, "Dispense as written", "Call the insurer", "Document only"],
        `Hold ${drug}`,
        { scenario: `A new counseling visit about ${drug} and a different comorbidity ${drug}-case.` }
      )
    );
    const selected = selectSittingItems({
      pool,
      limit: 5,
      seed: 4,
      relax: false,
      frameCap: SITTING_FRAME_CAP,
    });
    expect(selected.items.length).toBe(SITTING_FRAME_CAP);
    expect(new Set(assignSittingClusters(pool)).size).toBe(pool.length);
  });

  it("uses a stored family id instead of wording", () => {
    const pool = [
      item("a", "Totally different stem about warfarin.", ["1", "2", "3", "4"], "1", {
        generationMeta: { templateId: "vanco-trough" },
      }),
      item("b", "Another stem about insulin glargine.", ["9", "8", "7", "6"], "9", {
        generationMeta: { templateId: "vanco-trough" },
      }),
      item("c", "Which antibiotic covers Pseudomonas?", ["Cipro", "Amox", "Azithro", "Linezolid"], "Cipro", {
        generationMeta: { templateId: "pseudomonas" },
      }),
    ];
    const selected = selectSittingItems({ pool, limit: 3, seed: 1, relax: false });
    const ids = selected.items.map((row) => row.id).sort();
    expect(ids.filter((id) => id === "a" || id === "b")).toHaveLength(1);
    expect(ids).toContain("c");
  });

  it("prefers items the student has not seen, then falls back", () => {
    const topics = [
      "A patient taking lamotrigine starts an oral contraceptive. Which counseling point is most appropriate?",
      "A vancomycin trough is 22 mg/L. Which dose adjustment is preferred?",
      "Which statement best describes the purpose of a loading dose?",
      "An older adult takes diphenhydramine nightly. Which Beers risk applies?",
    ];
    const pool = [0, 1, 2].flatMap((copy) =>
      topics.map((stem, topic) =>
        item(
          `t${topic}-c${copy}`,
          stem.replace("A patient", `A ${30 + copy}-year-old patient`).replace("An older", `A ${70 + copy}-year-old older`),
          [`Keyed action ${topic}`, `Distractor ${topic}a`, `Distractor ${topic}b`, `Distractor ${topic}c`],
          `Keyed action ${topic}`
        )
      )
    );
    const first = selectSittingItems({ pool, limit: 4, seed: 8, relax: false });
    expect(first.items).toHaveLength(4);
    const seen = new Set(first.items.map((row) => row.id!));
    const second = selectSittingItems({ pool, limit: 4, seenIds: seen, seed: 8, relax: false });
    expect(second.items.every((row) => !seen.has(row.id!))).toBe(true);

    const onlySeen = selectSittingItems({
      pool: first.items,
      limit: 4,
      seenIds: seen,
      seed: 2,
      relax: false,
    });
    expect(onlySeen.items).toHaveLength(4);
    expect(onlySeen.relaxed).toBe(false);
  });

  it("relaxes the cluster cap only when the pool cannot fill the length", () => {
    const pool = [0, 1, 2, 3, 4].map((copy) =>
      item(
        `only-${copy}`,
        "Which statement best describes the purpose of a loading dose?",
        ["Reach steady state sooner", "Reduce the half-life", "Avoid all side effects", "Replace maintenance therapy"]
      )
    );
    const strict = selectSittingItems({ pool, limit: 4, seed: 1, relax: false });
    expect(strict.items).toHaveLength(1);
    expect(strict.relaxed).toBe(false);

    const filled = selectSittingItems({ pool, limit: 4, seed: 1, relax: true });
    expect(filled.items).toHaveLength(4);
    expect(filled.relaxed).toBe(true);
    expect(new Set(filled.items.map((row) => row.id)).size).toBe(4);
  });

  it("yields a repeated stored form when most rows were already seen", () => {
    const pool = Array.from({ length: 10 }, (_, index) =>
      item(`form-${index}`, `Distinct stem number ${index} about a unique drug class.`, [
        `Answer ${index}`,
        "Wrong",
        "Also wrong",
        "Nope",
      ])
    );
    const seen = new Set(pool.map((row) => row.id!));
    expect(
      storedFormNeedsFreshAssembly({ items: pool, limit: 10, seenIds: seen, namedForm: false })
    ).toBe(true);
    expect(
      storedFormNeedsFreshAssembly({ items: pool, limit: 10, seenIds: seen, namedForm: true })
    ).toBe(false);
  });
});

describe("simulated sittings", () => {
  const boards = simulatedBoards();

  it("cuts NAPLEX template duplication and cross-sitting repeats", () => {
    const { before, after } = compareSitting(boards.naplex);
    expect(before.count).toBe(225);
    expect(after.count).toBe(225);
    expect(before.dupRate).toBeGreaterThan(0.3);
    expect(after.dupRate).toBe(0);
    expect(before.repeatRate).toBeGreaterThan(0.5);
    expect(after.repeatRate).toBeLessThan(0.05);
    expect(before.keyPosition[3]).toBeLessThan(0.08);
    expect(after.keyPosition[3]).toBeGreaterThan(0.15);
    expect(after.keyPosition[3]).toBeLessThan(0.4);
  });

  it("puts published NGN items into an NCLEX CAT-sized pool", () => {
    const { before, after } = compareSitting(boards.nclex);
    expect(before.ngnCount).toBe(0);
    expect(after.ngnCount).toBeGreaterThan(10);
    expect(after.dupRate).toBe(0);
    const assembled = finalizeAssembledSitting({
      pool: boards.nclex.wide,
      limit: boards.nclex.limit,
      fieldId: "nursing",
      seenIds: boards.nclex.seenIds,
      seed: 42,
      includeNgn: true,
    });
    const catNgn = simulateCatNgnCount(assembled.items, 87);
    expect(catNgn).toBeGreaterThan(8);
  });
});
