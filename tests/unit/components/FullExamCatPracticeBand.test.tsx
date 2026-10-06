import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FullExamCatPracticeBand } from "@/components/exam/FullExamCatPracticeBand";
import type { FullExamCatOutcome } from "@/types/full-exam";

const outcome: FullExamCatOutcome = {
  questionNumber: 91,
  ability: 0.4,
  difficulty: "medium",
  correctCount: 80,
  incorrectCount: 11,
  isComplete: true,
  stopReason: "confidence",
  practiceBand: {
    label: "Strong practice band",
    hint: "You answered most items correctly at mixed difficulty.",
  },
};

describe("FullExamCatPracticeBand", () => {
  it("uses the 85–150 length and does not repeat the headline accuracy", () => {
    render(<FullExamCatPracticeBand catOutcome={outcome} />);
    expect(screen.getByText(/91 answered · 85–150/)).toBeInTheDocument();
    expect(screen.getByText("Practice confidence threshold reached")).toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/up to 145/);
    expect(document.body.textContent).not.toMatch(/88%/);
  });
});
