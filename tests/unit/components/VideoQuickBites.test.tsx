import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { QUICK_BITE_EPISODES } from "@/lib/quick-bites/catalog";
import { VideoQuickBitesSection } from "@/components/quick-bites/VideoQuickBitesSection";

describe("Video Quick Bites", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows locked posters and one upgrade action for a free member", () => {
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
    expect(screen.getAllByText("Locked")).toHaveLength(QUICK_BITE_EPISODES.length);
    expect(screen.queryByText("Coming soon")).not.toBeInTheDocument();
    expect(screen.getByText("2:44")).toBeInTheDocument();
    expect(screen.getByText("3:25")).toBeInTheDocument();
    expect(screen.getByText("High-Alert Medications")).toBeInTheDocument();
    expect(screen.getByText("Acid-Base Made Simple")).toBeInTheDocument();
    expect(screen.queryByText(/Question 1 of/)).not.toBeInTheDocument();
    expect(screen.queryByText(/nursing board exam ends at question 85/)).not.toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    const upgrade = screen.getByRole("link", { name: "Subscribe to watch" });
    expect(upgrade).toHaveAttribute("href", "/checkout?plan=subscribe");
    expect(upgrade.className).toContain("min-h-11");
    expect(document.querySelector("video")).toBeNull();
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
});
