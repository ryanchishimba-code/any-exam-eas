import { describe, expect, it } from "vitest";
import type { ExpertStructuredRationale } from "@/lib/engine/rationale/expert-rationale-types";
import { enrichBankItemFromRow } from "@/lib/mpje/parse-bank-options";
import { examQuestionToStudy, studyQuestionsToExamQuestions } from "./prepare";
import { findBannedStudentKeys } from "./student-payload";
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
    tags: ["cjmm:recognize_cues", "Recognize cues", "drug:albuterol", "cn:safety"],
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

    expect(api?.expertRationale).toEqual(expertRationale);
    expect(api?.solutionSteps).toEqual(study.solutionSteps);
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
