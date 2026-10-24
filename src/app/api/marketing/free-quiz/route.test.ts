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
import { FREE_QUIZ_QUESTION_COUNT, gradeFreeQuizAnswers } from "@/lib/marketing/free-quiz";

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

  it("grades a full ten-answer submission end to end", async () => {
    const questions = Array.from({ length: FREE_QUIZ_QUESTION_COUNT }, (_, index) => ({
      id: `q-${index + 1}`,
      stem: `Vignette ${index + 1}: A client presents with clinical findings that require nursing judgment.`,
      options: ["Priority action A", "Priority action B", "Priority action C"],
      selection: "single" as const,
      correct: ["Priority action A"],
      rationale: "Action A is first because it stabilizes the client before other steps.",
      sources: ["Clinical reference"],
    }));

    bankState.bank = {
      board: "pance",
      rotationKey: "2026-10-24",
      questions,
    };

    const answers = questions.map((question, index) => ({
      id: question.id,
      selected: index % 2 === 0 ? question.correct : ["Priority action B"],
    }));

    const response = await POST_GRADE(
      gradeRequest({
        board: "pance",
        rotationKey: "2026-10-24",
        answers,
      })
    );
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toMatchObject({ total: FREE_QUIZ_QUESTION_COUNT, score: 5 });
    expect(body.results).toHaveLength(FREE_QUIZ_QUESTION_COUNT);
    expect(body.results[0]).toMatchObject({
      id: "q-1",
      selected: ["Priority action A"],
      correctAnswers: ["Priority action A"],
      correct: true,
    });
  });
});
