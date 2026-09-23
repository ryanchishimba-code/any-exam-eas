import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FullExamPassPathPanel } from "@/components/exam/FullExamPassPathPanel";
import { FULL_EXAM_PRACTICE_DISCLAIMER } from "@/lib/learning/full-exam-pass-path";

describe("FullExamPassPathPanel", () => {
  it("shows the practice-band disclaimer and a review link when the sim has misses", () => {
    render(
      <FullExamPassPathPanel
        missCount={3}
        persisted
        reviewHref="/question-bank?mode=bank&field=nursing&style=review_incorrect"
        proofHref="/dashboard"
      />
    );

    expect(screen.getByText(FULL_EXAM_PRACTICE_DISCLAIMER)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "3 misses are in Review incorrect" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Review incorrect" })).toHaveAttribute(
      "href",
      "/question-bank?mode=bank&field=nursing&style=review_incorrect"
    );
    expect(screen.getByRole("link", { name: "Readiness proof" })).toHaveAttribute(
      "href",
      "/dashboard"
    );
    expect(document.body.textContent).not.toMatch(/you will pass|guaranteed pass|board-ready/i);
  });

  it("stays honest when the simulation has no misses", () => {
    render(
      <FullExamPassPathPanel missCount={0} persisted reviewHref={null} proofHref="/dashboard" />
    );

    expect(screen.getByRole("heading", { name: "No misses from this simulation" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Review incorrect" })).toBeNull();
    expect(screen.getByRole("link", { name: "Readiness proof" })).toBeInTheDocument();
  });
});
