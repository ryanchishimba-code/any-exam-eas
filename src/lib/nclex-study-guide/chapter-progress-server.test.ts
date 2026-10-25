import { describe, expect, it } from "vitest";
import { capChapterHeartbeatSeconds, isChapterComplete } from "./chapter-progress-server";

describe("chapter progress server", () => {
  it("caps heartbeat seconds", () => {
    expect(capChapterHeartbeatSeconds(45)).toBe(20);
    expect(capChapterHeartbeatSeconds(10)).toBe(10);
  });

  it("requires scroll and verified time for completion", () => {
    expect(isChapterComplete(95, 100)).toBe(false);
    expect(isChapterComplete(85, 130)).toBe(false);
    expect(isChapterComplete(95, 130)).toBe(true);
  });
});
