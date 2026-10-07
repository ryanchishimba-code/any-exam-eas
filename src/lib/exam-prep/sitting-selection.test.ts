import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import { assignSittingClusters } from "@/lib/exam-prep/sitting-clusters";
import {
  calcTemplateAsk,
  enforceEntityAndDosageCap,
  entityShareCap,
  isPharmacyNumericEntry,
  itemClinicalText,
  nursingConditionCap,
  nursingDosageShareCap,
  perFiftyCap,
  PHARMACY_DRUG_CAP,
  pharmacyBackgroundDrugCap,
  pharmacyDrugCap,
  sittingCapLimits,
  sittingCaseFingerprint,
  sittingConditionMentions,
  sittingDrugMentions,
  sittingDrugSplit,
  sittingRepeatKeys,
  sittingVitalFingerprint,
  templateRepeatCap,
} from "@/lib/exam-prep/entity-cap";
import {
  finalizeAssembledSitting,
  isPharmacyCalculationItem,
  pharmacyCalculationQuota,
  selectSittingItems,
  sessionOrderSeed,
  spreadPharmacyNumericEntries,
  storedFormNeedsFreshAssembly,
} from "@/lib/exam-prep/sitting-selection";
import { narrowTopicKey, narrowTopicShareCap } from "@/lib/exam-prep/narrow-topic";
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

