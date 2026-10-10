import { beforeEach, describe, expect, it, vi } from "vitest";

const appendExamAnswer = vi.hoisted(() => vi.fn());
const gradeExamAnswerRecords = vi.hoisted(() => vi.fn());
const getExamSession = vi.hoisted(() => vi.fn());
const updateExamSessionAnalysis = vi.hoisted(() => vi.fn());

vi.mock("@/lib/api-access", () => ({
  requirePremiumApi: async () => ({
    ok: true,
    userId: "user-1",
    access: { hasPremiumAccess: true },
  }),
}));

vi.mock("@/lib/exam-sessions/service", () => ({
  appendExamAnswer,
  getExamSession,
  updateExamSessionAnalysis,
  completeExamSession: vi.fn(),
}));

vi.mock("@/lib/exam-sessions/grade-stored-answer", () => ({
  gradeExamAnswerRecords,
  overlayServerRationales: vi.fn(async (analysis: unknown) => analysis),
  weakAreasFromGradedAnswers: vi.fn(() => []),
}));

import { PATCH } from "./route";

const examAnalysis = {
  sessionConfig: { nclexExamMode: true },
  examLock: { lockedThrough: 1 },
};

function patch(body: unknown) {
  return PATCH(
    new Request("https://example.test/api/exam-sessions/sess-1/answer", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
    { params: Promise.resolve({ id: "sess-1" }) }
  );
}

describe("PATCH /api/exam-sessions/[id]/answer", () => {
  beforeEach(() => {
    appendExamAnswer.mockReset();
    gradeExamAnswerRecords.mockReset();
    getExamSession.mockReset();
    updateExamSessionAnalysis.mockReset();
    gradeExamAnswerRecords.mockImplementation(async (records: { correct: boolean; selected: string }[]) =>
      records.map((record) => ({ ...record, correct: record.selected === "Alpha" }))
    );
    getExamSession.mockResolvedValue({
      id: "sess-1",
      status: "in_progress",
      analysis: {},
      answers: [],
    });
  });

  it("stores the server grade and ignores the client correct flag", async () => {
    appendExamAnswer.mockImplementation(async (_id: string, _user: string, answer: unknown) => [answer]);

    const response = await patch({
      questionIndex: 0,
      questionId: "bank-1",
      selected: "Beta",
      correct: true,
    });

    expect(response.status).toBe(200);
    const saved = appendExamAnswer.mock.calls[0]?.[2] as { correct: boolean; selected: string };
    expect(saved.selected).toBe("Beta");
    expect(saved.correct).toBe(false);
    const body = await response.json();
    expect(body.answers[0].correct).toBe(false);
  });
});

describe("NCLEX exam-mode answer lock", () => {
  beforeEach(() => {
    appendExamAnswer.mockReset();
    gradeExamAnswerRecords.mockReset();
    getExamSession.mockReset();
    updateExamSessionAnalysis.mockReset();
    updateExamSessionAnalysis.mockResolvedValue({ id: "sess-1" });
    gradeExamAnswerRecords.mockImplementation(async (records: { selected: string }[]) =>
      records.map((record) => ({ ...record, correct: false }))
    );
    getExamSession.mockResolvedValue({
      id: "sess-1",
      status: "in_progress",
      analysis: examAnalysis,
      answers: [
        {
          questionIndex: 0,
          questionId: "q0",
          selected: "Alpha",
          correct: true,
          answeredAt: "2026-10-10T00:00:00.000Z",
        },
      ],
    });
  });

  it("rejects a changed answer after the student has moved past it", async () => {
    const response = await patch({
      questionIndex: 0,
      questionId: "q0",
      selected: "Beta",
      correct: true,
    });
    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toMatchObject({
      code: "ANSWER_LOCKED",
      lockedThrough: 1,
    });
    expect(appendExamAnswer).not.toHaveBeenCalled();
  });

  it("still accepts the current item and records Next as a forward lock", async () => {
    appendExamAnswer.mockResolvedValue([{ questionIndex: 1, selected: "Gamma", correct: false }]);
    const saved = await patch({
      questionIndex: 1,
      questionId: "q1",
      selected: "Gamma",
      correct: false,
    });
    expect(saved.status).toBe(200);
    expect(appendExamAnswer).toHaveBeenCalled();

    const advanced = await patch({ lockThrough: 2 });
    expect(advanced.status).toBe(200);
    await expect(advanced.json()).resolves.toEqual({ lockedThrough: 2 });
    expect(updateExamSessionAnalysis).toHaveBeenCalled();
  });

  it("does not lock answers outside NCLEX exam mode", async () => {
    getExamSession.mockResolvedValue({
      id: "sess-1",
      status: "in_progress",
      analysis: { sessionConfig: { nclexExamMode: false } },
      answers: [
        {
          questionIndex: 0,
          questionId: "q0",
          selected: "Alpha",
          correct: true,
          answeredAt: "2026-10-10T00:00:00.000Z",
        },
      ],
    });
    appendExamAnswer.mockResolvedValue([{ questionIndex: 0, selected: "Beta", correct: false }]);
    const response = await patch({
      questionIndex: 0,
      questionId: "q0",
      selected: "Beta",
      correct: false,
    });
    expect(response.status).toBe(200);
    expect(appendExamAnswer).toHaveBeenCalled();
  });
});
