import { describe, expect, it } from "vitest";
import type { ExpertStructuredRationale } from "@/lib/engine/rationale/expert-rationale-types";
import {
  canonicalStoredQuestionKey,
  ngnQuestionKey,
  presentClinicalUnits,
  studentRevealedItem,
  takeSessionUnits,
  type PublishedCatalog,
  type ServeItem,
} from "@/lib/assessment/serve";
import { openStudentRef } from "@/lib/assessment/student-item-ref";
import { enrichBankItemFromRow } from "@/lib/mpje/parse-bank-options";
import { examQuestionToStudy, studyQuestionsToExamQuestions } from "./prepare";
import { findBannedStudentKeys, findPreSubmitAnswerLeaks } from "./student-payload";
import type { RawQuestionInput } from "./types";

const STALE_RATIONALE = "STALE_OLD_RATIONALE_MUST_NOT_REACH_THE_BROWSER";
const MODEL = "gpt-4o-mini-internal-pipeline";

const expertRationale = {
  whyCorrect: {
    headline: "Airway comes before the case label.",
    conceptBreakdown: ["Look at the work of breathing first."],
    clinicalContext: "The student needs the teaching, not the generator note.",
  },
  whyIncorrect: [],
  keyTakeaway: "Open the airway before you name the step.",
  stepByStepReasoning: ["See the noisy breathing.", "Open the airway."],
  clinicalPearl: "Noise means air is still moving.",
  highYieldFacts: ["Airway first."],
  commonPitfalls: ["Reading the case title as the question."],
  testTakingTip: "Use the findings in the note.",
  realWorldApplication: "Same order at the bedside.",
} satisfies ExpertStructuredRationale;

function leakingQuestion(): RawQuestionInput {
  return {
    id: 7,
    type: "multiple_choice",
    question: "What is the priority action?",
    vignette: "Night-time confusion\nThe client is awake at 0200 and breathing loudly.",
    options: ["Open the airway", "Document the title", "Call the family", "Finish the note"],
    correctAnswer: "Open the airway",
    explanation: "Noisy breathing means the airway is the priority.",
    solutionSteps: ["Listen to the breathing.", "Open the airway."],
    references: ["Lewis medical-surgical nursing"],
    expertRationale,
    tags: ["cjmm:recognize_cues", "Recognize cues", "cjmm-polished", "drug:albuterol", "cn:safety"],
    caseStep: 1,
    ngnPayload: {
      kind: "sequential",
      setId: "case-night",
      stepIndex: 1,
      totalSteps: 6,
      caseTitle: "Night-time confusion",
      cjmmStep: "Recognize cues",
      stepName: "Recognize cues",
      stepLevel: "recognize_cues",
      slotId: "slot-9",
      slotIndex: 9,
      caseGroupId: "group-internal",
      taskCategory: "internal-task",
      blueprintTopic: "internal-blueprint",
      manualCorrection: true,
      generationMeta: {
        rationale: STALE_RATIONALE,
        model: MODEL,
        pipeline: "nclex-batch",
        pipelineVersion: "gpt-4o-mini-nclex-v1",
        batchId: "batch-hidden",
        slotIndex: 9,
        templateId: "template-hidden",
        manualCorrection: true,
        keyFix: true,
        examNumber: 3,
        generatedAt: "2020-01-01T00:00:00.000Z",
      },
    },
    chartData: {
      kind: "exhibit",
      table: { headers: ["Lab"], rows: [["K 3.1"]] },
      generationMeta: { model: MODEL, rationale: STALE_RATIONALE },
      caseTitle: "Night-time confusion",
    },
  };
}

