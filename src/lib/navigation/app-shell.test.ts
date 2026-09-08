import { describe, expect, it } from "vitest";
import {
  hideMarketingChrome,
  isAppShellRoute,
  isExamPracticeLockedRoute,
  isFullExamSessionRoute,
  isImmersiveAppRoute,
  isMinimalChromeRoute,
  isStudyGuideReaderRoute,
} from "./app-shell";

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

  it("treats a study guide chapter as immersive but not the index", () => {
    expect(isStudyGuideReaderRoute("/nclex/study-guide/cardiac")).toBe(true);
    expect(isStudyGuideReaderRoute("/nclex/study-guide")).toBe(false);
    expect(isStudyGuideReaderRoute("/nclex")).toBe(false);

    expect(isImmersiveAppRoute("/nclex/study-guide/cardiac")).toBe(true);
    expect(isImmersiveAppRoute("/full-exam/nclex/abc123")).toBe(true);
    expect(isImmersiveAppRoute("/dashboard")).toBe(false);
  });

  it("gives the study guide the app shell rather than minimal chrome", () => {
    expect(isAppShellRoute("/nclex/study-guide/cardiac")).toBe(true);
    expect(isMinimalChromeRoute("/nclex/study-guide/cardiac")).toBe(false);
    // Either path hides marketing chrome; the shell must not double up.
    expect(hideMarketingChrome("/nclex/study-guide/cardiac")).toBe(true);
    expect(isAppShellRoute("/nclex")).toBe(false);
  });
});
