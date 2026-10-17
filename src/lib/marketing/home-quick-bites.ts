import {
  OPEN_QUICK_BITE_SLUG,
  getQuickBiteBySlug,
  quickBitePoster,
} from "@/lib/quick-bites/catalog";
import {
  OPEN_PHARMACY_QUICK_BITE_SLUG,
  getPharmacyQuickBiteBySlug,
  pharmacyQuickBitePoster,
} from "@/lib/quick-bites/pharmacy-catalog";

export type HomeQuickBiteSample = {
  id: "nursing" | "pharmacy";
  title: string;
  board: "NCLEX" | "NAPLEX";
  episodeTitle: string;
  duration: string;
  slug: string;
  webp: string;
  jpg: string;
  /** Signed media is requested from here after a click. The page does not embed a file URL. */
  mediaUrl: string;
  captions: boolean;
};

/**
 * One public sample per track.
 * Nursing: How the Nursing Boards Work.
 * Pharmacy: Anticoagulants: Warfarin vs Heparins vs DOACs.
 */
export function homeQuickBiteSamples(): HomeQuickBiteSample[] {
  const nursing = getQuickBiteBySlug(OPEN_QUICK_BITE_SLUG);
  const pharmacy = getPharmacyQuickBiteBySlug(OPEN_PHARMACY_QUICK_BITE_SLUG);
  if (!nursing || !pharmacy) {
    throw new Error("Quick Bites samples are missing from the catalogs");
  }
  const nursingPoster = quickBitePoster(nursing.slug);
  const pharmacyPoster = pharmacyQuickBitePoster(pharmacy.slug);
  return [
    {
      id: "nursing",
      title: "Nursing",
      board: "NCLEX",
      episodeTitle: nursing.title,
      duration: nursing.duration,
      slug: nursing.slug,
      webp: nursingPoster.webp,
      jpg: nursingPoster.jpg,
      mediaUrl: `/api/quick-bites/${nursing.slug}/media`,
      captions: true,
    },
    {
      id: "pharmacy",
      title: "Pharmacy",
      board: "NAPLEX",
      episodeTitle: pharmacy.title,
      duration: pharmacy.duration,
      slug: pharmacy.slug,
      webp: pharmacyPoster.webp,
      jpg: pharmacyPoster.jpg,
      mediaUrl: `/api/quick-bites-pharmacy/${pharmacy.slug}/media`,
      captions: false,
    },
  ];
}
