import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SessionCompletionCard } from "@/components/study/SessionCompletionCard";

describe("SessionCompletionCard mobile receipt", () => {
  it("puts Review incorrect ahead of session analytics", () => {
    render(
      <SessionCompletionCard
        summary={{ correct: 6, total: 8, accuracy: 75 }}
        domainBreakdown={[
          { id: "cv", label: "Cardiovascular", correct: 2, total: 4, pct: 50 },
        ]}
        notes={[{ questionNumber: 2, text: "Check the drip rate." }]}
        onReview={() => undefined}
        receipt={{
          attemptsSaved: 8,
          accuracy: 75,
          correct: 6,
          studyStreakDays: 3,
          weakTopics: [{ id: "pharm", label: "Pharm" }],
          reviewIncorrectHref: "/question-bank?style=review_incorrect",
          analyticsHref: "/analytics",
        }}
      />
    );

    const primary = screen.getByRole("link", { name: "Review incorrect" });
    const analytics = screen.getByText("Organ-system breakdown");
    expect(primary).toHaveAttribute("href", "/question-bank?style=review_incorrect");
    expect(primary).toHaveAttribute("data-session-primary", "true");
    expect(
      primary.compareDocumentPosition(analytics) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    expect(screen.getByText("Session analytics")).toBeInTheDocument();
    expect(screen.getByText("8 saved · 75% accuracy · 3d streak")).toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/you will pass|guaranteed pass|pass rate/i);
  });

  it("uses Review explanations as the primary action when there is no receipt", () => {
    render(
      <SessionCompletionCard
        summary={{ correct: 1, total: 2, accuracy: 50 }}
        onReview={() => undefined}
      />
    );
    expect(screen.getByRole("button", { name: "Review explanations" })).toHaveAttribute(
      "data-session-primary",
      "true"
    );
  });
});
