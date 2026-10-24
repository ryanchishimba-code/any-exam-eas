import { describe, expect, it } from "vitest";
import {
  freeQuizRotationKey,
  gradeFreeQuizAnswers,
  isFreeQuizBoardSlug,
  toPublicFreeQuizPayload,
  type FreeQuizBankPayload,
} from "@/lib/marketing/free-quiz";

describe("freeQuizRotationKey", () => {
  it("uses a UTC date bucket", () => {
    expect(freeQuizRotationKey(new Date("2026-10-24T15:30:00.000Z"))).toBe("2026-10-24");
  });
});

describe("isFreeQuizBoardSlug", () => {
  it("accepts the six public board slugs", () => {
    expect(isFreeQuizBoardSlug("nclex")).toBe(true);
    expect(isFreeQuizBoardSlug("aanp-fnp")).toBe(true);
    expect(isFreeQuizBoardSlug("mpje")).toBe(false);
  });
});

describe("toPublicFreeQuizPayload", () => {
  it("strips keyed answers and rationales", () => {
    const bank: FreeQuizBankPayload = {
      board: "nclex",
      rotationKey: "2026-10-24",
      questions: [
        {
          id: "q1",
          stem: "A nurse is caring for a client with dehydration.",
          options: ["Option A", "Option B"],
          selection: "single",
          correct: ["Option A"],
          rationale: "Option A is best because fluids are needed.",
          sources: ["Source one"],
        },
      ],
    };
    const publicPayload = toPublicFreeQuizPayload(bank);
    expect(publicPayload.questions[0]).toEqual({
      id: "q1",
      stem: bank.questions[0]!.stem,
      options: bank.questions[0]!.options,
      selection: "single",
    });
    expect(JSON.stringify(publicPayload)).not.toContain("Option A is best");
    expect(publicPayload.questions[0]).not.toHaveProperty("correct");
    expect(publicPayload.questions[0]).not.toHaveProperty("rationale");
    expect(publicPayload.questions[0]).not.toHaveProperty("sources");
  });
});

describe("gradeFreeQuizAnswers", () => {
  const bank: FreeQuizBankPayload = {
    board: "nclex",
    rotationKey: "2026-10-24",
    questions: [
      {
        id: "single-1",
        stem: "Pick the priority intervention for a febrile infant.",
        options: ["Give antipyretic", "Isolate immediately", "Delay assessment"],
        selection: "single",
        correct: ["Give antipyretic"],
        rationale: "Fever management comes first in this vignette.",
        sources: ["Pediatric nursing text"],
      },
      {
        id: "sata-1",
        stem: "Select all appropriate actions for a post-op client with nausea.",
        options: ["Assess hydration", "Administer PRN antiemetic", "Ignore symptoms", "Document intake"],
        selection: "multi",
        correct: ["Assess hydration", "Administer PRN antiemetic", "Document intake"],
        rationale: "Supportive care and documentation are required.",
        sources: ["Perioperative guidelines"],
      },
    ],
  };

  it("scores single-select and multi-select answers", () => {
    const graded = gradeFreeQuizAnswers(bank, "2026-10-24", [
      { id: "single-1", selected: ["Give antipyretic"] },
      { id: "sata-1", selected: ["Document intake", "Assess hydration", "Administer PRN antiemetic"] },
    ]);
    expect(graded.ok).toBe(true);
    if (!graded.ok) return;
    expect(graded.payload.score).toBe(2);
    expect(graded.payload.results[0]?.correct).toBe(true);
    expect(graded.payload.results[1]?.correct).toBe(true);
    expect(graded.payload.results[1]).not.toHaveProperty("rationale");
    expect(graded.payload.results[1]).not.toHaveProperty("sources");
    expect(graded.payload.results[1]).not.toHaveProperty("explanation");
  });

  it("marks a partial SATA attempt incorrect", () => {
    const graded = gradeFreeQuizAnswers(bank, "2026-10-24", [
      { id: "single-1", selected: ["Give antipyretic"] },
      { id: "sata-1", selected: ["Assess hydration", "Administer PRN antiemetic"] },
    ]);
    expect(graded.ok).toBe(true);
    if (!graded.ok) return;
    expect(graded.payload.score).toBe(1);
    expect(graded.payload.results[1]?.correct).toBe(false);
  });

  it("allows unanswered items as incorrect", () => {
    const graded = gradeFreeQuizAnswers(bank, "2026-10-24", [
      { id: "single-1", selected: [] },
      { id: "sata-1", selected: ["Assess hydration", "Administer PRN antiemetic", "Document intake"] },
    ]);
    expect(graded.ok).toBe(true);
    if (!graded.ok) return;
    expect(graded.payload.score).toBe(1);
    expect(graded.payload.results[0]?.correct).toBe(false);
    expect(graded.payload.results[0]?.selected).toEqual([]);
  });

  it("rejects a stale rotation key", () => {
    const graded = gradeFreeQuizAnswers(bank, "2026-10-23", [
      { id: "single-1", selected: ["Give antipyretic"] },
      { id: "sata-1", selected: ["Assess hydration", "Administer PRN antiemetic", "Document intake"] },
    ]);
    expect(graded.ok).toBe(false);
    if (graded.ok) return;
    expect(graded.status).toBe(400);
  });
});
