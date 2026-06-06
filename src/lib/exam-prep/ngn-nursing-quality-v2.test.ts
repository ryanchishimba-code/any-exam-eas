import { describe, expect, it } from "vitest";
import { NGN_NURSING_QUALITY_V2 } from "./ngn-nursing-quality-v2";
import { bankItemToExamQuestion } from "./ngn-bank-bridge";
import { examQuestionToStudy } from "@/lib/questions/prepare";

describe("NGN_NURSING_QUALITY_V2", () => {
  it("has at least 40 concise items", () => {
    expect(NGN_NURSING_QUALITY_V2.length).toBeGreaterThanOrEqual(40);
  });

  it("keeps vignettes short and separate from stems", () => {
    for (const item of NGN_NURSING_QUALITY_V2) {
      if (item.vignette) {
        expect(item.vignette.length).toBeLessThan(220);
        expect(item.question).not.toContain(item.vignette);
      }
    }
  });

  it("includes required NGN type mix", () => {
    const types = NGN_NURSING_QUALITY_V2.map((i) => i.itemType);
    expect(types.filter((t) => t === "ngn_bowtie").length).toBeGreaterThanOrEqual(5);
    expect(types.filter((t) => t === "ngn_matrix").length).toBeGreaterThanOrEqual(8);
    expect(types.filter((t) => t === "select_all").length).toBeGreaterThanOrEqual(4);
  });

  it("round-trips bow-tie through exam pipeline", () => {
    const bow = NGN_NURSING_QUALITY_V2.find((i) => i.itemType === "ngn_bowtie");
    expect(bow).toBeDefined();
    const exam = bankItemToExamQuestion(bow!, 0);
    expect(exam.type).toBe("bow_tie");
    expect(exam.chartData?.kind).toBe("bow_tie");
    const study = examQuestionToStudy(exam, 0);
    expect(study.type).toBe("bow_tie");
    expect(study.vignette).toBeTruthy();
  });
});
