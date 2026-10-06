import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FullExamSimulator } from "@/components/exam/FullExamSimulator";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
}));

function apiQuestion(id: number, stem: string, subjectId: string) {
  return {
    id,
    type: "multiple_choice" as const,
    question: stem,
    options: ["Alpha", "Beta", "Gamma", "Delta"],
    correctAnswer: "Alpha",
    explanation: "Alpha is correct.",
    subjectId,
    topicCategory: subjectId,
  };
}

describe("FullExamSimulator submit control", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);
        if (url.includes("/questions")) {
          return {
            ok: true,
            json: async () => ({
              questions: [
                apiQuestion(1, "Which parameter describes drug clearance?", "pharmacokinetics"),
                apiQuestion(2, "Which drug class lowers blood pressure?", "cardiovascular-rx"),
              ],
              bankItemIds: ["pk-1", "cv-1"],
            }),
          };
        }
        return { ok: true, json: async () => ({ ok: true }) };
      })
    );
  });

  it("enables Review & submit on the last item", async () => {
    render(
      <FullExamSimulator
        sessionId="sess-last-item"
        examSlug="naplex"
        fieldId="pharmacy"
        config={{
          lengthPreset: "50",
          questionCount: 2,
          timed: false,
          timeLimitSec: 0,
          adaptive: false,
        }}
      />
    );

    const next = await screen.findByRole("button", { name: /^next/i });
    fireEvent.click(next);

    const review = await screen.findByTestId("full-exam-review-submit");
    expect(review).toBeEnabled();
    expect(review).toHaveTextContent("Review & submit");
  });
});
