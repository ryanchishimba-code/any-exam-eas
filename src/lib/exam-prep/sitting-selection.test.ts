import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import { assignSittingClusters } from "@/lib/exam-prep/sitting-clusters";
import {
  finalizeAssembledSitting,
  selectSittingItems,
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

describe("selectSittingItems", () => {
  it("clusters identical option sets even when the stems are paraphrases", () => {
    const options = [
      "Start warfarin today",
      "Hold anticoagulation",
      "Give vitamin K",
      "Recheck in one year",
    ];
    const pool = [
      item(
        "para-a",
        "Which regimen should be started today?",
        options,
        options[0]!,
        {
          scenario:
            "A 54-year-old man with atrial fibrillation and a prior stroke takes no medicines. Heart rate is 118 and creatinine is 1.1.",
        }
      ),
      item(
        "para-b",
        "What is the most appropriate antithrombotic plan?",
        options,
        options[0]!,
        {
          scenario:
            "A 61-year-old woman has new atrial fibrillation, a CHA2DS2-VASc score of 4, and no bleeding history.",
        }
      ),
      item(
        "other",
        "What is the next best step?",
        ["Activate the cath lab", "Give acetaminophen", "Discharge home", "Order a sleep study"],
        "Activate the cath lab",
        { scenario: "Crushing chest pain with ST elevation in two contiguous leads." }
      ),
    ];
    const clusters = assignSittingClusters(pool);
    expect(clusters[0]).toBe(clusters[1]);
    expect(clusters[2]).not.toBe(clusters[0]);

    const selected = selectSittingItems({ pool, limit: 3, seed: 2, relax: false });
    expect(selected.items.filter((row) => row.id?.startsWith("para-"))).toHaveLength(1);
    expect(selected.items.some((row) => row.id === "other")).toBe(true);
  });

  it("keeps a large pool of distinct items fast to cluster", () => {
    const pool = Array.from({ length: 360 }, (_, index) =>
      item(
        `row-${index}`,
        `Which monitoring step is required before agent ${index} in case ${index * 3}?`,
        [`Check level ${index}`, `Ignore ${index}`, `Stop ${index}`, `Discharge ${index}`],
        `Check level ${index}`,
        { scenario: `Unique history ${index} with finding ${index * 17} and drug ${index * 13}.` }
      )
    );
    const started = Date.now();
    const clusters = assignSittingClusters(pool);
    expect(Date.now() - started).toBeLessThan(80);
    expect(new Set(clusters).size).toBe(pool.length);
  });

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

  it("puts eligible NGN items into an NCLEX pool without a 22% claim", () => {
    const { before, after } = compareSitting(boards.nclex);
    expect(before.ngnCount).toBe(0);
    expect(after.ngnCount).toBeGreaterThan(0);
    expect(after.ngnCount).toBeLessThan(Math.round(boards.nclex.limit * 0.22));
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
    expect(catNgn).toBeGreaterThan(0);
    expect(catNgn).toBeLessThanOrEqual(after.ngnCount);
  });
});
