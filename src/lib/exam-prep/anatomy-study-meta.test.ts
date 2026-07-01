import { describe, expect, it } from "vitest";
import { enrichRelatedStudyMeta, resolveStructureIdsForStudyItem } from "./anatomy-study-meta";
import { applyAnatomyStudyMetaToBankItem } from "./apply-bank-anatomy-meta";
import type { BankItem } from "@/lib/question-bank";

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

  it("maps NPTE MSK subjects to extremity bones", () => {
    const ids = resolveStructureIdsForStudyItem({ subjectId: "musculoskeletal" });
    expect(ids.some((id) => ["femur", "humerus", "vertebral-column"].includes(id))).toBe(true);
  });

  it("maps NAPLEX cardiovascular-rx to heart", () => {
    const ids = resolveStructureIdsForStudyItem({ subjectId: "cardiovascular-rx" });
    expect(ids).toContain("heart");
  });

  it("applyAnatomyStudyMetaToBankItem patches ngnPayload at serve time", () => {
    const item: BankItem = {
      subjectId: "cardiology",
      question: "STEMI with ST elevation in V1–V4. Next step?",
      options: ["A", "B", "C", "D"],
      correctAnswer: "A",
      explanation: "Anterior wall MI — LAD territory.",
    };
    const patched = applyAnatomyStudyMetaToBankItem(item);
    expect(patched.ngnPayload?.structureIds).toContain("heart");
  });

  it("applyAnatomyStudyMetaToBankItem preserves explicit structureIds", () => {
    const item: BankItem = {
      subjectId: "cardiology",
      question: "Test?",
      options: ["A", "B", "C", "D"],
      correctAnswer: "A",
      explanation: "Test",
      ngnPayload: { structureIds: ["liver", "kidneys", "brain"] },
    };
    expect(applyAnatomyStudyMetaToBankItem(item)).toBe(item);
  });
});
