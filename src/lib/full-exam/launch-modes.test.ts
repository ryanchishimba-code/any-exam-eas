import { describe, expect, it } from "vitest";
import {
  buildFullExamStartBody,
  isFullExamLaunchMode,
} from "./launch-modes";

describe("full exam launch modes", () => {
  it("validates launch modes", () => {
    expect(isFullExamLaunchMode("new_exam")).toBe(true);
    expect(isFullExamLaunchMode("retake_last")).toBe(true);
    expect(isFullExamLaunchMode("focus_weak")).toBe(true);
    expect(isFullExamLaunchMode("continue_learning")).toBe(true);
    expect(isFullExamLaunchMode("other")).toBe(false);
  });

  it("builds a typed start body", () => {
    const body = buildFullExamStartBody("nclex", "focus_weak", {
      lengthPreset: "100",
      focusAreas: ["pharmacology-nursing"],
    });
    expect(body).toMatchObject({
      examSlug: "nclex",
      launchMode: "focus_weak",
      lengthPreset: "100",
      timed: true,
      focusAreas: ["pharmacology-nursing"],
    });
  });
});
