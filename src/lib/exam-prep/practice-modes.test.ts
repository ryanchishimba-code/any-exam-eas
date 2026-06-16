import { describe, expect, it } from "vitest";
import {
  PRACTICE_MODES,
  practiceModeLaunchHref,
  resolvePracticeModeFromParams,
} from "./practice-modes";

describe("practice modes", () => {
  it("defines five launch modes", () => {
    expect(PRACTICE_MODES.map((m) => m.id)).toEqual([
      "quick",
      "simulator",
      "adaptive",
      "topic",
      "test_day",
    ]);
  });

  it("resolves hub mode from URL params", () => {
    expect(resolvePracticeModeFromParams({ practiceMode: "topic" })).toBe("topic");
    expect(resolvePracticeModeFromParams({ style: "adaptive", mode: "bank" })).toBe("adaptive");
    expect(resolvePracticeModeFromParams({ count: "15", mode: "bank" })).toBe("quick");
    expect(resolvePracticeModeFromParams({ mode: "timed" })).toBe("simulator");
  });

  it("builds autostart bank URLs on the active base path", () => {
    const href = practiceModeLaunchHref("nursing", "quick", "/question-bank");
    expect(href).toContain("/question-bank?");
    expect(href).toContain("field=nursing");
    expect(href).not.toContain("mode=bank");
    expect(href).toContain("count=15");
    expect(href).toContain("autostart=1");
    expect(href).toContain("practiceMode=quick");
  });

  it("routes simulator mode to full exam pages with autostart", () => {
    expect(practiceModeLaunchHref("pharmacy", "simulator", "/study/practice")).toBe(
      "/full-exam/naplex?mode=full&autostart=1"
    );
    expect(practiceModeLaunchHref("nursing", "test_day", "/study/practice")).toBe(
      "/full-exam/nclex?mode=full&autostart=1"
    );
  });

  it("builds adaptive bank URLs for PANCE", () => {
    const href = practiceModeLaunchHref("pance", "adaptive", "/question-bank");
    expect(href).toContain("field=pance");
    expect(href).toContain("style=adaptive");
    expect(href).toContain("autostart=1");
  });
});
