import { describe, expect, it } from "vitest";
import { TRIAL_DAYS } from "@/lib/billing-config";
import { buildHowToPassMetadata } from "@/lib/marketing/how-to-pass-metadata";
import {
  HOW_TO_PASS_DESCRIPTION,
  HOW_TO_PASS_MEDIA,
  HOW_TO_PASS_TITLE,
  buildShareLinks,
  howToPassSharePath,
} from "@/lib/marketing/home-video";
import { SEO_DESC_MAX, SEO_DESC_MIN, SEO_TITLE_MAX } from "@/lib/seo/meta-budget";

describe("how to pass video", () => {
  it("uses placeholder media that can be overridden by public env", () => {
    expect(HOW_TO_PASS_MEDIA.src).toMatch(/how-to-pass\.mp4$/);
    expect(HOW_TO_PASS_MEDIA.poster).toMatch(/how-to-pass-poster\.png$/);
    expect(HOW_TO_PASS_MEDIA.captions).toMatch(/how-to-pass\.vtt$/);
    expect(HOW_TO_PASS_TITLE.length).toBeLessThanOrEqual(SEO_TITLE_MAX);
    expect(HOW_TO_PASS_DESCRIPTION.length).toBeGreaterThanOrEqual(SEO_DESC_MIN);
    expect(HOW_TO_PASS_DESCRIPTION.length).toBeLessThanOrEqual(SEO_DESC_MAX);
    expect(HOW_TO_PASS_DESCRIPTION).toContain(`${TRIAL_DAYS}-day free trial`);
    expect(HOW_TO_PASS_DESCRIPTION).not.toMatch(/24\/7|support hours/i);
  });

  it("deep-links the share URL to the video", () => {
    expect(howToPassSharePath()).toBe("/how-to-pass#video");
  });

  it("builds share links for the five channels", () => {
    const url = "https://www.anyexameasy.com/how-to-pass#video";
    const links = buildShareLinks(url, HOW_TO_PASS_TITLE);
    expect(links.map((link) => link.id)).toEqual(["facebook", "x", "whatsapp", "linkedin", "email"]);
    expect(links.find((link) => link.id === "facebook")?.href).toContain(
      "https://www.facebook.com/sharer/sharer.php?u="
    );
    expect(links.find((link) => link.id === "x")?.href).toContain("https://twitter.com/intent/tweet");
    expect(links.find((link) => link.id === "whatsapp")?.href).toContain("https://wa.me/?text=");
    expect(links.find((link) => link.id === "linkedin")?.href).toContain(
      "https://www.linkedin.com/sharing/share-offsite/?url="
    );
    expect(links.find((link) => link.id === "email")?.href).toMatch(/^mailto:\?subject=/);
    expect(links.every((link) => link.href.includes(encodeURIComponent(url)))).toBe(true);
  });

  it("publishes poster and video tags", () => {
    const meta = buildHowToPassMetadata();
    expect(meta.openGraph?.title).toBe(HOW_TO_PASS_TITLE);
    expect(meta.openGraph?.videos).toEqual([
      expect.objectContaining({ type: "video/mp4", url: expect.stringMatching(/how-to-pass\.mp4$/) }),
    ]);
    const images = meta.openGraph?.images;
    const image = Array.isArray(images) ? images[0] : images;
    expect(image).toEqual(
      expect.objectContaining({
        url: expect.stringMatching(/how-to-pass-poster\.png$/),
        width: 1280,
        height: 720,
      })
    );
    expect(meta.twitter?.card).toBe("summary_large_image");
    expect(meta.twitter?.images).toEqual([expect.stringMatching(/how-to-pass-poster\.png$/)]);
    expect(meta.alternates?.canonical).toBe("/how-to-pass");
  });
});
