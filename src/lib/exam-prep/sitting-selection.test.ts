import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import { assignSittingClusters } from "@/lib/exam-prep/sitting-clusters";
import {
  calcTemplateAsk,
  entityShareCap,
  isPharmacyNumericEntry,
  itemClinicalText,
  nursingDosageShareCap,
} from "@/lib/exam-prep/entity-cap";
import {
  finalizeAssembledSitting,
  isPharmacyCalculationItem,
  pharmacyCalculationQuota,
  selectSittingItems,
  storedFormNeedsFreshAssembly,
} from "@/lib/exam-prep/sitting-selection";
import { narrowTopicKey } from "@/lib/exam-prep/narrow-topic";
import { isKeyWrongPendingReview } from "@/lib/exam-prep/reviewed-key-queue";
import {
  compareSitting,
  deliverCatSitting,
  simulateCatNgnCount,
  simulatedBoards,
} from "@/lib/exam-prep/sitting-simulation";

const HIDE_LISTED_CALC_ID = "cmra6lyew002xic04rnufu0in";

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

describe("finalizeAssembledSitting caps", () => {
  it("caps heart failure on the exam length even when the pool is much larger", () => {
    const hf = (id: string) =>
      item(id, `Heart failure exacerbation ${id}. Which assessment is first?`, ["Daily weight", "Other"], "Daily weight");
    const other = (id: string) =>
      item(id, `Wound care teaching item ${id}. Which step is first?`, [`Choice ${id}`, "Other"], `Choice ${id}`);
    const pool = [
      ...Array.from({ length: 20 }, (_, i) => hf(`hf-${i}`)),
      ...Array.from({ length: 80 }, (_, i) => other(`other-${i}`)),
    ];
    const selected = finalizeAssembledSitting({ pool, limit: 50, fieldId: "nursing", seed: 7 });
    const hfCount = selected.items.filter(
      (row) => narrowTopicKey({ text: row.question }) === "heart-failure"
    ).length;
    expect(selected.items).toHaveLength(50);
    expect(hfCount).toBeLessThanOrEqual(2);
  });

  it("reserves calculation items in a pharmacy sitting", () => {
    const calcDrugs = ["vancomycin", "phenytoin", "gentamicin", "heparin"];
    const calc = (id: string, index: number) =>
      item(
        id,
        `How many milligrams of ${calcDrugs[index] ?? "amoxicillin"} should be given to a ${40 + index} kg patient? Round to the nearest whole number.`,
        [],
        String(12 + index),
        { itemType: "constructed_response", scenario: `Infusion case ${index} with a unique volume of ${80 + index * 7} mL.` }
      );
    const other = (id: string) =>
      item(id, `Counseling point ${id} for a new prescription.`, ["Teach", "Skip"], "Teach", { itemType: "mcq" });
    const pool = [
      ...Array.from({ length: 40 }, (_, i) => other(`mcq-${i}`)),
      ...Array.from({ length: 4 }, (_, i) => calc(`calc-${i}`, i)),
    ];
    expect(isPharmacyCalculationItem(pool[40]!)).toBe(true);
    const selected = finalizeAssembledSitting({ pool, limit: 20, fieldId: "pharmacy", seed: 3 });
    const calcCount = selected.items.filter(isPharmacyCalculationItem).length;
    expect(calcCount).toBeGreaterThanOrEqual(2);
    expect(pharmacyCalculationQuota(20)).toBe(2);
    expect(pharmacyCalculationQuota(50)).toBe(4);
  });

  it("keeps one row per drug-and-ask and caps the drug on a 50-item pharmacy sitting", () => {
    const filler = (id: string) =>
      item(id, `Which monitoring step is required before agent ${id}?`, [`Check ${id}`, "Skip"], `Check ${id}`);
    const loading = (id: string) =>
      item(
        id,
        `Why is a digoxin loading dose used for this new atrial fibrillation case ${id}?`,
        [`Reason ${id}`, "Skip"],
        `Reason ${id}`
      );
    const vd = (id: string) =>
      item(
        id,
        `How does CKD change the digoxin volume of distribution in case ${id}?`,
        [`Lower Vd ${id}`, "Skip"],
        `Lower Vd ${id}`
      );
    const pool = [
      ...Array.from({ length: 3 }, (_, i) => loading(`load-${i}`)),
      ...Array.from({ length: 2 }, (_, i) => vd(`vd-${i}`)),
      ...Array.from({ length: 60 }, (_, i) => filler(`fill-${i}`)),
    ];
    const selected = finalizeAssembledSitting({ pool, limit: 50, fieldId: "pharmacy", seed: 11 });
    const digoxin = selected.items.filter((row) => /digoxin/i.test(row.question));
    expect(selected.items).toHaveLength(50);
    expect(digoxin.filter((row) => /loading dose/i.test(row.question))).toHaveLength(1);
    expect(digoxin.filter((row) => /volume of distribution/i.test(row.question))).toHaveLength(1);
    expect(digoxin.length).toBeLessThanOrEqual(entityShareCap(50));
  });

  it("caps a repeated condition and dosage calculations on an NCLEX-length sitting", () => {
    const chole = (id: string) =>
      item(
        id,
        `Postoperative day 1 after laparoscopic cholecystectomy, case ${id}. Which action is first?`,
        [`Ambulate ${id}`, "Stay in bed"],
        `Ambulate ${id}`
      );
    const dose = (id: string) =>
      item(id, `What rate (mL/hr) should the nurse set for infusion ${id}?`, [`${id} mL/hr`, "Stop"], `${id} mL/hr`);
    const filler = (id: string) =>
      item(id, `Which monitoring step is required before agent ${id}?`, [`Check ${id}`, "Skip"], `Check ${id}`);
    const pool = [
      ...Array.from({ length: 8 }, (_, i) => chole(`chole-${i}`)),
      ...Array.from({ length: 20 }, (_, i) => dose(`dose-${i}`)),
      ...Array.from({ length: 120 }, (_, i) => filler(`fill-${i}`)),
    ];
    const selected = finalizeAssembledSitting({ pool, limit: 89, fieldId: "nursing", seed: 5 });
    const choleCount = selected.items.filter((row) => /cholecystectomy/i.test(row.question)).length;
    const doseCount = selected.items.filter((row) => /mL\/hr/i.test(row.question)).length;
    expect(selected.items).toHaveLength(89);
    expect(choleCount).toBeLessThanOrEqual(entityShareCap(89));
    expect(doseCount).toBeLessThanOrEqual(1);
    expect(doseCount).toBeLessThanOrEqual(nursingDosageShareCap(89));
    expect(nursingDosageShareCap(89)).toBe(8);
  });

  it("reserves about 8 percent real calculation items when the pharmacy pool has them", () => {
    const calcDrugs = [
      "vancomycin",
      "phenytoin",
      "gentamicin",
      "heparin",
      "digoxin",
      "levothyroxine",
      "metformin",
      "warfarin",
    ];
    const calc = (id: string, index: number) =>
      item(
        id,
        `How many milligrams of ${calcDrugs[index]} are required for a ${50 + index} kg adult? Round to the nearest whole milligram.`,
        [],
        String(15 + index),
        {
          itemType: "constructed_response",
          scenario: `Calculation ${index}: volume ${100 + index * 13} mL, concentration ${index + 2} mg/mL.`,
        }
      );
    const other = (id: string) =>
      item(id, `Which monitoring step is required before agent ${id}?`, [`Check ${id}`, "Skip"], `Check ${id}`, {
        itemType: "mcq",
      });
    const pool = [
      ...Array.from({ length: 70 }, (_, i) => other(`mcq-${i}`)),
      ...Array.from({ length: 8 }, (_, i) => calc(`calc-${i}`, i)),
    ];
    const selected = finalizeAssembledSitting({ pool, limit: 50, fieldId: "pharmacy", seed: 9 });
    expect(selected.items.filter(isPharmacyCalculationItem).length).toBeGreaterThanOrEqual(4);
  });

  it("keeps a 50-item pharmacy sitting inside the calc reserve with no repeated template or drug", () => {
    const concentration = (id: string, mg: number) =>
      item(
        id,
        `Amoxicillin suspension is ${mg} mg/5 mL. Calculate the concentration in mg/mL.`,
        [],
        String(mg / 5),
        {
          itemType: "constructed_response",
          scenario: `Pharmacy counter case ${id}. The caregiver asks how many mg are in each mL.`,
        }
      );
    const tablets = (id: string, days: number) =>
      item(
        id,
        `Amoxicillin 500 mg is ordered every 8 hours for ${days} days. How many tablets should be dispensed?`,
        [],
        String(days * 3),
        { itemType: "constructed_response", scenario: `Dispensing case ${id} at the outpatient window.` }
      );
    const drugMcq = (drug: string, id: string) =>
      item(
        id,
        `Which monitoring step is required before the next ${drug} dose in encounter ${id}?`,
        [`Check ${id}`, "Skip the visit"],
        `Check ${id}`,
        { itemType: "mcq", scenario: `${drug} follow-up ${id}.` }
      );
    const realCalc = (drug: string, index: number) =>
      item(
        `real-${drug}`,
        `How many milligrams of ${drug} are required for a ${50 + index} kg adult? Round to the nearest whole milligram.`,
        [],
        String(15 + index),
        {
          itemType: "constructed_response",
          scenario: `Calculation for ${drug}: volume ${100 + index * 13} mL.`,
        }
      );
    const filler = (id: string) =>
      item(id, `Which counseling point applies to refill case ${id}?`, [`Point ${id}`, "Skip"], `Point ${id}`, {
        itemType: "mcq",
      });
    const pool = [
      ...Array.from({ length: 12 }, (_, i) => concentration(`amox-conc-${i}`, 200 + i * 25)),
      ...Array.from({ length: 8 }, (_, i) => tablets(`amox-tab-${i}`, 7 + i)),
      ...Array.from({ length: 6 }, (_, i) => drugMcq("lisinopril", `lisi-${i}`)),
      ...Array.from({ length: 4 }, (_, i) => drugMcq("atorvastatin", `ator-${i}`)),
      ...Array.from({ length: 4 }, (_, i) => drugMcq("metformin", `met-${i}`)),
      ...["vancomycin", "phenytoin", "gentamicin", "heparin", "digoxin", "warfarin"].map((drug, index) =>
        realCalc(drug, index)
      ),
      ...Array.from({ length: 80 }, (_, i) => filler(`fill-${i}`)),
    ];
    const selected = finalizeAssembledSitting({ pool, limit: 50, fieldId: "pharmacy", seed: 163 });
    const calcs = selected.items.filter(isPharmacyNumericEntry);
    const templates = calcs.map((row) => calcTemplateAsk(row.question)).filter((key): key is string => Boolean(key));
    expect(selected.items).toHaveLength(50);
    expect(entityShareCap(50)).toBe(2);
    expect(calcs.length).toBeLessThanOrEqual(pharmacyCalculationQuota(50));
    expect(calcs.length).toBeGreaterThanOrEqual(4);
    expect(new Set(templates).size).toBe(templates.length);
    for (const drug of ["amoxicillin", "lisinopril", "atorvastatin", "metformin"]) {
      const count = selected.items.filter((row) => new RegExp(`\\b${drug}\\b`, "i").test(itemClinicalText(row))).length;
      expect(count).toBeLessThanOrEqual(2);
    }
  });

  it("never places a hide-listed calculation in an assembled pharmacy sitting", () => {
    expect(isKeyWrongPendingReview(HIDE_LISTED_CALC_ID)).toBe(true);
    const hidden = item(
      HIDE_LISTED_CALC_ID,
      "How many milligrams of amoxicillin are in each milliliter of the 250 mg/5 mL suspension?",
      [],
      "4.3",
      {
        itemType: "constructed_response",
        active: true,
        qaPassed: true,
        scenario: "The caregiver asks for the concentration before the first dose.",
      }
    );
    const eligibleCalc = item(
      "eligible-calc",
      "How many milligrams of vancomycin are required for a 70 kg adult? Round to the nearest whole milligram.",
      [],
      "1500",
      { itemType: "constructed_response", active: true, qaPassed: true, scenario: "Infusion case eligible-calc." }
    );
    const failedQa = item(
      "qa-failed-calc",
      "How many milliliters of gentamicin should be drawn for a 80 kg adult?",
      [],
      "4",
      { itemType: "constructed_response", active: true, qaPassed: false, scenario: "Dose case qa-failed-calc." }
    );
    const inactive = item(
      "inactive-calc",
      "How many tablets of metformin should be dispensed for 30 days?",
      [],
      "60",
      { itemType: "constructed_response", active: false, qaPassed: true, scenario: "Dispense case inactive-calc." }
    );
    const oneKeySata = item(
      "sata-one-key",
      "Select all monitoring steps required before the next phenytoin dose.",
      ["Check the level", "Skip the level", "Call the lab"],
      "Check the level",
      { itemType: "select_all", active: true, qaPassed: true }
    );
    const filler = (id: string) =>
      item(id, `Which counseling point applies to refill case ${id}?`, [`Point ${id}`, "Skip"], `Point ${id}`, {
        itemType: "mcq",
        active: true,
        qaPassed: true,
      });
    const pool = [
      hidden,
      eligibleCalc,
      failedQa,
      inactive,
      oneKeySata,
      ...Array.from({ length: 40 }, (_, i) => filler(`elig-fill-${i}`)),
    ];
    const selected = finalizeAssembledSitting({ pool, limit: 20, fieldId: "pharmacy", seed: 49 });
    const ids = selected.items.map((row) => row.id);
    expect(ids).toContain("eligible-calc");
    expect(ids).not.toContain(HIDE_LISTED_CALC_ID);
    expect(ids).not.toContain("qa-failed-calc");
    expect(ids).not.toContain("inactive-calc");
    expect(ids).not.toContain("sata-one-key");
  });
});

