import { beforeEach, describe, expect, it, vi } from "vitest";

const getExamSession = vi.hoisted(() => vi.fn());
const listInProgressExamSessions = vi.hoisted(() => vi.fn());

vi.mock("@/lib/exam-sessions/service", () => ({
  getExamSession,
  listInProgressExamSessions,
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
    getExamSession.mockReset();
    listInProgressExamSessions.mockReset();
    listInProgressExamSessions.mockResolvedValue([
      sitting({ id: "abandoned", updatedAt: new Date("2026-10-01T12:00:00Z") }),
    ]);
  });

  it("allows a practice reveal when an abandoned unfinished exam contains the item", async () => {
    await expect(guardExamReveal("user-1", "bank-1")).resolves.toBe("allow");
    expect(getExamSession).not.toHaveBeenCalled();
    expect(listInProgressExamSessions).not.toHaveBeenCalled();
  });

  it("allows review of a finished session that contains the item", async () => {
    getExamSession.mockResolvedValue(sitting({ id: "finished", status: "completed" }));
    await expect(guardExamReveal("user-1", "bank-1", "finished")).resolves.toBe("allow");
    expect(getExamSession).toHaveBeenCalledWith("finished", "user-1");
    expect(listInProgressExamSessions).not.toHaveBeenCalled();
  });

  it("withholds a reveal made in an active owned exam that contains the item", async () => {
    getExamSession.mockResolvedValue(sitting({ id: "active" }));
    await expect(guardExamReveal("user-1", "bank-1", "active")).resolves.toBe("withhold");
    expect(listInProgressExamSessions).not.toHaveBeenCalled();
  });

  it("allows a named exam that has been untouched for over 24 hours", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(now);
    getExamSession.mockResolvedValue(
      sitting({
        id: "stale",
        updatedAt: new Date("2026-10-09T11:00:00Z"),
        startedAt: new Date("2026-10-09T10:00:00Z"),
        timeLimitSec: null,
      })
    );
    await expect(guardExamReveal("user-1", "bank-1", "stale")).resolves.toBe("allow");
    vi.useRealTimers();
  });

  it("refuses a session id the caller does not own", async () => {
    getExamSession.mockResolvedValue(null);
    await expect(guardExamReveal("user-1", "bank-1", "someone-elses")).resolves.toBe("not_owner");
  });
});
