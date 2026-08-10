import { describe, expect, it } from "vitest";
import { buildInsightPreview } from "./build-insight-preview";
import { pearlsFromQuestion, trapsFromQuestion } from "./insights";
import { buildRemediationRecommendations } from "./recommendations";
import type { StudyQuestion } from "@/lib/questions/types";
import type { ExpertStructuredRationale } from "@/lib/engine/rationale/expert-rationale-types";

function baseQuestion(overrides: Partial<StudyQuestion> = {}): StudyQuestion {
  return {
    id: "q1",
    stem: "A nurse is caring for a client. What is the priority action?",
    options: ["A", "B", "C", "D"],
    correctAnswers: ["A"],
    explanation: "Airway comes first.",
    subjectId: "management-of-care",
    ...overrides,
  };
}

function expertPartial(
  overrides: Partial<ExpertStructuredRationale>
): ExpertStructuredRationale {
  return {
    whyCorrect: { headline: "Protect the airway first.", conceptBreakdown: [] },
    whyIncorrect: [],
    keyTakeaway: "ABC before everything else.",
    stepByStepReasoning: ["Assess airway", "Intervene", "Reassess"],
    clinicalPearl: "If the airway is threatened, intervene before labs.",
    highYieldFacts: [],
    commonPitfalls: ["Choosing a true but non-priority intervention."],
    testTakingTip: "Priority stems want the first safe action.",
    realWorldApplication: "Call a rapid response when the airway is closing.",
    ...overrides,
  };
}

describe("expert pearl / trap helpers", () => {
  it("prefers expert clinicalPearl and commonPitfalls", () => {
    const q = baseQuestion({ expertRationale: expertPartial({}) });

    expect(pearlsFromQuestion(q)[0]).toMatch(/airway is threatened/i);
    expect(trapsFromQuestion(q, false)[0]).toMatch(/non-priority/i);
  });
});

describe("buildInsightPreview", () => {
  it("surfaces expert pearl and trap on a miss preview", () => {
    const insight = buildInsightPreview(
      baseQuestion({
        expertRationale: expertPartial({
          whyCorrect: { headline: "Priority is airway.", conceptBreakdown: [] },
          clinicalPearl: "Bedside pearl about airway.",
          commonPitfalls: ["Skipping assessment for a familiar order."],
        }),
      }),
      false,
      ["B"]
    );

    expect(insight.pearls[0]).toMatch(/Bedside pearl/i);
    expect(insight.commonTraps[0]).toMatch(/Skipping assessment/i);
    expect(insight.whyCorrect).toMatch(/Priority is airway/i);
  });
});

describe("buildRemediationRecommendations", () => {
  it("includes 25Q retest on miss (and deep dive when mapped)", () => {
    const recs = buildRemediationRecommendations({
      fieldId: "nursing",
      subjectId: "management-of-care",
      correct: false,
      weakConcepts: ["management-of-care"],
      weakest: [],
    });

    const retest = recs.find((r) => /Retest this topic/i.test(r.title));
    expect(retest).toBeTruthy();
    expect(retest?.href).toMatch(/count=25/);
    expect(retest?.href).toMatch(/autostart=1/);
    expect(retest?.type).toBe("retry_questions");
  });
});
