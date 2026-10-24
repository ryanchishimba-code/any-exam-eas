import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FreeQuizPlayer } from "@/components/marketing/free-quiz/FreeQuizPlayer";

const PAYLOAD = {
  board: "nclex",
  rotationKey: "fixed",
  questions: [
    {
      id: "q1",
      stem: "A client has chest pain. What should the nurse do first?",
      options: ["Obtain vital signs", "Leave the room", "Document later"],
      selection: "single" as const,
    },
    {
      id: "q2",
      stem: "Which finding is the priority?",
      options: ["Stridor", "Mild headache"],
      selection: "single" as const,
    },
  ],
};

describe("FreeQuizPlayer selection", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it("highlights a choice, lets the user change it, and keeps it visible after grading", async () => {
    const user = userEvent.setup();
    let posted: { answers?: { id: string; selected: string[] }[] } | null = null;

    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        if (url.endsWith("/grade") && init?.method === "POST") {
          posted = JSON.parse(String(init.body)) as { answers?: { id: string; selected: string[] }[] };
          return {
            ok: true,
            status: 200,
            json: async () => ({
              board: "nclex",
              rotationKey: "fixed",
              score: 0,
              total: 2,
              results: [
                {
                  id: "q1",
                  stem: PAYLOAD.questions[0]!.stem,
                  selection: "single",
                  selected: ["Leave the room"],
                  correctAnswers: ["Obtain vital signs"],
                  correct: false,
                  rationale: "SECRET_RATIONALE",
                },
                {
                  id: "q2",
                  stem: PAYLOAD.questions[1]!.stem,
                  selection: "single",
                  selected: ["Stridor"],
                  correctAnswers: ["Stridor"],
                  correct: true,
                },
              ],
            }),
          };
        }
        return { ok: true, status: 200, json: async () => PAYLOAD };
      })
    );

    render(<FreeQuizPlayer board="nclex" />);

    const obtain = await screen.findByRole("radio", { name: "Obtain vital signs" });
    const leave = screen.getByRole("radio", { name: "Leave the room" });

    obtain.focus();
    await user.keyboard("{ArrowDown}");
    expect(leave).toHaveAttribute("aria-checked", "true");
    expect(leave).toHaveAttribute("aria-pressed", "true");
    expect(leave).toHaveClass("is-selected");
    expect(obtain).toHaveAttribute("aria-checked", "false");

    await user.click(obtain);
    expect(obtain).toHaveAttribute("aria-checked", "true");
    expect(obtain).toHaveClass("is-selected");
    expect(leave).toHaveAttribute("aria-checked", "false");
    expect(leave).not.toHaveClass("is-selected");

    await user.click(leave);
    await user.click(screen.getByRole("button", { name: "Next" }));

    const stridor = await screen.findByRole("radio", { name: "Stridor" });
    stridor.focus();
    await user.keyboard("{Enter}");
    expect(stridor).toHaveAttribute("aria-checked", "true");

    await user.click(screen.getByRole("button", { name: "Finish quiz" }));

    expect(posted?.answers).toEqual([
      { id: "q1", selected: ["Leave the room"] },
      { id: "q2", selected: ["Stridor"] },
    ]);

    const yourAnswer = await screen.findByRole("radio", { name: /Leave the room/ });
    expect(yourAnswer).toHaveAttribute("aria-checked", "true");
    expect(yourAnswer).toHaveClass("is-selected");
    expect(yourAnswer).toHaveClass("is-wrong");
    expect(yourAnswer).toHaveTextContent("Your answer");

    const keyed = screen.getByRole("radio", { name: /Obtain vital signs/ });
    expect(keyed).toHaveClass("is-correct");
    expect(keyed).toHaveTextContent("Correct");
    expect(keyed).toHaveAttribute("aria-checked", "false");

    const correctPick = screen.getByRole("radio", { name: /Stridor/ });
    expect(correctPick).toHaveAttribute("aria-checked", "true");
    expect(correctPick).toHaveClass("is-selected");
    expect(correctPick).toHaveClass("is-correct");

    expect(screen.getAllByText("Want explanations?").length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "Start for free" }).length).toBeGreaterThan(0);
    expect(screen.queryByText(/SECRET_RATIONALE/)).toBeNull();
    expect(screen.queryByText(/Rationale/)).toBeNull();
  });

  it("toggles a multi-select choice off before submit", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        status: 200,
        json: async () => ({
          board: "nclex",
          rotationKey: "fixed",
          questions: [
            {
              id: "sata",
              stem: "Select the safe actions.",
              options: ["Assess pain", "Ignore the client"],
              selection: "multi",
            },
          ],
        }),
      }))
    );

    render(<FreeQuizPlayer board="nclex" />);
    const assess = await screen.findByRole("checkbox", { name: "Assess pain" });
    await user.click(assess);
    expect(assess).toHaveAttribute("aria-checked", "true");
    expect(assess).toHaveClass("is-selected");
    await user.click(assess);
    expect(assess).toHaveAttribute("aria-checked", "false");
    expect(assess).not.toHaveClass("is-selected");
  });
});
