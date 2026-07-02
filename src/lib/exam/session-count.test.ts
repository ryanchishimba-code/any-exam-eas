import { describe, expect, it } from "vitest";
import {
  assertExactQuestionCount,
  parseRequestedLengthPreset,
  resolveLengthPresetForField,
  syncSessionConfigQuestionCount,
} from "./session-count";
import { buildSessionConfig } from "@/lib/full-exam/config";

describe("parseRequestedLengthPreset", () => {
  it("falls back to 50Q sprint for invalid values", () => {
    expect(parseRequestedLengthPreset(undefined)).toBe("50");
    expect(parseRequestedLengthPreset("bogus")).toBe("50");
  });

  it("accepts sprint and full presets", () => {
    expect(parseRequestedLengthPreset("100")).toBe("100");
    expect(parseRequestedLengthPreset("full-length")).toBe("full");
  });
});

describe("resolveLengthPresetForField", () => {
  it("maps USMLE Step 3 full length to full preset", () => {
    expect(
      resolveLengthPresetForField("usmle", 200, { fieldId: "usmle-step-3" })
    ).toBe("full");
    expect(
      resolveLengthPresetForField("usmle", 280, { fieldId: "usmle-step-2" })
    ).toBe("full");
  });

  it("maps MPJE full length via field id", () => {
    expect(resolveLengthPresetForField("pance", 120, { fieldId: "mpje" })).toBe("full");
  });
});

describe("syncSessionConfigQuestionCount", () => {
  it("updates question count and time limit when delivered count differs", () => {
    const config = buildSessionConfig("naplex", "100", true);
    const synced = syncSessionConfigQuestionCount(config, "naplex", 100);
    expect(synced.questionCount).toBe(100);
    expect(synced.timeLimitSec).toBeGreaterThan(0);
  });

  it("returns config unchanged when counts match", () => {
    const config = buildSessionConfig("naplex", "50", true);
    expect(syncSessionConfigQuestionCount(config, "naplex", 50)).toBe(config);
  });
});

describe("assertExactQuestionCount", () => {
  it("throws when counts mismatch", () => {
    expect(() => assertExactQuestionCount(99, 100)).toThrow(/Expected 100/);
  });
});
