import { beforeEach, describe, expect, it, vi } from "vitest";

const guardExamReveal = vi.hoisted(() => vi.fn());
const revealStoredItem = vi.hoisted(() => vi.fn());
const findServedItem = vi.hoisted(() => vi.fn());

vi.mock("@/lib/api-access", () => ({
  requireStudyApi: async () => ({
    ok: true,
    userId: "user-1",
    access: { hasStudyAccess: true },
  }),
}));

vi.mock("@/lib/exam-sessions/reveal-guard", () => ({
  guardExamReveal,
}));

vi.mock("@/lib/questions/reveal-stored-item", () => ({
  revealStoredItem,
}));

vi.mock("@/lib/assessment/serve-db", () => ({
  findServedItem,
}));

import { POST } from "./route";

function post(body: unknown) {
  return POST(
    new Request("https://example.test/api/study/ngn-reveal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
  );
}

describe("POST /api/study/ngn-reveal", () => {
  beforeEach(() => {
    guardExamReveal.mockReset();
    revealStoredItem.mockReset();
    findServedItem.mockReset();
  });

  it("does not return keys or explanations for an item in an active exam", async () => {
    guardExamReveal.mockResolvedValue("withhold");
    const response = await post({
      itemId: "bank-1",
      version: 1,
      response: ["Alpha"],
      sessionId: "exam-1",
    });
    expect(response.status).toBe(409);
    const body = await response.json();
    expect(body).toEqual({
      error: "Answers stay hidden until the exam is finished.",
      code: "EXAM_REVEAL_WITHHELD",
    });
    expect(JSON.stringify(body)).not.toMatch(/correctAnswer|explanation|Alpha/);
    expect(revealStoredItem).not.toHaveBeenCalled();
    expect(findServedItem).not.toHaveBeenCalled();
  });

  it("returns 404 when the session is not owned, without the key", async () => {
    guardExamReveal.mockResolvedValue("not_owner");
    const response = await post({
      itemId: "bank-1",
      version: 1,
      response: ["Alpha"],
      sessionId: "someone-elses",
    });
    expect(response.status).toBe(404);
    const body = await response.json();
    expect(body.correctAnswer).toBeUndefined();
    expect(revealStoredItem).not.toHaveBeenCalled();
  });

  it("still reveals immediately in practice when the item is not in an active exam", async () => {
    guardExamReveal.mockResolvedValue("allow");
    revealStoredItem.mockResolvedValue({
      correct: true,
      correctAnswer: "Alpha",
      explanation: "Alpha matches the chart.",
    });
    const response = await post({
      itemId: "bank-1",
      version: 1,
      response: ["Alpha"],
    });
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.correct).toBe(true);
    expect(body.answer.correctAnswer).toBe("Alpha");
    expect(body.answer.explanation).toBe("Alpha matches the chart.");
  });
});
