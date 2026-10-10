import { describe, expect, it } from "vitest";
import { decideExamReveal, sessionContainsItem } from "./reveal-policy";

describe("decideExamReveal", () => {
  it("withholds keys for an item in an owned in-progress exam", () => {
    expect(
      decideExamReveal({
        sessionRequested: true,
        ownedSession: { status: "in_progress", containsItem: true },
        activeSessionContainsItem: false,
      })
    ).toBe("withhold");
  });

  it("allows reveal after the owned exam is finished", () => {
    expect(
      decideExamReveal({
        sessionRequested: true,
        ownedSession: { status: "completed", containsItem: true },
        activeSessionContainsItem: false,
      })
    ).toBe("allow");
  });

  it("refuses a session the caller does not own", () => {
    expect(
      decideExamReveal({
        sessionRequested: true,
        ownedSession: null,
        activeSessionContainsItem: false,
      })
    ).toBe("not_owner");
  });

  it("keeps practice reveal when no active exam contains the item", () => {
    expect(
      decideExamReveal({
        sessionRequested: false,
        ownedSession: null,
        activeSessionContainsItem: false,
      })
    ).toBe("allow");
  });

  it("withholds an unscoped reveal of an item that is in an active exam", () => {
    expect(
      decideExamReveal({
        sessionRequested: false,
        ownedSession: null,
        activeSessionContainsItem: true,
      })
    ).toBe("withhold");
  });

  it("still withholds when a finished session id is sent for an item in another active exam", () => {
    expect(
      decideExamReveal({
        sessionRequested: true,
        ownedSession: { status: "completed", containsItem: false },
        activeSessionContainsItem: true,
      })
    ).toBe("withhold");
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
