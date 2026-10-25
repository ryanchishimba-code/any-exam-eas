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
