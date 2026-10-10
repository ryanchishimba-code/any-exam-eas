import { beforeEach, describe, expect, it, vi } from "vitest";

const appendExamAnswer = vi.hoisted(() => vi.fn());
const gradeExamAnswerRecords = vi.hoisted(() => vi.fn());

vi.mock("@/lib/api-access", () => ({
  requirePremiumApi: async () => ({
    ok: true,
    userId: "user-1",
    access: { hasPremiumAccess: true },
  }),
}));

vi.mock("@/lib/exam-sessions/service", () => ({
  appendExamAnswer,
  getExamSession: vi.fn(),
  completeExamSession: vi.fn(),
}));

vi.mock("@/lib/exam-sessions/grade-stored-answer", () => ({
  gradeExamAnswerRecords,
  overlayServerRationales: vi.fn(async (analysis: unknown) => analysis),
  weakAreasFromGradedAnswers: vi.fn(() => []),
}));

import { PATCH } from "./route";

describe("PATCH /api/exam-sessions/[id]/answer", () => {
  beforeEach(() => {
    appendExamAnswer.mockReset();
    gradeExamAnswerRecords.mockReset();
  });

  it("stores the server grade and ignores the client correct flag", async () => {
    gradeExamAnswerRecords.mockImplementation(async (records: { correct: boolean; selected: string }[]) =>
      records.map((record) => ({ ...record, correct: record.selected === "Alpha" }))
    );
    appendExamAnswer.mockImplementation(async (_id: string, _user: string, answer: unknown) => [answer]);

    const response = await PATCH(
      new Request("https://example.test/api/exam-sessions/sess-1/answer", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionIndex: 0,
          questionId: "bank-1",
          selected: "Beta",
          correct: true,
        }),
      }),
      { params: Promise.resolve({ id: "sess-1" }) }
    );

    expect(response.status).toBe(200);
    const saved = appendExamAnswer.mock.calls[0]?.[2] as { correct: boolean; selected: string };
    expect(saved.selected).toBe("Beta");
    expect(saved.correct).toBe(false);
    const body = await response.json();
    expect(body.answers[0].correct).toBe(false);
  });
});
