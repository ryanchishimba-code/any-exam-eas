import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import { sittingConceptKeys } from "@/lib/exam-prep/entity-cap";
import {
  isPharmacyBlueprintField,
  rankSittingByBlueprint,
} from "@/lib/exam-prep/sitting-blueprint";
import { finalizeAssembledSitting } from "@/lib/exam-prep/sitting-selection";
import { cleanOptionText } from "@/lib/question-format";
import { examQuestionToStudy } from "@/lib/questions/prepare";
import { shuffleDeliveryChoices } from "@/lib/questions/shuffle-delivery";
import { stripInternalDisplayMetadata } from "@/lib/questions/student-display-text";

const MAX_LENGTH = [
  { fieldId: "nursing", limit: 85 },
  { fieldId: "usmle-step-1", limit: 280 },
  { fieldId: "usmle-step-2", limit: 280 },
  { fieldId: "usmle-step-3", limit: 200 },
  { fieldId: "pharmacy", limit: 225 },
  { fieldId: "pance", limit: 300 },
  { fieldId: "aanp-fnp", limit: 135 },
  { fieldId: "npte-pt", limit: 250 },
] as const;

const OPENINGS = [
  "ankle", "rash", "cough", "tremor", "ulcer", "wheeze", "cramp", "blister",
  "fever", "swelling", "itching", "spasm", "bruising", "numbness", "nausea", "fatigue",
  "morning", "evening", "overnight", "weekend", "holiday", "dawn", "dusk", "midday",
  "lilac", "amber", "cedar", "maple", "birch", "olive", "coral", "indigo",
  "harbor", "meadow", "ridge", "canyon", "prairie", "orchard", "lagoon", "summit",
];

function mark(n: number): string {
  const alphabet = "abcdefghij";
  return `${alphabet[Math.floor(n / 100) % 10]}${alphabet[Math.floor(n / 10) % 10]}${alphabet[n % 10]}mark`;
}

function distinctPool(fieldId: string, count: number): BankItem[] {
  return Array.from({ length: count }, (_, n) => {
    const stamp = mark(n);
    const a = OPENINGS[n % OPENINGS.length]!;
    const b = OPENINGS[(n * 3 + 1) % OPENINGS.length]!;
    const c = OPENINGS[(n * 5 + 2) % OPENINGS.length]!;
    const d = OPENINGS[(n * 7 + 3) % OPENINGS.length]!;
    const lead = `Do ${stamp} ${a} ${fieldId} first`;
    return {
      id: `${fieldId}-${n}`,
      subjectId: `subject-${n % 17}`,
      blueprintDomain: `domain-${n % 7}`,
      blueprintTopic: `topic-${fieldId}-${stamp}`,
      question: `Which ${stamp} ${a} step follows the ${b} finding?`,
      options: [lead, `Delay ${stamp} ${c}`, `Skip ${stamp} ${d}`, `Record ${stamp} ${b} only`],
      correctAnswer: lead,
      explanation: `Because the ${stamp} ${a} chart needs that step.`,
      scenario: `${stamp} ${a} ${b} during ${c} clinic shows ${d}. This note is not copied from another chart.`,
    };
  });
}

