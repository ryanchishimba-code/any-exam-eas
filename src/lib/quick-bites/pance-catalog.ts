/**
 * Quick Bites: PANCE for the PANCE track only.
 * Posters are public; MP4 and VTT stay private under Blob.
 */

import type { QuickBiteEpisode } from "@/lib/quick-bites/catalog";

export const PANCE_QUICK_BITES_MEDIA_VERSION = "v1-20261025";

type EpisodeSeed = {
  slug: string;
  number: number;
  title: string;
  duration: string;
  mediaVersion?: string;
};

const EPISODES: EpisodeSeed[] = [
  {
    slug: "quick-bites-pance-ep01-coronary-failure-shock",
    number: 1,
    title: "Coronary Disease, Heart Failure and Shock",
    duration: "4:34",
    mediaVersion: PANCE_QUICK_BITES_MEDIA_VERSION,
  },
  {
    slug: "quick-bites-pance-ep02-rhythms-valves-congenital",
    number: 2,
    title: "Rhythms, Valves and Congenital Hearts",
    duration: "4:31",
    mediaVersion: PANCE_QUICK_BITES_MEDIA_VERSION,
  },
  {
    slug: "quick-bites-pance-ep03-pressure-lipids-vessels",
    number: 3,
    title: "Pressure, Lipids and Vessels",
    duration: "4:21",
    mediaVersion: PANCE_QUICK_BITES_MEDIA_VERSION,
  },
  {
    slug: "quick-bites-pance-ep04-airways-lung-circulation",
    number: 4,
    title: "Airways and Lung Circulation",
    duration: "4:23",
    mediaVersion: PANCE_QUICK_BITES_MEDIA_VERSION,
  },
  {
    slug: "quick-bites-pance-ep05-lung-infections-kids",
    number: 5,
    title: "Lung Infections and Breathing in Kids",
    duration: "4:09",
    mediaVersion: PANCE_QUICK_BITES_MEDIA_VERSION,
  },
  {
    slug: "quick-bites-pance-ep06-upper-gi-liver-pancreas",
    number: 6,
    title: "Upper Gut, Liver, Gallbladder and Pancreas",
    duration: "3:55",
    mediaVersion: PANCE_QUICK_BITES_MEDIA_VERSION,
  },
  {
    slug: "quick-bites-pance-ep07-lower-gi-nutrition",
    number: 7,
    title: "Lower Gut, Surgical Abdomen and Nutrition",
    duration: "4:14",
    mediaVersion: PANCE_QUICK_BITES_MEDIA_VERSION,
  },
  {
    slug: "quick-bites-pance-ep08-fractures-spine-injuries",
    number: 8,
    title: "Fractures, Spine and Sports Injuries",
    duration: "3:30",
    mediaVersion: PANCE_QUICK_BITES_MEDIA_VERSION,
  },
  {
    slug: "quick-bites-pance-ep09-rheum-bone",
    number: 9,
    title: "Joints, Rheumatology and Bone",
    duration: "2:57",
    mediaVersion: PANCE_QUICK_BITES_MEDIA_VERSION,
  },
  {
    slug: "quick-bites-pance-ep10-neuro",
    number: 10,
    title: "Brain, Nerves and Headaches",
    duration: "3:22",
    mediaVersion: PANCE_QUICK_BITES_MEDIA_VERSION,
  },
  {
    slug: "quick-bites-pance-ep11-psych-behavior",
    number: 11,
    title: "Mind and Behavior",
    duration: "2:50",
    mediaVersion: PANCE_QUICK_BITES_MEDIA_VERSION,
  },
  {
    slug: "quick-bites-pance-ep12-pregnancy",
    number: 12,
    title: "Pregnancy, Labor and Postpartum",
    duration: "3:05",
    mediaVersion: PANCE_QUICK_BITES_MEDIA_VERSION,
  },
  {
    slug: "quick-bites-pance-ep13-gyn-breast",
    number: 13,
    title: "Gynecology, Breast and Contraception",
    duration: "2:57",
    mediaVersion: PANCE_QUICK_BITES_MEDIA_VERSION,
  },
  {
    slug: "quick-bites-pance-ep14-infectious",
    number: 14,
    title: "Infections Across the Body",
    duration: "2:58",
    mediaVersion: PANCE_QUICK_BITES_MEDIA_VERSION,
  },
  {
    slug: "quick-bites-pance-ep15-endocrine",
    number: 15,
    title: "Glands and Hormones",
    duration: "4:13",
    mediaVersion: PANCE_QUICK_BITES_MEDIA_VERSION,
  },
  {
    slug: "quick-bites-pance-ep16-eent",
    number: 16,
    title: "Eyes, Ears, Nose and Throat",
    duration: "4:29",
    mediaVersion: PANCE_QUICK_BITES_MEDIA_VERSION,
  },
  {
    slug: "quick-bites-pance-ep17-heme",
    number: 17,
    title: "Blood: Anemia, Clotting and Cancers",
    duration: "4:04",
    mediaVersion: PANCE_QUICK_BITES_MEDIA_VERSION,
  },
  {
    slug: "quick-bites-pance-ep18-renal-gu",
    number: 18,
    title: "Kidneys, Fluids and the Urinary Tract",
    duration: "4:02",
    mediaVersion: PANCE_QUICK_BITES_MEDIA_VERSION,
  },
  {
    slug: "quick-bites-pance-ep19-mens-health-skin",
    number: 19,
    title: "Men's Health and Skin",
    duration: "4:40",
    mediaVersion: PANCE_QUICK_BITES_MEDIA_VERSION,
  },
  {
    slug: "quick-bites-pance-ep20-professional-practice",
    number: 20,
    title: "Professional Practice and Board Strategy",
    duration: "3:40",
    mediaVersion: PANCE_QUICK_BITES_MEDIA_VERSION,
  },
];