describe("sitting-wide drug, condition, and case caps", () => {
  const filler = (id: string, field: "pharmacy" | "nursing") =>
    item(
      id,
      field === "pharmacy"
        ? `Which counseling point applies to refill case ${id}?`
        : `Which isolation step is required before entering room ${id}?`,
      [`Point ${id}`, "Skip the step"],
      `Point ${id}`,
      { itemType: "mcq" }
    );

  it("caps each pharmacy drug at 2 even when a longer drug is also in the vignette", () => {
    const token = ["alpha", "bravo", "charlie", "delta", "echo", "foxtrot", "golf", "hotel", "india", "juliet"] as const;
    const about = (drug: string, index: number, subject?: string) =>
      item(
        `${drug}-${index}`,
        subject
          ? `Which monitoring step is required before the next dose in encounter ${token[index] ?? index}?`
          : `Which monitoring step is required before the next ${drug} dose in encounter ${token[index] ?? index}?`,
        [`Check ${drug} ${index}`, "Skip the visit"],
        `Check ${drug} ${index}`,
        {
          itemType: "mcq",
          subjectId: subject,
          scenario:
            drug === "lisinopril" && !subject
              ? `${token[index] ?? "note"} chart is a separate follow-up with its own counseling goal. Home therapy includes acetaminophen.`
              : `${token[index] ?? "note"} chart is a separate follow-up with its own counseling goal.`,
        }
      );
    const pair = (id: string, scene: string, question: string) =>
      item(id, question, [`Act ${id}`, "Wait"], `Act ${id}`, {
        itemType: "mcq",
        scenario: scene,
      });
    const pool = [
      ...Array.from({ length: 6 }, (_, index) => about("lisinopril", index)),
      ...Array.from({ length: 4 }, (_, index) => about("lisinopril", index + 6, "lisinopril")),
      ...Array.from({ length: 5 }, (_, index) => about("warfarin", index)),
      ...Array.from({ length: 4 }, (_, index) => about("apixaban", index)),
      ...Array.from({ length: 5 }, (_, index) => about("gabapentin", index)),
      ...Array.from({ length: 4 }, (_, index) => about("clopidogrel", index)),
      pair(
        "gaba-micro-a",
        "A patient asks whether gabapentin is listed in Micromedex before the evening dose. Chart A is open.",
        "Which reference check is required before the gabapentin dose?"
      ),
      pair(
        "gaba-micro-b",
        "A patient asks whether gabapentin is listed in Micromedex before the evening dose. Chart B is open.",
        "Which reference check is required before the gabapentin dose?"
      ),
      ...Array.from({ length: 80 }, (_, index) => filler(`fill-${index}`, "pharmacy")),
    ];
    const selected = finalizeAssembledSitting({ pool, limit: 50, fieldId: "pharmacy", seed: 50 });
    const mentions = (drug: string) =>
      selected.items.filter((row) => {
        const text = `${row.subjectId ?? ""}\n${itemClinicalText(row)}`;
        return new RegExp(`\\b${drug}\\b`, "i").test(text);
      }).length;
    expect(selected.items).toHaveLength(50);
    expect(PHARMACY_DRUG_CAP).toBe(2);
    for (const drug of ["lisinopril", "warfarin", "apixaban", "gabapentin", "clopidogrel"]) {
      expect(mentions(drug)).toBeLessThanOrEqual(2);
    }
    const micromedex = selected.items.filter((row) => /micromedex/i.test(itemClinicalText(row)));
    expect(micromedex).toHaveLength(1);
  });

  it("caps NCLEX conditions at 3 and keeps one copy of an identical case", () => {
    const routine = (id: string, weeks: number) =>
      item(
        id,
        "Which priority intervention is required at this routine prenatal visit?",
        [`Teach ${id}`, "Delay teaching"],
        `Teach ${id}`,
        {
          scenario: `A ${22 + (weeks % 4)}-year-old pregnant client at ${weeks} weeks presents for a routine prenatal visit. Chart ${id} is open.`,
        }
      );
    const distinctPregnancy = (id: string, concern: string) =>
      item(
        id,
        `Which finding during this ${concern} prenatal visit should be reported first?`,
        [`Report ${id}`, "Recheck tomorrow"],
        `Report ${id}`,
        { scenario: `Prenatal clinic note ${id}: the concern is ${concern}, which is not the routine template.` }
      );
    const gallbladder = (id: string, label: string) =>
      item(
        id,
        `Which action is first for this ${label} client in bay ${id}?`,
        [`Act ${id}`, "Wait"],
        `Act ${id}`,
        { scenario: `Bay ${id} has a different ${label} history and a unique exam finding ${id}.` }
      );
    const moodToken = ["amber", "birch", "cedar", "dune", "elm", "fern"] as const;
    const depressed = (id: string, index: number) =>
      item(
        id,
        `Which safety step is first for the client in room ${moodToken[index]} who feels depressed?`,
        [`Stay ${id}`, "Leave"],
        `Stay ${id}`,
        {
          scenario: `${moodToken[index]} clinic documents a separate mood assessment. The client feels depressed and is not suicidal.`,
        }
      );
    const anaphylaxis = (id: string) =>
      item(
        id,
        id.endsWith("b") ? "Which medication is given first?" : "Which action is the priority?",
        [`Epinephrine ${id}`, "Diphenhydramine"],
        `Epinephrine ${id}`,
        {
          scenario:
            "A client develops anaphylaxis with hives, wheezing, and hypotension minutes after the antibiotic infusion. The crash cart is outside the room.",
        }
      );
    const pool = [
      ...Array.from({ length: 4 }, (_, index) => routine(`preg-${index}`, 28 + index)),
      ...["headache", "swelling", "glucose", "fundal"].map((concern, index) =>
        distinctPregnancy(`preg-other-${index}`, concern)
      ),
      ...["gallbladder", "cholecystitis", "cholelithiasis", "laparoscopic cholecystectomy", "gallbladder pain"].map(
        (label, index) => gallbladder(`gall-${index}`, label)
      ),
      ...Array.from({ length: 6 }, (_, index) => depressed(`mood-${index}`, index)),
      anaphylaxis("anaphylaxis-a"),
      anaphylaxis("anaphylaxis-b"),
      ...Array.from({ length: 90 }, (_, index) => filler(`nfill-${index}`, "nursing")),
    ];
    const selected = finalizeAssembledSitting({ pool, limit: 85, fieldId: "nursing", seed: 85 });
    const textOf = (row: (typeof selected.items)[number]) => itemClinicalText(row);
    const pregnancy = selected.items.filter((row) => /pregnan|prenatal/i.test(textOf(row)));
    const gall = selected.items.filter((row) => /gallbladder|cholecystitis|cholelithiasis|cholecystectomy/i.test(textOf(row)));
    const mood = selected.items.filter((row) => /depress/i.test(textOf(row)));
    const shock = selected.items.filter((row) => /anaphylaxis/i.test(textOf(row)));
    const routineCount = pregnancy.filter((row) =>
      /priority intervention is required at this routine prenatal visit/i.test(row.question)
    ).length;
    expect(selected.items).toHaveLength(85);
    expect(nursingConditionCap(85)).toBe(3);
    expect(pregnancy.length).toBeLessThanOrEqual(3);
    expect(routineCount).toBeLessThanOrEqual(1);
    expect(gall.length).toBeLessThanOrEqual(3);
    expect(mood.length).toBeLessThanOrEqual(3);
    expect(shock).toHaveLength(1);
  });

  it("applies the condition cap and calc-template dedupe on later CAT picks", () => {
    const catToken = ["amber", "birch", "cedar", "dune", "elm", "fern"] as const;
    const routine = (id: string, index: number) =>
      item(
        id,
        `Which prenatal finding in the ${catToken[index]} clinic should be reported first?`,
        [`Teach ${id}`, "Delay teaching"],
        `Teach ${id}`,
        {
          scenario: `${catToken[index]} prenatal clinic sees a pregnant client with a complaint that belongs only to ${catToken[index]}.`,
        }
      );
    const gallbladder = (id: string, index: number) =>
      item(
        id,
        `Which comfort measure is first after the gallbladder episode in the ${catToken[index]} bay?`,
        [`Support ${id}`, "Discharge"],
        `Support ${id}`,
        { scenario: `${catToken[index]} bay documents a gallbladder episode that is separate from the other bays.` }
      );
    const depressed = (id: string, index: number) =>
      item(
        id,
        `Which safety step is first for the client who feels depressed in the ${catToken[index]} room?`,
        [`Stay ${id}`, "Leave"],
        `Stay ${id}`,
        { scenario: `${catToken[index]} room documents a separate mood assessment. The client feels depressed.` }
      );
    const dose = (id: string, ml: number) =>
      item(
        id,
        `How many milliliters per hour should infuse for order ${ml}?`,
        [],
        String(ml),
        { itemType: "constructed_response", scenario: `Infusion order ${id} uses a different pump ${ml}.` }
      );
    const shock = (id: string) =>
      item(id, `Which action is the priority in case ${id}?`, [`Epinephrine ${id}`, "Observe"], `Epinephrine ${id}`, {
        scenario:
          "A client develops anaphylaxis with hives, wheezing, and hypotension minutes after the antibiotic infusion. The crash cart is outside the room.",
      });
    const pool = [
      ...Array.from({ length: 6 }, (_, index) => routine(`cat-preg-${index}`, index)),
      ...Array.from({ length: 6 }, (_, index) => gallbladder(`cat-gall-${index}`, index)),
      ...Array.from({ length: 6 }, (_, index) => depressed(`cat-mood-${index}`, index)),
      ...Array.from({ length: 4 }, (_, index) => dose(`cat-dose-${index}`, 40 + index * 5)),
      shock("cat-shock-a"),
      shock("cat-shock-b"),
      ...Array.from({ length: 100 }, (_, index) => filler(`cat-fill-${index}`, "nursing")),
    ];
    const delivered = deliverCatSitting(pool, 85, "nursing");
    const textOf = (row: (typeof delivered)[number]) => itemClinicalText(row);
    expect(delivered.length).toBe(85);
    expect(delivered.filter((row) => /pregnan|prenatal/i.test(textOf(row))).length).toBeLessThanOrEqual(3);
    expect(delivered.filter((row) => /gallbladder/i.test(textOf(row))).length).toBeLessThanOrEqual(3);
    expect(delivered.filter((row) => /depress/i.test(textOf(row))).length).toBeLessThanOrEqual(3);
    expect(delivered.filter((row) => /anaphylaxis/i.test(textOf(row)))).toHaveLength(1);
    const doses = delivered.filter((row) => calcTemplateAsk(row.question));
    const templates = doses.map((row) => calcTemplateAsk(row.question));
    expect(new Set(templates).size).toBe(templates.length);
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

describe("retest 165 drug, condition, and case detection", () => {
  const filler = (id: string, field: "pharmacy" | "nursing") =>
    item(
      id,
      field === "pharmacy"
        ? `Which storage step applies to shipment lot ${id} before it leaves the pharmacy vault?`
        : `Which isolation step is required before entering room ${id} for a unique dressing change?`,
      [`Step ${id}`, "Skip the step"],
      `Step ${id}`,
      { itemType: "mcq" }
    );

  it("counts insulin, warfarin, and sertraline beyond a single longest metadata name", () => {
    const insulinHiddenByLongerList = item(
      "insulin-list",
      "Which check applies to the insulin vial before the evening dose in encounter alpha?",
      ["Verify the insulin concentration", "Skip the check"],
      "Verify the insulin concentration",
      {
        scenario:
          "Home medications include levothyroxine 125 mcg daily and acetaminophen 500 mg as needed. The chart also lists spironolactone.",
        generationMeta: { mainDrug: "heparin" },
      }
    );
    const lantus = item(
      "insulin-lantus",
      "Which counseling point applies to the new Lantus prescription in encounter bravo?",
      ["Inject Lantus at the same time each evening", "Shake the pen"],
      "Inject Lantus at the same time each evening",
      { scenario: "Clinic bravo is starting a basal insulin the patient has not used before." }
    );
    const humalogKey = item(
      "insulin-key",
      "Which high-alert product should be verified during encounter charlie?",
      ["Humalog", "Acetaminophen"],
      "Humalog",
      { scenario: "The medication drawer for encounter charlie contains several look-alike vials." }
    );
    const warfarinKey = item(
      "warfarin-key",
      "Which medication interaction should the pharmacist address first during this pneumonia admission?",
      ["Warfarin with the new antibiotic", "Continue every home medication"],
      "Warfarin with the new antibiotic",
      {
        scenario:
          "An older adult is admitted with pneumonia. Home medications include warfarin 5 mg daily and metoprolol 50 mg twice daily.",
      }
    );
    const zoloft = item(
      "sertraline-zoloft",
      "Which adverse effect is most likely during the first week of Zoloft in encounter delta?",
      ["Nausea", "Hair loss"],
      "Nausea",
      { scenario: "Encounter delta starts sertraline under its brand name only." }
    );

    expect(sittingDrugMentions(insulinHiddenByLongerList)[0]).toBe("insulin");
    expect(sittingDrugMentions(insulinHiddenByLongerList)).toEqual(
      expect.arrayContaining(["insulin", "heparin", "levothyroxine", "acetaminophen"])
    );
    expect(sittingDrugMentions(insulinHiddenByLongerList)).not.toContain("spironolactone");
    expect(sittingDrugMentions(lantus)).toContain("insulin");
    expect(sittingDrugMentions(humalogKey)).toEqual(["insulin"]);
    expect(sittingDrugMentions(warfarinKey)[0]).toBe("warfarin");
    expect(sittingDrugMentions(warfarinKey)).toEqual(expect.arrayContaining(["warfarin", "metoprolol"]));
    expect(sittingDrugMentions(zoloft)).toContain("sertraline");
  });

  it("counts hypertension, ACS, pressure injury, START triage, and opioid risk from the stem", () => {
    const hypertension = item(
      "htn-vitals",
      "Which finding is the highest priority?",
      ["Blood pressure", "Hunger"],
      "Blood pressure",
      {
        scenario:
          "A client presents with complaints of frequent headaches and blurred vision. Blood pressure is 150/95.",
        generationMeta: { mainSubject: "preeclampsia" },
      }
    );
    const backgroundHypertension = item(
      "acs-background-htn",
      "Which action is first for this client?",
      ["Obtain an ECG", "Offer a blanket"],
      "Obtain an ECG",
      { scenario: "History of hypertension. He now has crushing chest pain radiating to the jaw." }
    );
    const pressure = item(
      "pressure",
      "Which dressing is appropriate for this wound?",
      ["Foam", "Leave it open"],
      "Foam",
      { scenario: "The sacral wound is a stage 2 pressure injury." }
    );
    const triage = item(
      "triage",
      "Which client is treated first?",
      ["Red tag", "Green tag"],
      "Red tag",
      { scenario: "START triage is underway after a mass-casualty incident." }
    );
    const opioid = item(
      "opioid",
      "Which assessment is the priority before the next dose?",
      ["Respiratory rate", "Appetite"],
      "Respiratory rate",
      {
        scenario:
          "A male client with chronic pain is prescribed an opioid. He has a history of substance use disorder and is currently in recovery.",
      }
    );

    expect(sittingConditionMentions(hypertension)).toContain("hypertension");
    expect(sittingConditionMentions(hypertension)).not.toContain("preeclampsia");
    expect(sittingConditionMentions(backgroundHypertension)).toContain("acs");
    expect(sittingConditionMentions(backgroundHypertension)).not.toContain("hypertension");
    expect(sittingConditionMentions(pressure)).toContain("pressure-injury");
    expect(sittingConditionMentions(triage)).toContain("mass-casualty");
    expect(sittingConditionMentions(opioid)).toContain("opioid-sud");
    expect(sittingConditionMentions(opioid)).not.toContain("suicide");
  });

  it("blocks identical vitals and age-or-sex clones of the same opening", () => {
    const anaphylaxis = (id: string, age: number, sex: string, room: number) =>
      item(id, "Which action is the priority?", [`Epinephrine ${id}`, "Observe"], `Epinephrine ${id}`, {
        scenario: `A ${age}-year-old ${sex} in the emergency department, room ${room}, develops anaphylaxis minutes after ceftriaxone for pyelonephritis. Penicillin allergy. BP 74/42, HR 130, RR 30, SpO2 89%.`,
      });
    const bleedA = item(
      "ugib-a",
      "Which action is first?",
      ["Start fluids", "Offer food"],
      "Start fluids",
      {
        scenario:
          "A 77-year-old male with peptic ulcer disease and daily aspirin is pale, cool, and lightheaded. BP 90/56, HR 118, hemoglobin 7.2.",
      }
    );
    const bleedB = item(
      "ugib-b",
      "Which order does the nurse anticipate?",
      ["Large-bore IV access", "Oral diet"],
      "Large-bore IV access",
      {
        scenario:
          "Brought from home after vomiting blood, this 74-year-old man has a history of peptic ulcer disease. BP 90/56, HR 118, hemoglobin 7.2. He is pale and lightheaded.",
      }
    );
    const colonoscopy = (id: string, age: number) =>
      item(id, `Which finding after today's procedure matters most for ${id}?`, [`Report ${id}`, "Recheck tomorrow"], `Report ${id}`, {
        scenario: `A ${age}-year-old male is recovering from a colonoscopy performed earlier today. Finding set ${id} is documented.`,
      });
    const shockA = anaphylaxis("shock-a", 33, "female", 352);
    const shockB = anaphylaxis("shock-b", 35, "woman", 418);
    expect(sittingCaseFingerprint(shockA)).toBe(sittingCaseFingerprint(shockB));
    expect(sittingVitalFingerprint(shockA)).toBe(sittingVitalFingerprint(shockB));
    expect(sittingCaseFingerprint(bleedA)).not.toBe(sittingCaseFingerprint(bleedB));
    expect(sittingVitalFingerprint(bleedA)).toBe(sittingVitalFingerprint(bleedB));
    expect(sittingRepeatKeys(bleedA, "nursing").some((key) => sittingRepeatKeys(bleedB, "nursing").includes(key))).toBe(
      true
    );
    expect(sittingCaseFingerprint(colonoscopy("colo-a", 45))).toBe(sittingCaseFingerprint(colonoscopy("colo-b", 60)));
  });

  it("holds pharmacy drug caps at 2 for the retest-165 insulin, warfarin, and sertraline misses", () => {
    const insulin = (id: string, question: string, answer: string, extra: Partial<BankItem> = {}) =>
      item(id, question, [answer, `Other ${id}`], answer, { itemType: "mcq", ...extra });
    const candidates = [
      insulin(
        "insulin-1",
        "Which check applies to the insulin vial before the evening dose in encounter alpha?",
        "Verify the insulin concentration",
        {
          scenario: "Home medications include levothyroxine 125 mcg daily and acetaminophen 500 mg as needed.",
          generationMeta: { mainDrug: "heparin" },
        }
      ),
      insulin(
        "insulin-2",
        "Which counseling point applies to the new Lantus prescription in encounter bravo?",
        "Inject Lantus at the same time each evening",
        { scenario: "Clinic bravo is starting basal insulin the patient has not used before." }
      ),
      insulin(
        "insulin-3",
        "Which high-alert product should be verified during encounter charlie?",
        "Humalog",
        { scenario: "The medication drawer for encounter charlie contains several look-alike vials." }
      ),
      insulin(
        "insulin-4",
        "The list includes spironolactone. Which product is the insulin that must be double-checked in encounter delta?",
        "Confirm the insulin aspart vial",
        { scenario: "Encounter delta is a separate high-alert verification." }
      ),
      item(
        "warfarin-1",
        "Which monitoring step is required before the next warfarin dose in encounter echo?",
        ["Check the INR", "Skip the visit"],
        "Check the INR",
        { scenario: "Encounter echo is a dedicated anticoagulation follow-up." }
      ),
      item(
        "warfarin-2",
        "Which counseling point applies to a new warfarin prescription in encounter foxtrot?",
        ["Report bleeding", "Stop all food"],
        "Report bleeding",
        { scenario: "Encounter foxtrot starts anticoagulation for a first clot." }
      ),
      item(
        "warfarin-3",
        "Which medication interaction should the pharmacist address first during this pneumonia admission?",
        ["Warfarin with the new antibiotic", "Continue every home medication"],
        "Warfarin with the new antibiotic",
        {
          scenario:
            "An older adult is admitted with pneumonia in bay north. Home medications include warfarin 5 mg daily and metoprolol 50 mg twice daily.",
        }
      ),
      item(
        "warfarin-4",
        "Which reconciliation problem is the priority for this second pneumonia admission?",
        ["The warfarin interaction", "A missing vitamin"],
        "The warfarin interaction",
        {
          scenario:
            "A different older adult is admitted with pneumonia in bay south. Home medications include warfarin 2 mg daily and metoprolol 25 mg daily.",
        }
      ),
      item(
        "sertraline-1",
        "Which adverse effect is most likely during the first week of Zoloft in encounter golf?",
        ["Nausea", "Hair loss"],
        "Nausea",
        { scenario: "Encounter golf starts the brand antidepressant." }
      ),
      item(
        "sertraline-2",
        "Which interaction matters most when sertraline is added in encounter hotel?",
        ["Serotonin risk", "No interaction"],
        "Serotonin risk",
        { scenario: "Encounter hotel adds the generic SSRI to an otherwise stable regimen." }
      ),
      item(
        "sertraline-3",
        "Which counseling point applies to a Zoloft refill in encounter india?",
        ["Take it with food", "Stop tomorrow"],
        "Take it with food",
        { scenario: "Encounter india is a refill of the same SSRI under the brand name." }
      ),
      ...Array.from({ length: 55 }, (_, index) => filler(`pharm-fill-${index}`, "pharmacy")),
    ];
    const kept = enforceEntityAndDosageCap(candidates, candidates, 50, "pharmacy");
    const ids = kept.map((row) => row.id);
    expect(ids.filter((id) => id?.startsWith("insulin-"))).toHaveLength(2);
    expect(ids.filter((id) => id?.startsWith("warfarin-"))).toHaveLength(2);
    expect(ids.filter((id) => id?.startsWith("sertraline-"))).toHaveLength(2);
    expect(PHARMACY_DRUG_CAP).toBe(2);

    const assembled = finalizeAssembledSitting({ pool: candidates, limit: 50, fieldId: "pharmacy", seed: 165 });
    expect(assembled.items).toHaveLength(50);
    expect(assembled.items.filter((row) => row.id?.startsWith("insulin-")).length).toBeLessThanOrEqual(2);
    expect(assembled.items.filter((row) => row.id?.startsWith("warfarin-")).length).toBeLessThanOrEqual(2);
    expect(assembled.items.filter((row) => row.id?.startsWith("sertraline-")).length).toBeLessThanOrEqual(2);
  });

  it("holds NCLEX condition caps at 3 and blocks the retest duplicate cases", () => {
    const priority = (id: string, scenario: string) =>
      item(id, "Which finding is the highest priority?", [`Finding ${id}`, "No change"], `Finding ${id}`, { scenario });
    const distinct = (id: string, scenario: string, question: string) =>
      item(id, question, [`Act ${id}`, "Wait"], `Act ${id}`, { scenario });
    const candidates = [
      priority("htn-same-1", "Clinic amber: morning headaches and blurred vision. Blood pressure is 150/95."),
      priority("htn-same-2", "Clinic birch: a different headache pattern. Blood pressure is 162/98."),
      priority("htn-same-3", "Clinic cedar: visual changes today. Blood pressure is 148/96."),
      priority("htn-same-4", "Clinic dune: another elevated reading. Blood pressure is 170/100."),
      distinct(
        "htn-diff-1",
        "Case river is an explicit hypertension follow-up with blood pressure 158/94 and no chest pain.",
        "Which hypertension complication should be reported first in case river?"
      ),
      distinct(
        "htn-diff-2",
        "Case stone is a hypertensive urgency visit with blood pressure 180/110.",
        "Which action comes first for this hypertensive urgency in case stone?"
      ),
      distinct(
        "acs-1",
        "History of hypertension. Crushing chest pain started at rest in bay one.",
        "Which action is first for the client in bay one?"
      ),
      distinct(
        "acs-2",
        "Acute coronary syndrome is the working diagnosis in bay two.",
        "Which monitor is required first in bay two?"
      ),
      distinct(
        "acs-3",
        "The ECG shows an ST-elevation myocardial infarction in bay three.",
        "Which team is activated first in bay three?"
      ),
      distinct(
        "acs-4",
        "Unstable angina recurred after lunch in bay four.",
        "Which medication check is first in bay four?"
      ),
      distinct(
        "pressure-1",
        "A stage 2 pressure injury is present on the sacrum in room maple.",
        "Which dressing is appropriate in room maple?"
      ),
      distinct(
        "pressure-2",
        "The heel has a suspected deep-tissue pressure injury in room oak.",
        "Which offloading plan is required in room oak?"
      ),
      distinct(
        "pressure-3",
        "Documentation describes a decubitus ulcer on the elbow in room pine.",
        "Which turning schedule is required in room pine?"
      ),
      distinct(
        "pressure-4",
        "A new bedsore is reported on the coccyx in room cedarwood.",
        "Which skin assessment is first in room cedarwood?"
      ),
      distinct(
        "mci-1",
        "START triage is underway after the stadium collapse. Case red walks.",
        "Which tag color is assigned to case red?"
      ),
      distinct(
        "mci-2",
        "The mass-casualty drill continues at the north entrance. Case yellow waits.",
        "Which client is delayed in case yellow?"
      ),
      distinct(
        "mci-3",
        "Disaster triage uses black tags for expectant clients. Case black is apart.",
        "Which resource decision applies to case black?"
      ),
      distinct(
        "mci-4",
        "Simple triage and rapid treatment is repeated at the south lawn. Case green sits.",
        "Which instruction is given to case green?"
      ),
      distinct(
        "opioid-open-1",
        "A 40-year-old male client with chronic pain is prescribed an opioid. He has a history of substance use disorder and is currently in recovery. Pain score 8.",
        "Which assessment comes first before the opioid dose for the 40-year-old?"
      ),
      distinct(
        "opioid-open-2",
        "A 55-year-old male client with chronic pain is prescribed an opioid. He has a history of substance use disorder and is currently in recovery. Pain score 4.",
        "Which assessment comes first before the opioid dose for the 55-year-old?"
      ),
      distinct(
        "opioid-3",
        "Postoperative morphine has produced respiratory depression and pinpoint pupils in case harbor.",
        "Which antidote is prepared first in case harbor?"
      ),
      distinct(
        "opioid-4",
        "A client in recovery is prescribed oxycodone and has a substance use disorder history. Case inlet is separate.",
        "Which monitoring plan is required in case inlet?"
      ),
      distinct(
        "opioid-5",
        "Fentanyl was given and naloxone is now ordered for respiratory depression in case jetty.",
        "Which response is watched first in case jetty?"
      ),
      item("shock-a", "Which action is the priority?", ["Epinephrine now", "Diphenhydramine"], "Epinephrine now", {
        scenario:
          "A 33-year-old female in the emergency department, room 352, develops anaphylaxis minutes after ceftriaxone for pyelonephritis. Penicillin allergy. BP 74/42, HR 130, RR 30, SpO2 89%.",
      }),
      item("shock-b", "Which medication is given first?", ["Epinephrine first", "Observe"], "Epinephrine first", {
        scenario:
          "A 35-year-old woman in the emergency department, room 418, develops anaphylaxis minutes after ceftriaxone for pyelonephritis. Penicillin allergy. BP 74/42, HR 130, RR 30, SpO2 89%.",
      }),
      item("ugib-a", "Which action is first?", ["Start fluids", "Offer food"], "Start fluids", {
        scenario:
          "A 77-year-old male with peptic ulcer disease and daily aspirin is pale, cool, and lightheaded. BP 90/56, HR 118, hemoglobin 7.2.",
      }),
      item("ugib-b", "Which order does the nurse anticipate?", ["Large-bore IV access", "Oral diet"], "Large-bore IV access", {
        scenario:
          "Brought from home after vomiting blood, this 74-year-old man has a history of peptic ulcer disease. BP 90/56, HR 118, hemoglobin 7.2. He is pale and lightheaded.",
      }),
      item("colo-a", "Which finding after today's procedure matters most in note alpha?", ["Report bleeding", "Discharge"], "Report bleeding", {
        scenario: "A 45-year-old male is recovering from a colonoscopy performed earlier today. Note alpha records mild cramping.",
      }),
      item("colo-b", "Which finding after today's procedure matters most in note beta?", ["Report bleeding now", "Send home"], "Report bleeding now", {
        scenario: "A 60-year-old male is recovering from a colonoscopy performed earlier today. Note beta records a different cramp score.",
      }),
      item("weight-a", "Which teaching point comes first at this prenatal visit for chart alpha?", ["Review gain", "Ignore weight"], "Review gain", {
        scenario: "A 28-year-old client at a prenatal visit expresses concern about gaining too much weight. Chart alpha is open.",
      }),
      item("weight-b", "Which teaching point comes first at this prenatal visit for chart beta?", ["Review the gain", "Delay teaching"], "Review the gain", {
        scenario: "A 31-year-old client at a prenatal visit expresses concern about gaining too much weight. Chart beta is open.",
      }),
      item("headache-a", "Which complaint is addressed first for client amber?", ["Vision", "Hunger"], "Vision", {
        scenario: "A 52-year-old client presents with complaints of frequent headaches and blurred vision. Blood pressure is 150/95.",
      }),
      item("headache-b", "Which complaint is addressed first for client birch?", ["The headache", "Sleep"], "The headache", {
        scenario: "A 61-year-old female presents with complaints of frequent headaches and blurred vision. Blood pressure is 166/102.",
      }),
      ...Array.from({ length: 80 }, (_, index) => filler(`nurs-fill-${index}`, "nursing")),
    ];

    const kept = enforceEntityAndDosageCap(candidates, candidates, 85, "nursing");
    const count = (prefix: string) => kept.filter((row) => row.id?.startsWith(prefix)).length;
    expect(nursingConditionCap(85)).toBe(3);
    expect(count("htn-")).toBeLessThanOrEqual(3);
    expect(count("htn-same-")).toBeLessThanOrEqual(1);
    expect(count("acs-")).toBeLessThanOrEqual(3);
    expect(count("pressure-")).toBeLessThanOrEqual(3);
    expect(count("mci-")).toBeLessThanOrEqual(3);
    expect(count("opioid-")).toBeLessThanOrEqual(3);
    expect(count("opioid-open-")).toBeLessThanOrEqual(1);
    expect(count("shock-")).toBe(1);
    expect(count("ugib-")).toBe(1);
    expect(count("colo-")).toBe(1);
    expect(count("weight-")).toBe(1);
    expect(count("headache-")).toBeLessThanOrEqual(1);
    expect(kept).toHaveLength(85);

    const delivered = deliverCatSitting(candidates, 85, "nursing");
    const deliveredCount = (prefix: string) => delivered.filter((row) => row.id?.startsWith(prefix)).length;
    expect(delivered).toHaveLength(85);
    expect(deliveredCount("htn-")).toBeLessThanOrEqual(3);
    expect(deliveredCount("acs-")).toBeLessThanOrEqual(3);
    expect(deliveredCount("pressure-")).toBeLessThanOrEqual(3);
    expect(deliveredCount("mci-")).toBeLessThanOrEqual(3);
    expect(deliveredCount("opioid-")).toBeLessThanOrEqual(3);
    expect(deliveredCount("shock-")).toBeLessThanOrEqual(1);
    expect(deliveredCount("ugib-")).toBeLessThanOrEqual(1);
    expect(deliveredCount("colo-")).toBeLessThanOrEqual(1);
    expect(deliveredCount("weight-")).toBeLessThanOrEqual(1);
    expect(deliveredCount("headache-")).toBeLessThanOrEqual(1);
  });
});

describe("retest 166 postpartum, vitals, and medication duplicates", () => {
  const filler = (id: string, field: "pharmacy" | "nursing") =>
    item(
      id,
      field === "pharmacy"
        ? `Which storage step applies to shipment lot ${id} before it leaves the pharmacy vault?`
        : `Which isolation step is required before entering room ${id} for a unique dressing change?`,
      [`Step ${id}`, "Skip the step"],
      `Step ${id}`,
      { itemType: "mcq" }
    );

  const shares = (left: BankItem, right: BankItem, fieldId: string, prefix: string) => {
    const keys = new Set(sittingRepeatKeys(left, fieldId));
    return sittingRepeatKeys(right, fieldId).some((key) => key.startsWith(prefix) && keys.has(key));
  };

  it("counts boggy fundus, atony, lochia, and PPH as postpartum, and caps the topic at 3", () => {
    const boggy = item(
      "pph-boggy",
      "Which finding is reported first?",
      ["Boggy fundus", "Firm fundus"],
      "Boggy fundus",
      {
        scenario:
          "A 32-year-old female on the postpartum unit is dizzy 12 hours after a vaginal delivery. BP 90/60, HR 110. The fundus is boggy and above the umbilicus.",
      }
    );
    const near = item(
      "pph-near",
      "Which vital sign is the priority to report?",
      ["Blood pressure 88/50", "Temperature"],
      "Blood pressure 88/50",
      {
        scenario:
          "Called back for dizziness, this 32-year-old woman is 12 hours after vaginal delivery and has soaked 2 pads per hour. BP 88/50, HR 110. Fundus boggy above the umbilicus.",
      }
    );
    const atony = item(
      "pph-atony",
      "Which protocol is started first?",
      ["Hemorrhage protocol", "Routine fundal checks"],
      "Hemorrhage protocol",
      {
        scenario:
          "Postpartum day 0. Uterine atony, fundus boggy above the umbilicus and deviated right, pad saturated in 15 minutes, HR 118.",
      }
    );
    const pphLabel = item(
      "pph-label",
      "Which finding requires the hemorrhage protocol?",
      ["Saturated pad in 5 minutes", "A firm fundus"],
      "Saturated pad in 5 minutes",
      {
        scenario:
          "Labor and delivery, room 399. A 24-year-old has PPH 30 minutes after delivery. BP 94/60, HR 124, and a pad saturated in 5 minutes.",
      }
    );
    const bluesA = item(
      "blues-a",
      "Which response is the most therapeutic?",
      ["Let us talk about how you feel", "This will pass if you sleep"],
      "Let us talk about how you feel",
      {
        scenario:
          "A 29-year-old woman delivered 12 hours ago. She reports feeling overwhelmed and tearful. The fundus is firm.",
      }
    );
    const bluesB = item(
      "blues-b",
      "Which statement should the nurse make?",
      ["Feeling this way can be frightening. Let us talk.", "Ignore the tears"],
      "Feeling this way can be frightening. Let us talk.",
      {
        scenario:
          "A 22-year-old is 12 hours postpartum and says she feels overwhelmed and tearful about caring for the baby.",
      }
    );
    const engorgement = item(
      "pp-engorge",
      "Which statement needs further teaching?",
      ["I will avoid breastfeeding until the swelling is gone", "I will feed on demand"],
      "I will avoid breastfeeding until the swelling is gone",
      { scenario: "A 28-year-old on postpartum day 2 has breast engorgement and is unsure how to feed." }
    );
    const lochia = item(
      "pp-lochia",
      "Which description of lochia is expected on day 1?",
      ["Lochia rubra", "Clear yellow discharge only"],
      "Lochia rubra",
      { scenario: "The nurse is teaching a postpartum client about normal lochia rubra on the first day." }
    );
    const newborn = item(
      "newborn-1",
      "Which action is first for this newborn?",
      ["Skin to skin", "A full bath"],
      "Skin to skin",
      { scenario: "A newborn is assessed 1 hour after delivery. Acrocyanosis is present and the heart rate is 140." }
    );
    const history = item(
      "history-pph",
      "Which action is first for the chest pain?",
      ["Obtain an ECG", "Offer juice"],
      "Obtain an ECG",
      { scenario: "History of postpartum hemorrhage. She now has crushing chest pain radiating to the jaw." }
    );

    expect(sittingConditionMentions(boggy)).toEqual(
      expect.arrayContaining(["postpartum-hemorrhage", "postpartum"])
    );
    expect(sittingConditionMentions(atony)).toContain("postpartum-hemorrhage");
    expect(sittingConditionMentions(pphLabel)).toContain("postpartum-hemorrhage");
    expect(sittingConditionMentions(lochia)).toContain("postpartum");
    expect(sittingConditionMentions(lochia)).not.toContain("postpartum-hemorrhage");
    expect(sittingConditionMentions(bluesA)).toContain("postpartum");
    expect(sittingConditionMentions(newborn)).not.toContain("postpartum");
    expect(sittingConditionMentions(history)).toContain("acs");
    expect(sittingConditionMentions(history)).not.toContain("postpartum");
    expect(shares(boggy, near, "nursing", "vitals:")).toBe(false);
    expect(shares(boggy, near, "nursing", "vitals-core:")).toBe(false);
    expect(shares(boggy, near, "nursing", "template:boggy-hemorrhage")).toBe(true);
    expect(shares(bluesA, bluesB, "nursing", "template:postpartum-blues")).toBe(true);

    const pool = [
      boggy,
      near,
      atony,
      pphLabel,
      bluesA,
      bluesB,
      engorgement,
      lochia,
      newborn,
      ...Array.from({ length: 90 }, (_, index) => filler(`pp-fill-${index}`, "nursing")),
    ];
    const kept = enforceEntityAndDosageCap(pool, pool, 85, "nursing");
    const postpartum = kept.filter((row) => sittingConditionMentions(row).includes("postpartum"));
    expect(postpartum.length).toBeLessThanOrEqual(3);
    expect(kept.filter((row) => row.id?.startsWith("pph-"))).toHaveLength(1);
    // Template keys scale per 50 items, so an 85-item sitting allows two postpartum-blues stems.
    expect(kept.filter((row) => row.id?.startsWith("blues-"))).toHaveLength(templateRepeatCap(85));
    expect(kept.some((row) => row.id === "newborn-1")).toBe(true);

    const delivered = deliverCatSitting(pool, 85, "nursing");
    const deliveredPostpartum = delivered.filter((row) => sittingConditionMentions(row).includes("postpartum"));
    expect(delivered).toHaveLength(85);
    expect(deliveredPostpartum.length).toBeLessThanOrEqual(3);
    expect(delivered.filter((row) => row.id?.startsWith("pph-")).length).toBeLessThanOrEqual(1);
    expect(delivered.filter((row) => row.id?.startsWith("blues-")).length).toBeLessThanOrEqual(1);
  });

  it("collapses the pediatric asthma pair across peak-flow ratios, SpO2 spellings, and chart vitals", () => {
    const inline = item(
      "asthma-10",
      "Which action is the priority for this child?",
      ["Position upright and give a bronchodilator", "Wait for the next round"],
      "Position upright and give a bronchodilator",
      {
        scenario:
          "A 10-year-old boy is in the pediatric emergency department with moderate asthma after a viral URI. He has intercostal retractions and speaks in short phrases. BP 98/62, HR 118, RR 32, SpO2 90% on room air. Peak flow is 45% of personal best.",
      }
    );
    const unicode = item(
      "asthma-5",
      "Which intervention comes first in this room?",
      ["Upright position, bronchodilator, and continuous pulse ox", "Discharge home"],
      "Upright position, bronchodilator, and continuous pulse ox",
      {
        scenario:
          "Pediatric emergency department, room 345. A 5-year-old boy has moderate asthma with intercostal retractions and short phrases. BP 98/62 mm Hg, HR 118/min, RR 32/min, SpO₂ 90% on room air, PEF 45% of personal best.",
      }
    );
    const peakFlowFirst = item(
      "asthma-pef",
      "Which escalation is required now?",
      ["Continuous pulse oximetry and a bronchodilator", "Routine comfort measures"],
      "Continuous pulse oximetry and a bronchodilator",
      {
        scenario:
          "Peak expiratory flow is 90/200 L/min (45% of personal best). Blood pressure 98/62 mm Hg, pulse 118 beats/min, respirations 32 breaths/min, oxygen sat 90% on room air. A school-age child has intercostal retractions.",
      }
    );
    const equalsForm = item(
      "asthma-equals",
      "Which monitoring plan is started first?",
      ["Bronchodilator and pulse oximetry", "Observe only"],
      "Bronchodilator and pulse oximetry",
      {
        scenario:
          "Moderate asthma with intercostal retractions and short phrases in the pediatric emergency department. BP=98/62, HR=118, RR=32, SpO2=90% on room air. Peak flow=45% of personal best.",
      }
    );
    const chartOnly = item(
      "asthma-chart",
      "Which action should the nurse take first?",
      ["Escalate the asthma treatment", "Offer a snack"],
      "Escalate the asthma treatment",
      {
        scenario:
          "A child in the pediatric emergency department has moderate asthma, intercostal retractions, and is speaking in short phrases.",
        chartData: {
          vitalSigns: "BP 98/62, HR 118, RR 32, SaO2 90% on room air. Peak flow 45% of his personal best.",
        },
      }
    );
    const noPeak = item(
      "asthma-no-pef",
      "Which treatment is given first?",
      ["Bronchodilator now", "A sedative"],
      "Bronchodilator now",
      {
        scenario:
          "Another wording of the same exacerbation, without a peak-flow percent. BP 98/62, HR 118, RR 32, SpO2 90% on room air, intercostal retractions, short phrases.",
      }
    );

    expect(sittingCaseFingerprint(inline)).not.toBe(sittingCaseFingerprint(unicode));
    expect(sittingVitalFingerprint(inline)).toBe(sittingVitalFingerprint(unicode));
    expect(sittingVitalFingerprint(inline)).toBe(sittingVitalFingerprint(peakFlowFirst));
    expect(sittingVitalFingerprint(inline)).toBe(sittingVitalFingerprint(equalsForm));
    expect(sittingVitalFingerprint(inline)).toBe(sittingVitalFingerprint(chartOnly));
    expect(sittingVitalFingerprint(inline)).not.toBe(sittingVitalFingerprint(noPeak));
    expect(shares(inline, noPeak, "nursing", "vitals-core:")).toBe(true);

    const pool = [
      inline,
      unicode,
      peakFlowFirst,
      noPeak,
      ...Array.from({ length: 40 }, (_, index) => filler(`asthma-fill-${index}`, "nursing")),
    ];
    const kept = enforceEntityAndDosageCap(pool, pool, 40, "nursing");
    expect(
      kept.filter((row) => row.id?.startsWith("asthma-") && !row.id.startsWith("asthma-fill"))
    ).toHaveLength(1);
  });

  it("collapses medication scenarios that have no abnormal vitals, and the repeated pharmacy and nursing templates", () => {
    const chemoA = item(
      "chemo-a",
      "Which antiemetic should be added?",
      ["Add aprepitant", "Add a second dose of ondansetron only"],
      "Add aprepitant",
      {
        scenario:
          "A 55-year-old female with breast cancer receiving chemotherapy has severe nausea and vomiting despite ondansetron 8 mg three times daily plus dexamethasone.",
      }
    );
    const chemoB = item(
      "chemo-b",
      "Which antiemetic is indicated for this regimen?",
      ["Aprepitant", "Diphenhydramine"],
      "Aprepitant",
      {
        scenario:
          "A 55-year-old female on pantoprazole with breast cancer receiving chemotherapy has severe nausea and vomiting despite ondansetron 8 mg three times daily plus dexamethasone.",
      }
    );
    const gabaA = item(
      "gaba-a",
      "Which reference should be checked before answering?",
      ["Micromedex", "A general news site"],
      "Micromedex",
      {
        scenario:
          "A pharmacist receives a question about off-label gabapentin for neuropathic pain in CKD.",
      }
    );
    const gabaB = item(
      "gaba-b",
      "Which resource is required for this off-label question?",
      ["Micromedex", "Wikipedia"],
      "Micromedex",
      {
        scenario:
          "A pharmacist is asked about off-label gabapentin for neuropathic pain in renal impairment.",
      }
    );
    const lamoA = item(
      "lamo-a",
      "A 28-year-old female with epilepsy on lamotrigine 100 mg twice daily starts ethinyl estradiol. Which change is required after breakthrough seizures?",
      ["Increase the lamotrigine dose", "Stop the contraceptive"],
      "Increase the lamotrigine dose"
    );
    const lamoB = item(
      "lamo-b",
      "A 30-year-old female with epilepsy on lamotrigine 200 mg twice daily starts an oral contraceptive and has breakthrough seizures. Which dose change is appropriate?",
      ["Increase lamotrigine", "Decrease lamotrigine"],
      "Increase lamotrigine"
    );
    const foodA = item(
      "food-a",
      "A 50-year-old male with hypertension takes metoprolol tartrate 100 mg twice daily with a high-fat meal. What happens to bioavailability?",
      ["Increased bioavailability", "No change"],
      "Increased bioavailability"
    );
    const foodB = item(
      "food-b",
      "A 55-year-old male with hypertension is prescribed metoprolol tartrate and is concerned about food. Which administration instruction is correct?",
      ["Take with food", "Take on an empty stomach only"],
      "Take with food"
    );
    const loadA = item(
      "load-a",
      "What is the primary purpose of administering a loading dose of digoxin?",
      ["Achieve therapeutic levels rapidly", "Reduce the maintenance dose forever"],
      "Achieve therapeutic levels rapidly"
    );
    const loadB = item(
      "load-b",
      "What is the primary purpose of administering a loading dose of phenytoin?",
      ["Achieve therapeutic levels rapidly", "Avoid all monitoring"],
      "Achieve therapeutic levels rapidly"
    );
    const vdA = item(
      "vd-a",
      "How does CKD change the volume of distribution of vancomycin?",
      ["Increases Vd due to fluid retention", "Vd never changes"],
      "Increases Vd due to fluid retention",
      { scenario: "A 70-year-old female with CKD stage 3 is admitted with pneumonia." }
    );
    const vdB = item(
      "vd-b",
      "How does CKD affect the Vd of digoxin?",
      ["Decrease the Vd", "Increase the Vd"],
      "Decrease the Vd",
      { scenario: "A 45-year-old female with CKD stage 3 is prescribed digoxin for atrial fibrillation." }
    );
    const holdA = item(
      "hold-a",
      "When should apixaban be stopped before elective hip replacement?",
      ["Discontinue 48 hours before surgery", "Continue through the incision"],
      "Discontinue 48 hours before surgery",
      { scenario: "A 70-year-old male with atrial fibrillation is scheduled for hip replacement in two weeks and takes apixaban 5 mg twice daily." }
    );
    const holdB = item(
      "hold-b",
      "How long is rivaroxaban held before hip surgery?",
      ["Hold 48 hours before surgery", "Bridge with heparin"],
      "Hold 48 hours before surgery",
      { scenario: "A 72-year-old female with atrial fibrillation and a history of DVT will have an elective hip replacement. She takes rivaroxaban 20 mg daily." }
    );
    const alarmA = item(
      "alarm-a",
      "A 68-year-old woman forgets her once-daily tiotropium. Which adherence step is best?",
      ["Set a daily alarm", "Double the next dose"],
      "Set a daily alarm"
    );
    const alarmB = item(
      "alarm-b",
      "A 55-year-old female forgets her weekly methotrexate doses. Which reminder is appropriate?",
      ["Set a weekly reminder", "Take it only when pain returns"],
      "Set a weekly reminder"
    );
    const dietA = item(
      "diet-a",
      "The nurse is teaching a client prescribed warfarin. Which dietary instruction is given?",
      ["Limit leafy green vegetables", "Avoid all fluids"],
      "Limit leafy green vegetables"
    );
    const dietB = item(
      "diet-b",
      "A 60-year-old client with atrial fibrillation is prescribed warfarin and asks about food. Which statement is the keyed teaching?",
      ["Avoid foods high in vitamin K", "Eat more spinach every day"],
      "Avoid foods high in vitamin K"
    );
    const gownA = item(
      "gown-a",
      "A client with MRSA pneumonia is on contact precautions. Which protective equipment does the nurse wear to enter?",
      ["Gown and gloves", "A surgical mask only"],
      "Gown and gloves"
    );
    const gownB = item(
      "gown-b",
      "The nurse is caring for a client on contact precautions. What is donned before entering the room?",
      ["Gown and gloves", "Sterile gloves only"],
      "Gown and gloves"
    );
    const soap = item(
      "cdiff-soap",
      "A client with C. difficile is on contact precautions. Which hand hygiene is required?",
      ["Soap and water", "Gown and gloves as a substitute for handwashing"],
      "Soap and water"
    );
    const calc = (id: string, drug: string, dose: string) =>
      item(
        id,
        `${drug} ${dose} mg/kg/day PO divided through the day. What dose (mg) per administration? Round to the nearest whole number.`,
        [`${id} mg`, "Hold the dose"],
        `${id} mg`
      );
    const rate = item(
      "rate-1",
      "What rate (mL/hr) should the nurse set for this antibiotic infusion? Round to the nearest whole number.",
      ["25 mL/hr", "Stop the infusion"],
      "25 mL/hr"
    );
    const sameWrong = [
      "Wait until the next scheduled assessment round before doing anything else at the bedside.",
      "Restrict all oral intake for 24 hours without a provider order or a swallowing evaluation.",
      "Complete routine comfort measures for all other assigned clients before returning.",
    ];
    const distractor = (id: string, scenario: string, correct: string) =>
      item(id, "Which action should the nurse take first?", [correct, ...sameWrong], correct, { scenario });

    expect(sittingCaseFingerprint(chemoA)).not.toBe(sittingCaseFingerprint(chemoB));
    expect(sittingVitalFingerprint(chemoA)).toBeNull();
    expect(sittingVitalFingerprint(chemoB)).toBeNull();
    expect(shares(chemoA, chemoB, "pharmacy", "rxcase:")).toBe(true);
    expect(sittingCaseFingerprint(gabaA)).not.toBe(sittingCaseFingerprint(gabaB));
    expect(shares(gabaA, gabaB, "pharmacy", "rxcase:")).toBe(true);
    expect(shares(lamoA, lamoB, "pharmacy", "template:lamotrigine-oc")).toBe(true);
    expect(shares(foodA, foodB, "pharmacy", "template:metoprolol-food")).toBe(true);
    expect(shares(loadA, loadB, "pharmacy", "template:loading-dose")).toBe(true);
    expect(shares(vdA, vdB, "pharmacy", "template:ckd-vd")).toBe(true);
    expect(shares(holdA, holdB, "pharmacy", "template:hold-doac-surgery")).toBe(true);
    expect(shares(alarmA, alarmB, "pharmacy", "template:adherence-alarm")).toBe(true);
    expect(shares(dietA, dietB, "nursing", "template:warfarin-diet")).toBe(true);
    expect(shares(gownA, gownB, "nursing", "template:contact-gown-gloves")).toBe(true);
    expect(sittingRepeatKeys(soap, "nursing").some((key) => key === "template:contact-gown-gloves")).toBe(false);
    expect(shares(calc("calc-pred", "Prednisolone", "2"), calc("calc-fur", "Furosemide", "2"), "nursing", "template:mgkg-per-admin")).toBe(
      true
    );

    const pharmacyPool = [
      chemoA,
      chemoB,
      gabaA,
      gabaB,
      lamoA,
      lamoB,
      foodA,
      foodB,
      loadA,
      loadB,
      vdA,
      vdB,
      holdA,
      holdB,
      alarmA,
      alarmB,
      item(
        "sertraline-distinct",
        "A 45-year-old male has taken sertraline 100 mg for 6 weeks and reports sexual dysfunction. Which change is preferred?",
        ["Switch to bupropion", "Double sertraline"],
        "Switch to bupropion"
      ),
      ...Array.from({ length: 55 }, (_, index) => filler(`rx-fill-${index}`, "pharmacy")),
    ];
    const pharmacyKept = enforceEntityAndDosageCap(pharmacyPool, pharmacyPool, 50, "pharmacy");
    expect(pharmacyKept).toHaveLength(50);
    expect(pharmacyKept.filter((row) => row.id?.startsWith("chemo-"))).toHaveLength(1);
    expect(pharmacyKept.filter((row) => row.id?.startsWith("gaba-"))).toHaveLength(1);
    expect(pharmacyKept.filter((row) => row.id?.startsWith("lamo-"))).toHaveLength(1);
    expect(pharmacyKept.filter((row) => row.id?.startsWith("food-"))).toHaveLength(1);
    expect(pharmacyKept.filter((row) => /loading dose/i.test(row.question))).toHaveLength(1);
    expect(pharmacyKept.filter((row) => /volume of distribution|\bVd\b/i.test(row.question))).toHaveLength(1);
    expect(pharmacyKept.filter((row) => row.id?.startsWith("hold-"))).toHaveLength(1);
    expect(pharmacyKept.filter((row) => row.id?.startsWith("alarm-"))).toHaveLength(1);
    expect(pharmacyKept.some((row) => row.id === "sertraline-distinct")).toBe(true);

    const nursingPool = [
      dietA,
      dietB,
      gownA,
      gownB,
      soap,
      calc("calc-pred", "Prednisolone", "2"),
      calc("calc-fur", "Furosemide", "2"),
      calc("calc-apap", "Acetaminophen", "60"),
      rate,
      distractor(
        "dist-ugib",
        "A 74-year-old male with an upper GI bleed is pale. BP 90/56, HR 118, hemoglobin 7.2.",
        "Obtain IV access and prepare for endoscopy."
      ),
      distractor(
        "dist-asthma-a",
        "A 10-year-old boy has moderate asthma in the pediatric emergency department. BP 98/62, HR 118, RR 32, SpO2 90%.",
        "Position upright and give a bronchodilator."
      ),
      distractor(
        "dist-asthma-b",
        "A different clinic visit for a sprained ankle, with no shared vitals and a different story entirely, still reused the long wrong answers.",
        "Apply ice and reassess circulation in the foot."
      ),
      ...Array.from({ length: 40 }, (_, index) => filler(`rn-fill-${index}`, "nursing")),
    ];
    const nursingKept = enforceEntityAndDosageCap(nursingPool, nursingPool, 40, "nursing");
    expect(nursingKept.filter((row) => row.id?.startsWith("diet-"))).toHaveLength(1);
    expect(nursingKept.filter((row) => row.id?.startsWith("gown-"))).toHaveLength(1);
    expect(nursingKept.some((row) => row.id === "cdiff-soap")).toBe(true);
    expect(nursingKept.filter((row) => row.id?.startsWith("calc-"))).toHaveLength(1);
    expect(nursingKept.some((row) => row.id === "rate-1")).toBe(true);
    expect(nursingKept.filter((row) => row.id?.startsWith("dist-"))).toHaveLength(1);
    expect(nursingKept).toHaveLength(40);
  });

  it("still composes a 50-question pharmacy sitting from distinct items", () => {
    const pool = Array.from({ length: 70 }, (_, index) => filler(`compose-${index}`, "pharmacy"));
    const kept = enforceEntityAndDosageCap(pool, pool, 50, "pharmacy");
    expect(kept).toHaveLength(50);
  });
});

describe("retest 167 misses", () => {
  const giA = item(
    "cmqwqluo500091yel8a8679i5",
    "What is the most appropriate immediate action?",
    [
      "Establish large-bore IV access, begin fluid resuscitation, and notify the provider for transfusion and urgent endoscopy",
      "Give the scheduled low-dose aspirin and recheck vital signs in 1 hour",
    ],
    "Establish large-bore IV access, begin fluid resuscitation, and notify the provider for transfusion and urgent endoscopy",
    {
      scenario:
        "A 77-year-old male is admitted to the medical-surgical unit with an upper gastrointestinal bleed. His medical history includes peptic ulcer disease and chronic aspirin use. Overnight, he experienced melena, and upon assessment, his vital signs reveal a blood pressure of 90/56 mmHg, heart rate of 118 bpm, and hemoglobin level of 7.2 g/dL. The client appears pale with cool extremities, reports feeling lightheaded when repositioning, and has a capillary refill time of 3 seconds.",
    }
  );
  const giB = item(
    "cmpnjm27z0nor1ymxab1gpzhb",
    "What is the nurse's priority action?",
    [
      "Complete routine comfort measures for all other assigned clients before addressing abnormal findings.",
      "Establish IV access, infuse fluids and blood per protocol, monitor vital signs and mental status, and prepare for endoscopy.",
    ],
    "Establish IV access, infuse fluids and blood per protocol, monitor vital signs and mental status, and prepare for endoscopy.",
    {
      scenario:
        "A 74-year-old male is admitted to the medical-surgical unit with an upper gastrointestinal (GI) bleed, attributed to his history of peptic ulcer disease and chronic aspirin use. He presents with active melena and shows signs of hypovolemic shock, including a blood pressure of 90/56 mmHg, heart rate of 118 bpm, and hemoglobin level of 7.2 g/dL. The client appears pale with cool extremities and reports feeling lightheaded upon repositioning.",
    }
  );

  it("treats hemoglobin level of 7.2 as the same GI-bleed case", () => {
    const keysA = sittingRepeatKeys(giA, "nursing");
    const keysB = sittingRepeatKeys(giB, "nursing");
    expect(sittingVitalFingerprint(giA)).toBe(sittingVitalFingerprint(giB));
    expect(sittingVitalFingerprint(giA)).toContain("hgb=7.2");
    expect(keysA.some((key) => keysB.includes(key) && key.startsWith("vitals:"))).toBe(true);
    expect(sittingConditionMentions(giA)).toContain("gi-bleed");
    const kept = enforceEntityAndDosageCap([giA, giB], [giA, giB], 2, "nursing");
    expect(kept.filter((row) => row.id === giA.id || row.id === giB.id)).toHaveLength(1);
  });

  it("shares one pediatric mg/kg key when the dose lives in the scenario", () => {
    const question = "What dose (mg) per administration? (Round to the nearest whole number.)";
    const rows = [
      item("cmr1bhh7v003c1yrm20vw2xux", question, [], "11 mg", {
        scenario: "Furosemide 2 mg/kg/day PO divided every 12 hours is ordered for a child weighing 11 kg.",
        itemType: "vignette",
      }),
      item("cmr1bhgpw00371yrm9rygq9ta", question, [], "180 mg", {
        scenario: "Azithromycin 10 mg/kg/day PO divided once daily is ordered for a child weighing 18 kg.",
        itemType: "vignette",
      }),
      item("cmr1bhh0m003a1yrmawzvszui", question, [], "160 mg", {
        scenario: "Clindamycin 30 mg/kg/day PO divided every 8 hours is ordered for a child weighing 16 kg.",
        itemType: "vignette",
      }),
      item("cmr1bhgcc00331yrme7wr9p5l", "What dose (mg) should the nurse administer per dose?", [], "100 mg", {
        scenario: "Cefazolin 25 mg/kg/day IV divided every 8 hours is ordered for a child weighing 12 kg.",
        itemType: "vignette",
      }),
    ];
    for (const row of rows) {
      expect(sittingRepeatKeys(row, "nursing")).toContain("template:mgkg-per-admin");
    }
    expect(calcTemplateAsk(question)).toBeTruthy();
    const fillers = Array.from({ length: 20 }, (_, index) =>
      item(`peds-fill-${index}`, `Which isolation step is required before entering room ${index}?`, [`Step ${index}`, "Skip"], `Step ${index}`)
    );
    const kept = enforceEntityAndDosageCap([...rows, ...fillers], [...rows, ...fillers], 12, "nursing");
    expect(kept.filter((row) => rows.some((candidate) => candidate.id === row.id))).toHaveLength(1);
  });

  it("caps the new NCLEX conditions at 3 and recognizes the retest topics", () => {
    const samples: { id: string; scenario: string; key: string }[] = [
      { id: "copd", scenario: "A 60-year-old male is admitted with a COPD exacerbation on oxygen at 2 L/min by nasal cannula.", key: "copd" },
      { id: "t2dm", scenario: "A 55-year-old with type 2 diabetes takes metformin and is admitted for hyperglycemia.", key: "type-2-diabetes" },
      { id: "dka", scenario: "A client in diabetic ketoacidosis has a glucose of 480 and is receiving an insulin infusion.", key: "dka" },
      { id: "gib", scenario: "The client has an upper GI bleed with melena and a dropping hemoglobin.", key: "gi-bleed" },
      { id: "etoh", scenario: "A male client in alcohol withdrawal is anxious with tremors. CIWA scoring is due.", key: "alcohol-withdrawal" },
      { id: "mood", scenario: "A 16-year-old reports depression and refuses to leave the room. The client is not suicidal.", key: "depression" },
      { id: "oa", scenario: "An older adult with osteoarthritis pain rates the knee 8 out of 10.", key: "arthritis-pain" },
      { id: "vax", scenario: "The nurse reviews the immunization record before giving the scheduled vaccine.", key: "immunization" },
      { id: "asthma", scenario: "A child with asthma has wheezing after a viral illness.", key: "asthma" },
      { id: "postop", scenario: "Postoperative pain is 7 out of 10 on the day after surgery.", key: "postop-pain" },
      { id: "anc", scenario: "The client is neutropenic after chemotherapy and has a fever.", key: "neutropenia" },
      { id: "cinv", scenario: "Chemotherapy-induced nausea continues despite the scheduled antiemetic.", key: "cinv" },
      { id: "thyroid", scenario: "After thyroidectomy the client has perioral tingling from hypocalcemia.", key: "thyroid" },
    ];
    for (const sample of samples) {
      const row = item(sample.id, "Which action is the priority?", ["Act", "Wait"], "Act", { scenario: sample.scenario });
      expect(sittingConditionMentions(row)).toContain(sample.key);
    }
    expect(
      sittingConditionMentions(
        item("resp", "Which assessment is first?", ["Rate", "Appetite"], "Rate", {
          scenario: "Postoperative morphine has produced respiratory depression and pinpoint pupils.",
        })
      )
    ).not.toContain("depression");

    const places = ["alpha", "bravo", "charlie", "delta", "echo", "foxtrot", "golf", "hotel", "india", "juliet"];
    const copd = (id: string, place: string) =>
      item(
        id,
        `Which observation belongs in the ${place} respiratory note?`,
        [`Document ${place} work of breathing`, `Skip the ${place} note`],
        `Document ${place} work of breathing`,
        {
          scenario: `A rancher from ${place} county arrives tripoding with pursed lips during a COPD exacerbation and needs oxygen.`,
        }
      );
    const pool = [
      ...Array.from({ length: 6 }, (_, index) => copd(`copd-${index}`, places[index]!)),
      ...Array.from({ length: 40 }, (_, index) =>
        item(`cond-fill-${index}`, `Which isolation step is required before entering room ${index}?`, [`Step ${index}`, "Skip"], `Step ${index}`)
      ),
    ];
    const keptShort = enforceEntityAndDosageCap(pool, pool, 30, "nursing");
    expect(nursingConditionCap(30)).toBe(2);
    expect(keptShort.filter((row) => /copd/i.test(itemClinicalText(row)))).toHaveLength(2);
    const longPool = [
      ...Array.from({ length: 8 }, (_, index) => copd(`copd-long-${index}`, places[index]!)),
      ...Array.from({ length: 80 }, (_, index) =>
        item(`cond-long-fill-${index}`, `Which isolation step is required before entering room long-${index}?`, [`Long step ${index}`, "Skip"], `Long step ${index}`)
      ),
    ];
    const keptLong = enforceEntityAndDosageCap(longPool, longPool, 75, "nursing");
    expect(nursingConditionCap(75)).toBe(3);
    expect(keptLong.filter((row) => /copd/i.test(itemClinicalText(row)))).toHaveLength(3);
  });

  it("counts warfarin in a current-medications sentence and the added interaction drugs", () => {
    const q44 = item(
      "q44",
      "What is the most appropriate action for the pharmacist to take before dispensing the amiodarone?",
      [],
      "Contact the prescriber to discuss potential drug interactions.",
      {
        scenario:
          "A 65-year-old female patient with a history of atrial fibrillation and hypertension presents to the pharmacy with a new prescription for amiodarone 200 mg daily. Her current medications include warfarin 5 mg daily, lisinopril 20 mg daily, and metoprolol 50 mg twice daily. Her recent INR is 2.8.",
      }
    );
    expect(sittingDrugMentions(q44)).toEqual(expect.arrayContaining(["amiodarone", "warfarin", "lisinopril", "metoprolol"]));
    const names = [
      "amiodarone",
      "fluconazole",
      "carbamazepine",
      "diltiazem",
      "oxycodone",
      "hydromorphone",
      "prasugrel",
      "valproic acid",
      "famotidine",
      "citalopram",
      "aprepitant",
    ];
    for (const name of names) {
      expect(sittingDrugMentions(item(name, `Patient takes ${name}.`, [], ""))).not.toHaveLength(0);
    }
    const warfarinItems = ["q21", "q42", "q44"].map((id, index) =>
      item(
        id,
        index === 0
          ? "What potential interaction should the pharmacist be concerned about?"
          : index === 1
            ? "What is the likely effect of adding fluconazole on the patient's INR?"
            : q44.question,
        index === 1 ? ["Increase the INR", "No effect"] : ["Contact the prescriber", "Dispense as written"],
        index === 1 ? "Increase the INR" : index === 0 ? "Levofloxacin and warfarin" : q44.correctAnswer,
        {
          scenario:
            index === 0
              ? "Home medications include warfarin, metoprolol, and simvastatin. The pharmacist notes an order for levofloxacin."
              : index === 1
                ? "A 50-year-old male is taking warfarin for atrial fibrillation. He is prescribed fluconazole. His INR is 2.5."
                : q44.scenario,
        }
      )
    );
    const fillers = Array.from({ length: 20 }, (_, index) =>
      item(`warf-fill-${index}`, `Which storage step applies to shipment lot ${index}?`, [`Step ${index}`, "Skip"], `Step ${index}`)
    );
    const kept = enforceEntityAndDosageCap([...warfarinItems, ...fillers], [...warfarinItems, ...fillers], 15, "pharmacy");
    expect(kept.filter((row) => sittingRepeatKeys(row, "pharmacy").includes("template:warfarin-interaction"))).toHaveLength(1);
    expect(sittingRepeatKeys(warfarinItems[1]!, "pharmacy")).toContain("template:warfarin-interaction");
  });

  it("caps steady-state and renal dose-reduction templates once per pharmacy sitting", () => {
    const steady = (id: string, drug: string) =>
      item(
        id,
        `Approximately how many half-lives does it take for ${drug} to reach steady state?`,
        ["3 to 5 half-lives", "1 half-life"],
        "3 to 5 half-lives",
        { scenario: `${drug} case ${id} has its own indication and a unique chart.` }
      );
    const renal = (id: string, drug: string) =>
      item(
        id,
        `What adjustment should be made to the ${drug} dose for this kidney function?`,
        ["Decrease the dose", "No change"],
        "Decrease the dose",
        { scenario: `CrCl is reduced in case ${id}. The ${drug} order needs a renal review.` }
      );
    const rows = [steady("ss-1", "amiodarone"), steady("ss-2", "carbamazepine"), renal("ren-1", "gabapentin"), renal("ren-2", "levofloxacin")];
    const fillers = Array.from({ length: 20 }, (_, index) =>
      item(`tpl-fill-${index}`, `Which storage step applies to shipment lot ${index}?`, [`Step ${index}`, "Skip"], `Step ${index}`)
    );
    const kept = enforceEntityAndDosageCap([...rows, ...fillers], [...rows, ...fillers], 16, "pharmacy");
    expect(kept.filter((row) => /steady state/i.test(row.question))).toHaveLength(1);
    expect(kept.filter((row) => /kidney function/i.test(row.question))).toHaveLength(1);
  });

  it("accepts a bow-tie before regular questions use up its condition, and ignores choice-column tags", () => {
    const bowtie = item(
      "ngn:hypoglycemia",
      "Complete the diagram: choose the condition, 2 actions, and 2 parameters.",
      ["Give dextrose", "Give albuterol"],
      "Give dextrose",
      {
        itemType: "ngn_bowtie",
        scenario: "The client is NPO, alert, and pale.",
        ngnPayload: {
          kind: "bow_tie",
          condition: "Hypoglycemia",
          conditionOptions: ["Hypoglycemia", "COPD exacerbation", "Type 2 diabetes", "Upper GI bleed", "Asthma"],
          actions: ["Give IV dextrose", "Give a nebulized bronchodilator for COPD"],
          monitors: ["Glucose", "Peak flow"],
        },
      }
    );
    const cloze = item(
      "ngn:cloze-pain",
      "Complete the cloze about the postoperative client.",
      [],
      "pain=opioid",
      {
        itemType: "ngn_dropdown",
        scenario: "The client is one day after surgery.",
        ngnPayload: {
          kind: "dropdown",
          template: "The priority finding is postoperative pain.",
          dropdowns: [
            {
              id: "pain",
              key: "opioid",
              options: [
                { id: "opioid", text: "an opioid" },
                { id: "copd", text: "a COPD exacerbation" },
                { id: "dka", text: "diabetic ketoacidosis" },
              ],
            },
          ],
        },
      }
    );
    expect(sittingConditionMentions(bowtie)).toContain("hypoglycemia");
    expect(sittingConditionMentions(bowtie)).not.toContain("copd");
    expect(sittingConditionMentions(bowtie)).not.toContain("type-2-diabetes");
    expect(sittingConditionMentions(bowtie)).not.toContain("gi-bleed");
    expect(sittingConditionMentions(bowtie)).not.toContain("asthma");
    expect(sittingConditionMentions(cloze)).toContain("postop-pain");
    expect(sittingConditionMentions(cloze)).not.toContain("copd");
    expect(sittingConditionMentions(cloze)).not.toContain("dka");

    const hypoPlaces = ["maple", "cedar", "birch", "spruce"];
    const hypo = (id: string, place: string) =>
      item(
        id,
        `Which snack does the ${place} aide bring first?`,
        [`Bring juice to the ${place} bedside`, "Wait for the meal tray"],
        `Bring juice to the ${place} bedside`,
        {
          scenario: `A visitor in the ${place} lounge finds the client pale, sweaty, and confused from hypoglycemia.`,
        }
      );
    const fillers = Array.from({ length: 8 }, (_, index) =>
      item(`ngn-fill-${index}`, `Which isolation step is required before entering room ngn-${index}?`, [`Step ${index}`, "Skip"], `Step ${index}`)
    );
    const pool = [
      ...hypoPlaces.map((place, index) => hypo(`h${index + 1}`, place)),
      bowtie,
      cloze,
      ...fillers,
    ];
    const limit = 12;
    const kept = enforceEntityAndDosageCap(pool, pool, limit, "nursing");
    const hypoKept = kept.filter((row) => sittingConditionMentions(row).includes("hypoglycemia"));
    expect(kept.some((row) => row.id === bowtie.id)).toBe(true);
    expect(kept.some((row) => row.id === cloze.id)).toBe(true);
    expect(nursingConditionCap(limit)).toBe(2);
    expect(hypoKept).toHaveLength(nursingConditionCap(limit));
    expect(hypoKept.some((row) => row.id === bowtie.id)).toBe(true);
  });

  it("spreads pharmacy numeric entries through the sitting for a session id", () => {
    const calcs = [
      item(
        "spread-calc-0",
        "How many milligrams of vancomycin are required for this adult? Round to the nearest whole milligram.",
        [],
        "1000",
        { itemType: "constructed_response", scenario: "A 70 kg adult in the east clinic is due for a vancomycin infusion." }
      ),
      item(
        "spread-calc-1",
        "Calculate the piperacillin infusion rate in mL/hr for this order.",
        [],
        "125",
        { itemType: "constructed_response", scenario: "The west clinic is starting a piperacillin infusion over two hours." }
      ),
      item(
        "spread-calc-2",
        "How many levothyroxine tablets should be dispensed for a 30-day supply?",
        [],
        "30",
        { itemType: "constructed_response", scenario: "The south pharmacy is filling a once-daily levothyroxine supply." }
      ),
      item(
        "spread-calc-3",
        "What is the cefazolin concentration in mg/mL after reconstitution?",
        [],
        "100",
        { itemType: "calculation", scenario: "The north hood is reconstituting a cefazolin vial with sterile water." }
      ),
    ];
    const filler = (id: string) =>
      item(id, `Which counseling point applies to refill case ${id}?`, [`Point ${id}`, "Skip"], `Point ${id}`, {
        itemType: "mcq",
      });
    const pool = [
      ...calcs,
      ...Array.from({ length: 46 }, (_, index) => filler(`spread-fill-${index}`)),
    ];
    const seed = sessionOrderSeed("cmuxg3v8fhewk6nw8");
    const first = finalizeAssembledSitting({ pool, limit: 50, fieldId: "pharmacy", seed });
    const second = finalizeAssembledSitting({ pool, limit: 50, fieldId: "pharmacy", seed });
    const indexes = first.items.flatMap((row, index) => (isPharmacyCalculationItem(row) ? [index] : []));
    expect(first.items.map((row) => row.id)).toEqual(second.items.map((row) => row.id));
    expect(indexes.length).toBeGreaterThanOrEqual(4);
    expect(indexes.every((index, position) => index === position)).toBe(false);
    expect(indexes[indexes.length - 1]! - indexes[0]!).toBeGreaterThan(10);
    expect(spreadPharmacyNumericEntries(first.items, seed).map((row) => row.id)).toEqual(first.items.map((row) => row.id));
    const other = finalizeAssembledSitting({
      pool,
      limit: 50,
      fieldId: "pharmacy",
      seed: sessionOrderSeed("cmuxg6m8gi59ru2e0"),
    });
    const otherIndexes = other.items.flatMap((row, index) => (isPharmacyCalculationItem(row) ? [index] : []));
    expect(otherIndexes.join(",")).not.toBe(indexes.join(","));
  });
});

describe("length-scaled sitting caps", () => {
  const lengths = [50, 100, 135, 150, 200, 225, 250, 280, 300] as const;

  it("scales drug, template, narrow, and condition caps, and matches today's caps at 50", () => {
    expect(perFiftyCap(2, 50)).toBe(2);
    expect(perFiftyCap(2, 225)).toBe(9);
    const drug = { 50: 2, 100: 4, 135: 6, 150: 6, 200: 8, 225: 9, 250: 10, 280: 12, 300: 12 };
    const template = { 50: 1, 100: 2, 135: 3, 150: 3, 200: 4, 225: 5, 250: 5, 280: 6, 300: 6 };
    const background = { 50: 4, 100: 8, 135: 11, 150: 12, 200: 16, 225: 18, 250: 20, 280: 23, 300: 24 };
    const narrow = { 50: 2, 100: 4, 135: 4, 150: 4, 200: 6, 225: 6, 250: 7, 280: 8, 300: 8 };
    const condition = { 50: 2, 100: 4, 135: 5, 150: 6, 200: 8, 225: 8, 250: 9, 280: 10, 300: 11 };
    for (const length of lengths) {
      expect(pharmacyDrugCap(length)).toBe(drug[length]);
      expect(templateRepeatCap(length)).toBe(template[length]);
      expect(pharmacyBackgroundDrugCap(length)).toBe(background[length]);
      expect(narrowTopicShareCap(length)).toBe(narrow[length]);
      expect(nursingConditionCap(length)).toBe(condition[length]);
    }
    expect(PHARMACY_DRUG_CAP).toBe(2);
    expect(nursingConditionCap(30)).toBe(2);
    expect(nursingConditionCap(75)).toBe(3);
    expect(nursingConditionCap(85)).toBe(3);
    expect(narrowTopicShareCap(91)).toBe(4);
  });

  it("does not treat cholesterol or sterol as drugs", () => {
    const cholesterol = item(
      "chol",
      "Which lifestyle note belongs in the chart?",
      ["Diet counseling", "No note"],
      "Diet counseling",
      { scenario: "The lipid panel shows high cholesterol. The membrane sterol content is not a medicine." }
    );
    expect(sittingDrugMentions(cholesterol)).not.toContain("cholesterol");
    expect(sittingDrugMentions(cholesterol)).not.toContain("sterol");
    const formoterol = item(
      "form",
      "Which counseling point applies to the new formoterol inhaler?",
      ["Rinse the mouth", "Stop tomorrow"],
      "Rinse the mouth",
      { scenario: "Clinic formoterol is starting a long-acting inhaler the patient has not used." }
    );
    expect(sittingDrugMentions(formoterol)).toContain("formoterol");
  });

  it("counts med-list drugs as background and still returns them from sittingDrugMentions", () => {
    const row = item(
      "split",
      "What is the most appropriate action before dispensing the amiodarone?",
      ["Contact the prescriber", "Dispense as written"],
      "Contact the prescriber",
      {
        scenario:
          "Her current medications include warfarin 5 mg daily, lisinopril 20 mg daily, and metoprolol 50 mg twice daily.",
      }
    );
    const split = sittingDrugSplit(row);
    expect(split.subject).toContain("amiodarone");
    expect(split.subject).not.toContain("lisinopril");
    expect(split.background).toEqual(expect.arrayContaining(["warfarin", "lisinopril", "metoprolol"]));
    expect(sittingDrugMentions(row)).toEqual(
      expect.arrayContaining(["amiodarone", "warfarin", "lisinopril", "metoprolol"])
    );
  });

  it("holds subject, template, and narrow caps at 50 and at 225", () => {
    const token = (n: number) =>
      ["amber", "birch", "cedar", "dune", "elm", "fern", "grove", "harbor", "inlet", "jetty", "knoll", "ledge"][n % 12]!;
    const lisinopril = (n: number) =>
      item(
        `lisin-${n}`,
        `Which monitoring step is required before the lisinopril dose in the ${token(n)} clinic, visit ${n}?`,
        [`Check the ${token(n)} pressure`, `Skip the ${token(n)} visit`, `Stop the ${token(n)} plan`, `Call the ${token(n)} desk`],
        `Check the ${token(n)} pressure`,
        { scenario: `${token(n)} clinic chart ${n * 17} is a separate lisinopril follow-up.` }
      );
    const steadyAsks = [
      ["Approximately how many half-lives does it take for amiodarone to reach steady state?", "Alpha clinic opens a new amiodarone start with its own consent form."],
      ["How many half-lives pass before carbamazepine is expected to reach steady state?", "Bravo ward is asking about a carbamazepine level drawn this morning."],
      ["About how many half-lives are required for digoxin to reach steady state?", "Cedar pharmacy is counseling a first digoxin fill for a new patient."],
      ["Approximately how many half-lives does lithium need to reach steady state?", "Dune clinic is starting lithium after a separate intake visit."],
      ["How many half-lives should pass before phenytoin reaches steady state?", "Elm hospital is reviewing a phenytoin load from last night."],
      ["Approximately how many half-lives until vancomycin reaches steady state?", "Fern infusion center is timing a vancomycin trough for a different order."],
      ["How many half-lives does theophylline take to reach steady state?", "Grove clinic is teaching a theophylline schedule that is not the prior visit."],
      ["Approximately how many half-lives are needed for procainamide to reach steady state?", "Harbor ward is documenting a procainamide start on a new admission."],
    ] as const;
    const steadyOptions = [
      ["Refrigerate the alpha carton", "Freeze the alpha carton", "Sun the alpha carton", "Discard the alpha leaflet"],
      ["Lock the bravo safe", "Leave the bravo safe open", "Mail the bravo bottle", "Store the bravo bottle in the register"],
      ["Quarantine the cedar lot", "Sell the cedar lot", "Return the cedar lot to the shelf", "Ignore the cedar recall"],
      ["Level the dune balance", "Skip the dune calibration", "Weigh the dune spatula", "Tare the dune printer"],
      ["Wash the elm tray", "Reuse the elm powder", "Count on the elm counter", "Skip the elm wipe"],
      ["Record the fern noon reading", "Leave the fern log blank", "Copy the fern yesterday", "Erase the fern excursion"],
      ["Use the grove insulated tote", "Use a grove paper sack", "Use an open grove tray", "Drop the grove parcel in the mailbox"],
      ["Read back the harbor order", "Guess the harbor strength", "Hang up on the harbor caller", "Dispense the closest harbor bottle"],
    ];
    const steady = (n: number) => {
      const ask = steadyAsks[n]!;
      const options = steadyOptions[n]!;
      return item(`steady-${n}`, ask[0], [...options], options[0]!, { scenario: ask[1] });
    };
    const copdScenes = [
      "A rancher from amber county is tripoding with pursed lips during a COPD exacerbation.",
      "The birch clinic spirometry shows chronic obstructive pulmonary disease with a new oxygen order.",
      "Cedar ward documents emphysema and asks for the next nebulizer during this COPD flare.",
      "Dune rehab records chronic bronchitis and a separate COPD action plan for discharge teaching.",
      "Elm emergency sees a different COPD exacerbation after a dust exposure at work.",
      "Fern pharmacy counsels a COPD inhaler technique that is not the previous visit.",
      "Grove hospital admits chronic obstructive disease with a unique oxygen titration note.",
      "Harbor clinic reviews a COPD exacerbation that started after a viral illness.",
      "Inlet ward charts emphysema progression with a new pulmonary rehab referral.",
      "Jetty clinic documents chronic bronchitis symptoms that began last winter.",
    ];
    const copd = (n: number) =>
      item(
        `copd-${n}`,
        `Which observation belongs in the ${token(n)} respiratory note number ${n}?`,
        [
          `Record the ${token(n)} work of breathing`,
          `Close the ${token(n)} chart`,
          `Transfer ${token(n)} without a note`,
          `Erase the ${token(n)} oxygen order`,
        ],
        `Record the ${token(n)} work of breathing`,
        { scenario: copdScenes[n] ?? `Unique COPD chart ${n} for ${token(n)}.` }
      );
    const filler = (n: number) =>
      item(
        `fill-${n}`,
        `Which storage step applies to shipment lot ${n} before it leaves the pharmacy vault?`,
        [`Seal lot ${n}`, `Leave lot ${n}`, `Discard lot ${n}`, `Ignore lot ${n}`],
        `Seal lot ${n}`,
        { scenario: `Vault lot ${n} is a unique shipment with packing note ${n * 19}.` }
      );
    const pool = [
      ...Array.from({ length: 12 }, (_, n) => lisinopril(n)),
      ...Array.from({ length: 8 }, (_, n) => steady(n)),
      ...Array.from({ length: 10 }, (_, n) => copd(n)),
      ...Array.from({ length: 220 }, (_, n) => filler(n)),
    ];
    const at50 = enforceEntityAndDosageCap(pool, pool, 50, "pharmacy");
    expect(at50.filter((row) => row.id?.startsWith("lisin-"))).toHaveLength(2);
    expect(at50.filter((row) => row.id?.startsWith("steady-"))).toHaveLength(1);
    expect(at50.filter((row) => row.id?.startsWith("copd-"))).toHaveLength(2);
    const at225 = enforceEntityAndDosageCap(pool, pool, 225, "pharmacy");
    expect(at225).toHaveLength(225);
    expect(at225.filter((row) => row.id?.startsWith("lisin-"))).toHaveLength(9);
    expect(at225.filter((row) => row.id?.startsWith("steady-"))).toHaveLength(5);
    expect(at225.filter((row) => row.id?.startsWith("copd-"))).toHaveLength(6);
  });

  it("fills on the first sufficient relaxation level and does not relax cluster or case keys", () => {
    const steady = (id: string, scene: string, options: string[]) =>
      item(
        id,
        "Approximately how many half-lives does it take for this drug to reach steady state?",
        options,
        options[0]!,
        { scenario: scene }
      );
    const templatePool = [
      steady("ss-a", "Alpha clinic chart is open for a first counseling visit about a new start.", [
        "Refrigerate the alpha carton",
        "Freeze the alpha carton",
        "Leave the alpha carton in the sun",
        "Discard the alpha leaflet",
      ]),
      steady("ss-b", "Bravo ward note describes a separate question for a different new start.", [
        "Lock the bravo narcotic safe",
        "Leave the bravo safe open",
        "Store the bravo bottle in the register",
        "Mail the bravo bottle home",
      ]),
    ];
    const relaxed = finalizeAssembledSitting({ pool: templatePool, limit: 2, fieldId: "pharmacy", seed: 1 });
    expect(sittingCapLimits(2, 0).templateCap).toBe(1);
    expect(sittingCapLimits(2, 1).templateCap).toBe(2);
    expect(relaxed.items).toHaveLength(2);
    expect(relaxed.capStats.relaxLevel).toBe(1);
    expect(relaxed.capStats.strict?.kept).toBe(1);

    const sharedOptions = ["Start today", "Hold the dose", "Give vitamin K", "Recheck next year"];
    const clustered = [
      item("cl-a", "Which regimen should be started for the alpha carton?", sharedOptions, sharedOptions[0]!, {
        scenario: "Alpha shelf holds a unique recalled lot that is not the bravo lot.",
      }),
      item("cl-b", "Which regimen should be started for the bravo carton?", sharedOptions, sharedOptions[0]!, {
        scenario: "Bravo cage holds a different recalled lot with its own invoice.",
      }),
    ];
    const clusterResult = finalizeAssembledSitting({ pool: clustered, limit: 2, fieldId: "pharmacy", seed: 2 });
    expect(clusterResult.items).toHaveLength(1);
    expect(clusterResult.capStats.relaxLevel).toBe(5);
    expect(clusterResult.capStats.rejections.cluster ?? 0).toBeGreaterThan(0);

    const shock = (id: string, age: number, room: number, options: string[]) =>
      item(id, `Which action is the priority in bay ${id}?`, options, options[0]!, {
        scenario: `A ${age}-year-old patient in the emergency department, room ${room}, develops anaphylaxis minutes after ceftriaxone for pyelonephritis. Penicillin allergy. BP 74/42, HR 130, RR 30, SpO2 89%.`,
      });
    const cases = [
      shock("shock-a", 33, 352, ["Give the alpha antidote", "Watch alpha", "Call alpha", "Document alpha"]),
      shock("shock-b", 35, 418, ["Open the bravo cart", "Close bravo", "Page bravo", "Leave bravo"]),
    ];
    expect(
      sittingRepeatKeys(cases[0]!, "pharmacy").some((key) => sittingRepeatKeys(cases[1]!, "pharmacy").includes(key))
    ).toBe(true);
    const caseResult = finalizeAssembledSitting({ pool: cases, limit: 2, fieldId: "pharmacy", seed: 3 });
    expect(caseResult.items).toHaveLength(1);
    expect(caseResult.capStats.relaxLevel).toBe(5);
    const reasons = Object.keys(caseResult.capStats.rejections);
    expect(reasons.some((reason) => reason.startsWith("repeat:") || reason === "cluster")).toBe(true);
  });
});
