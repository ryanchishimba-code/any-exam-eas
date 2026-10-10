import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ngnQuestionKey } from "@/lib/assessment/question-key";
import { sealStudentRef } from "@/lib/assessment/student-item-ref";
import { EXAM_REVEAL_IDLE_MS } from "./reveal-policy";

const getExamSession = vi.hoisted(() => vi.fn());
const listRecentlyTouchedInProgressSessions = vi.hoisted(() => vi.fn());

vi.mock("@/lib/exam-sessions/service", () => ({
  getExamSession,
  listRecentlyTouchedInProgressSessions,
}));

import { guardExamReveal } from "./reveal-guard";

const now = new Date("2026-10-10T12:00:00Z");

function sitting(overrides: Record<string, unknown> = {}) {
  return {
    id: "exam-1",
    status: "in_progress",
    analysis: { prefetchedQuestionIds: ["bank-1"] },
    updatedAt: now,
    startedAt: now,
    timeLimitSec: 7200,
    ...overrides,
  };
}

describe("guardExamReveal", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(now);
    getExamSession.mockReset();
    listRecentlyTouchedInProgressSessions.mockReset();
    listRecentlyTouchedInProgressSessions.mockResolvedValue([]);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("withholds a practice reveal with no session id when an active exam contains the item", async () => {
    listRecentlyTouchedInProgressSessions.mockResolvedValue([sitting({ id: "active" })]);
    await expect(guardExamReveal("user-1", "bank-1")).resolves.toBe("withhold");
    expect(getExamSession).not.toHaveBeenCalled();
    const since = listRecentlyTouchedInProgressSessions.mock.calls[0]?.[1] as Date;
    expect(since.toISOString()).toBe(new Date(now.getTime() - EXAM_REVEAL_IDLE_MS).toISOString());
    expect(listRecentlyTouchedInProgressSessions).toHaveBeenCalledWith("user-1", since);
  });

  it("allows a practice reveal when the only sitting that contains the item is abandoned", async () => {
    listRecentlyTouchedInProgressSessions.mockResolvedValue([
      sitting({
        id: "abandoned",
        updatedAt: new Date("2026-10-01T12:00:00Z"),
        startedAt: new Date("2026-10-01T11:00:00Z"),
        timeLimitSec: null,
      }),
    ]);
    await expect(guardExamReveal("user-1", "bank-1")).resolves.toBe("allow");
  });

  it("allows a practice reveal when the sitting that contains the item is past its time limit", async () => {
    listRecentlyTouchedInProgressSessions.mockResolvedValue([
      sitting({
        id: "overtime",
        updatedAt: now,
        startedAt: new Date("2026-10-10T09:00:00Z"),
        timeLimitSec: 3600,
      }),
    ]);
    await expect(guardExamReveal("user-1", "bank-1")).resolves.toBe("allow");
  });

  it("allows review of a finished session that contains the item", async () => {
    getExamSession.mockResolvedValue(sitting({ id: "finished", status: "completed" }));
    await expect(guardExamReveal("user-1", "bank-1", "finished")).resolves.toBe("allow");
    expect(getExamSession).toHaveBeenCalledWith("finished", "user-1");
  });

  it("allows a reveal of an item that is not in any exam", async () => {
    listRecentlyTouchedInProgressSessions.mockResolvedValue([
      sitting({ analysis: { prefetchedQuestionIds: ["bank-2"] } }),
    ]);
    await expect(guardExamReveal("user-1", "bank-1")).resolves.toBe("allow");
  });

  it("withholds a sealed case-step id when the active exam stores the catalog id", async () => {
    const sealedStep = ngnQuestionKey(sealStudentRef({ id: "NC003-S1", version: 1 }), 1);
    listRecentlyTouchedInProgressSessions.mockResolvedValue([
      sitting({
        analysis: { prefetchedQuestionIds: ["ngn:NC003-S1:v1", "ngn:NC003-S2:v1"] },
      }),
    ]);
    await expect(guardExamReveal("user-1", sealedStep)).resolves.toBe("withhold");
    await expect(guardExamReveal("user-1", "ngn:NC003-S3:v1")).resolves.toBe("allow");
  });

  it("withholds a named active exam and refuses a session id the caller does not own", async () => {
    getExamSession.mockResolvedValueOnce(sitting({ id: "active" }));
    await expect(guardExamReveal("user-1", "bank-1", "active")).resolves.toBe("withhold");

    getExamSession.mockResolvedValueOnce(null);
    await expect(guardExamReveal("user-1", "bank-9", "someone-elses")).resolves.toBe("not_owner");
  });
});
