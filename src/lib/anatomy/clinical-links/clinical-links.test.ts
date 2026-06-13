import { describe, expect, it } from "vitest";
import {
  ANATOMY_DISEASE_LINKS,
  anatomyDrugHref,
  anatomyStructureHref,
  getClinicalContextForDrug,
  getCorePathologyCoverage,
  getDiseaseLinkForPathology,
  getResolvedDiseaseLinksForStructure,
  getUncoveredCorePathologies,
  matchDrugsToPathologyForTest,
  resolveDiseaseLink,
} from "./index";

describe("anatomy clinical links", () => {
  it("links thyroid to hypothyroidism with levothyroxine / Synthroid", () => {
    const links = getResolvedDiseaseLinksForStructure("thyroid");
    const hypo = links.find((l) => l.id === "primary-hypothyroidism");
    expect(hypo).toBeDefined();
    expect(hypo?.firstLineDrugs[0]?.generic).toBe("Levothyroxine");
    expect(hypo?.firstLineDrugs[0]?.brand).toContain("Synthroid");
    expect(hypo?.diagnosticEndpoints?.some((e) => e.label === "TSH")).toBe(true);
  });

  it("matches pathology badge labels to disease links", () => {
    const graves = getDiseaseLinkForPathology("thyroid", "Graves disease");
    expect(graves?.id).toBe("hyperthyroidism-graves");
  });

  it("curates endocarditis with MSSA antibiotics", () => {
    const link = getDiseaseLinkForPathology("heart", "Endocarditis");
    expect(link?.id).toBe("infective-endocarditis");
    const resolved = resolveDiseaseLink(link!);
    expect(resolved.firstLineDrugs.some((d) => d.id === "nafcillin")).toBe(true);
  });

  it("curates appendicitis with broad-spectrum antibiotics", () => {
    const link = getDiseaseLinkForPathology("appendix", "Appendicitis");
    expect(link?.id).toBe("acute-appendicitis");
  });

  it("has substantial curated disease catalog", () => {
    const curated = ANATOMY_DISEASE_LINKS.filter((d) => !d.generated);
    expect(curated.length).toBeGreaterThanOrEqual(80);
  });

  it("covers all core structure pathologies with drug threads", () => {
    const uncovered = getUncoveredCorePathologies();
    expect(uncovered).toEqual([]);
  });

  it("reports coverage stats for core organs", () => {
    const coverage = getCorePathologyCoverage();
    expect(coverage.length).toBeGreaterThan(90);
    expect(coverage.every((c) => c.hasDrugs)).toBe(true);
  });

  it("matcher finds drugs for pneumonia", () => {
    const { firstLine } = matchDrugsToPathologyForTest("Pneumonia", ["lung", "pulmonary"]);
    expect(firstLine.length).toBeGreaterThan(0);
    expect(firstLine).toContain("amoxicillin");
  });

  it("reverse lookup: levothyroxine connects to thyroid diseases", () => {
    const ctx = getClinicalContextForDrug("levothyroxine");
    expect(ctx.structureIds).toContain("thyroid");
    expect(ctx.diseases.some((d) => d.id === "primary-hypothyroidism")).toBe(true);
  });

  it("reverse lookup: omeprazole spans esophagus and stomach", () => {
    const ctx = getClinicalContextForDrug("omeprazole");
    expect(ctx.structureIds.some((id) => ["esophagus", "stomach", "duodenum"].includes(id))).toBe(
      true
    );
  });

  it("skips unknown drug ids during hydration", () => {
    const resolved = resolveDiseaseLink({
      id: "test",
      name: "Test",
      structureIds: ["thyroid"],
      pathophysiology: "x",
      presentation: [],
      firstLineDrugIds: ["levothyroxine", "not-a-real-drug"],
      highYield: false,
    });
    expect(resolved.firstLineDrugs).toHaveLength(1);
    expect(resolved.firstLineDrugs[0]?.id).toBe("levothyroxine");
  });

  it("builds deep links", () => {
    expect(anatomyDrugHref("levothyroxine")).toBe("/study/drugs300?drug=levothyroxine");
    expect(anatomyStructureHref("thyroid")).toBe("/anatomy?structure=thyroid");
  });
});
