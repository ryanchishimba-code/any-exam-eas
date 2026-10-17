import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PHARMACY_QUICK_BITE_EPISODES } from "@/lib/quick-bites/pharmacy-catalog";
import { VideoQuickBitesSection } from "@/components/quick-bites/VideoQuickBitesSection";

describe("Quick Bites: Pharmacy", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows locked posters and one upgrade action to a free member", () => {
    render(
      <VideoQuickBitesSection
        series="pharmacy"
        canPlay={false}
        upgradeHref="/checkout?plan=subscribe"
        upgradeLabel="Subscribe to watch"
      />
    );

    expect(screen.getByRole("heading", { name: "Quick Bites: Pharmacy" })).toBeInTheDocument();
    expect(screen.queryByText("How the Nursing Boards Work is free. Paid members can watch every episode.")).not.toBeInTheDocument();
    expect(screen.getByText("Paid members can watch every episode.")).toBeInTheDocument();
    expect(screen.getAllByText("Locked")).toHaveLength(PHARMACY_QUICK_BITE_EPISODES.length);
    expect(screen.queryByRole("button", { name: /Play / })).not.toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(1);
    expect(screen.getByRole("link", { name: "Subscribe to watch" })).toHaveAttribute(
      "href",
      "/checkout?plan=subscribe"
    );
    expect(document.querySelector("video")).toBeNull();
    expect(screen.queryByText("Video Quick Bites")).not.toBeInTheDocument();
  });

  it("lets a paid member switch episodes and keeps captions off by default", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);
        const slug = url.split("/api/quick-bites-pharmacy/")[1]?.split("/")[0] ?? "";
        if (url.includes("/quiz")) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              questions: [
                {
                  id: `q-${slug}`,
                  type: "single-answer",
                  stem: `Stem for ${slug}`,
                  options: [{ id: "A", text: `Answer for ${slug}` }],
                  videoTimestamp: "0:47",
                },
              ],
            }),
          };
        }
        return {
          ok: true,
          status: 200,
          json: async () => ({
            videoUrl: `https://iiuq2awk7g8oulze.private.blob.vercel-storage.com/quick-bites-pharmacy/${slug}-web.mp4?vercel-blob-signature=test`,
            captionsUrl: `/api/quick-bites-pharmacy/${slug}/media?part=captions`,
          }),
        };
      })
    );

    render(
      <VideoQuickBitesSection
        series="pharmacy"
        canPlay
        upgradeHref="/checkout?plan=subscribe"
        upgradeLabel="Upgrade to watch"
      />
    );

    expect(screen.queryByRole("link", { name: "Upgrade to watch" })).not.toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: "Play 1. Anticoagulants: Warfarin vs Heparins vs DOACs" })
    );
    const video = await screen.findByLabelText("Anticoagulants: Warfarin vs Heparins vs DOACs video");
    expect(video).toHaveAttribute("preload", "none");
    expect(video).toHaveAttribute(
      "poster",
      "/quick-bites-pharmacy/quick-bites-pharm-ep01-anticoagulants-poster.webp"
    );
    expect(video.querySelector("track")).toBeNull();
    expect(screen.getByText("Captions are already on the video.")).toBeInTheDocument();
    expect(await screen.findByText("Stem for quick-bites-pharm-ep01-anticoagulants")).toBeInTheDocument();
    const next = screen.getByRole("button", { name: "Next episode" });
    expect(
      next.compareDocumentPosition(screen.getByText("Quiz · Question 1 of 1")) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();

    await user.click(next);
    expect(await screen.findByRole("heading", { name: "2. ACE Inhibitors vs ARBs vs ARNI" })).toBeInTheDocument();
    expect(await screen.findByText("Stem for quick-bites-pharm-ep02-raas")).toBeInTheDocument();
    expect(screen.queryByText("Stem for quick-bites-pharm-ep01-anticoagulants")).not.toBeInTheDocument();
    expect(screen.getByLabelText("ACE Inhibitors vs ARBs vs ARNI video")).toHaveAttribute(
      "src",
      expect.stringContaining("quick-bites-pharmacy/quick-bites-pharm-ep02-raas-web.mp4")
    );

    await user.click(screen.getByRole("button", { name: "Play 17. Bonus: How the Pharmacy Boards Work" }));
    expect(await screen.findByText("Stem for quick-bites-pharm-bonus-exam-format")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Next episode" })).not.toBeInTheDocument();
  });
});
