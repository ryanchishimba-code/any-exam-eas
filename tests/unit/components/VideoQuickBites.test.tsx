import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { QUICK_BITE_EPISODES } from "@/lib/quick-bites/catalog";
import { VideoQuickBitesSection } from "@/components/quick-bites/VideoQuickBitesSection";

describe("Video Quick Bites", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it("lets a free member play the first episode and keeps the rest locked", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => ({
        videoUrl:
          "https://iiuq2awk7g8oulze.private.blob.vercel-storage.com/quick-bites/quick-bites-ep02-nclex-works-web.mp4?vercel-blob-signature=test",
        captionsUrl: "/api/quick-bites/quick-bites-ep02-nclex-works/media?part=captions",
      }),
    }));
    vi.stubGlobal("fetch", fetchMock);

    render(
      <VideoQuickBitesSection
        canPlay={false}
        upgradeHref="/checkout?plan=subscribe"
        upgradeLabel="Subscribe to watch"
      />
    );

    expect(screen.getByRole("heading", { name: "Video Quick Bites" })).toBeInTheDocument();
    expect(screen.getByText("Lab ranges vary by lab.")).toBeInTheDocument();
    expect(screen.getByText("How the Nursing Boards Work")).toBeInTheDocument();
    expect(screen.getByText("Danger-Zone Labs & Exam-Day Plan")).toBeInTheDocument();
    expect(screen.getAllByText("Locked")).toHaveLength(QUICK_BITE_EPISODES.length - 1);
    expect(screen.queryByText("Coming soon")).not.toBeInTheDocument();
    expect(screen.getByText("2:44")).toBeInTheDocument();
    expect(screen.getByText("3:25")).toBeInTheDocument();
    expect(screen.getByText("High-Alert Medications")).toBeInTheDocument();
    expect(screen.getByText("Acid-Base Made Simple")).toBeInTheDocument();
    expect(screen.queryByText(/Question 1 of/)).not.toBeInTheDocument();
    expect(screen.queryByText(/nursing board exam ends at question 85/)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Play 1. How the Nursing Boards Work" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Play 2. Priority: Who Do You See First?" })).not.toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(1);
    const upgrade = screen.getByRole("link", { name: "Subscribe to watch" });
    expect(upgrade).toHaveAttribute("href", "/checkout?plan=subscribe");
    expect(upgrade.className).toContain("min-h-11");
    expect(screen.getAllByRole("link")).toHaveLength(1);
    expect(document.querySelector("video")).toBeNull();

    await user.click(screen.getByRole("button", { name: "Play 1. How the Nursing Boards Work" }));
    const video = await screen.findByLabelText("How the Nursing Boards Work video");
    expect(video).toHaveAttribute("src", expect.stringContaining("vercel-blob-signature="));
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/quick-bites/quick-bites-ep02-nclex-works/media",
      expect.any(Object)
    );
  });

  it("lets a paid member open one lazy player", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      if (String(input).endsWith("/quiz")) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            questions: [
              {
                id: "q1",
                type: "single-answer",
                stem: "A candidate's nursing board exam ends at question 85. What does this mean?",
                options: [{ id: "C", text: "The result can't be told from the length" }],
                videoTimestamp: "1:09",
              },
            ],
          }),
        };
      }
      return {
        ok: true,
        status: 200,
        json: async () => ({
          videoUrl:
            "https://iiuq2awk7g8oulze.private.blob.vercel-storage.com/quick-bites/quick-bites-ep02-nclex-works-web.mp4?vercel-blob-signature=test",
          captionsUrl: "/api/quick-bites/quick-bites-ep02-nclex-works/media?part=captions",
        }),
      };
    });
    vi.stubGlobal("fetch", fetchMock);

    render(
      <VideoQuickBitesSection
        canPlay
        upgradeHref="/checkout?plan=subscribe"
        upgradeLabel="Upgrade to watch"
      />
    );

    expect(fetchMock).not.toHaveBeenCalled();
    expect(document.querySelector("video")).toBeNull();
    expect(screen.queryByRole("link", { name: "Upgrade to watch" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Play 9. High-Alert Medications" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Play 15. Acid-Base Made Simple" })).toBeInTheDocument();
    expect(screen.queryByText("Coming soon")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Play 1. How the Nursing Boards Work" }));

    const video = await screen.findByLabelText("How the Nursing Boards Work video");
    expect(video).toHaveAttribute("preload", "none");
    expect(video).toHaveAttribute("poster", "/quick-bites/quick-bites-ep02-nclex-works-poster.webp");
    expect(video).toHaveAttribute(
      "src",
      expect.stringContaining("vercel-blob-signature=")
    );
    expect(video.querySelector("track")).toHaveAttribute(
      "src",
      "/api/quick-bites/quick-bites-ep02-nclex-works/media?part=captions"
    );
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/quick-bites/quick-bites-ep02-nclex-works/media",
      expect.any(Object)
    );
  });

  it("switches episodes during the quiz and resets the new video and quiz", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        const slug = url.split("/api/quick-bites/")[1]?.split("/")[0] ?? "";
        if (url.includes("/quiz") && init?.method === "POST") {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              correct: true,
              explanation: "The first unstable patient is the priority.",
              keys: ["A"],
            }),
          };
        }
        if (url.includes("/quiz")) {
          const stem =
            slug === "quick-bites-ep03-priority"
              ? "Who do you see first?"
              : slug === "quick-bites-ep04-delegation"
                ? "Who can take this task?"
                : "A candidate's nursing board exam ends at question 85. What does this mean?";
          return {
            ok: true,
            status: 200,
            json: async () => ({
              questions: [
                {
                  id: `q-${slug}`,
                  type: "single-answer",
                  stem,
                  options: [{ id: "A", text: `Answer for ${slug}` }],
                  videoTimestamp: "1:09",
                },
              ],
            }),
          };
        }
        return {
          ok: true,
          status: 200,
          json: async () => ({
            videoUrl: `https://iiuq2awk7g8oulze.private.blob.vercel-storage.com/quick-bites/${slug}-web.mp4?vercel-blob-signature=test`,
            captionsUrl: `/api/quick-bites/${slug}/media?part=captions`,
          }),
        };
      })
    );

    render(
      <VideoQuickBitesSection
        canPlay
        upgradeHref="/checkout?plan=subscribe"
        upgradeLabel="Upgrade to watch"
      />
    );

    await user.click(screen.getByRole("button", { name: "Play 1. How the Nursing Boards Work" }));
    expect(
      await screen.findByText("A candidate's nursing board exam ends at question 85. What does this mean?")
    ).toBeInTheDocument();
    const nextDuringQuiz = screen.getByRole("button", { name: "Next episode" });
    expect(
      nextDuringQuiz.compareDocumentPosition(screen.getByText("Quiz · Question 1 of 1")) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    await user.click(screen.getByRole("radio", { name: /Answer for quick-bites-ep02-nclex-works/ }));
    expect(screen.getByRole("radio", { name: /Answer for quick-bites-ep02-nclex-works/ })).toBeChecked();

    await user.click(screen.getByRole("button", { name: "Play 2. Priority: Who Do You See First?" }));
    expect(await screen.findByRole("heading", { name: "2. Priority: Who Do You See First?" })).toBeInTheDocument();
    expect(await screen.findByText("Who do you see first?")).toBeInTheDocument();
    expect(
      screen.queryByText("A candidate's nursing board exam ends at question 85. What does this mean?")
    ).not.toBeInTheDocument();
    expect(screen.queryByText("The first unstable patient is the priority.")).not.toBeInTheDocument();
    const priorityAnswer = screen.getByRole("radio", { name: /Answer for quick-bites-ep03-priority/ });
    expect(priorityAnswer).not.toBeChecked();
    expect(screen.getByLabelText("Priority: Who Do You See First? video")).toHaveAttribute(
      "src",
      expect.stringContaining("quick-bites-ep03-priority-web.mp4")
    );
    expect(screen.getByText("Quiz · Question 1 of 1")).toBeInTheDocument();
    expect(document.querySelector("[role='dialog'], [aria-modal='true']")).toBeNull();
    expect(document.body.style.overflow).not.toBe("hidden");

    await user.click(priorityAnswer);
    await user.click(screen.getByRole("button", { name: "Check answer" }));
    expect(await screen.findByText("The first unstable patient is the priority.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next episode" })).toBeEnabled();
    await user.click(screen.getByRole("button", { name: "Play 3. Delegation: Who Can Do What?" }));
    expect(await screen.findByText("Who can take this task?")).toBeInTheDocument();
    expect(screen.queryByText("The first unstable patient is the priority.")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Delegation: Who Can Do What? video")).toHaveAttribute(
      "src",
      expect.stringContaining("quick-bites-ep04-delegation-web.mp4")
    );

    await user.click(screen.getByRole("radio", { name: /Answer for quick-bites-ep04-delegation/ }));
    await user.click(screen.getByRole("button", { name: "Check answer" }));
    await user.click(await screen.findByRole("button", { name: "See score" }));
    const score = screen.getByRole("heading", { name: "You got 1 of 1." });
    const nextAfterScore = screen.getByRole("button", { name: "Next episode" });
    expect(score.compareDocumentPosition(nextAfterScore) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    await user.click(nextAfterScore);
    expect(await screen.findByRole("heading", { name: "4. Isolation Precautions" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "You got 1 of 1." })).not.toBeInTheDocument();
    expect(screen.getByText("Quiz · Question 1 of 1")).toBeInTheDocument();
  });

  it("keeps the free episode on episode 1 with no path into a locked quiz", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);
        if (url.includes("/quiz")) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              questions: [
                {
                  id: "q-open",
                  type: "single-answer",
                  stem: "How does the nursing board exam stop?",
                  options: [{ id: "A", text: "When the decision is confident" }],
                  videoTimestamp: "0:40",
                },
              ],
            }),
          };
        }
        return {
          ok: true,
          status: 200,
          json: async () => ({
            videoUrl:
              "https://iiuq2awk7g8oulze.private.blob.vercel-storage.com/quick-bites/quick-bites-ep02-nclex-works-web.mp4?vercel-blob-signature=test",
            captionsUrl: "/api/quick-bites/quick-bites-ep02-nclex-works/media?part=captions",
          }),
        };
      })
    );

    render(
      <VideoQuickBitesSection
        canPlay={false}
        upgradeHref="/checkout?plan=subscribe"
        upgradeLabel="Subscribe to watch"
      />
    );

    await user.click(screen.getByRole("button", { name: "Play 1. How the Nursing Boards Work" }));
    expect(await screen.findByText("How does the nursing board exam stop?")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Next episode" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Play 2. Priority: Who Do You See First?" })).not.toBeInTheDocument();
    expect(screen.getAllByText("Locked")).toHaveLength(QUICK_BITE_EPISODES.length - 1);
    expect(screen.getByRole("link", { name: "Subscribe to watch" })).toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(1);
  });

  it("does not offer a next episode after the last video", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);
        if (url.includes("/quiz")) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              questions: [
                {
                  id: "q-last",
                  type: "single-answer",
                  stem: "Which lab needs a call before the exam?",
                  options: [{ id: "A", text: "A critical potassium" }],
                  videoTimestamp: "0:20",
                },
              ],
            }),
          };
        }
        return {
          ok: true,
          status: 200,
          json: async () => ({
            videoUrl:
              "https://iiuq2awk7g8oulze.private.blob.vercel-storage.com/quick-bites/quick-bites-bonus-labs-examday-web.mp4?vercel-blob-signature=test",
            captionsUrl: "/api/quick-bites/quick-bites-bonus-labs-examday/media?part=captions",
          }),
        };
      })
    );

    render(
      <VideoQuickBitesSection
        canPlay
        upgradeHref="/checkout?plan=subscribe"
        upgradeLabel="Upgrade to watch"
      />
    );

    await user.click(screen.getByRole("button", { name: "Play 16. Danger-Zone Labs & Exam-Day Plan" }));
    expect(await screen.findByText("Which lab needs a call before the exam?")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Next episode" })).not.toBeInTheDocument();
  });
});
