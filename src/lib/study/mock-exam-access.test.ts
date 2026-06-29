import { describe, expect, it } from "vitest";
import {
  defaultMockPresetForAccess,
  filterLengthOptionsForAccess,
  resolveMockExamAccess,
} from "@/lib/study/mock-exam-access";
import { STUDY_USAGE_LIMITS } from "@/lib/study/usage-limits-config";

describe("mock-exam-access", () => {
  it("limits free tier to 50-question mocks only", () => {
    const access = resolveMockExamAccess(STUDY_USAGE_LIMITS.free, "free");
    const options = filterLengthOptionsForAccess(
      [
        { preset: "50", label: "50", description: "", questionCount: 50 },
        { preset: "100", label: "100", description: "", questionCount: 100 },
        { preset: "full", label: "Full", description: "", questionCount: 135 },
      ],
      access
    );
    expect(options).toHaveLength(1);
    expect(options[0]?.preset).toBe("50");
    expect(defaultMockPresetForAccess(access)).toBe("50");
  });

  it("allows Pro and trial full-length presets", () => {
    const pro = resolveMockExamAccess(STUDY_USAGE_LIMITS.pro, "pro");
    expect(defaultMockPresetForAccess(pro)).toBe("full");
    const trial = resolveMockExamAccess(STUDY_USAGE_LIMITS.trial, "trial");
    expect(defaultMockPresetForAccess(trial)).toBe("full");
  });
});
