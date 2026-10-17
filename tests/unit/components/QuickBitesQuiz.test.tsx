import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { QuickBitesPlayer } from "@/components/quick-bites/QuickBitesPlayer";
import { getQuickBiteBySlug } from "@/lib/quick-bites/catalog";

const QUESTIONS = [
  {
    id: "q1",
    type: "single-answer",
    stem: "A candidate's nursing board exam ends at question 85. What does this mean?",
    options: [
      { id: "A", text: "The candidate passed" },
      { id: "C", text: "The result can't be told from the length" },
    ],
    videoTimestamp: "1:09",
  },
  {
    id: "q2",
    type: "sata",
    stem: "Which are next-generation item formats described in the video?",
    options: [
      { id: "A", text: "Bow-tie" },
      { id: "B", text: "Matrix grid" },
      { id: "E", text: "Essay" },
    ],
    videoTimestamp: "1:37",
  },
];

describe("Quick Bites quiz", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    HTMLMediaElement.prototype.play = () => Promise.resolve();
  });

  it("asks one question at a time, locks the answer, seeks on rewatch, and shows the score", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onNext = vi.fn();
    let posts = 0;
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        if (url.endsWith("/quiz") && init?.method === "POST") {
          posts += 1;
          const correct = posts === 1;
          return {
            ok: true,
            status: 200,
            json: async () => ({
              correct,
              explanation: correct
                ? "C is correct: the length does not show pass or fail."
                : "A and B are correct. Essay is not a format on the exam.",
              keys: correct ? ["C"] : ["A", "B"],
            }),
          };
        }
        if (url.endsWith("/quiz")) {
          return { ok: true, status: 200, json: async () => ({ questions: QUESTIONS }) };
        }
        return {
          ok: true,
          status: 200,
          json: async () => ({
            videoUrl: "https://example.test/video.mp4?vercel-blob-signature=test",
            captionsUrl: "/captions.vtt",
          }),
        };
      })
    );

    render(
      <QuickBitesPlayer
        episode={getQuickBiteBySlug("quick-bites-ep02-nclex-works")!}
        nextEpisode={getQuickBiteBySlug("quick-bites-ep03-priority")!}
        onClose={onClose}
        onNext={onNext}
      />
    );

    expect(await screen.findByText(QUESTIONS[0]!.stem)).toBeInTheDocument();
    const nextEpisode = screen.getByRole("button", { name: "Next episode" });
    expect(nextEpisode.className).toContain("min-h-11");
    expect(
      nextEpisode.compareDocumentPosition(screen.getByText("Quiz · Question 1 of 2")) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    expect(screen.getByText("Quiz · Question 1 of 2")).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(2);
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
    expect(screen.queryByText(/the length does not show pass or fail/)).not.toBeInTheDocument();

    await user.click(screen.getByRole("radio", { name: /The result can't be told from the length/ }));
    await user.click(screen.getByRole("button", { name: "Check answer" }));

    expect(await screen.findByText(/the length does not show pass or fail/)).toBeInTheDocument();
    expect(screen.getByText("Correct")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next episode" })).toBeEnabled();
    expect(screen.getByRole("radio", { name: /The candidate passed/ })).toBeDisabled();
    expect(screen.queryByRole("button", { name: "Check answer" })).not.toBeInTheDocument();

    const video = screen.getByLabelText("How the Nursing Boards Work video");
    await user.click(screen.getByRole("button", { name: "Rewatch this part" }));
    expect(video).toHaveProperty("currentTime", 69);

    await user.click(screen.getByRole("button", { name: "Next question" }));
    expect(screen.getByText("Select all that apply")).toBeInTheDocument();
    expect(screen.getAllByRole("checkbox")).toHaveLength(3);
    expect(screen.queryByRole("radio")).not.toBeInTheDocument();

    await user.click(screen.getByRole("checkbox", { name: /Essay/ }));
    await user.click(screen.getByRole("button", { name: "Check answer" }));
    expect(await screen.findByText("Not quite")).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: /Essay/ })).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "See score" }));
    const score = screen.getByRole("heading", { name: "You got 1 of 2." });
    const nextAfterScore = screen.getByRole("button", { name: "Next episode" });
    expect(score.compareDocumentPosition(nextAfterScore) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(document.querySelector("[role='dialog'], [aria-modal='true']")).toBeNull();
    expect(document.body.style.overflow).not.toBe("hidden");
    await user.click(nextAfterScore);
    expect(onNext).toHaveBeenCalledOnce();
    expect(onClose).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Back to episodes" }));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
