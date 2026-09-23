import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { StudyHubSessionSummary } from "@/components/study-hub/StudyHubSessionSummary";

const params = new URLSearchParams(
  "session=ended&saved=1&acc=0&correct=0&answered=1&total=5&streak=1&early=1&title=Management+of+Care&review=%2Fquestion-bank%3Fstyle%3Dreview_incorrect&stats=%2Fanalytics"
);

vi.mock("next/navigation", () => ({
  useSearchParams: () => params,
}));

describe("StudyHubSessionSummary receipt", () => {
  beforeEach(() => {
    sessionStorage.clear();
    sessionStorage.setItem(
      "aee-activity-session-summary",
      JSON.stringify({
        title: "Management of Care",
        activityType: "practice",
        mode: "standard",
        answered: 1,
        total: 5,
        correct: 0,
        accuracy: 0,
        endedEarly: true,
        attemptsSaved: 1,
        studyStreakDays: 1,
        analyticsHref: "/analytics",
        reviewIncorrectHref: "/question-bank?style=review_incorrect",
      })
    );
  });

  it("keeps session details collapsed after the stored summary merges in", () => {
    render(<StudyHubSessionSummary />);

    const fold = screen.getByRole("button", { name: "Session details" });
    expect(fold).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("checkbox")).toBeNull();
    expect(screen.getByRole("link", { name: "Review incorrect" })).toHaveAttribute(
      "data-session-primary",
      "true"
    );

    const panel = document.getElementById(fold.getAttribute("aria-controls") ?? "");
    expect(panel).toHaveAttribute("data-phone-fold", "closed");
    expect(panel?.className).toContain("hidden");
    expect(panel?.className).toContain("sm:block");
    expect(screen.getByText("Unanswered")).toBeInTheDocument();
    expect(screen.getByText("Mode")).toBeInTheDocument();
    expect(
      fold.compareDocumentPosition(screen.getByText("Unanswered")) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });
});
