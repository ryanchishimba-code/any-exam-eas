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

export type MarketingPhotoHeroVariant = "desktop" | "mobile" | "mobile2x" | "mobile3x";

const VARIANT_FILE: Record<MarketingPhotoHeroVariant, string> = {
  desktop: "desktop",
  mobile: "mobile",
  mobile2x: "mobile-2x",
  mobile3x: "mobile-3x",
};

export function marketingPhotoHeroSrc(
  id: MarketingPhotoHeroId,
  variant: MarketingPhotoHeroVariant,
  format: "webp" | "avif"
): string {
  const base = MARKETING_PHOTO_HEROES[id].basePath;
  return `${base}-${VARIANT_FILE[variant]}.${format}`;
}

/**
 * Phone files are 9:16. 360 is only for DPR 1. DPR 2 uses the native 720
 * frame. DPR 3 uses a sharpened 1080 Lanczos enlargement of that frame.
 */
export const MARKETING_PHOTO_HERO_MOBILE_WIDTH = { x1: 360, x2: 720, x3: 1080 } as const;

/** Phones only. Desktop keeps the single 1280-wide file. */
export const MARKETING_PHOTO_HERO_MOBILE_MEDIA = "(max-width: 767px)";

export function marketingPhotoHeroMobileImageSet(id: MarketingPhotoHeroId): string {
  const avif1 = marketingPhotoHeroSrc(id, "mobile", "avif");
  const avif2 = marketingPhotoHeroSrc(id, "mobile2x", "avif");
  const avif3 = marketingPhotoHeroSrc(id, "mobile3x", "avif");
  const webp1 = marketingPhotoHeroSrc(id, "mobile", "webp");
  const webp2 = marketingPhotoHeroSrc(id, "mobile2x", "webp");
  const webp3 = marketingPhotoHeroSrc(id, "mobile3x", "webp");
  return `image-set(${[
    `url("${avif1}") type("image/avif") 1x`,
    `url("${avif2}") type("image/avif") 2x`,
    `url("${avif3}") type("image/avif") 3x`,
    `url("${webp1}") type("image/webp") 1x`,
    `url("${webp2}") type("image/webp") 2x`,
    `url("${webp3}") type("image/webp") 3x`,
  ].join(", ")})`;
}

export function marketingPhotoHeroMobilePreload(id: MarketingPhotoHeroId) {
  const avif2 = marketingPhotoHeroSrc(id, "mobile2x", "avif");
  const avif3 = marketingPhotoHeroSrc(id, "mobile3x", "avif");
  return [
    {
      href: avif2,
      imageSrcSet: `${avif2} ${MARKETING_PHOTO_HERO_MOBILE_WIDTH.x2}w`,
      imageSizes: "100vw",
      type: "image/avif" as const,
      media: `${MARKETING_PHOTO_HERO_MOBILE_MEDIA} and (max-resolution: 2.5dppx)`,
    },
    {
      href: avif3,
      imageSrcSet: `${avif3} ${MARKETING_PHOTO_HERO_MOBILE_WIDTH.x3}w`,
      imageSizes: "100vw",
      type: "image/avif" as const,
      media: `${MARKETING_PHOTO_HERO_MOBILE_MEDIA} and (min-resolution: 2.51dppx)`,
    },
  ];
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
 * Pixel aspect of the shipped file. Mobile portraits are native 720×1280.
 * Desktop stays 16:9.
 */
export const MARKETING_PHOTO_HERO_IMAGE_ASPECT = {
  mobile: 720 / 1280,
  desktop: 16 / 9,
} as const;

/** The phone files are already framed. Crop from the center, not the desktop focal. */
export const MARKETING_PHOTO_HERO_MOBILE_FOCAL = "50% 50%";

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