describe("student question payload", () => {
  it("omits internal metadata and keeps the fields the player renders", () => {
    const study = examQuestionToStudy(leakingQuestion(), 0, { shuffleOptions: false });
    const [api] = studyQuestionsToExamQuestions([study]);

    expect(findBannedStudentKeys(study)).toEqual([]);
    expect(findBannedStudentKeys(api)).toEqual([]);
    expect(JSON.stringify(api)).not.toContain(STALE_RATIONALE);
    expect(JSON.stringify(api)).not.toContain(MODEL);
    expect(JSON.stringify(api)).not.toContain("Night-time confusion");
    expect(JSON.stringify(api)).not.toContain("slot-9");
    expect(JSON.stringify(api)).not.toContain("recognize_cues");

    expect(study.vignette).toBe("The client is awake at 0200 and breathing loudly.");
    expect(study.solutionSteps).toEqual(["Listen to the breathing.", "Open the airway."]);
    expect(study.references).toEqual(["Lewis medical-surgical nursing"]);
    expect(study.expertRationale?.keyTakeaway).toBe(expertRationale.keyTakeaway);
    expect(study.tags).toEqual(["drug:albuterol", "cn:safety"]);
    expect(study.caseStep).toBe(1);
    expect(study.ngnPayload).toMatchObject({
      kind: "sequential",
      setId: "case-night",
      stepIndex: 1,
      totalSteps: 6,
    });
    expect(study.ngnPayload).not.toHaveProperty("generationMeta");
    expect(study.ngnPayload).not.toHaveProperty("caseTitle");
    expect(study.ngnPayload).not.toHaveProperty("blueprintTopic");
    expect(study.chartData).toEqual({
      kind: "exhibit",
      table: { headers: ["Lab"], rows: [["K 3.1"]] },
    });

    expect(api?.expertRationale).toBeUndefined();
    expect(api?.solutionSteps).toBeUndefined();
    expect(api?.correctAnswer).toBe("");
    expect(api?.explanation).toBe("");
    expect(findPreSubmitAnswerLeaks(api)).toEqual([]);
    expect(api?.references).toEqual(study.references);
    expect(api?.ngnPayload).toEqual(study.ngnPayload);
    expect(api?.chartData).toEqual(study.chartData);
  });

  it("keeps bow-tie layout after the generator metadata is merged into the payload", () => {
    const study = examQuestionToStudy(
      {
        id: 2,
        type: "bow_tie",
        question: "Complete the bow-tie.",
        options: ["Start fluids", "Give morphine", "Urine output", "Pain score"],
        correctAnswer: "Start fluids|||Urine output|||Pain score",
        explanation: "Fluids treat the volume loss.",
        ngnPayload: {
          kind: "bow_tie",
          condition: "Hypovolemia",
          conditionOptions: ["Hypovolemia", "Fluid overload"],
          actions: ["Start fluids", "Give morphine"],
          monitors: ["Urine output", "Pain score"],
          actionPickCount: 1,
          monitorPickCount: 2,
          caseTitle: "Volume loss",
          generationMeta: { rationale: STALE_RATIONALE, model: MODEL, slotIndex: 2 },
        },
      },
      0,
      { shuffleOptions: false }
    );

    expect(findBannedStudentKeys(study)).toEqual([]);
    expect(study.ngnPayload).toMatchObject({
      kind: "bow_tie",
      condition: "Hypovolemia",
      actions: ["Start fluids", "Give morphine"],
      monitors: ["Urine output", "Pain score"],
      actionPickCount: 1,
      monitorPickCount: 2,
    });
    expect(study.chartData).toMatchObject({
      kind: "bow_tie",
      condition: "Hypovolemia",
      actionPickCount: 1,
      monitorPickCount: 2,
    });
    expect(JSON.stringify(study)).not.toContain(STALE_RATIONALE);
  });

  it("still stores generation metadata on the server bank item", () => {
    const item = enrichBankItemFromRow({
      id: "row-1",
      subjectId: "management-of-care",
      question: "What is the priority action?",
      options: JSON.stringify(["Open the airway", "Document", "Call", "Wait"]),
      correctAnswer: "Open the airway",
      explanation: "Airway first.",
      solutionSteps: null,
      tags: null,
      generationMeta: { model: MODEL, rationale: STALE_RATIONALE, slotIndex: 1 },
    });

    expect(item.generationMeta).toMatchObject({ model: MODEL, slotIndex: 1 });
    expect(item.ngnPayload?.generationMeta).toMatchObject({ rationale: STALE_RATIONALE });
  });
});

const EMPTY_RATIONALE = {
  short: "",
  expanded: { perOption: {}, cjmmCoaching: "", pointsLost: "", takeaway: "" },
};

function clinicalItem(overrides: Partial<ServeItem> & Pick<ServeItem, "id">): ServeItem {
  return {
    version: 1,
    batchId: "batch-hidden",
    itemType: "case_item",
    caseId: "NC003",
    caseStep: 1,
    caseVersion: 1,
    cjmmFunction: "recognize_cues",
    timepoint: "day-1",
    responseFormat: "mc_single",
    scoringRule: "zero_one",
    maxPoints: 1,
    stem: "What is the priority assessment?",
    payload: { key: "a", options: [{ id: "a", text: "Chest pain" }] },
    rationale: EMPTY_RATIONALE,
    clientNeeds: { subcategory: "Physiological Adaptation" },
    references: [],
    rnFlags: [],
    status: "published",
    ...overrides,
  };
}

