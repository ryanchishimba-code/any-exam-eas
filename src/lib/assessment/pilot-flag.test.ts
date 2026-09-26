import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it } from "vitest";
import { isNgnPilotEnabled, studentNgnEntryVisible } from "@/lib/assessment/pilot-flag";

const original = process.env.NGN_PILOT_ENABLED;

afterEach(() => {
  if (original === undefined) delete process.env.NGN_PILOT_ENABLED;
  else process.env.NGN_PILOT_ENABLED = original;
});

describe("NGN pilot flag", () => {
  it("defaults off and hides every student entry", () => {
    delete process.env.NGN_PILOT_ENABLED;
    expect(isNgnPilotEnabled()).toBe(false);
    expect(studentNgnEntryVisible(0)).toBe(false);
    expect(studentNgnEntryVisible(3)).toBe(false);
    process.env.NGN_PILOT_ENABLED = "false";
    expect(isNgnPilotEnabled()).toBe(false);
  });

  it("still hides students when the flag is on and nothing is published", () => {
    process.env.NGN_PILOT_ENABLED = "true";
    expect(isNgnPilotEnabled()).toBe(true);
    expect(studentNgnEntryVisible(0)).toBe(false);
    expect(studentNgnEntryVisible(1)).toBe(true);
  });

  it("does not add an NGN item to the student navigation", () => {
    const nav = readFileSync("src/components/Navigation.tsx", "utf8").toLowerCase();
    expect(nav).not.toContain("ngn");
    expect(nav).not.toContain("coming soon");
  });
});
