import { describe, expect, it } from "vitest";
import {
  countOpenIncorrectItems,
  REMEDIATION_MASTERY_RULE,
  selectReviewQueueIds,
  SPACED_REPROOF_MIN_DAYS,
  SPACED_REPROOF_MIN_INTERVENING,
  summarizeRemediationMastery,
} from "./item-mastery";

const DAY = 24 * 60 * 60 * 1000;
const t0 = Date.parse("2026-09-01T15:00:00.000Z");

describe("remediation mastery state machine", () => {
  it("keeps a miss open until any correct exists", () => {
    const summary = summarizeRemediationMastery({
      attempts: [
        { bankItemId: "q1", questionKey: "q1", correct: false, createdAt: t0, sessionId: "s1" },
      ],
      now: t0,
    });
    expect(summary.totalOpen).toBe(1);
    expect(summary.stillMissed).toBe(1);
    expect(summary.items[0]?.status).toBe("open");
  });

  it("does not clear on one immediate correct in the same session", () => {
    const summary = summarizeRemediationMastery({
      attempts: [
        {
          bankItemId: "q1",
          questionKey: "q1",
          correct: false,
          createdAt: t0,
          sessionId: "s1",
          subjectId: "management-of-care",
        },
        {
          bankItemId: "q1",
          questionKey: "q1",
          correct: true,
          createdAt: t0 + 60_000,
          sessionId: "s1",
          subjectId: "management-of-care",
        },
      ],
      now: t0 + 60_000,
    });
    expect(summary.totalOpen).toBe(1);
    expect(summary.pendingReproof).toBe(1);
    expect(summary.items[0]?.status).toBe("pending_reproof");
    expect(summary.items[0]?.reproofDue).toBe(false);
    expect(
      countOpenIncorrectItems([
        { bankItemId: "q1", correct: false, createdAt: t0, sessionId: "s1" },
        { bankItemId: "q1", correct: true, createdAt: t0 + 60_000, sessionId: "s1" },
      ])
    ).toBe(1);
  });

  it("keeps a single later-session correct as pending re-proof", () => {
    const summary = summarizeRemediationMastery({
      attempts: [
        { bankItemId: "q1", correct: false, createdAt: t0, sessionId: "s1" },
        { bankItemId: "q1", correct: true, createdAt: t0 + 3_600_000, sessionId: "s2" },
      ],
      now: t0 + 3_600_000,
    });
    expect(summary.pendingReproof).toBe(1);
    expect(summary.totalOpen).toBe(1);
    expect(selectReviewQueueIds({
      attempts: [
        { bankItemId: "q1", correct: false, createdAt: t0, sessionId: "s1" },
        { bankItemId: "q1", correct: true, createdAt: t0 + 3_600_000, sessionId: "s2" },
      ],
      now: t0 + 3_600_000,
    })).toEqual(["q1"]);
  });

  it("clears after a spaced re-ask on a later day", () => {
    const proofAt = t0 + 3_600_000;
    const reaskAt = proofAt + SPACED_REPROOF_MIN_DAYS * DAY;
    const attempts = [
      { bankItemId: "q1", correct: false, createdAt: t0, sessionId: "s1", subjectId: "cardiac" },
      { bankItemId: "q1", correct: true, createdAt: proofAt, sessionId: "s2", subjectId: "cardiac" },
      { bankItemId: "q1", correct: true, createdAt: reaskAt, sessionId: "s3", subjectId: "cardiac" },
    ];
    const summary = summarizeRemediationMastery({ attempts, now: reaskAt });
    expect(summary.totalOpen).toBe(0);
    expect(selectReviewQueueIds({ attempts, now: reaskAt })).toEqual([]);
  });

  it("clears after enough intervening items even on the same day", () => {
    const proofAt = t0 + 60_000;
    const attempts = [
      { bankItemId: "q1", correct: false, createdAt: t0, sessionId: "s1" },
      { bankItemId: "q1", correct: true, createdAt: proofAt, sessionId: "s2" },
      ...Array.from({ length: SPACED_REPROOF_MIN_INTERVENING }, (_, index) => ({
        bankItemId: `other-${index}`,
        correct: true,
        createdAt: proofAt + (index + 1) * 1000,
        sessionId: "s2",
      })),
      {
        bankItemId: "q1",
        correct: true,
        createdAt: proofAt + 60_000,
        sessionId: "s3",
      },
    ];
    expect(summarizeRemediationMastery({ attempts, now: proofAt + 60_000 }).totalOpen).toBe(0);
  });

  it("does not clear a same-day re-ask that is still short of the spacing bar", () => {
    const proofAt = t0 + 60_000;
    const attempts = [
      { bankItemId: "q1", correct: false, createdAt: t0, sessionId: "s1" },
      { bankItemId: "q1", correct: true, createdAt: proofAt, sessionId: "s2" },
      ...Array.from({ length: SPACED_REPROOF_MIN_INTERVENING - 1 }, (_, index) => ({
        bankItemId: `other-${index}`,
        correct: true,
        createdAt: proofAt + (index + 1) * 1000,
        sessionId: "s2",
      })),
      { bankItemId: "q1", correct: true, createdAt: proofAt + 30_000, sessionId: "s3" },
    ];
    const summary = summarizeRemediationMastery({ attempts, now: proofAt + 30_000 });
    expect(summary.pendingReproof).toBe(1);
    expect(summary.totalOpen).toBe(1);
  });

  it("clears when the student confirms mark mastered", () => {
    const attempts = [
      { bankItemId: "q1", correct: false, createdAt: t0, sessionId: "s1", subjectId: "psych" },
    ];
    const summary = summarizeRemediationMastery({
      attempts,
      marks: [{ itemId: "q1", confirmedAt: t0 + 5_000 }],
      now: t0 + 5_000,
    });
    expect(summary.totalOpen).toBe(0);
  });

  it("reopens a mastered item after a later miss", () => {
    const summary = summarizeRemediationMastery({
      attempts: [
        { bankItemId: "q1", correct: false, createdAt: t0, sessionId: "s1" },
        { bankItemId: "q1", correct: false, createdAt: t0 + DAY, sessionId: "s2" },
      ],
      marks: [{ itemId: "q1", confirmedAt: t0 + 5_000 }],
      now: t0 + DAY,
    });
    expect(summary.stillMissed).toBe(1);
    expect(summary.totalOpen).toBe(1);
  });

  it("ignores ephemeral numeric keys and uses the same machine for any field id", () => {
    expect(
      countOpenIncorrectItems([
        { questionKey: "42", correct: false, createdAt: t0 },
        { bankItemId: "usmle-item", correct: false, createdAt: t0, sessionId: "s1" },
        { bankItemId: "naplex-item", correct: false, createdAt: t0, sessionId: "s1" },
      ])
    ).toBe(2);
    expect(REMEDIATION_MASTERY_RULE).toMatch(/pending re-proof/i);
    expect(REMEDIATION_MASTERY_RULE).toMatch(/mark it mastered/i);
    expect(REMEDIATION_MASTERY_RULE).not.toMatch(/nclex only/i);
  });
});
