import { describe, expect, it } from "vitest";
import { getAnatomyStructure } from "@/lib/anatomy";
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
    expect(hypo?.guidelines?.some((g) => /Thyroid|FDA/i.test(g.label))).toBe(true);
  });

  it("matches pathology badge labels to disease links", () => {
    const graves = getDiseaseLinkForPathology("thyroid", "Graves disease");
    expect(graves?.id).toBe("hyperthyroidism-graves");
  });

  it("does not treat propranolol as disease-modifying first-line for Graves", () => {
    const graves = resolveDiseaseLink(getDiseaseLinkForPathology("thyroid", "Graves disease")!);
    expect(graves.firstLineDrugIds).not.toContain("propranolol");
    expect(graves.adjunctDrugIds).toContain("propranolol");
    expect(graves.guidelines?.some((g) => /Thyroid/i.test(g.label))).toBe(true);
  });

  it("includes ADA outcome agents for type 2 diabetes", () => {
    const t2dm = getResolvedDiseaseLinksForStructure("pancreas").find(
      (d) => d.id === "type-2-diabetes"
    );
    expect(t2dm?.firstLineDrugs.some((d) => d.id === "metformin")).toBe(true);
    expect(t2dm?.adjunctDrugs.some((d) => d.id === "semaglutide")).toBe(true);
    expect(t2dm?.adjunctDrugs.some((d) => d.id === "empagliflozin")).toBe(true);
    expect(t2dm?.guidelines?.some((g) => /ADA/i.test(g.label))).toBe(true);
  });

  it("anchors ischemic stroke to brain + carotid", () => {
    const stroke = getDiseaseLinkForPathology("brain", "Stroke");
    expect(stroke?.id).toBe("ischemic-stroke-brain");
    expect(stroke?.structureIds).toContain("brain");
    expect(stroke?.structureIds).toContain("carotid-artery");
    expect(stroke?.structureIds).not.toContain("spinal-cord");
  });

  it("publishes a brain structure in the catalog", () => {
    expect(getAnatomyStructure("brain")?.name).toBe("Brain");
    expect(getAnatomyStructure("brain")?.pathologies).toContain("Stroke");
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

  it("attaches guidelines to every curated high-yield disease", () => {
    const highYield = ANATOMY_DISEASE_LINKS.filter((d) => d.highYield && !d.generated);
    expect(highYield.length).toBeGreaterThan(20);
    for (const d of highYield) {
      expect(d.guidelines?.length ?? 0).toBeGreaterThan(0);
      expect(d.evidenceLevel).not.toBe("auto-matched");
    }
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

  it("matcher finds review-only adjunct drugs for pneumonia (never false first-line)", () => {
    const { firstLine, adjunct } = matchDrugsToPathologyForTest("Pneumonia", [
      "lung",
      "pulmonary",
    ]);
    expect(firstLine).toEqual([]);
    expect(adjunct.length).toBeGreaterThan(0);
    expect(
      adjunct.some((id) =>
        ["amoxicillin", "azithromycin", "levofloxacin", "cefuroxime"].includes(id)
      )
    ).toBe(true);
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
    expect(anatomyStructureHref("brain")).toBe("/anatomy?structure=brain");
  });
});
