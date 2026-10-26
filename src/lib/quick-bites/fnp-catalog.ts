/**
 * Quick Bites: FNP for the AANP-FNP track only.
 * Posters are public; MP4 and VTT stay private under Blob.
 */

import type { QuickBiteEpisode } from "@/lib/quick-bites/catalog";

export const FNP_QUICK_BITES_MEDIA_VERSION = "v1-20261025";

type EpisodeSeed = {
  slug: string;
  number: number;
  title: string;
  duration: string;
  mediaVersion?: string;
};

const EPISODES: EpisodeSeed[] = [
  {
    slug: "quick-bites-fnp-ep01-screening",
    number: 1,
    title: "Screening and Prevention Across the Lifespan",
    duration: "4:20",
    mediaVersion: FNP_QUICK_BITES_MEDIA_VERSION,
  },
  {
    slug: "quick-bites-fnp-ep02-bp-kidney-heart",
    number: 2,
    title: "Blood Pressure, Kidneys and Heart Risk",
    duration: "4:28",
    mediaVersion: FNP_QUICK_BITES_MEDIA_VERSION,
  },
  {
    slug: "quick-bites-fnp-ep03-diabetes",
    number: 3,
    title: "Diabetes from Diagnosis to Insulin",
    duration: "4:05",
    mediaVersion: FNP_QUICK_BITES_MEDIA_VERSION,
  },
  {
    slug: "quick-bites-fnp-ep04-breathing",
    number: 4,
    title: "Breathing Across Ages",
    duration: "4:04",
    mediaVersion: FNP_QUICK_BITES_MEDIA_VERSION,
  },
  {
    slug: "quick-bites-fnp-ep05-mind-mood",
    number: 5,
    title: "Mind and Mood",
    duration: "3:44",
    mediaVersion: FNP_QUICK_BITES_MEDIA_VERSION,
  },
  {
    slug: "quick-bites-fnp-ep06-older-adults",
    number: 6,
    title: "Older Adults",
    duration: "3:44",
    mediaVersion: FNP_QUICK_BITES_MEDIA_VERSION,
  },
  {
    slug: "quick-bites-fnp-ep07-board-strategy",
    number: 7,
    title: "How the Boards Work",
    duration: "3:12",
    mediaVersion: FNP_QUICK_BITES_MEDIA_VERSION,
  },
  {
    slug: "quick-bites-fnp-ep08-reproductive",
    number: 8,
    title: "Contraception, Pregnancy and Menopause",
    duration: "4:05",
    mediaVersion: FNP_QUICK_BITES_MEDIA_VERSION,
  },
  {
    slug: "quick-bites-fnp-ep09-children-growth-vaccines",
    number: 9,
    title: "Children: Growth, Development and Vaccines",
    duration: "3:37",
    mediaVersion: FNP_QUICK_BITES_MEDIA_VERSION,
  },
  {
    slug: "quick-bites-fnp-ep10-ent-fevers",
    number: 10,
    title: "Ears, Throats, Eyes and Fevers",
    duration: "3:55",
    mediaVersion: FNP_QUICK_BITES_MEDIA_VERSION,
  },
  {
    slug: "quick-bites-fnp-ep11-office-infections",
    number: 11,
    title: "Office Infections: STIs, Urinary, Pneumonia, TB",
    duration: "4:04",
    mediaVersion: FNP_QUICK_BITES_MEDIA_VERSION,
  },
  {
    slug: "quick-bites-fnp-ep12-heart-beyond-bp",
    number: 12,
    title: "Heart Failure, Atrial Fibrillation, Murmurs, Chest Pain",
    duration: "3:52",
    mediaVersion: FNP_QUICK_BITES_MEDIA_VERSION,
  },
  {
    slug: "quick-bites-fnp-ep13-thyroid-anemia",
    number: 13,
    title: "Thyroid and Anemia",
    duration: "3:42",
    mediaVersion: FNP_QUICK_BITES_MEDIA_VERSION,
  },
  {
    slug: "quick-bites-fnp-ep14-gut-liver",
    number: 14,
    title: "Gut, Liver and Abdomen",
    duration: "3:39",
    mediaVersion: FNP_QUICK_BITES_MEDIA_VERSION,
  },
  {
    slug: "quick-bites-fnp-ep15-bones-joints-nerves",
    number: 15,
    title: "Bones, Joints and Nerves",
    duration: "3:36",
    mediaVersion: FNP_QUICK_BITES_MEDIA_VERSION,
  },
  {
    slug: "quick-bites-fnp-ep16-skin",
    number: 16,
    title: "Skin Across Ages",
    duration: "3:16",
    mediaVersion: FNP_QUICK_BITES_MEDIA_VERSION,
  },
  {
    slug: "quick-bites-fnp-ep17-mens-kidney",
    number: 17,
    title: "Men's and Kidney Health",
    duration: "3:16",
    mediaVersion: FNP_QUICK_BITES_MEDIA_VERSION,
  },
  {
    slug: "quick-bites-fnp-ep18-role-law-evidence",
    number: 18,
    title: "Role, Law, Ethics and Evidence",
    duration: "3:17",
    mediaVersion: FNP_QUICK_BITES_MEDIA_VERSION,
  },
];

export const FNP_QUICK_BITE_EPISODES: QuickBiteEpisode[] = EPISODES.map((episode) => ({
  ...episode,
  group: "FNP",
}));

const BY_SLUG = new Map(FNP_QUICK_BITE_EPISODES.map((episode) => [episode.slug, episode]));

export function getFnpQuickBiteBySlug(slug: string): QuickBiteEpisode | undefined {
  return BY_SLUG.get(slug);
}

/** Public sample: Diabetes from Diagnosis to Insulin (trial + landing). */
export const OPEN_FNP_QUICK_BITE_SLUG = "quick-bites-fnp-ep03-diabetes";

export function isOpenFnpQuickBite(slug: string): boolean {
  return slug === OPEN_FNP_QUICK_BITE_SLUG;
}

/** The sample plays without a paid plan. Every other FNP episode stays on that check. */
export function isFnpQuickBitePlayable(
  episode: QuickBiteEpisode,
  canPlayLibrary: boolean
): boolean {
  return episode.held !== true && (canPlayLibrary || isOpenFnpQuickBite(episode.slug));
}

export function nextPlayableFnpQuickBite(
  slug: string,
  canPlayLibrary: boolean
): QuickBiteEpisode | null {
  const start = FNP_QUICK_BITE_EPISODES.findIndex((episode) => episode.slug === slug);
  if (start < 0) return null;
  for (const episode of FNP_QUICK_BITE_EPISODES.slice(start + 1)) {
    if (isFnpQuickBitePlayable(episode, canPlayLibrary)) return episode;
  }
  return null;
}

function fnpMediaFolder(slug: string): string {
  const version = BY_SLUG.get(slug)?.mediaVersion;
  return version ? `quick-bites-fnp/${version}` : "quick-bites-fnp";
}

export function fnpQuickBiteVideoPath(slug: string): string {
  return `${fnpMediaFolder(slug)}/${slug}-web.mp4`;
}

export function fnpQuickBiteCaptionsPath(slug: string): string {
  return `${fnpMediaFolder(slug)}/${slug}.vtt`;
}

export function fnpQuickBitePoster(slug: string): { webp: string; jpg: string } {
  return {
    webp: `/quick-bites-fnp/${slug}-poster.webp`,
    jpg: `/quick-bites-fnp/${slug}-poster.jpg`,
  };
}
