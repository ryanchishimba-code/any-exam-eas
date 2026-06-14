import { describe, expect, it } from "vitest";
import { getDrugById } from "../catalog";
import { enrichDrug, hasDrugEnrichment } from "./index";

describe("drug enrichment", () => {
  it("adds ADA-aligned pearls for GLP-1 agents", () => {
    const sema = getDrugById("semaglutide");
    expect(sema).toBeDefined();
    const e = enrichDrug(sema!);
    expect(e.pearls.some((p) => /ADA|SELECT|MEN2/i.test(p))).toBe(true);
    expect(e.guidelines.some((g) => /ADA/i.test(g.label))).toBe(true);
    expect(e.mechanism?.toLowerCase()).toContain("incretin");
  });

  it("adds dual agonist pearls for tirzepatide", () => {
    const tir = getDrugById("tirzepatide");
    expect(tir).toBeDefined();
    const e = enrichDrug(tir!);
    expect(e.pearls.some((p) => /Mounjaro|GIP/i.test(p))).toBe(true);
  });

  it("adds ACC/AHA pearls for statins", () => {
    const statin = getDrugById("atorvastatin");
    expect(statin).toBeDefined();
    const e = enrichDrug(statin!);
    expect(e.pearls.some((p) => /ACC\/AHA|LDL/i.test(p))).toBe(true);
  });

  it("returns false for drugs without class rules", () => {
    const senna = getDrugById("senna");
    expect(senna).toBeDefined();
    expect(hasDrugEnrichment(senna!)).toBe(false);
  });
});