describe("NCLEX CAT condition cap", () => {
  it("keeps every condition at or below 3 in an 85-item adaptive delivery", () => {
    const stacks: { pattern: RegExp; stem: (id: string, n: number) => string }[] = [
      {
        pattern: /cholecystectomy|lap chole/i,
        stem: (id, n) =>
          `Postoperative day ${n + 1} after laparoscopic cholecystectomy, room ${id}. Which action is the priority for this client?`,
      },
      {
        pattern: /suicide|depression/i,
        stem: (id, n) =>
          `A client in room ${id} reports suicidal thoughts and a history of depression after ${n + 2} days on the unit. Which action is the priority?`,
      },
      {
        pattern: /preeclampsia|late decel/i,
        stem: (id, n) =>
          `At ${30 + n} weeks the fetal tracing shows late decels and the client has preeclampsia, bed ${id}. Which action is first?`,
      },
      {
        pattern: /hip arthroplasty/i,
        stem: (id, n) =>
          `Day ${n + 1} after hip arthroplasty, the client in room ${id} needs assistance to the chair. Which precaution is required?`,
      },
      {
        pattern: /postpartum hemorrhage/i,
        stem: (id, n) =>
          `Two hours after delivery the client in room ${id} has a postpartum hemorrhage and soaked pad ${n + 1}. Which action is first?`,
      },
      {
        pattern: /\bburns?\b/i,
        stem: (id, n) =>
          `A client in room ${id} has partial-thickness burns to the arm from a scald ${n + 1} hours ago. Which action is first?`,
      },
    ];
    const pool = [
      ...stacks.flatMap((stack) =>
        Array.from({ length: 8 }, (_, n) =>
          item(`cond-${stack.pattern.source}-${n}`, stack.stem(`r${n}`, n), [`Act ${n}`, "Wait"], `Act ${n}`)
        )
      ),
      ...Array.from({ length: 90 }, (_, n) =>
        item(
          `filler-${n}`,
          `Which isolation step is required before entering room ${700 + n} for agent ${n}?`,
          [`Step ${n}`, "Skip"],
          `Step ${n}`
        )
      ),
    ];
    const delivered = deliverCatSitting(pool, 85, "nursing");
    expect(entityShareCap(85)).toBe(3);
    expect(delivered).toHaveLength(85);
    for (const stack of stacks) {
      const count = delivered.filter((row) => stack.pattern.test(itemClinicalText(row))).length;
      expect(count).toBeLessThanOrEqual(3);
    }
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
