import { describe, expect, it } from "vitest";
import { usmlePresetExamIsServeReady } from "./load-preset-exam";

describe("usmlePresetExamIsServeReady", () => {
  it("requires 90% of target questions", () => {
    expect(usmlePresetExamIsServeReady(72, 78)).toBe(true);
    expect(usmlePresetExamIsServeReady(70, 78)).toBe(true);
    expect(usmlePresetExamIsServeReady(69, 78)).toBe(false);
  });
});
