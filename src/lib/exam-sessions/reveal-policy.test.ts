import { describe, expect, it } from "vitest";
import { decideExamReveal, isUnfinishedExamActive, sessionContainsItem } from "./reveal-policy";

const now = new Date("2026-10-10T12:00:00Z");

describe("decideExamReveal", () => {
  it("withholds keys only for the named active exam that contains the item", () => {
    expect(
      decideExamReveal({
        sessionRequested: true,
        ownedSession: {
          status: "in_progress",
          containsItem: true,
          updatedAt: now,
          startedAt: now,
          timeLimitSec: 7200,
        },
        now,
      })
    ).toBe("withhold");
  });

  it("allows a practice reveal with no session even if the caller has other unfinished exams", () => {
    expect(
      decideExamReveal({
        sessionRequested: false,
        ownedSession: null,
        now,
      })
    ).toBe("allow");
  });

  it("allows review of a finished session that contains the item", () => {
    expect(
      decideExamReveal({
        sessionRequested: true,
        ownedSession: {
          status: "completed",
          containsItem: true,
          updatedAt: now,
          startedAt: now,
        },
        now,
      })
    ).toBe("allow");
  });

  it("allows an abandoned exam that has not been touched for over 24 hours", () => {
    expect(
      decideExamReveal({
        sessionRequested: true,
        ownedSession: {
          status: "in_progress",
          containsItem: true,
          updatedAt: new Date("2026-10-09T11:00:00Z"),
          startedAt: new Date("2026-10-09T10:00:00Z"),
          timeLimitSec: null,
        },
        now,
      })
    ).toBe("allow");
  });

  it("allows an exam whose time limit has already passed", () => {
    expect(
      decideExamReveal({
        sessionRequested: true,
        ownedSession: {
          status: "in_progress",
          containsItem: true,
          updatedAt: now,
          startedAt: new Date("2026-10-10T09:00:00Z"),
          timeLimitSec: 3600,
        },
        now,
      })
    ).toBe("allow");
  });

  it("refuses a session the caller does not own", () => {
    expect(
      decideExamReveal({
        sessionRequested: true,
        ownedSession: null,
        now,
      })
    ).toBe("not_owner");
  });

  it("does not withhold an item that is not in the named session", () => {
    expect(
      decideExamReveal({
        sessionRequested: true,
        ownedSession: {
          status: "in_progress",
          containsItem: false,
          updatedAt: now,
          startedAt: now,
          timeLimitSec: 7200,
        },
        now,
      })
    ).toBe("allow");
  });
});

describe("isUnfinishedExamActive", () => {
  it("stays active inside the time limit when the sitting was touched recently", () => {
    expect(
      isUnfinishedExamActive(
        {
          status: "in_progress",
          updatedAt: now,
          startedAt: new Date("2026-10-10T11:00:00Z"),
          timeLimitSec: 7200,
        },
        now
      )
    ).toBe(true);
  });
});

describe("sessionContainsItem", () => {
  it("matches a sealed id to the catalog id stored on the session", () => {
    const analysis = { prefetchedQuestionIds: ["ngn:NC003-S1:v1", "bank-1"] };
    expect(sessionContainsItem(analysis, "bank-1")).toBe(true);
    expect(sessionContainsItem(analysis, "ngn:NC003-S1:v1")).toBe(true);
    expect(sessionContainsItem(analysis, "bank-2")).toBe(false);
  });
});
