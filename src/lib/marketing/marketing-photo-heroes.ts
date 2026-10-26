import type { ExamSeoKey } from "@/lib/seo/exam-config";

/** Static hero photo ids — one per homepage and board hub. */
export type MarketingPhotoHeroId = "home" | ExamSeoKey;

export type MarketingPhotoHeroConfig = {
  id: MarketingPhotoHeroId;
  /** CSS object-position for crop focal point. */
  focalPosition: string;
  basePath: `/images/marketing/heroes/${string}`;
};

const HERO_BASE = "/images/marketing/heroes";

export const MARKETING_PHOTO_HEROES: Record<MarketingPhotoHeroId, MarketingPhotoHeroConfig> = {
  home: {
    id: "home",
    focalPosition: "42% 38%",
    basePath: `${HERO_BASE}/home`,
  },
  nclex: {
    id: "nclex",
    focalPosition: "38% 42%",
    basePath: `${HERO_BASE}/nclex`,
  },
  naplex: {
    id: "naplex",
    focalPosition: "50% 40%",
    basePath: `${HERO_BASE}/naplex`,
  },
  usmle: {
    id: "usmle",
    focalPosition: "45% 38%",
    basePath: `${HERO_BASE}/usmle`,
  },
  pance: {
    id: "pance",
    focalPosition: "48% 40%",
    basePath: `${HERO_BASE}/pance`,
  },
  "aanp-fnp": {
    id: "aanp-fnp",
    focalPosition: "42% 38%",
    basePath: `${HERO_BASE}/aanp-fnp`,
  },
  "npte-pt": {
    id: "npte-pt",
    focalPosition: "50% 42%",
    basePath: `${HERO_BASE}/npte-pt`,
  },
};

export function marketingPhotoHeroSrc(
  id: MarketingPhotoHeroId,
  variant: "desktop" | "mobile",
  format: "webp" | "avif"
): string {
  const base = MARKETING_PHOTO_HEROES[id].basePath;
  return `${base}-${variant}.${format}`;
}

/**
 * First-screen boxes the cover crop is built for.
 * Phone ~390×780 and desktop 1280×800 match a viewport-tall hero (100svh).
 */
export const MARKETING_PHOTO_HERO_BOX_ASPECT = {
  mobile: 390 / 780,
  desktop: 1280 / 800,
} as const;

/**
 * Pixel aspect of the shipped file. Mobile is already a portrait crop of the
 * original, so the browser does not slice it again. Desktop stays 16:9.
 */
export const MARKETING_PHOTO_HERO_IMAGE_ASPECT = {
  mobile: 360 / 720,
  desktop: 16 / 9,
} as const;

/**
 * border-image-slice that matches object-fit: cover + object-position for a box.
 * The `fill` keyword paints the crop in the hero without making an <img> the LCP element.
 * `imageAspect` defaults to 16:9 for callers that still pass a landscape file.
 */
export function marketingPhotoHeroSlice(
  focalPosition: string,
  boxAspect: number,
  imageAspect = 16 / 9
): string {
  const [rawX = "50%", rawY = "50%"] = focalPosition.split(/\s+/);
  const posX = Number.parseFloat(rawX) / 100;
  const posY = Number.parseFloat(rawY) / 100;
  const pct = (n: number) => `${(Math.min(1, Math.max(0, n)) * 100).toFixed(2)}%`;
  if (imageAspect > boxAspect) {
    const crop = 1 - boxAspect / imageAspect;
    return `0 ${pct(crop * (1 - posX))} 0 ${pct(crop * posX)} fill`;
  }
  const crop = 1 - imageAspect / boxAspect;
  return `${pct(crop * posY)} 0 ${pct(crop * (1 - posY))} 0 fill`;
}
