import { describe, expect, it } from "vitest";
import { buildNaplexLandingMetadata } from "@/lib/marketing/board-landing/naplex";
import { buildHubLandingMetadata } from "@/lib/marketing/board-landing/hub-model";
import { buildNclexLandingMetadata } from "@/lib/marketing/board-landing/model";
import { boardHeroMarketingCopy } from "@/lib/marketing/board-landing/board-hero-marketing";
import { ABOUT_HERO_HEADLINE } from "@/lib/marketing/about-copy";
import { HOME_PRACTICE_HEADLINE } from "@/lib/marketing/legal-copy";
import { buildHomeJsonLd, buildHomeMetadata, buildRootMetadata, DEFAULT_OG_IMAGE_PATH } from "@/lib/seo";
import { buildAboutJsonLd, buildAboutMetadata } from "@/lib/seo/marketing-metadata";
import {
  LANDING_OG_HEIGHT,
  LANDING_OG_IDS,
  LANDING_OG_ORIGIN,
  LANDING_OG_VERSION,
  LANDING_OG_WIDTH,
  landingOgImage,
} from "@/lib/seo/landing-og-image";

function imageUrl(meta: { openGraph?: { images?: unknown } }): string {
  const images = meta.openGraph?.images;
  const first = Array.isArray(images) ? images[0] : images;
  if (typeof first === "string") return first;
  if (first && typeof first === "object" && "url" in first) return String(first.url);
  return "";
}

describe("landing share images", () => {
  it("gives each landing its own production JPEG and leaves layout metadata without an image", () => {
    const root = buildRootMetadata();
    expect(root.openGraph?.images).toBeUndefined();

    const pages = [
      ["/", buildHomeMetadata()],
      ["/nclex", buildNclexLandingMetadata()],
      ["/naplex", buildNaplexLandingMetadata()],
      ["/usmle", buildHubLandingMetadata("usmle")],
      ["/pance", buildHubLandingMetadata("pance")],
      ["/aanp-fnp", buildHubLandingMetadata("aanp-fnp")],
      ["/npte-pt", buildHubLandingMetadata("npte-pt")],
    ] as const;

    const titles = [
      "NCLEX, NAPLEX, USMLE & More — One Plan, $27.99/mo",
      "NCLEX-RN Practice Questions + 5-Day Free Trial | $27.99/mo",
      "NAPLEX Practice Questions + 5-Day Free Trial | $27.99/mo",
      "USMLE Practice Questions + 5-Day Free Trial | $27.99/mo",
      "PANCE Practice Questions + 5-Day Free Trial | $27.99/mo",
      "AANP FNP Practice Questions + 5-Day Free Trial | $27.99/mo",
      "NPTE-PT Practice Questions + 5-Day Free Trial | $27.99/mo",
    ];
    const urls = pages.map(([, meta]) => imageUrl(meta));
    expect(new Set(urls).size).toBe(pages.length);

    for (const [index, [, meta]] of pages.entries()) {
      const id = LANDING_OG_IDS[index];
      const card = landingOgImage(id);
      const title = typeof meta.title === "object" ? meta.title?.absolute : meta.title;
      expect(title).toBe(titles[index]);
      expect(meta.openGraph?.title).toBe(titles[index]);
      expect(imageUrl(meta)).toBe(
        `${LANDING_OG_ORIGIN}/images/og/${id}.jpg?v=${LANDING_OG_VERSION}`
      );
      expect(imageUrl(meta)).toMatch(/\?v=\d+$/);
      expect(meta.openGraph?.images).toEqual([card]);
      expect(card.width).toBe(LANDING_OG_WIDTH);
      expect(card.height).toBe(LANDING_OG_HEIGHT);
      expect(card.type).toBe("image/jpeg");
      expect(meta.twitter?.card).toBe("summary_large_image");
      expect(meta.twitter?.images).toEqual([card.url]);
    }
  });

  it("uses the page H1 as alt text and keeps JSON-LD on the shared default image", () => {
    expect(landingOgImage("home").alt).toBe(HOME_PRACTICE_HEADLINE);
    expect(landingOgImage("about").alt).toBe(ABOUT_HERO_HEADLINE);
    expect(landingOgImage("about").alt.toLowerCase()).not.toMatch(/\bpass\b/);
    expect(ABOUT_HERO_HEADLINE).toMatch(/Any Exam Easy/);
    expect(ABOUT_HERO_HEADLINE.toLowerCase()).toMatch(/exam prep/);
    expect(ABOUT_HERO_HEADLINE.toLowerCase()).toMatch(/founder/);
    const aboutTitle = buildAboutMetadata().title;
    const aboutTitleText =
      typeof aboutTitle === "object" && aboutTitle && "absolute" in aboutTitle
        ? String(aboutTitle.absolute)
        : String(aboutTitle);
    const aboutDescription = String(buildAboutMetadata().description);
    expect(aboutTitleText.length).toBeLessThanOrEqual(60);
    expect(aboutDescription.length).toBeLessThanOrEqual(155);
    expect(aboutDescription.length).toBeGreaterThanOrEqual(140);
    expect(imageUrl(buildAboutMetadata())).toBe(
      `${LANDING_OG_ORIGIN}/images/og/about.jpg?v=${LANDING_OG_VERSION}`
    );
    const aboutLd = JSON.stringify(buildAboutJsonLd());
    expect(aboutLd).toContain('"@type":"AboutPage"');
    expect(aboutLd).toContain('"@type":"Organization"');
    expect(aboutLd).toContain('"@type":"Person"');
    expect(aboutLd).toContain("Ryan Chishimba, PharmD, RPh");
    expect(aboutLd).toContain('"jobTitle":"Founder and Pharmacy Manager"');
    expect(aboutLd).toContain("#founder");
    expect(aboutLd).toContain('"founder":{"@id":');
    expect(aboutLd).toContain("Ileen Chishimba, RN");
    expect(aboutLd).not.toContain("hoursAvailable");
    expect(aboutLd).not.toContain("worksFor");
    for (const id of ["nclex", "naplex", "usmle", "pance", "aanp-fnp", "npte-pt"] as const) {
      expect(landingOgImage(id).alt).toBe(boardHeroMarketingCopy(id).headline);
      expect(landingOgImage(id).alt.toLowerCase()).not.toMatch(/\bpass\b/);
    }
    const jsonLd = JSON.stringify(buildHomeJsonLd());
    expect(jsonLd).toContain(DEFAULT_OG_IMAGE_PATH);
    expect(jsonLd).not.toContain("/images/og/home.jpg");
  });
});
