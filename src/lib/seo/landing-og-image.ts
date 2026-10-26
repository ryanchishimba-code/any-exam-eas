import { boardHeroMarketingCopy } from "@/lib/marketing/board-landing/board-hero-marketing";
import { HOME_PRACTICE_HEADLINE } from "@/lib/marketing/legal-copy";

/** Share cards always advertise the production host, including on preview deploys. */
export const LANDING_OG_ORIGIN = "https://www.anyexameasy.com";

export const LANDING_OG_WIDTH = 1200;
export const LANDING_OG_HEIGHT = 630;

/**
 * Bump when the card art changes. iMessage and Facebook cache the image URL,
 * so a new query value makes the next scrape fetch the new file.
 */
export const LANDING_OG_VERSION = "1";

export const LANDING_OG_IDS = [
  "home",
  "nclex",
  "naplex",
  "usmle",
  "pance",
  "aanp-fnp",
  "npte-pt",
] as const;

export type LandingOgId = (typeof LANDING_OG_IDS)[number];

export function landingOgPath(id: LandingOgId): string {
  return `/images/og/${id}.jpg`;
}

export function landingOgAlt(id: LandingOgId): string {
  if (id === "home") return HOME_PRACTICE_HEADLINE;
  return boardHeroMarketingCopy(id).headline;
}

export function landingOgImage(id: LandingOgId) {
  const alt = landingOgAlt(id);
  const url = `${LANDING_OG_ORIGIN}${landingOgPath(id)}?v=${LANDING_OG_VERSION}`;
  return {
    url,
    width: LANDING_OG_WIDTH,
    height: LANDING_OG_HEIGHT,
    alt,
    type: "image/jpeg" as const,
  };
}
