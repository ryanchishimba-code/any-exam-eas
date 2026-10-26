import { readFileSync } from "node:fs";
import path from "node:path";
import type { MarketingPhotoHeroId } from "@/lib/marketing/marketing-photo-heroes";

/**
 * Mobile hero bytes, inlined so the LCP photo is in the document instead of a
 * second request. These are the same AVIF files as public/images — not a
 * lower-quality encode. Literal paths stay visible to the file tracer.
 */
const MOBILE_AVIF_FILES = {
  home: "public/images/marketing/heroes/home-mobile.avif",
  nclex: "public/images/marketing/heroes/nclex-mobile.avif",
  naplex: "public/images/marketing/heroes/naplex-mobile.avif",
  usmle: "public/images/marketing/heroes/usmle-mobile.avif",
  pance: "public/images/marketing/heroes/pance-mobile.avif",
  "aanp-fnp": "public/images/marketing/heroes/aanp-fnp-mobile.avif",
  "npte-pt": "public/images/marketing/heroes/npte-pt-mobile.avif",
} as const satisfies Record<MarketingPhotoHeroId, string>;

const dataUris = new Map<MarketingPhotoHeroId, string>();

export function marketingPhotoHeroMobileDataUri(id: MarketingPhotoHeroId): string {
  const cached = dataUris.get(id);
  if (cached) return cached;
  const file = path.join(process.cwd(), MOBILE_AVIF_FILES[id]);
  const uri = `data:image/avif;base64,${readFileSync(file).toString("base64")}`;
  dataUris.set(id, uri);
  return uri;
}
