import { describe, expect, it } from "vitest";
import {
  buildUsmleExpertSystemPrompt,
  buildUsmleExpertUserPrompt,
  resolveUsmleExpertStepTone,
} from "../prompts/usmle-expert-rationale";
import { scoreUsmleExplanationQuality } from "./usmle-explanation-quality";
import type { ExpertStructuredRationale } from "./expert-rationale-types";
import { USMLE_EXPERT_RATIONALE_VERSION } from "./expert-rationale-types";

function sampleExpert(overrides?: Partial<ExpertStructuredRationale>): ExpertStructuredRationale {
  return {
    whyCorrect: {
      headline: "Acute coronary syndrome from plaque rupture causing myocardial ischemia",
      conceptBreakdown: [
        "Subendocardial ischemia produces ST depression and troponin rise",
        "Aspirin inhibits platelet aggregation via irreversible COX-1 blockade",
      ],
      clinicalContext:
        "This middle-aged patient with crushing chest pain, diaphoresis, and rising troponin matches acute coronary syndrome; antiplatelet therapy is first-line next step.",
    },
    stepByStepReasoning: [
      "Recognize cues: crushing pain, diaphoresis, elevated troponin",
      "Build differential: ACS vs PE vs aortic dissection",
      "Most likely: plaque rupture with myocardial ischemia",
      "Next best step: give aspirin and activate ACS pathway",
    ],
    whyIncorrect: [
      {
        option: "Immediate thrombolysis without ECG review",
        misconception: "Assuming all chest pain needs lytics",
        correction:
          "Lytics are for STEMI when PCI is unavailable; this vignette needs ECG classification first and antiplatelet therapy now.",
        conceptLink: "STEMI vs NSTE-ACS pathways",
      },
      {
        option: "Discharge with outpatient stress test only",
        misconception: "Under-triaging ACS",
        correction:
          "Positive troponin and ongoing ischemic symptoms require inpatient ACS management, not outpatient testing.",
        conceptLink: "Risk stratification and disposition",
      },
    ],
    clinicalPearl:
      "Give non-enteric coated aspirin 162–325 mg chewed as soon as ACS is suspected — do not wait for the cath lab.",
    highYieldFacts: [
      "Aspirin is Class I first therapy in suspected ACS",
      "Troponin elevation marks myocardial injury",
    ],
    commonPitfalls: ["Skipping ECG before choosing reperfusion strategy"],
    testTakingTip: "When the stem asks next step in chest pain with troponin rise, think ACS protocol before fancy imaging.",
    realWorldApplication: "On the floor, order ECG within 10 minutes and continuous telemetry while starting antiplatelet therapy.",
    keyTakeaway: "Suspected ACS with injury markers → immediate aspirin and ACS pathway, not discharge.",
    ...overrides,
  };
}

describe("USMLE expert prompt routing", () => {
  it("resolves Step tones from field ids", () => {
    expect(resolveUsmleExpertStepTone("usmle-step-1")).toBe("step1");
    expect(resolveUsmleExpertStepTone("usmle-step-2")).toBe("step2");
    expect(resolveUsmleExpertStepTone("usmle-step-3")).toBe("step3");
  });

  it("embeds Step-specific reasoning spines in system prompts", () => {
    expect(buildUsmleExpertSystemPrompt("usmle-step-1")).toMatch(/pathogenesis/i);
    expect(buildUsmleExpertSystemPrompt("usmle-step-2")).toMatch(/differential/i);
    expect(buildUsmleExpertSystemPrompt("usmle-step-3")).toMatch(/CCS-style|disposition/i);
  });

  it("lists wrong options in the user prompt", () => {
    const user = buildUsmleExpertUserPrompt({
      fieldId: "usmle-step-2",
      question: "What is the next best step?",
      options: ["Aspirin", "Discharge home", "Immediate thrombolysis without ECG review"],
      correctAnswer: "Aspirin",
      vignette: "55-year-old with crushing chest pain",
    });
    expect(user).toContain("WRONG OPTIONS");
    expect(user).toContain("Discharge home");
    expect(user).toContain("Immediate thrombolysis without ECG review");
    expect(user).toContain("Step 2 CK");
  });
});

describe("scoreUsmleExplanationQuality", () => {
  const options = [
    "Aspirin",
    "Immediate thrombolysis without ECG review",
    "Discharge with outpatient stress test only",
  ];
  const correct = "Aspirin";

  it("passes a full attending-style rationale", () => {
    const verdict = scoreUsmleExplanationQuality(
      sampleExpert(),
      options,
      correct,
      "usmle-step-2"
    );
    expect(verdict.ok).toBe(true);
    expect(verdict.score).toBeGreaterThanOrEqual(70);
  });

  it("fails thin clinical pearl / context", () => {
    const thin = sampleExpert({
      clinicalPearl: "Be careful.",
      whyCorrect: {
        ...sampleExpert().whyCorrect,
        clinicalContext: "Short.",
      },
    });
    const verdict = scoreUsmleExplanationQuality(thin, options, correct, "usmle-step-2");
    expect(verdict.ok).toBe(false);
    expect(verdict.issues).toEqual(
      expect.arrayContaining(["thin_clinical_pearl", "thin_clinical_context"])
    );
  });

  it("flags weak mechanism language on Step 1", () => {
    const weak = sampleExpert({
      whyCorrect: {
        headline: "This is the correct diagnosis for the patient presentation today",
        conceptBreakdown: [
          "The vignette matches the classic syndrome described in textbooks",
          "Choose the option that fits the clinical picture best overall",
        ],
        clinicalContext:
          "The patient presentation aligns with the syndrome named in the correct option rather than look-alikes.",
      },
      stepByStepReasoning: [
        "Note the age and chief complaint in the stem carefully",
        "Compare each option against the most likely syndrome",
        "Select the answer that best fits without adding new findings",
        "Confirm the key takeaway for rapid review later",
      ],
      pharmacologyTieIn: "",
    });
    const verdict = scoreUsmleExplanationQuality(weak, options, correct, "usmle-step-1");
    expect(verdict.issues).toContain("weak_mechanism_language");
  });
});

describe("USMLE expert version constant", () => {
  it("uses usmle-expert-v1", () => {
    expect(USMLE_EXPERT_RATIONALE_VERSION).toBe("usmle-expert-v1");
  });
});
