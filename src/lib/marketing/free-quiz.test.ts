import { describe, expect, it } from "vitest";
import { MARKETING_BOARD_SLUGS } from "@/lib/marketing/board-paths";
import {
  FREE_QUIZ_QUESTION_COUNT,
  FREE_QUIZ_QUESTION_IDS,
  FREE_QUIZ_ROTATION_KEY,
  composeFreeQuizStem,
  freeQuizRotationKey,
  gradeFreeQuizAnswers,
  isFreeQuizBoardSlug,
  pickFreeQuizQuestionsFromRows,
  toPublicFreeQuizPayload,
  type FreeQuizBankPayload,
  type FreeQuizCandidateRow,
} from "@/lib/marketing/free-quiz";

const SCENARIO =
  "A 58-year-old man with type 2 diabetes and hypertension presents to the emergency department with 2 days of nausea, vomiting, and polyuria. He appears lethargic. Temperature 37.1°C (98.8°F), pulse 118/min, respirations 24/min, blood pressure 92/58 mm Hg. Dry mucous membranes and poor skin turgor are noted. Fingerstick glucose is 412 mg/dL. Serum studies show sodium 128 mEq/L, potassium 5.4 mEq/L, bicarbonate 10 mEq/L, and anion gap 22.";

function mockCandidateRow(id: string, overrides: Partial<FreeQuizCandidateRow> = {}): FreeQuizCandidateRow {
  return {
    id,
    fieldId: "pance",
    itemType: "vignette",
    scenario: SCENARIO,
    question: "Which action should the clinician take first?",
    options: JSON.stringify({
      options: ["Start IV 0.9% sodium chloride", "Administer subcutaneous insulin only", "Discharge with oral fluids"],
    }),
    correctAnswer: "Start IV 0.9% sodium chloride",
    explanation:
      "This presentation is consistent with diabetic ketoacidosis with hypovolemia; isotonic IV fluids are the priority before insulin therapy.",
    references: [{ label: "Endocrine emergencies", citation: "ACEP clinical policy" }],
    ...overrides,
  };
}

describe("freeQuizRotationKey", () => {
  it("stays on one fixed set instead of a daily bucket", () => {
    expect(freeQuizRotationKey()).toBe(FREE_QUIZ_ROTATION_KEY);
    expect(freeQuizRotationKey()).toBe("fixed");
  });
});

describe("FREE_QUIZ_QUESTION_IDS", () => {
  it.each(MARKETING_BOARD_SLUGS)("%s has exactly 10 unique ids", (board) => {
    const ids = FREE_QUIZ_QUESTION_IDS[board];
    expect(ids).toHaveLength(FREE_QUIZ_QUESTION_COUNT);
    expect(new Set(ids).size).toBe(FREE_QUIZ_QUESTION_COUNT);
    for (const id of ids) {
      expect(id).toMatch(/^[a-z0-9]+$/);
    }
  });

  it("does not repeat an id on more than one board", () => {
    const ids = MARKETING_BOARD_SLUGS.flatMap((board) => [...FREE_QUIZ_QUESTION_IDS[board]]);
    expect(new Set(ids).size).toBe(ids.length);
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

describe("composeFreeQuizStem", () => {
  it("includes the stored scenario with the lead-in question", () => {
    const row = mockCandidateRow("stem-1");
    const stem = composeFreeQuizStem(row);
    expect(stem).toContain("58-year-old man");
    expect(stem).toContain("Which action should the clinician take first?");
    expect(stem.length).toBeGreaterThan(150);
  });

  it("appends plain-text exhibit tables from options JSON", () => {
    const row = mockCandidateRow("table-1", {
      options: JSON.stringify({
        options: ["Option A", "Option B", "Option C"],
        table: {
          title: "Laboratory studies",
          headers: ["Test", "Result"],
          rows: [["Glucose", "412 mg/dL"], ["Bicarbonate", "10 mEq/L"]],
        },
      }),
    });
    const stem = composeFreeQuizStem(row);
    expect(stem).toContain("Laboratory studies");
    expect(stem).toContain("Glucose | 412 mg/dL");
  });
});

describe("pickFreeQuizQuestionsFromRows", () => {
  it("returns ten unique items when enough eligible rows exist", () => {
    const rows = Array.from({ length: 14 }, (_, index) => mockCandidateRow(`q-${index}`));
    const picked = pickFreeQuizQuestionsFromRows(rows);
    expect(picked).toHaveLength(FREE_QUIZ_QUESTION_COUNT);
    expect(new Set(picked.map((item) => item.id)).size).toBe(FREE_QUIZ_QUESTION_COUNT);
    for (const item of picked) {
      expect(item.stem.length).toBeGreaterThan(150);
    }
  });

  it.each(MARKETING_BOARD_SLUGS)("fills %s marketing boards to ten from eligible rows", (board) => {
    const fieldId =
      board === "nclex"
        ? "nursing"
        : board === "naplex"
          ? "pharmacy"
          : board === "usmle"
            ? "usmle-step-2"
            : board;
    const rows = Array.from({ length: 12 }, (_, index) =>
      mockCandidateRow(`${board}-${index}`, { fieldId })
    );
    expect(pickFreeQuizQuestionsFromRows(rows)).toHaveLength(FREE_QUIZ_QUESTION_COUNT);
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
