/**
 * Quick Bites: Pharmacy for the NAPLEX track only.
 * Episodes 1-16 stay in the released order. Episodes 17-26 follow the NAPLEX
 * study guide (infectious disease, endocrine, neuro/psych, oncology, special
 * populations, toxicology). The bonus stays last.
 * Posters are public so locked cards can render. MP4 and VTT files stay private.
 */

import type { QuickBiteEpisode } from "@/lib/quick-bites/catalog";

type EpisodeSeed = {
  slug: string;
  number: number;
  title: string;
  duration: string;
  mediaVersion?: string;
};

/**
 * ep07 was re-rendered on Oct 17, 2026 so the audio says "can last up to about
 * twenty-four hours", matching quiz Q4. The new MP4 and VTT live under this subfolder;
 * the original files stay at the old path untouched.
 */
export const PHARMACY_EP07_MEDIA_VERSION = "v2-20261017";

const EPISODES: EpisodeSeed[] = [
  {
    slug: "quick-bites-pharm-ep01-anticoagulants",
    number: 1,
    title: "Anticoagulants: Warfarin vs Heparins vs DOACs",
    duration: "5:09",
  },
  {
    slug: "quick-bites-pharm-ep02-raas",
    number: 2,
    title: "ACE Inhibitors vs ARBs vs ARNI",
    duration: "5:03",
  },
  {
    slug: "quick-bites-pharm-ep03-hypertension",
    number: 3,
    title: "Hypertension: Who Gets Which Drug",
    duration: "3:46",
  },
  {
    slug: "quick-bites-pharm-ep04-heart-failure",
    number: 4,
    title: "Heart Failure: The Four Pillars",
    duration: "3:42",
  },
  {
    slug: "quick-bites-pharm-ep05-lipids",
    number: 5,
    title: "Statins: Intensity, Goals + Safety",
    duration: "4:03",
  },
  {
    slug: "quick-bites-pharm-ep06-diabetes",
    number: 6,
    title: "Type 2 Diabetes: Pick by the Patient",
    duration: "4:07",
  },
  {
    slug: "quick-bites-pharm-ep07-insulin",
    number: 7,
    title: "Insulin: Onset, Peak + Safety",
    duration: "3:55",
    mediaVersion: PHARMACY_EP07_MEDIA_VERSION,
  },
  {
    slug: "quick-bites-pharm-ep08-asthma-copd",
    number: 8,
    title: "Asthma vs COPD Inhalers",
    duration: "4:06",
  },
  {
    slug: "quick-bites-pharm-ep09-antibiotics",
    number: 9,
    title: "Antibiotics: Bug-Drug Match",
    duration: "3:02",
  },
  {
    slug: "quick-bites-pharm-ep10-cyp-interactions",
    number: 10,
    title: "Drug Interactions: CYP Inhibitors vs Inducers",
    duration: "2:57",
  },
  {
    slug: "quick-bites-pharm-ep11-pharmacokinetics",
    number: 11,
    title: "Pharmacokinetics in Pictures",
    duration: "2:42",
  },
  {
    slug: "quick-bites-pharm-ep12-calculations",
    number: 12,
    title: "Calculations Survival Kit",
    duration: "2:52",
  },
  {
    slug: "quick-bites-pharm-ep13-compounding",
    number: 13,
    title: "Compounding Safety: USP 797 vs 800",
    duration: "2:49",
  },
  {
    slug: "quick-bites-pharm-ep14-high-alert",
    number: 14,
    title: "High-Alert Medications",
    duration: "2:42",
  },
  {
    slug: "quick-bites-pharm-ep15-vaccines",
    number: 15,
    title: "Vaccines: Live vs Inactivated",
    duration: "2:57",
  },
  {
    slug: "quick-bites-pharm-ep16-beers",
    number: 16,
    title: "Older Adults: Beers Criteria",
    duration: "2:58",
  },
  {
    slug: "quick-bites-pharm-ep22-hiv",
    number: 17,
    title: "HIV Drugs: Starting, PrEP + PEP",
    duration: "4:01",
  },
  {
    slug: "quick-bites-pharm-ep20-thyroid",
    number: 18,
    title: "Thyroid Drugs: Timing, Brakes + Pregnancy",
    duration: "3:54",
  },
  {
    slug: "quick-bites-pharm-ep18-antidepressants",
    number: 19,
    title: "Antidepressants: First Line, Washouts + Serotonin Syndrome",
    duration: "4:07",
  },
  {
    slug: "quick-bites-pharm-ep19-antipsychotics-lithium",
    number: 20,
    title: "Antipsychotics + Lithium",
    duration: "4:12",
  },
  {
    slug: "quick-bites-pharm-ep17-antiseizure",
    number: 21,
    title: "Antiseizure Drugs: Levels, Rashes + Pregnancy",
    duration: "4:04",
  },
  {
    slug: "quick-bites-pharm-ep23-pain-opioids",
    number: 22,
    title: "Pain + Opioids: Limits, Equivalents + Switches",
    duration: "3:49",
  },
  {
    slug: "quick-bites-pharm-ep21-oncology",
    number: 23,
    title: "Chemotherapy Safety: Toxicities, Rescues + Fatal Errors",
    duration: "3:47",
  },
  {
    slug: "quick-bites-pharm-ep24-pediatric-dosing",
    number: 24,
    title: "Pediatric Dosing: Weight Math + the Never List",
    duration: "3:51",
  },
  {
    slug: "quick-bites-pharm-ep25-pregnancy-lactation",
    number: 25,
    title: "Pregnancy + Lactation: Labels, Avoids + Swaps",
    duration: "3:47",
  },
  {
    slug: "quick-bites-pharm-ep26-antidotes",
    number: 26,
    title: "Toxicology: The Nomogram + Key Antidotes",
    duration: "4:07",
  },
  {
    slug: "quick-bites-pharm-bonus-exam-format",
    number: 27,
    title: "Bonus: How the Pharmacy Boards Work",
    duration: "2:18",
  },
];

