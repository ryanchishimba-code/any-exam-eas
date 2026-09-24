import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  resolveReviewOpenQueueTotal,
  reviewIncorrectPosition,
  reviewIncorrectQuestionReason,
  reviewIncorrectSessionRationale,
} from "./review-incorrect-queue-label";

describe("review incorrect sitting label", () => {
  it("names the full open queue when the sitting is capped", () => {
    expect(
      reviewIncorrectPosition({ index: 0, sittingSize: 25, openTotal: 41 })
    ).toEqual({ sitting: "(1/25)", openLabel: "41 open" });
    expect(
      reviewIncorrectPosition({ index: 9, sittingSize: 10, openTotal: 41 })
    ).toEqual({ sitting: "(10/10)", openLabel: "41 open" });
  });

  it("keeps the position alone when the sitting is the whole queue", () => {
    expect(
      reviewIncorrectPosition({ index: 0, sittingSize: 41, openTotal: 41 })
    ).toEqual({ sitting: "(1/41)", openLabel: null });
    expect(reviewIncorrectPosition({ index: 0, sittingSize: 25 })).toEqual({
      sitting: "(1/25)",
      openLabel: null,
    });
    expect(
      reviewIncorrectPosition({ index: 0, sittingSize: 7, openTotal: 4 })
    ).toEqual({ sitting: "(1/7)", openLabel: null });
  });

  it("ignores a non-finite open total and an empty sitting", () => {
    expect(
      reviewIncorrectPosition({ index: 0, sittingSize: 25, openTotal: Number.NaN })
    ).toEqual({ sitting: "(1/25)", openLabel: null });
    expect(reviewIncorrectPosition({ index: 0, sittingSize: 0, openTotal: 41 })).toBeNull();
  });

  it("says how a capped sitting relates to the open set", () => {
    expect(
      reviewIncorrectSessionRationale({ sittingSize: 25, openTotal: 41 })
    ).toBe(
      "Reviewing 25 of 41 open items. One correct leaves an item pending re-proof until a spaced re-check, or you mark it mastered."
    );
    expect(
      reviewIncorrectSessionRationale({ sittingSize: 10, openTotal: 41 })
    ).toContain("Reviewing 10 of 41 open items.");
    expect(reviewIncorrectSessionRationale({ sittingSize: 1, openTotal: 1 })).toBe(
      "Reviewing 1 open item. One correct leaves an item pending re-proof until a spaced re-check, or you mark it mastered."
    );
  });

  it("threads the launch queue total into the review session chip", () => {
    const practice = readFileSync(
      new URL("../../components/study/StudyBankPractice.tsx", import.meta.url),
      "utf8"
    );
    const player = readFileSync(
      new URL("../../components/study/StudySessionPlayer.tsx", import.meta.url),
      "utf8"
    );
    const chip = readFileSync(
      new URL("../../components/study/AdaptiveReasoningChip.tsx", import.meta.url),
      "utf8"
    );
    expect(practice).toContain("resolveReviewOpenQueueTotal");
    expect(practice).toContain("boardOpenRemediationCount");
    expect(practice).toContain("reviewIncorrectSessionRationale");
    expect(player).toContain("openQueueTotal");
    expect(player).toContain("reviewIncorrectQuestionReason");
    expect(player).toContain("review_incorrect");
    expect(chip).toContain("reviewIncorrectPosition");
    expect(chip).not.toMatch(/nclex|naplex/i);
    const loader = readFileSync(
      new URL("../../components/study/question-bank/QuestionBankPracticeLoader.tsx", import.meta.url),
      "utf8"
    );
    expect(loader).toContain("boardOpenRemediationCount={roadmap?.openIncorrectCount");
  });

  it("keeps the dashboard open total when a launch payload only echoes the sitting", () => {
    expect(
      resolveReviewOpenQueueTotal({
        sittingSize: 25,
        boardOpenTotal: 41,
        preflightAvailable: 41,
        payloads: [{ availableIncorrect: 25, questions: new Array(25) }],
      })
    ).toBe(41);
    expect(
      resolveReviewOpenQueueTotal({
        sittingSize: 10,
        boardOpenTotal: null,
        preflightAvailable: 41,
        payloads: [{}],
        headerTotals: [null],
      })
    ).toBe(41);
    expect(
      resolveReviewOpenQueueTotal({
        sittingSize: 10,
        payloads: [{ openQueueTotal: "41" }],
      })
    ).toBe(41);
    expect(
      resolveReviewOpenQueueTotal({
        sittingSize: 7,
        boardOpenTotal: 7,
        preflightAvailable: 7,
      })
    ).toBe(7);
  });

  it("finds the per-question line after session ids are rewritten", () => {
    const reasoning = { "1": "Open remediation — a single correct does not clear this item." };
    expect(
      reviewIncorrectQuestionReason(
        reasoning,
        { id: "q-1-abc", sourceIndex: 1 },
        "Reviewing 25 open items."
      )
    ).toBe("Open remediation — a single correct does not clear this item.");
    expect(
      reviewIncorrectQuestionReason(
        { "bank-1": "Open remediation — a single correct does not clear this item." },
        { id: "q-1-abc", sourceIndex: 9, bankItemId: "bank-1" },
        "fallback"
      )
    ).toContain("Open remediation");
  });
});
