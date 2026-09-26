import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { QuestionBankSessionPreview } from "@/components/study/question-bank/QuestionBankSessionPreview";

function renderPreview(emptyNotice?: {
  title: string;
  actionLabel: string;
  onAction: () => void;
} | null) {
  return render(
    <QuestionBankSessionPreview
      topicLabel="Cases · Mixed topics"
      questionCount={5}
      pace="untimed"
      bankStyle="standard"
      estimatedMinutes={8}
      availableCount={0}
      validationMessage="No published case items in this pool."
      loading={false}
      disabled
      onStart={vi.fn()}
      emptyNotice={emptyNotice}
    />
  );
}

describe("QuestionBankSessionPreview empty format", () => {
  it("replaces a disabled Start button with the next action", async () => {
    const onAction = vi.fn();
    renderPreview({
      title: "No case studies yet",
      actionLabel: "Practice all questions",
      onAction,
    });

    expect(screen.getByText("No case studies yet")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Start untimed practice/i })).not.toBeInTheDocument();
    const action = screen.getByRole("button", { name: "Practice all questions" });
    expect(action).toBeEnabled();
    await userEvent.setup().click(action);
    expect(onAction).toHaveBeenCalledOnce();
  });

  it("keeps Start disabled when the empty notice is absent", () => {
    renderPreview(null);
    expect(screen.getByRole("button", { name: /Start untimed practice/i })).toBeDisabled();
    expect(screen.getByText(/No published case items in this pool/i)).toBeInTheDocument();
  });
});
