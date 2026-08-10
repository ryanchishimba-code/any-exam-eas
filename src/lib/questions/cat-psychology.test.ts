import { describe, expect, it } from "vitest";
import { CAT_MAX_QUESTIONS, CAT_MIN_QUESTIONS, initCatSession } from "./cat-engine";
import {
  CAT_PRACTICE_DISCLAIMER,
  catInExamTip,
  catLauncherBriefing,
  catPauseDialogBody,
  catSessionStopSummary,
} from "./cat-psychology";

describe("cat-psychology", () => {
  it("covers variable length, stops, breaks, and not-Pearson in launcher briefing", () => {
    const bullets = catLauncherBriefing();
    const text = bullets.map((b) => `${b.title} ${b.body}`).join(" ");
    expect(text).toMatch(new RegExp(String(CAT_MIN_QUESTIONS)));
    expect(text).toMatch(new RegExp(String(CAT_MAX_QUESTIONS)));
    expect(text).toMatch(/confidence/i);
    expect(text).toMatch(/Pause/i);
    expect(text).toMatch(/Pearson/i);
    expect(bullets).toHaveLength(4);
  });

  it("keeps in-exam tip short and practice-only", () => {
    const tip = catInExamTip();
    expect(tip).toContain(String(CAT_MIN_QUESTIONS));
    expect(tip).toContain(CAT_PRACTICE_DISCLAIMER.slice(0, 20));
  });

  it("pause copy mentions self-managed breaks", () => {
    expect(catPauseDialogBody()).toMatch(/self-managed/i);
  });

  it("summarizes stop reason for completed sessions", () => {
    const state = {
      ...initCatSession(),
      questionNumber: 80,
      isComplete: true,
      stopReason: "confidence" as const,
    };
    expect(catSessionStopSummary(state)).toMatch(/confidence/i);
    expect(catSessionStopSummary(state)).toMatch(/80/);
  });
});
