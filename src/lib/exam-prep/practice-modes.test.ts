import { describe, expect, it } from "vitest";
import {
  PRACTICE_MODES,
  practiceModeLaunchHref,
  resolvePracticeModeFromParams,
} from "./practice-modes";

describe("practice modes", () => {
  it("defines full exam and question bank only", () => {
    expect(PRACTICE_MODES.map((m) => m.id)).toEqual(["simulator", "bank"]);
  });

  it("resolves hub mode from URL params", () => {
    expect(resolvePracticeModeFromParams({ practiceMode: "bank" })).toBe("bank");
    expect(resolvePracticeModeFromParams({ practiceMode: "topic" })).toBe("bank");
    expect(resolvePracticeModeFromParams({ style: "adaptive", mode: "bank" })).toBe("bank");
    expect(resolvePracticeModeFromParams({ count: "15", mode: "bank" })).toBe("bank");
    expect(resolvePracticeModeFromParams({ mode: "timed" })).toBe("simulator");
    expect(resolvePracticeModeFromParams({ practiceMode: "test_day" })).toBe("simulator");
  });

  it("builds autostart bank URLs on the active base path", () => {
    const href = practiceModeLaunchHref("nursing", "bank", "/question-bank");
    expect(href).toContain("/question-bank?");
    expect(href).toContain("field=nursing");
    expect(href).toContain("autostart=1");
    expect(href).toContain("practiceMode=bank");
  });

  it("routes full exam mode to full exam pages with autostart", () => {
    expect(practiceModeLaunchHref("pharmacy", "simulator", "/study/practice")).toBe(
      "/full-exam/naplex?mode=full&autostart=1"
    );
    expect(practiceModeLaunchHref("nursing", "simulator", "/study/practice")).toBe(
      "/full-exam/nclex?mode=full&autostart=1"
    );
  });
});
