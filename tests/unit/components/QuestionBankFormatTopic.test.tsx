import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { QuestionBankSetup } from "@/components/study/QuestionBankSetup";

const formats = { mcq: 5598, ngn: 492, case: 153 };
const subjects = [
  { id: "management-of-care", label: "Management of Care" },
  { id: "safety-and-infection-control", label: "Safety & Infection Control" },
];

function renderSetup(subjectId: string, format: "ngn" | "case" | "all" = "ngn") {
  return render(
    <QuestionBankSetup
      subjects={subjects}
      subjectId={subjectId}
      subjectCounts={{ "management-of-care": 953, "safety-and-infection-control": 729 }}
      onSubjectChange={vi.fn()}
      questionCount={5}
      onQuestionCountChange={vi.fn()}
      pace="untimed"
      onPaceChange={vi.fn()}
      bankStyle="standard"
      onBankStyleChange={vi.fn()}
      practiceFormat={format}
      onPracticeFormatChange={vi.fn()}
      formats={formats}
      ngnLabel="NGN"
    />
  );
}

describe("QuestionBankSetup format topic", () => {
  it("blocks mixed topics for an NGN set before Start", () => {
    renderSetup("__mixed__");
    expect(
      screen.getByText("Pick one topic for this NGN set. Mixed topics is not available.")
    ).toBeInTheDocument();
    expect(screen.queryByText(/published NGN/i)).not.toBeInTheDocument();
  });

  it("allows a selected topic and keeps the same rule for cases", () => {
    const { rerender } = renderSetup("management-of-care");
    expect(
      screen.queryByText("Pick one topic for this NGN set. Mixed topics is not available.")
    ).not.toBeInTheDocument();
    expect(screen.getByText("Management of Care")).toBeInTheDocument();

    rerender(
      <QuestionBankSetup
        subjects={subjects}
        subjectId="__mixed__"
        subjectCounts={{ "management-of-care": 953 }}
        onSubjectChange={vi.fn()}
        questionCount={5}
        onQuestionCountChange={vi.fn()}
        pace="untimed"
        onPaceChange={vi.fn()}
        bankStyle="standard"
        onBankStyleChange={vi.fn()}
        practiceFormat="case"
        onPracticeFormatChange={vi.fn()}
        formats={formats}
        ngnLabel="NGN"
      />
    );
    expect(
      screen.getByText("Pick one topic for this case set. Mixed topics is not available.")
    ).toBeInTheDocument();
  });

  it("leaves the all-questions path free to use mixed topics", () => {
    renderSetup("__mixed__", "all");
    expect(screen.queryByText(/Pick one topic for this/i)).not.toBeInTheDocument();
  });
});
