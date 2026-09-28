import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { QuestionBankSetup } from "@/components/study/QuestionBankSetup";
import { MIXED_SUBJECT_ID } from "@/lib/study/question-bank-setup";

const subjects = [
  { id: "management-of-care", label: "Management of Care" },
  { id: "safety-infection", label: "Safety and Infection Control" },
];

const counts = { "management-of-care": 4000, "safety-infection": 1489 };

function renderSetup(props: {
  subjectId: string;
  bankStyle: "adaptive" | "standard" | "review_incorrect" | "weak_areas" | "today";
}) {
  const onBankStyleChange = vi.fn();
  render(
    <QuestionBankSetup
      subjects={subjects}
      subjectId={props.subjectId}
      subjectCounts={counts}
      questionCount={25}
      onQuestionCountChange={vi.fn()}
      pace="timed"
      onPaceChange={vi.fn()}
      bankStyle={props.bankStyle}
      onBankStyleChange={onBankStyleChange}
      onSubjectChange={vi.fn()}
    />
  );
  return { onBankStyleChange };
}

describe("Question bank selection style", () => {
  it("selects Standard when mixed topics cannot run Adaptive, and leaves Review incorrect available", () => {
    const { onBankStyleChange } = renderSetup({
      subjectId: MIXED_SUBJECT_ID,
      bankStyle: "adaptive",
    });

    expect(screen.getByRole("button", { name: /Standard/ })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: /Adaptive/ })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: /Adaptive/ })).toBeDisabled();
    expect(screen.getByRole("button", { name: /Weak areas/ })).toBeDisabled();
    expect(screen.getByRole("button", { name: /Review incorrect/ })).toBeEnabled();
    expect(screen.getByRole("button", { name: /Today/ })).toBeEnabled();
    expect(screen.getByRole("button", { name: /Review incorrect/ })).not.toHaveTextContent(
      /Pick a single topic/
    );
    expect(onBankStyleChange).toHaveBeenCalledWith("standard");
  });

  it("keeps Review incorrect selected on mixed topics", () => {
    const { onBankStyleChange } = renderSetup({
      subjectId: MIXED_SUBJECT_ID,
      bankStyle: "review_incorrect",
    });

    expect(screen.getByRole("button", { name: /Review incorrect/ })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByRole("button", { name: /Standard/ })).toHaveAttribute("aria-pressed", "false");
    expect(onBankStyleChange).not.toHaveBeenCalled();
  });

  it("keeps Adaptive selected after mixed topics changes back to one topic", () => {
    const { onBankStyleChange } = renderSetup({
      subjectId: "management-of-care",
      bankStyle: "adaptive",
    });

    expect(screen.getByRole("button", { name: /Adaptive/ })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: /Adaptive/ })).toBeEnabled();
    expect(screen.getByRole("button", { name: /Review incorrect/ })).toBeEnabled();
    expect(onBankStyleChange).not.toHaveBeenCalled();
  });
});
