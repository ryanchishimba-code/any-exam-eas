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

  it("adds IDSA-aligned pearls for top antibiotics", () => {
    const amox = getDrugById("amoxicillin");
    expect(amox).toBeDefined();
    const e = enrichDrug(amox!);
    expect(e.pearls.some((p) => /strep|otitis|stewardship|IDSA/i.test(p))).toBe(true);
    expect(e.guidelines.some((g) => /IDSA/i.test(g.label))).toBe(true);
  });

  it("adds APA-aligned pearls for SSRIs in top 50", () => {
    const zoloft = getDrugById("sertraline");
    expect(zoloft).toBeDefined();
    const e = enrichDrug(zoloft!);
    expect(e.pearls.some((p) => /serotonin|suicid|SSRI|PTSD/i.test(p))).toBe(true);
    expect(e.guidelines.some((g) => /APA/i.test(g.label))).toBe(true);
  });

  it("adds ACOG pearls for pregnancy hypertension agents", () => {
    const lab = getDrugById("labetalol");
    expect(lab).toBeDefined();
    const e = enrichDrug(lab!);
    expect(e.pearls.some((p) => /ACOG|pregnancy|HTN/i.test(p))).toBe(true);
    expect(e.guidelines.some((g) => /ACOG/i.test(g.label))).toBe(true);
  });

  it("adds benzodiazepine safety pearls for alprazolam", () => {
    const benzo = getDrugById("alprazolam");
    expect(benzo).toBeDefined();
    const e = enrichDrug(benzo!);
    expect(e.pearls.some((p) => /opioid|dependence|respiratory/i.test(p))).toBe(true);
  });
});
