import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { QuestionBankFormatMode } from "@/components/study/question-bank/QuestionBankFormatMode";

const formats = { mcq: 5400, ngn: 842, case: 0 };

describe("QuestionBankFormatMode", () => {
  it("shows the inventory split and blocks an empty case pool", async () => {
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
    const cases = screen.getByRole("radio", { name: /Cases/i });
    expect(ngn).toHaveAttribute("data-format-count", "842");
    expect(ngn).toHaveTextContent("842");
    expect(cases).toHaveAttribute("data-format-count", "0");
    expect(cases).toBeDisabled();
    expect(cases).toHaveTextContent("None published");

    const user = userEvent.setup();
    await user.click(ngn);
    expect(onChange).toHaveBeenCalledWith("ngn");
    expect(onChange).not.toHaveBeenCalledWith("case");
  });

  it("tells the student to pick one topic instead of launching the whole bank", () => {
    render(
      <QuestionBankFormatMode
        value="ngn"
        onChange={() => undefined}
        formats={formats}
        ngnLabel="NGN"
      />
    );

    expect(screen.getByText(/Pick one topic/i)).toBeInTheDocument();
    expect(screen.getByText(/only NGN items from that topic/i)).toBeInTheDocument();
    expect(screen.getByText(/Mixed topics is not available/i)).toBeInTheDocument();
    expect(screen.queryByText(/Topic choice applies to All questions/i)).not.toBeInTheDocument();
  });

  it("uses NGN-style for boards that are not Client Needs and hides counts while loading", () => {
    render(
      <QuestionBankFormatMode
        value="all"
        onChange={() => undefined}
        formats={null}
        countsLoading
        ngnLabel="NGN-style"
      />
    );

    expect(screen.getByRole("radio", { name: /NGN-style/i })).toBeDisabled();
    expect(screen.getByRole("radio", { name: /Cases/i })).toBeDisabled();
    expect(screen.getByRole("radio", { name: /NGN-style/i })).toHaveTextContent("…");
  });
});
