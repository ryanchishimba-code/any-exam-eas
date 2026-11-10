import { describe, expect, it } from "vitest";
import {
  activitySummaryFromSearchParams,
  mergeActivitySummary,
  receiptModeLabel,
  studyHubWithSummaryPath,
  type ActivitySessionSummary,
} from "./exam-session-summary";

const summary: ActivitySessionSummary = {
  title: "Management of Care",
  activityType: "practice",
  mode: "bank",
  answered: 5,
  total: 25,
  correct: 3,
  accuracy: 60,
  endedEarly: true,
  attemptsSaved: 5,
  studyStreakDays: 1,
  weakTopicLabels: ["Management of Care"],
  analyticsHref: "/analytics",
  reviewIncorrectHref: "/question-bank?style=review_incorrect",
};

describe("study hub session receipt query", () => {
  it("marks the session ended without putting scores in the URL", () => {
    const path = studyHubWithSummaryPath(summary);
    expect(path).toBe("/dashboard?session=ended");
    expect(path).not.toMatch(/acc=|correct=|answered=|total=|streak=/);
    const params = new URLSearchParams(path.split("?")[1]);
    const parsed = activitySummaryFromSearchParams(params);
    expect(parsed).toMatchObject({
      endedEarly: false,
      title: "Practice session",
    });
    expect(parsed?.accuracy).toBeUndefined();
    const legacy = new URLSearchParams(
      "session=ended&title=Management+of+Care&early=1&saved=5&acc=60&correct=3&streak=1&weak=Management+of+Care&stats=/analytics&review=/question-bank%3Fstyle%3Dreview_incorrect"
    );
    expect(activitySummaryFromSearchParams(legacy)).toMatchObject({
      title: "Management of Care",
      endedEarly: true,
      attemptsSaved: 5,
      accuracy: 60,
      correct: 3,
      studyStreakDays: 1,
      weakTopicLabels: ["Management of Care"],
      analyticsHref: "/analytics",
      reviewIncorrectHref: "/question-bank?style=review_incorrect",
    });
  });

  it("keeps the stored receipt when the URL has no scores", () => {
    const params = new URLSearchParams(studyHubWithSummaryPath(summary).split("?")[1]);
    const merged = mergeActivitySummary(summary, activitySummaryFromSearchParams(params));
    expect(merged?.attemptsSaved).toBe(5);
    expect(merged?.weakTopicLabels).toEqual(["Management of Care"]);
    expect(merged?.accuracy).toBe(60);
  });

  it("ignores unrelated dashboard URLs", () => {
    expect(activitySummaryFromSearchParams(new URLSearchParams("exam=nclex"))).toBeNull();
  });

  it("labels review incorrect on the receipt and keeps the weak-area chip", () => {
    expect(receiptModeLabel("review_incorrect")).toBe("Review incorrect");
    expect(receiptModeLabel("weak_area")).toBe("Weak Area");
    expect(receiptModeLabel("adaptive")).toBe("Adaptive");
  });
});
