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
  });

  it("prefers reviewModuleSlug from ngnPayload", () => {
    const links = resolveQuestionStudyLinks("naplex", {
      ngnPayload: { reviewModuleSlug: "heart-failure-gdmt" },
    });
    expect(links.primaryDeepDive?.slug).toBe("heart-failure-gdmt");
  });

  it("falls back to topicCategory for full-exam review", () => {
    const links = resolveQuestionStudyLinks("usmle", {
      topicCategory: "cardiology",
    });
    expect(links.relatedDeepDives.some((d) => d.slug === "acute-coronary-syndrome")).toBe(true);
  });
});