export const PHARMACY_QUICK_BITE_EPISODES: QuickBiteEpisode[] = EPISODES.map((episode) => ({
  ...episode,
  group: "Pharmacy",
}));

const BY_SLUG = new Map(PHARMACY_QUICK_BITE_EPISODES.map((episode) => [episode.slug, episode]));

export function getPharmacyQuickBiteBySlug(slug: string): QuickBiteEpisode | undefined {
  return BY_SLUG.get(slug);
}

/** Public sample: Anticoagulants: Warfarin vs Heparins vs DOACs. */
export const OPEN_PHARMACY_QUICK_BITE_SLUG = "quick-bites-pharm-ep01-anticoagulants";

export function isOpenPharmacyQuickBite(slug: string): boolean {
  return slug === OPEN_PHARMACY_QUICK_BITE_SLUG;
}

/** The sample plays without a paid plan. Every other pharmacy episode stays on that check. */
export function isPharmacyQuickBitePlayable(
  episode: QuickBiteEpisode,
  canPlayLibrary: boolean
): boolean {
  return episode.held !== true && (canPlayLibrary || isOpenPharmacyQuickBite(episode.slug));
}

export function nextPlayablePharmacyQuickBite(
  slug: string,
  canPlayLibrary: boolean
): QuickBiteEpisode | null {
  const start = PHARMACY_QUICK_BITE_EPISODES.findIndex((episode) => episode.slug === slug);
  if (start < 0) return null;
  for (const episode of PHARMACY_QUICK_BITE_EPISODES.slice(start + 1)) {
    if (isPharmacyQuickBitePlayable(episode, canPlayLibrary)) return episode;
  }
  return null;
}

function pharmacyMediaFolder(slug: string): string {
  const version = BY_SLUG.get(slug)?.mediaVersion;
  return version ? `quick-bites-pharmacy/${version}` : "quick-bites-pharmacy";
}

export function pharmacyQuickBiteVideoPath(slug: string): string {
  return `${pharmacyMediaFolder(slug)}/${slug}-web.mp4`;
}

export function pharmacyQuickBiteCaptionsPath(slug: string): string {
  return `${pharmacyMediaFolder(slug)}/${slug}.vtt`;
}

export function pharmacyQuickBitePoster(slug: string): { webp: string; jpg: string } {
  return {
    webp: `/quick-bites-pharmacy/${slug}-poster.webp`,
    jpg: `/quick-bites-pharmacy/${slug}-poster.jpg`,
  };
}
