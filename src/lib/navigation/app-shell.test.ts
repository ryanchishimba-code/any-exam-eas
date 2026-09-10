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

  it("treats every exam's reader the same, not just NCLEX", () => {
    // Derived from the guide registry, so a new book gets immersive chrome
    // without another prefix to remember here.
    expect(isStudyGuideReaderRoute("/naplex/study-guide/cardiology")).toBe(true);
    expect(isStudyGuideReaderRoute("/naplex/study-guide")).toBe(false);
    expect(isImmersiveAppRoute("/naplex/study-guide/cardiology")).toBe(true);
    expect(isAppShellRoute("/naplex/study-guide/cardiology")).toBe(true);
    expect(hideMarketingChrome("/naplex/study-guide/cardiology")).toBe(true);
    expect(isStudyGuideReaderRoute("/aanp-fnp/study-guide/exam-strategy")).toBe(true);
    expect(isAppShellRoute("/aanp-fnp/study-guide")).toBe(true);

    // An exam without a book must not pick up reader chrome.
    expect(isStudyGuideReaderRoute("/usmle/study-guide/anything")).toBe(false);
  });
});