export const PANCE_QUICK_BITE_EPISODES: QuickBiteEpisode[] = EPISODES.map((episode) => ({
  ...episode,
  group: "PANCE",
}));

const BY_SLUG = new Map(PANCE_QUICK_BITE_EPISODES.map((episode) => [episode.slug, episode]));

export function getPanceQuickBiteBySlug(slug: string): QuickBiteEpisode | undefined {
  return BY_SLUG.get(slug);
}

/** Public sample: Coronary Disease, Heart Failure and Shock (trial + landing). */
export const OPEN_PANCE_QUICK_BITE_SLUG = "quick-bites-pance-ep01-coronary-failure-shock";

export function isOpenPanceQuickBite(slug: string): boolean {
  return slug === OPEN_PANCE_QUICK_BITE_SLUG;
}

/** The sample plays without a paid plan. Every other PANCE episode stays on that check. */
export function isPanceQuickBitePlayable(
  episode: QuickBiteEpisode,
  canPlayLibrary: boolean
): boolean {
  return episode.held !== true && (canPlayLibrary || isOpenPanceQuickBite(episode.slug));
}

export function nextPlayablePanceQuickBite(
  slug: string,
  canPlayLibrary: boolean
): QuickBiteEpisode | null {
  const start = PANCE_QUICK_BITE_EPISODES.findIndex((episode) => episode.slug === slug);
  if (start < 0) return null;
  for (const episode of PANCE_QUICK_BITE_EPISODES.slice(start + 1)) {
    if (isPanceQuickBitePlayable(episode, canPlayLibrary)) return episode;
  }
  return null;
}

function panceMediaFolder(slug: string): string {
  const version = BY_SLUG.get(slug)?.mediaVersion;
  return version ? `quick-bites-pance/${version}` : "quick-bites-pance";
}

export function panceQuickBiteVideoPath(slug: string): string {
  return `${panceMediaFolder(slug)}/${slug}-web.mp4`;
}

export function panceQuickBiteCaptionsPath(slug: string): string {
  return `${panceMediaFolder(slug)}/${slug}.vtt`;
}

export function panceQuickBitePoster(slug: string): { webp: string; jpg: string } {
  return {
    webp: `/quick-bites-pance/${slug}-poster.webp`,
    jpg: `/quick-bites-pance/${slug}-poster.jpg`,
  };
}
