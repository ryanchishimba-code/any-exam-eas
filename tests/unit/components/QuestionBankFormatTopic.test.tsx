import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
    expect(screen.getByText(/The number on the card is that pool/i)).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /NGN/i })).toHaveAttribute("data-format-count", "20");
    expect(screen.queryByRole("button", { name: "Practice all questions" })).not.toBeInTheDocument();
  });

  it("lets mixed topics start a case set the same way", () => {
    renderSetup("__mixed__", "case");
    expect(screen.queryByText(/Mixed topics is not available/i)).not.toBeInTheDocument();
    expect(screen.getByText(/eligible case items from every topic/i)).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /Cases/i })).toHaveAttribute("data-format-count", "24");
  });

  it("keeps a selected topic on that topic's pool", () => {
    renderSetup("management-of-care", "ngn", {
      formats: { mcq: 40, ngn: 2, case: 0 },
      boardFormats: formats,
    });
    expect(screen.queryByText(/Mixed topics is not available/i)).not.toBeInTheDocument();
    expect(screen.getByText("Management of Care")).toBeInTheDocument();
    expect(screen.getByText(/eligible NGN items from this topic/i)).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /NGN/i })).toHaveAttribute("data-format-count", "2");
  });

  it("offers standard practice when the board has no case studies", async () => {
    const onPracticeAllQuestions = vi.fn();
    renderSetup("__mixed__", "case", {
      formats: { mcq: 144, ngn: 144, case: 0 },
      onPracticeAllQuestions,
    });
    expect(screen.getByText("No case studies yet")).toBeInTheDocument();
    expect(screen.getByText(/Standard practice is ready now/i)).toBeInTheDocument();
    const action = screen.getByRole("button", { name: "Practice all questions" });
    expect(action).toBeEnabled();
    await userEvent.setup().click(action);
    expect(onPracticeAllQuestions).toHaveBeenCalledOnce();
  });

  it("offers mixed topics when one topic has no NGN items and the bank does", async () => {
    const onPracticeMixedTopics = vi.fn();
    renderSetup("management-of-care", "ngn", {
      formats: { mcq: 40, ngn: 0, case: 6 },
      boardFormats: { mcq: 5000, ngn: 20, case: 24 },
      onPracticeMixedTopics,
    });
    expect(screen.getByText("No NGN items in this topic")).toBeInTheDocument();
    const action = screen.getByRole("button", { name: "Practice mixed topics" });
    expect(action).toBeEnabled();
    await userEvent.setup().click(action);
    expect(onPracticeMixedTopics).toHaveBeenCalledOnce();
  });

  it("leaves the all-questions path free to use mixed topics", () => {
    renderSetup("__mixed__", "all");
    expect(screen.queryByText(/Pick one topic for this/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/No case studies yet/i)).not.toBeInTheDocument();
  });
});
