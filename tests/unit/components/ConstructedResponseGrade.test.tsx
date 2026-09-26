import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ConstructedResponseInput } from "@/components/study/questions/NaplexFormats";
import { isAnswerCorrect } from "@/lib/questions/prepare";
import type { StudyQuestion } from "@/lib/questions/types";

function numericQuestion(stem: string, key: string): StudyQuestion {
  return {
    id: "cr-1",
    sourceIndex: 0,
    type: "short_answer",
    stem,
    options: [],
    correctAnswers: [key],
    explanation: "",
  };
}

function feedback(question: StudyQuestion, selected: string[]) {
  const view = render(
    <ConstructedResponseInput
      question={question}
      selected={selected}
      revealed
      onToggle={vi.fn()}
    />
  );
  const line = screen.getByText(/Correct:/);
  const markedCorrect = line.className.includes("text-emerald-700");
  view.unmount();
  return { markedCorrect };
}

describe("constructed response feedback", () => {
  it("matches exam scoring for 9.25 versus a key of 9.2", () => {
    const question = numericQuestion("What is the infusion rate?", "9.2");
    const near = feedback(question, ["9.25"]);
    expect(near.markedCorrect).toBe(false);
    expect(near.markedCorrect).toBe(isAnswerCorrect(question, ["9.25"]));

    const exact = feedback(question, ["9.2"]);
    expect(exact.markedCorrect).toBe(true);
    expect(exact.markedCorrect).toBe(isAnswerCorrect(question, ["9.2"]));
  });

  it("marks a fraction by its value, not by concatenated digits", () => {
    const half = numericQuestion("What fraction of the tablet remains?", "0.5");
    const matched = feedback(half, ["1/2"]);
    expect(matched.markedCorrect).toBe(true);
    expect(matched.markedCorrect).toBe(isAnswerCorrect(half, ["1/2"]));

    const dozen = numericQuestion("Enter the count.", "12");
    const mismatched = feedback(dozen, ["1/2"]);
    expect(mismatched.markedCorrect).toBe(false);
    expect(mismatched.markedCorrect).toBe(isAnswerCorrect(dozen, ["1/2"]));
  });

  it("keeps a typed fraction intact", async () => {
    const user = userEvent.setup();
    const question = numericQuestion("What fraction of the tablet remains?", "0.5");
    function Controlled() {
      const [selected, setSelected] = useState<string[]>([]);
      return (
        <ConstructedResponseInput
          question={question}
          selected={selected}
          revealed={false}
          onToggle={(option) => setSelected(option === "__clear__" ? [] : [option])}
        />
      );
    }
    render(<Controlled />);
    const input = screen.getByLabelText("Numeric answer");
    await user.type(input, "1/2");
    expect(input).toHaveValue("1/2");
  });
});
