import { describe, expect, it } from "vitest";
import { USMLE_STEP1_CALC_CURATED } from "./usmle-calc-mcq-curated";
import { isUsmleCalculationItem, USMLE_CALC_TAG } from "./usmle-calc-mcq-helpers";
import { generateUsmleProceduralCalcs } from "./usmle-calc-procedural";

describe("usmle-calc-mcq-helpers", () => {
  it("tags curated items as calculation", () => {
    const item = USMLE_STEP1_CALC_CURATED[0]!;
    expect(item.tags).toContain(USMLE_CALC_TAG);
    expect(isUsmleCalculationItem({ tags: JSON.stringify(item.tags) })).toBe(true);
  });

  it("generates procedural calcs for all three steps", () => {
    const pool = generateUsmleProceduralCalcs(30);
    const steps = new Set(pool.map((i) => i.ngnPayload?.stepLevel));
    expect(steps.has("step1")).toBe(true);
    expect(steps.has("step2")).toBe(true);
    expect(steps.has("step3")).toBe(true);
  });

  it("anion gap item has correct answer in options", () => {
    const ag = USMLE_STEP1_CALC_CURATED.find((i) => i.question.includes("anion gap"));
    expect(ag?.options).toContain(ag?.correctAnswer);
  });
});
