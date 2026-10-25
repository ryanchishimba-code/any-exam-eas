import { describe, expect, it } from "vitest";
import { quickBiteResumeSeconds } from "@/lib/quick-bites/use-quick-bite-progress";

describe("quickBiteResumeSeconds", () => {
  it("resumes partial watch position from percent watched", () => {
    expect(quickBiteResumeSeconds(45, 200)).toBe(90);
  });

  it("skips resume when already complete or at the start", () => {
    expect(quickBiteResumeSeconds(0, 200)).toBeNull();
    expect(quickBiteResumeSeconds(99, 200)).toBeNull();
  });
});
