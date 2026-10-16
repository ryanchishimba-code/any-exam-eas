import { describe, expect, it } from "vitest";
import { quickBiteCaptionsPath, quickBiteVideoPath } from "./catalog";
import { unsignedQuickBiteUrl } from "./private-store";

describe("private Quick Bites storage", () => {
  it("rejects a direct storage URL without a signature", async () => {
    const captions = unsignedQuickBiteUrl(
      quickBiteCaptionsPath("quick-bites-ep02-nclex-works")
    );
    const video = unsignedQuickBiteUrl(quickBiteVideoPath("quick-bites-ep02-nclex-works"));
    expect(captions).not.toMatch(/[?&]vercel-blob-signature=/);
    expect(video).not.toMatch(/[?&]vercel-blob-signature=/);

    const [captionsResponse, videoResponse] = await Promise.all([
      fetch(captions, { redirect: "manual" }),
      fetch(video, {
        method: "GET",
        redirect: "manual",
        headers: { Range: "bytes=0-1" },
      }),
    ]);
    await captionsResponse.body?.cancel();
    await videoResponse.body?.cancel();

    expect([401, 403]).toContain(captionsResponse.status);
    expect([401, 403]).toContain(videoResponse.status);
  });
});
