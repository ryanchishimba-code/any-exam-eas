import { describe, expect, it } from "vitest";
import { USMLE_QUALITY_V2 } from "./usmle-quality-v2";
import { bankItemToUsmleExam } from "./usmle-bank-bridge";
import { examQuestionToStudy, isAnswerCorrect } from "@/lib/questions/prepare";

describe("USMLE_QUALITY_V2", () => {
  it("ships 55+ diverse items across steps", () => {
    expect(USMLE_QUALITY_V2.length).toBeGreaterThanOrEqual(55);
    const steps = { step1: 0, step2: 0, step3: 0 };
    for (const q of USMLE_QUALITY_V2) {
      const s = q.ngnPayload?.stepLevel as string;
      if (s in steps) steps[s as keyof typeof steps]++;
    }
    expect(steps.step1).toBeGreaterThanOrEqual(15);
    expect(steps.step2).toBeGreaterThanOrEqual(20);
    expect(steps.step3).toBeGreaterThanOrEqual(10);
  });

  it("covers required USMLE item types", () => {
    const types = new Set(USMLE_QUALITY_V2.map((q) => q.itemType));
    expect(types.has("vignette")).toBe(true);
    expect(types.has("sequential")).toBe(true);
    expect(types.has("abstract")).toBe(true);
    expect(types.has("drug_ad")).toBe(true);
    expect(types.has("ethics")).toBe(true);
    expect(types.has("biostats")).toBe(true);
    expect(types.has("ccs_prompt")).toBe(true);
    expect(types.has("exhibit")).toBe(true);
  });

  it("round-trips abstract format through study pipeline", () => {
    const item = USMLE_QUALITY_V2.find((q) => q.itemType === "abstract");
    expect(item).toBeDefined();
    const study = examQuestionToStudy(
      { ...bankItemToUsmleExam(item!, 0), field: "usmle-step-3" },
      0
    );
    expect(study.ngnFormat).toBe("abstract");
    expect(study.ngnPayload?.abstract).toBeDefined();
    expect(isAnswerCorrect(study, [study.correctAnswers[0]!])).toBe(true);
  });

  it("round-trips sequential item metadata", () => {
    const item = USMLE_QUALITY_V2.find((q) => q.itemType === "sequential");
    expect(item?.ngnPayload?.setId).toBeTruthy();
    expect(item?.ngnPayload?.stepIndex).toBe(1);
    const study = examQuestionToStudy(
      { ...bankItemToUsmleExam(item!, 0), field: "usmle-step-2" },
      0
    );
    expect(study.ngnFormat).toBe("sequential");
    expect(study.vignette).toBeTruthy();
  });
});
