import { describe, expect, it } from "vitest";
import { resolveQuestionStudyLinks } from "./question-study-links";

describe("resolveQuestionStudyLinks", () => {
  it("resolves NCLEX infection control from subjectId", () => {
    const links = resolveQuestionStudyLinks("nclex", {
      subjectId: "safety-infection",
    });
    expect(links.primaryDeepDive?.slug).toBe("infection-control");
    expect(links.relatedDeepDives.length).toBeGreaterThan(0);
    expect(links.relatedDeepDives[0]!.href).toContain("mode=deep");
    expect(links.studyGuide?.href).toBe("/nclex/study-guide/fundamentals-safety");
  });

  it("prefers reviewModuleSlug from ngnPayload", () => {
    const links = resolveQuestionStudyLinks("naplex", {
      ngnPayload: { reviewModuleSlug: "heart-failure-gdmt" },
    });
    expect(links.primaryDeepDive?.slug).toBe("heart-failure-gdmt");
  });

  it("does not offer clavicle or femur on a NAPLEX pharmacokinetics item", () => {
    const links = resolveQuestionStudyLinks("naplex", {
      subjectId: "pharmacokinetics",
      topicCategory: "pharmacokinetics",
      stem: "Calculate the half-life from clearance and volume of distribution. The drug has a long half-life. How long to steady state?",
    });
    expect(links.anatomyStructures.some((structure) => /clavicle|femur/i.test(structure.id))).toBe(
      false
    );
  });

  it("falls back to topicCategory for full-exam review", () => {
    const links = resolveQuestionStudyLinks("usmle", {
      topicCategory: "cardiology",
    });
    expect(links.relatedDeepDives.some((d) => d.slug === "acute-coronary-syndrome")).toBe(true);
  });
});
