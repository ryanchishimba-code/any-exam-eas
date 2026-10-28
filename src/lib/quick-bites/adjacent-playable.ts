import type { QuickBiteEpisode } from "@/lib/quick-bites/catalog";

/** Next or previous playable episode in catalog order (same board list only). */
export function adjacentPlayableEpisode(
  episodes: readonly QuickBiteEpisode[],
  slug: string,
  direction: "next" | "previous",
  isPlayable: (episode: QuickBiteEpisode) => boolean
): QuickBiteEpisode | null {
  const start = episodes.findIndex((episode) => episode.slug === slug);
  if (start < 0) return null;
  if (direction === "next") {
    for (const episode of episodes.slice(start + 1)) {
      if (isPlayable(episode)) return episode;
    }
    return null;
  }
  for (let index = start - 1; index >= 0; index -= 1) {
    const episode = episodes[index];
    if (episode && isPlayable(episode)) return episode;
  }
  return null;
}
