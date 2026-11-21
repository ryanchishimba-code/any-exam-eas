/**
 * Quick Bites videos for the USMLE track.
 * Posters are public. MP4 and VTT stay in the private Blob store.
 * There is no free sample. Playback stays on the paid check.
 */

import type { QuickBiteEpisode } from "@/lib/quick-bites/catalog";
import { adjacentPlayableEpisode } from "@/lib/quick-bites/adjacent-playable";

export const USMLE_VIDEO_QUICK_BITES_MEDIA_VERSION = "v1-20261121";

type EpisodeSeed = {
  slug: string;
  number: number;
  title: string;
  duration: string;
};

const EPISODES: EpisodeSeed[] = [
  {
    slug: "quick-bites-usmle-ep01-acid-base-tubule",
    number: 1,
    title: "Acid-Base, Potassium, and the Tubule",
    duration: "4:50",
  },
  {
    slug: "quick-bites-usmle-ep02-glomeruli-ckd",
    number: 2,
    title: "Nephritic vs Nephrotic, Stones, and the Failing Kidney",
    duration: "4:02",
  },
  {
    slug: "quick-bites-usmle-ep03-lungs",
    number: 3,
    title: "Lungs That Will Not Oxygenate",
    duration: "3:58",
  },
  {
    slug: "quick-bites-usmle-ep04-anemias",
    number: 4,
    title: "Anemias and the Red Cell",
    duration: "3:48",
  },
  {
    slug: "quick-bites-usmle-ep05-bleeding-cancers",
    number: 5,
    title: "Bleeding, Clots, and Blood Cancers",
    duration: "3:45",
  },
  {
    slug: "quick-bites-usmle-ep06-brain-bleeds-cord",
    number: 6,
    title: "Blood in the Head, a Cut in the Cord",
    duration: "3:38",
  },
  {
    slug: "quick-bites-usmle-ep07-neuro-drugs",
    number: 7,
    title: "Slow Nerves and Dangerous Drugs",
    duration: "3:47",
  },
  {
    slug: "quick-bites-usmle-ep08-heart",
    number: 8,
    title: "Heart Failure, Murmurs, and a Long QT",
    duration: "3:55",
  },
  {
    slug: "quick-bites-usmle-ep09-endocrine-dka",
    number: 9,
    title: "Adrenal, Pituitary, and Diabetic Ketoacidosis",
    duration: "4:16",
  },
  {
    slug: "quick-bites-usmle-ep10-pregnancy-pelvis",
    number: 10,
    title: "Pregnancy Emergencies and the Pelvis",
    duration: "3:49",
  },
];

export const USMLE_VIDEO_QUICK_BITE_EPISODES: QuickBiteEpisode[] = EPISODES.map((episode) => ({
  ...episode,
  group: "USMLE",
  mediaVersion: USMLE_VIDEO_QUICK_BITES_MEDIA_VERSION,
}));

const BY_SLUG = new Map(USMLE_VIDEO_QUICK_BITE_EPISODES.map((episode) => [episode.slug, episode]));

export function getUsmleVideoQuickBiteBySlug(slug: string): QuickBiteEpisode | undefined {
  return BY_SLUG.get(slug);
}

/** No public sample. Every episode stays on the paid check. */
export function isOpenUsmleVideoQuickBite(_slug: string): boolean {
  return false;
}

export function isUsmleVideoQuickBitePlayable(
  episode: QuickBiteEpisode,
  canPlayLibrary: boolean
): boolean {
  return episode.held !== true && canPlayLibrary;
}

export function nextPlayableUsmleVideoQuickBite(
  slug: string,
  canPlayLibrary: boolean
): QuickBiteEpisode | null {
  return adjacentPlayableEpisode(USMLE_VIDEO_QUICK_BITE_EPISODES, slug, "next", (episode) =>
    isUsmleVideoQuickBitePlayable(episode, canPlayLibrary)
  );
}

export function previousPlayableUsmleVideoQuickBite(
  slug: string,
  canPlayLibrary: boolean
): QuickBiteEpisode | null {
  return adjacentPlayableEpisode(USMLE_VIDEO_QUICK_BITE_EPISODES, slug, "previous", (episode) =>
    isUsmleVideoQuickBitePlayable(episode, canPlayLibrary)
  );
}

function mediaFolder(slug: string): string {
  const version = BY_SLUG.get(slug)?.mediaVersion;
  return version ? `quick-bites-usmle/${version}` : "quick-bites-usmle";
}

export function usmleVideoQuickBiteVideoPath(slug: string): string {
  return `${mediaFolder(slug)}/${slug}-web.mp4`;
}

export function usmleVideoQuickBiteCaptionsPath(slug: string): string {
  return `${mediaFolder(slug)}/${slug}.vtt`;
}

export function usmleVideoQuickBitePoster(slug: string): { webp: string; jpg: string } {
  return {
    webp: `/quick-bites-usmle/${slug}-poster.webp`,
    jpg: `/quick-bites-usmle/${slug}-poster.jpg`,
  };
}
