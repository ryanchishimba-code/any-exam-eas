/**
 * Medical Math videos shared by every board.
 * Posters are public. MP4 and VTT stay in the private Blob store.
 * There is no free sample.
 */

import type { QuickBiteEpisode } from "@/lib/quick-bites/catalog";
import { adjacentPlayableEpisode } from "@/lib/quick-bites/adjacent-playable";

export const MEDMATH_MEDIA_VERSION = "v1-20261121";

const EPISODES: QuickBiteEpisode[] = [
  {
    slug: "quick-bites-medmath-ep01-dosing-drips",
    number: 1,
    title: "Dosing and Drips",
    duration: "4:26",
    group: "Medical Math",
    mediaVersion: MEDMATH_MEDIA_VERSION,
  },
  {
    slug: "quick-bites-medmath-ep02-clinical-formulas",
    number: 2,
    title: "Clinical Formulas",
    duration: "5:15",
    group: "Medical Math",
    mediaVersion: MEDMATH_MEDIA_VERSION,
  },
  {
    slug: "quick-bites-medmath-ep03-biostats",
    number: 3,
    title: "Biostats That Change the Decision",
    duration: "4:27",
    group: "Medical Math",
    mediaVersion: MEDMATH_MEDIA_VERSION,
  },
];

export const MEDMATH_EPISODES = EPISODES;

const BY_SLUG = new Map(MEDMATH_EPISODES.map((episode) => [episode.slug, episode]));

export function getMedmathEpisode(slug: string): QuickBiteEpisode | undefined {
  return BY_SLUG.get(slug);
}

export function isOpenMedmathEpisode(_slug: string): boolean {
  return false;
}

export function isMedmathPlayable(episode: QuickBiteEpisode, canPlayLibrary: boolean): boolean {
  return episode.held !== true && canPlayLibrary;
}

export function nextPlayableMedmath(slug: string, canPlayLibrary: boolean): QuickBiteEpisode | null {
  return adjacentPlayableEpisode(MEDMATH_EPISODES, slug, "next", (episode) =>
    isMedmathPlayable(episode, canPlayLibrary)
  );
}

export function previousPlayableMedmath(slug: string, canPlayLibrary: boolean): QuickBiteEpisode | null {
  return adjacentPlayableEpisode(MEDMATH_EPISODES, slug, "previous", (episode) =>
    isMedmathPlayable(episode, canPlayLibrary)
  );
}

function folder(slug: string): string {
  const version = BY_SLUG.get(slug)?.mediaVersion ?? MEDMATH_MEDIA_VERSION;
  return `quick-bites-medmath/${version}`;
}

export function medmathVideoPath(slug: string): string {
  return `${folder(slug)}/${slug}-web.mp4`;
}

export function medmathCaptionsPath(slug: string): string {
  return `${folder(slug)}/${slug}.vtt`;
}

export function medmathPoster(slug: string): { webp: string; jpg: string } {
  return {
    webp: `/quick-bites-medmath/${slug}-poster.webp`,
    jpg: `/quick-bites-medmath/${slug}-poster.jpg`,
  };
}