function clinicalCatalog(): PublishedCatalog {
  const steps = [1, 2].map((step) =>
    clinicalItem({
      id: step === 1 ? "NC003-S1" : "C01-S1",
      caseId: "NC003",
      caseStep: step,
      cjmmFunction: step === 1 ? "recognize_cues" : "take_action",
    })
  );
  return {
    standalones: [
      {
        kind: "standalone",
        subjectId: "physiological-adaptation",
        item: clinicalItem({
          id: "B01",
          itemType: "bowtie",
          caseId: null,
          caseStep: null,
          caseVersion: null,
          responseFormat: "bowtie",
          batchId: "batch-hidden",
          rationale: EMPTY_RATIONALE,
        }),
      },
    ],
    cases: [
      {
        kind: "case",
        subjectId: "physiological-adaptation",
        items: steps,
        caseDoc: {
          id: "NC003",
          version: 1,
          batchId: "batch-hidden",
          title: "Day after PCI: chest pain",
          boardProfile: "nclex-rn-2026",
          status: "published",
          primaryClientNeed: "Physiological Adaptation",
          setting: "Cardiac step-down",
          patient: {
            displayName: "Morgan",
            age: 62,
            sex: "male",
            weightKg: 82,
            allergies: "NKDA",
            history: "Open colectomy 2 days ago.",
          },
          timepoints: [{ id: "day-1", label: "Day 1" }],
          chart: {
            tabs: [
              {
                id: "history",
                label: "History",
                entries: [{ time: "baseline", text: "Open colectomy 2 days ago." }],
              },
            ],
          },
          revealRule: "baseline",
          references: [{ src: "src-1", locator: "p. 12" }],
          items: steps,
        },
      },
    ],
  };
}

describe("clinical student payloads", () => {
  it("strips case titles, slot ids, step names, batch ids, and empty rationales", () => {
    const catalog = clinicalCatalog();
    for (const format of ["case", "ngn"] as const) {
      const selected = takeSessionUnits({
        catalog,
        format,
        subjectId: "__mixed__",
        limit: 5,
        seed: format,
      });
      const presented = presentClinicalUnits(selected, {
        "NC003:1": [{ src: "src-1", locator: "p. 12" }],
      });
      const wire = JSON.stringify(presented);
      expect(findBannedStudentKeys(presented)).toEqual([]);
      expect(wire).not.toContain("Day after PCI");
      expect(wire).not.toContain("NC003-S1");
      expect(wire).not.toContain("C01-S1");
      expect(wire).not.toContain("batch-hidden");
      expect(wire).not.toContain("recognize_cues");
      expect(wire).not.toContain("take_action");
      expect(wire).not.toMatch(/"NC003"/);
      if (format === "case") {
        const unit = presented.units[0];
        expect(unit?.kind).toBe("case");
        if (unit?.kind !== "case") continue;
        expect(unit.items.map((item) => item.caseStep)).toEqual([1, 2]);
        expect(unit.caseDoc).not.toHaveProperty("title");
        expect(unit.caseDoc.chart.tabs.map((tab) => tab.label)).toEqual(["History"]);
        expect(unit.caseDoc.patient.history).toBe("Open colectomy 2 days ago.");
        expect(unit.items[0]).not.toHaveProperty("rationale");
        const ref = openStudentRef(unit.items[0]!.id);
        expect(ref).toEqual({ id: "NC003-S1", version: 1 });
        expect(canonicalStoredQuestionKey(ngnQuestionKey(unit.items[0]!.id, unit.items[0]!.version))).toBe(
          "ngn:NC003-S1:v1"
        );
        const revealed = studentRevealedItem(
          catalog.cases[0]!.items[0]!,
          unit.items[0]!.id
        );
        expect(revealed.id).toBe(unit.items[0]!.id);
        expect(revealed.rationale.short).toBe("");
        expect(revealed).not.toHaveProperty("batchId");
        expect(revealed).not.toHaveProperty("cjmmFunction");
        expect(revealed.caseStep).toBe(1);
        const refKey = `${unit.caseDoc.id}:${unit.caseDoc.version}`;
        expect(presented.caseReferences[refKey]?.[0]?.locator).toBe("p. 12");
      }
      if (format === "ngn") {
        const unit = presented.units[0];
        expect(unit?.kind).toBe("standalone");
        if (unit?.kind !== "standalone") continue;
        expect(unit.item).not.toHaveProperty("rationale");
        expect(unit.item).not.toHaveProperty("batchId");
        expect(openStudentRef(unit.item.id)).toEqual({ id: "B01", version: 1 });
      }
    }
  });
});
