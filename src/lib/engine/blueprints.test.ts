import { describe, expect, it } from "vitest";
import {
  allocateQuestionsByBlueprint,
  buildBlueprintPromptBlock,
  buildDetailedSlotAllocationBlock,
  getExamBlueprint,
} from "./blueprints";

describe("exam blueprints", () => {
  it("returns NCLEX blueprint for nursing", () => {
    const bp = getExamBlueprint("nursing");
    expect(bp?.examName).toBe("NCLEX");
    expect(bp?.sourceNote).toContain("CJMM");
    const totalWeight = bp!.categories.reduce((n, c) => n + c.weight, 0);
    expect(totalWeight).toBeCloseTo(1, 2);
  });

  it("NAPLEX 2025 domains sum to 1", () => {
    const bp = getExamBlueprint("pharmacy")!;
    expect(bp.sourceNote).toContain("2025");
    const totalWeight = bp.categories.reduce((n, c) => n + c.weight, 0);
    expect(totalWeight).toBeCloseTo(1, 2);
  });

  it("USMLE Step 1 basic-science weights sum to 1", () => {
    const bp = getExamBlueprint("usmle-step-1")!;
    const totalWeight = bp.categories.reduce((n, c) => n + c.weight, 0);
    expect(totalWeight).toBeCloseTo(1, 2);
  });

  it("USMLE Step 2 organ-system weights sum to 1", () => {
    const bp = getExamBlueprint("usmle-step-2")!;
    const totalWeight = bp.categories.reduce((n, c) => n + c.weight, 0);
    expect(totalWeight).toBeCloseTo(1, 2);
  });

  it("allocates question counts that sum to requested total", () => {
    const bp = getExamBlueprint("nursing")!;
    const slots = allocateQuestionsByBlueprint(20, bp);
    expect(slots).toHaveLength(20);
  });

  it("assigns NGN formats for nursing sets", () => {
    const bp = getExamBlueprint("nursing")!;
    const slots = allocateQuestionsByBlueprint(30, bp);
    const ngnCount = slots.filter((s) => s.ngnFormat).length;
    expect(ngnCount).toBeGreaterThan(0);
  });

  it("focuses allocation when subjectId provided", () => {
    const bp = getExamBlueprint("nursing")!;
    const slots = allocateQuestionsByBlueprint(10, bp, "pharmacology-nursing");
    expect(slots.every((s) => s.subjectIds?.includes("pharmacology-nursing"))).toBe(true);
  });

  it("builds per-question slot allocation block", () => {
    const block = buildDetailedSlotAllocationBlock("nursing", 5);
    expect(block).toContain("ITEM-BY-ITEM ALLOCATION");
    expect(block).toContain("Q1:");
    expect(block).toContain("Q5:");
  });

  it("builds prompt block with blueprint and vignette guidance", () => {
    const block = buildBlueprintPromptBlock("usmle-step-2", 15);
    expect(block).toContain("USMLE");
    expect(block).toMatch(/vignette/i);
  });
});
