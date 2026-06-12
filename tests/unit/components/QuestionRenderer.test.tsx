import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { QuestionRenderer } from "@/components/study/questions/QuestionRenderer";
import { sampleMcqQuestion, sampleNclexQuestion } from "../../fixtures/questions";

describe("QuestionRenderer", () => {
  it("renders stem, vignette, and MCQ options for USMLE items", () => {
    const onToggle = vi.fn();

    render(
      <QuestionRenderer
        question={sampleMcqQuestion}
        selected={[]}
        revealed={false}
        onToggle={onToggle}
      />
    );

    expect(screen.getByText(sampleMcqQuestion.stem)).toBeInTheDocument();
    expect(screen.getByText(/68-year-old man with nyha class ii/i)).toBeInTheDocument();
    expect(screen.getByText("High yield")).toBeInTheDocument();
    expect(screen.getByText(/QC 92%/)).toBeInTheDocument();

    for (const option of sampleMcqQuestion.options) {
      expect(screen.getByRole("button", { name: new RegExp(option, "i") })).toBeInTheDocument();
    }
  });

  it("invokes onToggle when an option is selected", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();

    render(
      <QuestionRenderer
        question={sampleNclexQuestion}
        selected={[]}
        revealed={false}
        onToggle={onToggle}
      />
    );

    const target = sampleNclexQuestion.options[1];
    await user.click(screen.getByRole("button", { name: new RegExp(target, "i") }));

    expect(onToggle).toHaveBeenCalledWith(target);
  });

  it("does not allow toggling after reveal", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();

    render(
      <QuestionRenderer
        question={sampleNclexQuestion}
        selected={[sampleNclexQuestion.correctAnswers[0]]}
        revealed={true}
        onToggle={onToggle}
      />
    );

    const optionButtons = screen
      .getAllByRole("button")
      .filter((btn) => sampleNclexQuestion.options.some((opt) => btn.textContent?.includes(opt)));
    for (const button of optionButtons) {
      expect(button).toBeDisabled();
    }

    await user.click(optionButtons[0]);
    expect(onToggle).not.toHaveBeenCalled();
  });
});