describe("long-exam compose", () => {
  it.each(MAX_LENGTH)("fills $fieldId at $limit", ({ fieldId, limit }) => {
    const started = Date.now();
    const sitting = finalizeAssembledSitting({
      pool: distinctPool(fieldId, limit),
      limit,
      fieldId,
      seed: 11,
    });
    expect(sitting.items).toHaveLength(limit);
    if (!isPharmacyBlueprintField(fieldId)) {
      expect(sitting.capStats.relaxLevel).toBeLessThanOrEqual(5);
    }
    expect(Date.now() - started).toBeLessThan(15_000);
  });

  it("keeps non-pharmacy order and skips concept keys", () => {
    const items = distinctPool("pance", 12);
    for (const fieldId of [
      "pance",
      "usmle-step-1",
      "usmle-step-2",
      "usmle-step-3",
      "aanp-fnp",
      "npte-pt",
      "nursing",
    ]) {
      const ranked = rankSittingByBlueprint(items, 12, fieldId, 3);
      expect(ranked.map((item) => item.id)).toEqual(items.map((item) => item.id));
    }
    const hipaa: BankItem = {
      id: "hipaa",
      subjectId: "pharmacy-law",
      question: "What should the pharmacist tell the caller about the prescription?",
      options: ["Disclose the diagnosis", "Decline the request", "Transfer the call", "Read the chart"],
      correctAnswer: "Decline the request",
      explanation: "Privacy rules block that disclosure.",
      scenario: "A spouse HIPAA call asks for the diagnosis during morning clinic.",
    };
    expect(sittingConceptKeys(hipaa, "aanp-fnp")).toEqual([]);
    expect(sittingConceptKeys(hipaa, "pance")).toEqual([]);
    expect(sittingConceptKeys(hipaa, "pharmacy")).toContain("concept:hipaa-family-disclosure");
  });

  it("fills a repeated AANP concept without the pharmacy ladder", () => {
    const pool = Array.from({ length: 8 }, (_, n) => {
      const item = distinctPool("aanp-fnp", 8)[n]!;
      return {
        ...item,
        question: `What should the clinician tell caller ${n} about the chart?`,
        scenario: `${item.scenario} A spouse HIPAA call asks for the diagnosis.`,
      };
    });
    const sitting = finalizeAssembledSitting({
      pool,
      limit: 6,
      fieldId: "aanp-fnp",
      seed: 4,
    });
    expect(sitting.items).toHaveLength(6);
    expect(sitting.capStats.relaxLevel).toBeLessThanOrEqual(5);
  });

  it("does not throw a.replace when AANP fields are objects or arrays", () => {
    const objectOptions = [
      { text: "A) Start the plan" },
      { text: "Delay the plan" },
      { text: "Skip the plan" },
      { text: "Document only" },
    ];
    const bad = {
      ...distinctPool("aanp-fnp", 1)[0]!,
      id: "bad-aanp",
      options: objectOptions as unknown as string[],
      explanation: { text: "Option A is the plan for this visit." } as unknown as string,
      solutionSteps: [{ text: "Confirm Option A with the patient." }] as unknown as string[],
      clinicalReasoning: { text: "Choice A matches the visit plan." } as unknown as string,
      blueprintDomain: ["assess"] as unknown as string,
      blueprintTopic: ["diabetes-follow-up"] as unknown as string,
      subjectId: ["endocrine"] as unknown as string,
      tags: [{ label: "diabetes" }] as unknown as string[],
      references: [{ label: "ADA Standards of Care" }] as unknown as BankItem["references"],
    };
    const pool = [bad, ...distinctPool("aanp-fnp", 135)];
    expect(() =>
      finalizeAssembledSitting({
        pool,
        limit: 50,
        fieldId: "aanp-fnp",
        seed: 2,
      })
    ).not.toThrow();
    expect(
      finalizeAssembledSitting({ pool, limit: 50, fieldId: "aanp-fnp", seed: 2 }).items
    ).toHaveLength(50);
    expect(
      finalizeAssembledSitting({ pool, limit: 135, fieldId: "aanp-fnp", seed: 2 }).items
    ).toHaveLength(135);

    expect(cleanOptionText(objectOptions[0])).toBe("Start the plan");
    expect(() => stripInternalDisplayMetadata(bad.explanation as unknown as string)).not.toThrow();
    expect(stripInternalDisplayMetadata(bad.references?.[0] as unknown as string)).toBe("");

    const shuffled = shuffleDeliveryChoices({
      options: objectOptions as unknown as string[],
      correctAnswer: "Start the plan",
      explanation: bad.explanation as unknown as string,
      clinicalReasoning: bad.clinicalReasoning as unknown as string,
      solutionSteps: bad.solutionSteps as unknown as string[],
      seed: 4,
    });
    expect(shuffled.options[0]?.length).toBeGreaterThan(0);
    expect(shuffled.explanation).toContain("plan");

    const study = examQuestionToStudy(
      {
        question: bad.question,
        vignette: bad.scenario,
        options: objectOptions as unknown as string[],
        correctAnswer: "Start the plan",
        explanation: bad.explanation as unknown as string,
        clinicalReasoning: bad.clinicalReasoning as unknown as string,
        solutionSteps: bad.solutionSteps as unknown as string[],
        references: bad.references as unknown as string[],
      },
      0,
      { shuffleOptions: true, shuffleSeed: 9 }
    );
    expect(study.options).toHaveLength(4);
    expect(study.explanation).toContain("plan");
    expect(study.solutionSteps?.[0]).toContain("Confirm");
  });
});
