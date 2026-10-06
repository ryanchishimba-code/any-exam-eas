import { describe, expect, it } from "vitest";
import { guideMatchesQuestion, resolveQuestionStudyLinks } from "./question-study-links";

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

  it("keeps a heart link for chest pain and hides anatomy that the stem does not name", () => {
    const heart = resolveQuestionStudyLinks("nclex", {
      subjectId: "physiological-adaptation",
      stem: "Crushing substernal chest pain with ST elevations — which coronary artery territory?",
      anatomyText: "Crushing substernal chest pain with ST elevations — which coronary artery territory?",
    });
    expect(
      heart.anatomyStructures.some((structure) => structure.id === "heart" || structure.id === "heart-coronary-arteries")
    ).toBe(true);

    const burns = resolveQuestionStudyLinks("nclex", {
      subjectId: "physiological-adaptation",
      topicCategory: "cardiovascular",
      stem: "Partial-thickness burns cover both arms. Airway is patent.",
      anatomyText: "Partial-thickness burns cover both arms. Airway is patent.",
    });
    expect(burns.anatomyStructures.some((structure) => /heart|liver|spleen/i.test(structure.name))).toBe(false);
    expect(burns.memoryCards.every((card) => /burn|airway|inhal/i.test(card.title))).toBe(true);
  });

  it("shows a Beers guide only at age 65 or older", () => {
    expect(guideMatchesQuestion("Beers Criteria", "A 30-year-old takes diphenhydramine at bedtime.")).toBe(false);
    expect(guideMatchesQuestion("Geriatric prescribing", "A 72-year-old takes diphenhydramine at bedtime.")).toBe(
      true
    );
    expect(guideMatchesQuestion("Endocrine", "Atorvastatin 40 mg. LDL remains 160.")).toBe(false);
    expect(guideMatchesQuestion("Anticoagulation & Reversal", "Aprepitant for chemotherapy nausea.")).toBe(false);
  });
});
