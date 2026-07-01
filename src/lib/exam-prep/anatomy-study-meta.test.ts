import { describe, expect, it } from "vitest";
import { enrichRelatedStudyMeta, resolveStructureIdsForStudyItem } from "./anatomy-study-meta";

describe("anatomy-study-meta", () => {
  it("maps cardiology subjects to heart structures", () => {
    const ids = resolveStructureIdsForStudyItem({ subjectId: "cardiology" });
    expect(ids).toContain("heart");
  });

  it("maps neurology blueprint system to brain structures", () => {
    const ids = resolveStructureIdsForStudyItem({ blueprintSystem: "neurologic" });
    expect(ids.some((id) => id === "brain" || id === "spinal-cord")).toBe(true);
  });

  it("maps MSK topics to extremity bones", () => {
    const ids = resolveStructureIdsForStudyItem({ blueprintTopic: "musculoskeletal" });
    expect(ids.some((id) => ["femur", "humerus", "scapula", "vertebral-column"].includes(id))).toBe(
      true
    );
  });

  it("uses review module registry for ACS", () => {
    const ids = resolveStructureIdsForStudyItem({ reviewModuleSlug: "acute-coronary-syndrome" });
    expect(ids).toEqual(expect.arrayContaining(["heart", "aorta"]));
  });

  it("infers structures from clinical vignette text", () => {
    const ids = resolveStructureIdsForStudyItem({
      text: "Crushing substernal chest pain with ST elevations — which coronary artery territory?",
    });
    expect(ids).toContain("heart");
  });

  it("preserves explicit seed structureIds", () => {
    const enriched = enrichRelatedStudyMeta(
      { structureIds: ["liver"], reviewModuleSlug: "acute-coronary-syndrome" },
      { subjectId: "cardiology" }
    );
    expect(enriched.structureIds?.[0]).toBe("liver");
  });
});
