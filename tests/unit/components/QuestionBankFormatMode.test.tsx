import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { QuestionBankFormatMode } from "@/components/study/question-bank/QuestionBankFormatMode";

const formats = { mcq: 5400, ngn: 842, case: 0 };

describe("QuestionBankFormatMode", () => {
  it("shows the inventory split and hides an empty case pool", async () => {
    const onChange = vi.fn();
    render(
      <QuestionBankFormatMode
        value="all"
        onChange={onChange}
        formats={formats}
        ngnLabel="NGN"
      />
    );

    const ngn = screen.getByRole("radio", { name: /NGN/i });
    expect(ngn).toHaveAttribute("data-format-count", "842");
    expect(ngn).toHaveTextContent("842");
    expect(ngn).toHaveTextContent("Standalone NGN items");
    expect(screen.getByRole("radio", { name: /All questions/i })).toBeInTheDocument();
    expect(screen.queryByRole("radio", { name: /Cases/i })).not.toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(ngn);
    expect(onChange).toHaveBeenCalledWith("ngn");
  });

  it("keeps a mixed-topic NGN card selectable", () => {
    render(
      <QuestionBankFormatMode
        value="ngn"
        onChange={() => undefined}
        formats={formats}
        subjectId="__mixed__"
        ngnLabel="NGN"
      />
    );

    expect(screen.getByRole("radio", { name: /NGN/i })).toHaveAttribute("data-format-count", "842");
    expect(screen.queryByText(/Mixed topics is not available/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Pick one topic/i)).not.toBeInTheDocument();
  });

  it("uses NGN-style for boards that are not Client Needs and hides the chooser while loading", () => {
    const { rerender } = render(
      <QuestionBankFormatMode
        value="all"
        onChange={() => undefined}
        formats={{ mcq: 10, ngn: 4, case: 2 }}
        ngnLabel="NGN-style"
      />
    );

    expect(screen.getByRole("radio", { name: /NGN-style/i })).toBeEnabled();
    expect(screen.getByRole("radio", { name: /Cases/i })).toBeEnabled();

    rerender(
      <QuestionBankFormatMode
        value="all"
        onChange={() => undefined}
        formats={null}
        countsLoading
        ngnLabel="NGN-style"
      />
    );

    expect(screen.queryByRole("radio")).not.toBeInTheDocument();
  });
});
