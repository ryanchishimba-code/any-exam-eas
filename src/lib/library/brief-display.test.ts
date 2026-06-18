import { describe, expect, it } from "vitest";
import { prepareBriefForDisplay } from "./brief-display";
import type { LibraryStudyBrief } from "./study-brief-types";

function sampleBrief(overrides: Partial<LibraryStudyBrief> = {}): LibraryStudyBrief {
  return {
    generatedAt: "2026-06-13T12:00:00.000Z",
    examSlug: "nclex",
    headline: "Focus on sepsis and fluids",
    summary: "Your weakest areas need a refresh before the next block.",
    focusAreas: [
      {
        topicKey: "sepsis",
        topicName: "Sepsis",
        masteryScore: 38,
        pearls: [
          "Early broad-spectrum antibiotics within one hour improve outcomes in sepsis.",
          "Early broad-spectrum antibiotics within one hour improve outcomes in sepsis.",
        ],
        studyAction: "Open memory cards and run 10 practice questions on Sepsis.",
      },
    ],
    boardUpdates: [
      "Your weakest areas need a refresh before the next block.",
      "NGN case studies emphasize clinical judgment under time pressure.",
    ],
    sourceCount: 4,
    sources: [{ title: "Open RN", url: "https://openrn.org", sourceType: "oer" }],
    aiPowered: true,
    memoryCardIds: [],
    ...overrides,
  };
}

describe("prepareBriefForDisplay", () => {
  it("truncates long copy and dedupes pearls and board updates", () => {
    const out = prepareBriefForDisplay(sampleBrief());
    expect(out.focusAreas[0]?.pearls).toHaveLength(1);
    expect(out.boardUpdates).toHaveLength(1);
    expect(out.boardUpdates[0]).toContain("NGN");
    expect(out.focusAreas[0]?.showStudyAction).toBe(false);
    expect(out.metaLine).toContain("4 cited sources");
  });

  it("keeps non-generic study actions", () => {
    const out = prepareBriefForDisplay(
      sampleBrief({
        focusAreas: [
          {
            topicKey: "cardiology",
            topicName: "Cardiology",
            pearls: ["Review beta-blocker contraindications in acute decompensated HF."],
            studyAction: "Complete the heart failure review module, then practice 15 items.",
          },
        ],
      })
    );
    expect(out.focusAreas[0]?.showStudyAction).toBe(true);
  });
});
