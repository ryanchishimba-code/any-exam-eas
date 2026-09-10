import { describe, expect, it } from "vitest";
import {
  AANP_FNP_FIGURE_CATALOG,
  findApprovedAanpFnpFiguresForTopic,
  selectAanpFnpFigureForItem,
} from "./figure-assets";
import { normalizeAanpFnpExhibitPayload } from "./normalize-exhibit";
import type { BankItem } from "@/lib/question-bank";

describe("AANP FNP figure catalog", () => {
  it("exposes approved primary-care teaching SVGs", () => {
    expect(AANP_FNP_FIGURE_CATALOG.length).toBeGreaterThanOrEqual(5);
    for (const fig of AANP_FNP_FIGURE_CATALOG) {
      expect(fig.reviewStatus).toBe("approved");
      expect(fig.url.startsWith("data:image/svg+xml")).toBe(true);
      expect(fig.id.startsWith("aanp-")).toBe(true);
    }
  });

  it("finds AFib figure by exact topic", () => {
    const figs = findApprovedAanpFnpFiguresForTopic("atrial-fibrillation-anticoagulation");
    expect(figs[0]?.id).toBe("aanp-ecg-afib");
  });

  it("does not attach AFib figure for hypertension without AFib cues", () => {
    expect(
      selectAanpFnpFigureForItem({
        vignette: "A 58-year-old with hypertension presents for medication refill.",
        question: "Which antihypertensive is most appropriate first-line?",
        blueprintTopic: "atrial-fibrillation-anticoagulation",
      })
    ).toBeUndefined();
  });

  it("attaches AFib figure when stem tests atrial fibrillation", () => {
    expect(
      selectAanpFnpFigureForItem({
        vignette:
          "A 72-year-old has irregularly irregular rhythm. ECG shows atrial fibrillation with no P waves.",
        question: "Which next step addresses stroke risk?",
        blueprintTopic: "atrial-fibrillation-anticoagulation",
      })?.id
    ).toBe("aanp-ecg-afib");
  });

  it("attaches ABCDE when melanoma warning signs are tested", () => {
    expect(
      selectAanpFnpFigureForItem({
        vignette: "A patient asks which pigmented lesion features suggest melanoma.",
        question: "Which ABCDE finding most warrants biopsy referral?",
        blueprintTopic: "skin-cancer-detection",
      })?.id
    ).toBe("aanp-derm-abcde");
  });

  it("does not attach otoscopy for pharyngitis without TM findings", () => {
    expect(
      selectAanpFnpFigureForItem({
        vignette: "A child has fever and sore throat without ear pain.",
        question: "Which test is most appropriate?",
        blueprintTopic: "otitis-hearing-loss",
      })
    ).toBeUndefined();
  });

  it("attaches otoscopy when acute otitis media findings are tested", () => {
    expect(
      selectAanpFnpFigureForItem({
        vignette: "Otoscopy shows a bulging tympanic membrane with middle ear effusion.",
        question: "Which diagnosis is most likely?",
        blueprintTopic: "otitis-hearing-loss",
      })?.id
    ).toBe("aanp-otoscopy-om");
  });

  it("attaches spirometry when FEV1/FVC obstruction is tested", () => {
    expect(
      selectAanpFnpFigureForItem({
        vignette: "Spirometry shows FEV1/FVC of 0.62 with an obstructive pattern.",
        question: "Which interpretation is correct?",
        blueprintTopic: "copd-gold-inhalers",
      })?.id
    ).toBe("aanp-spirometry-obstructive");
  });

  it("attaches growth chart when crossing percentiles is tested", () => {
    expect(
      selectAanpFnpFigureForItem({
        vignette:
          "A toddler's growth chart shows crossing percentiles downward over three visits.",
        question: "Which action is most appropriate?",
        blueprintTopic: "well-child-developmental-milestones",
      })?.id
    ).toBe("aanp-growth-chart");
  });
});

describe("normalizeAanpFnpExhibitPayload", () => {
  it("attaches purpose-fit media", () => {
    const item = {
      subjectId: "cardiovascular",
      vignette: "ECG confirms atrial fibrillation with irregularly irregular rhythm.",
      question: "Calculate CHA2DS2-VASc to guide anticoagulation.",
      options: ["A", "B", "C", "D"],
      correctAnswer: "A",
      explanation: "x",
      itemType: "vignette",
      blueprintTopic: "atrial-fibrillation-anticoagulation",
      ngnPayload: { kind: "vignette" },
    } as BankItem;

    const next = normalizeAanpFnpExhibitPayload(item);
    const media = next.ngnPayload?.media as { id?: string }[] | undefined;
    expect(media?.some((m) => m.id === "aanp-ecg-afib")).toBe(true);
  });

  it("prunes misfit catalog media", () => {
    const item = {
      subjectId: "cardiovascular",
      vignette: "A well adult presents for annual wellness visit.",
      question: "Which USPSTF screening is indicated?",
      options: ["A", "B", "C", "D"],
      correctAnswer: "A",
      explanation: "x",
      itemType: "vignette",
      blueprintTopic: "health-promotion-uspstf-screening",
      ngnPayload: {
        kind: "vignette",
        media: [
          {
            id: "aanp-ecg-afib",
            kind: "ecg",
            url: "data:image/svg+xml,x",
            alt: "afib",
            license: "x",
            sourceNote: "x",
            organSystem: "cardiovascular",
            topics: ["atrial-fibrillation-anticoagulation"],
            reviewStatus: "approved",
          },
        ],
      },
    } as BankItem;

    const next = normalizeAanpFnpExhibitPayload(item);
    expect(next.ngnPayload?.media).toBeUndefined();
  });
});
