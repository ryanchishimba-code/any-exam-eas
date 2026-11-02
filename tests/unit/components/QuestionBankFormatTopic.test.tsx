import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { QuestionBankSetup } from "@/components/study/QuestionBankSetup";

const formats = { mcq: 5598, ngn: 20, case: 24 };
const subjects = [
  { id: "management-of-care", label: "Management of Care" },
  { id: "safety-and-infection-control", label: "Safety & Infection Control" },
];

function renderSetup(
  subjectId: string,
  format: "ngn" | "case" | "all" = "ngn",
  options?: {
    formats?: { mcq: number; ngn: number; case: number };
    boardFormats?: { mcq: number; ngn: number; case: number };
    onPracticeAllQuestions?: () => void;
    onPracticeMixedTopics?: () => void;
  }
) {
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
      formats={options?.formats ?? formats}
      boardFormats={options?.boardFormats ?? options?.formats ?? formats}
      ngnLabel="NGN"
      onPracticeAllQuestions={options?.onPracticeAllQuestions}
      onPracticeMixedTopics={options?.onPracticeMixedTopics}
    />
  );
}

describe("QuestionBankSetup format topic", () => {
  it("lets mixed topics start an NGN set from the field pool", () => {
    renderSetup("__mixed__");
    expect(screen.queryByText(/Mixed topics is not available/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Pick one topic for this NGN set/i)).not.toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /NGN/i })).toHaveAttribute("data-format-count", "20");
    expect(screen.queryByRole("button", { name: "Practice all questions" })).not.toBeInTheDocument();
  });

  it("lets mixed topics start a case set the same way", () => {
    renderSetup("__mixed__", "case");
    expect(screen.queryByText(/Mixed topics is not available/i)).not.toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /Cases/i })).toHaveAttribute("data-format-count", "24");
    expect(screen.getByRole("radio", { name: /Cases/i })).toHaveTextContent("Case studies");
  });

  it("keeps a selected topic on that topic's pool", () => {
    renderSetup("management-of-care", "ngn", {
      formats: { mcq: 40, ngn: 2, case: 0 },
      boardFormats: formats,
    });
    expect(screen.queryByText(/Mixed topics is not available/i)).not.toBeInTheDocument();
    expect(screen.getByText("Management of Care")).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /NGN/i })).toHaveAttribute("data-format-count", "2");
    expect(screen.queryByRole("radio", { name: /Cases/i })).not.toBeInTheDocument();
  });

  it("offers standard practice when the board has no case studies", () => {
    renderSetup("__mixed__", "case", {
      formats: { mcq: 144, ngn: 144, case: 0 },
    });
    expect(screen.getByText("No published case items in this pool.")).toBeInTheDocument();
    expect(screen.queryByRole("radio", { name: /Cases/i })).not.toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /All questions/i })).toBeInTheDocument();
  });

  it("offers mixed topics when one topic has no NGN items and the bank does", () => {
    renderSetup("management-of-care", "ngn", {
      formats: { mcq: 40, ngn: 0, case: 6 },
      boardFormats: { mcq: 5000, ngn: 20, case: 24 },
    });
    expect(screen.getByText("No published NGN items in this pool.")).toBeInTheDocument();
    expect(screen.queryByRole("radio", { name: /^NGN/i })).not.toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /Cases/i })).toBeInTheDocument();
  });

  it("leaves the all-questions path free to use mixed topics", () => {
    renderSetup("__mixed__", "all");
    expect(screen.queryByText(/Pick one topic for this/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/No published case items/i)).not.toBeInTheDocument();
  });
});
