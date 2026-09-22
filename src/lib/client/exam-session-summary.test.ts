import { describe, expect, it } from "vitest";
import {
  activitySummaryFromSearchParams,
  mergeActivitySummary,
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
  it("round-trips the receipt on the dashboard URL", () => {
    const path = studyHubWithSummaryPath(summary);
    expect(path.startsWith("/dashboard?")).toBe(true);
    const params = new URLSearchParams(path.split("?")[1]);
    const parsed = activitySummaryFromSearchParams(params);
    expect(parsed).toMatchObject({
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

  it("uses the URL when session storage was cleared", () => {
    const params = new URLSearchParams(studyHubWithSummaryPath(summary).split("?")[1]);
    const merged = mergeActivitySummary(null, activitySummaryFromSearchParams(params));
    expect(merged?.attemptsSaved).toBe(5);
    expect(merged?.weakTopicLabels).toEqual(["Management of Care"]);
  });

  it("ignores unrelated dashboard URLs", () => {
    expect(activitySummaryFromSearchParams(new URLSearchParams("exam=nclex"))).toBeNull();
  });
});
