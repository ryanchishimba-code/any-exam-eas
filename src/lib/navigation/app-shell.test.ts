import { describe, expect, it } from "vitest";
import { isExamPracticeLockedRoute, isFullExamSessionRoute } from "./app-shell";

describe("app-shell routes", () => {
  it("locks exam switching on question bank and full-exam launcher", () => {
    expect(isExamPracticeLockedRoute("/question-bank")).toBe(true);
    expect(isExamPracticeLockedRoute("/full-exam/nclex")).toBe(true);
    expect(isExamPracticeLockedRoute("/full-exam")).toBe(false);
    expect(isExamPracticeLockedRoute("/full-exam/nclex/session-id")).toBe(false);
    expect(isExamPracticeLockedRoute("/dashboard")).toBe(false);
  });

  it("detects immersive full-exam session routes", () => {
    expect(isFullExamSessionRoute("/full-exam/nclex/abc123")).toBe(true);
    expect(isFullExamSessionRoute("/full-exam/nclex/abc123/results")).toBe(true);
    expect(isFullExamSessionRoute("/full-exam/nclex")).toBe(false);
  });
});
