import { beforeEach, describe, expect, it, vi } from "vitest";

const bankState = vi.hoisted(() => ({
  bank: {
    board: "nclex" as const,
    rotationKey: "2026-10-24",
    questions: [
      {
        id: "q1",
        stem: "A nurse reviews a postoperative client with tachycardia and cool extremities.",
        options: ["Start IV fluids", "Discharge home", "Withhold assessment"],
        selection: "single" as const,
        correct: ["Start IV fluids"],
        rationale: "Hypovolemia requires fluid resuscitation first.",
        sources: ["Medical-surgical nursing"],
      },
    ],
  },
}));

vi.mock("@/lib/marketing/free-quiz", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/marketing/free-quiz")>();
  return {
    ...actual,
    getFreeQuizBank: vi.fn(async () => bankState.bank),
  };
});

vi.mock("@/lib/api-rate-limit", () => ({
  enforceRateLimit: async () => null,
}));

import { GET } from "./route";
import { POST as POST_GRADE } from "./grade/route";
import { gradeFreeQuizAnswers } from "@/lib/marketing/free-quiz";

function getRequest(board = "nclex") {
  return new Request(`https://example.test/api/marketing/free-quiz?board=${board}`);
}

function gradeRequest(body: unknown) {
  return new Request("https://example.test/api/marketing/free-quiz/grade", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("GET /api/marketing/free-quiz", () => {
  beforeEach(() => {
    bankState.bank = {
      board: "nclex",
      rotationKey: "2026-10-24",
      questions: [
        {
          id: "q1",
          stem: "A nurse reviews a postoperative client with tachycardia and cool extremities.",
          options: ["Start IV fluids", "Discharge home", "Withhold assessment"],
          selection: "single",
          correct: ["Start IV fluids"],
          rationale: "Hypovolemia requires fluid resuscitation first.",
          sources: ["Medical-surgical nursing"],
        },
      ],
    };
  });

  it("does not expose answer keys or explanations", async () => {
    const response = await GET(getRequest());
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.questions).toHaveLength(1);
    expect(body.questions[0]).toMatchObject({
      id: "q1",
      selection: "single",
    });
    expect(body.questions[0]).not.toHaveProperty("correct");
    expect(body.questions[0]).not.toHaveProperty("rationale");
    expect(body.questions[0]).not.toHaveProperty("sources");
    const serialized = JSON.stringify(body);
    expect(serialized).not.toContain("Hypovolemia requires");
    expect(serialized).not.toContain("rationale");
  });
});

describe("POST /api/marketing/free-quiz/grade", () => {
  beforeEach(() => {
    bankState.bank = {
      board: "nclex",
      rotationKey: "2026-10-24",
      questions: [
        {
          id: "mcq",
          stem: "A nurse reviews a postoperative client with tachycardia and cool extremities.",
          options: ["Start IV fluids", "Discharge home", "Withhold assessment"],
          selection: "single",
          correct: ["Start IV fluids"],
          rationale: "Hypovolemia requires fluid resuscitation first.",
          sources: ["Medical-surgical nursing"],
        },
        {
          id: "sata",
          stem: "Select all appropriate nursing actions for a client with acute pain.",
          options: ["Reassess pain", "Document findings", "Ignore report", "Offer nonpharmacologic relief"],
          selection: "multi",
          correct: ["Reassess pain", "Document findings", "Offer nonpharmacologic relief"],
          rationale: "Pain control requires assessment, documentation, and multimodal care.",
          sources: ["Pain management guideline"],
        },
      ],
    };
  });

  it("returns score and answer review without explanations", async () => {
    const response = await POST_GRADE(
      gradeRequest({
        board: "nclex",
        rotationKey: "2026-10-24",
        answers: [
          { id: "mcq", selected: ["Start IV fluids"] },
          {
            id: "sata",
            selected: ["Offer nonpharmacologic relief", "Reassess pain", "Document findings"],
          },
        ],
      })
    );
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toMatchObject({ score: 2, total: 2 });
    expect(body.results[1]?.correct).toBe(true);
    const serialized = JSON.stringify(body);
    expect(serialized).not.toContain("Hypovolemia");
    expect(serialized).not.toContain("Pain control requires");
    expect(body.results[0]).not.toHaveProperty("rationale");
    expect(body.results[0]).not.toHaveProperty("sources");
    expect(body.results[0]).not.toHaveProperty("explanation");
  });

  it("grades multi-select strictly", () => {
    const graded = gradeFreeQuizAnswers(bankState.bank, "2026-10-24", [
      { id: "mcq", selected: ["Start IV fluids"] },
      { id: "sata", selected: ["Reassess pain", "Document findings"] },
    ]);
    expect(graded.ok).toBe(true);
    if (!graded.ok) return;
    expect(graded.payload.score).toBe(1);
    expect(graded.payload.results[1]?.correct).toBe(false);
  });
});
