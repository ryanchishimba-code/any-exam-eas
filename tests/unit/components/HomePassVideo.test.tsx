import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { HomePassVideo } from "@/components/marketing/elevation/HomePassVideo";
import { HOW_TO_PASS_MEDIA, HOW_TO_PASS_TITLE } from "@/lib/marketing/home-video";

describe("HomePassVideo", () => {
  it("does not load the video until play, then attaches the captions track", async () => {
    const user = userEvent.setup();
    render(
      <HomePassVideo
        shareUrl="https://www.anyexameasy.com/how-to-pass#video"
        heading="h2"
      />
    );

    expect(screen.getByRole("heading", { name: HOW_TO_PASS_TITLE })).toBeInTheDocument();
    expect(document.querySelector("video")).toBeNull();
    expect(screen.getByRole("link", { name: "WhatsApp" })).toHaveAttribute("href", expect.stringContaining("wa.me"));

    await user.click(screen.getByRole("button", { name: /play video/i }));

    const video = document.querySelector("video");
    expect(video).toHaveAttribute("src", HOW_TO_PASS_MEDIA.src);
    expect(video).toHaveAttribute("poster", HOW_TO_PASS_MEDIA.poster);
    expect(video).toHaveAttribute("preload", "none");
    expect(video?.querySelector("track")).toHaveAttribute("src", HOW_TO_PASS_MEDIA.captions);
    expect(video?.querySelector("track")).toHaveAttribute("kind", "captions");
  });
});
