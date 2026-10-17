import {
  QUICK_BITE_EPISODES,
  quickBitePoster,
  type QuickBiteEpisode,
} from "@/lib/quick-bites/catalog";
import {
  PHARMACY_QUICK_BITE_EPISODES,
  pharmacyQuickBitePoster,
} from "@/lib/quick-bites/pharmacy-catalog";

/** Posters shown on the homepage. The rest stay in the library. */
export const HOME_QUICK_BITE_POSTER_LIMIT = 2;

/** Released episodes only. A held slot is visible in the library, not counted here. */
export function releasedQuickBiteCount(episodes: readonly { held?: boolean }[]): number {
  return episodes.filter((episode) => episode.held !== true).length;
}

export function quickBiteLessonLabel(count: number): string {
  const noun = count === 1 ? "lesson" : "lessons";
  return `${count.toLocaleString("en-US")} ${noun}`;
}

export type HomeQuickBitePoster = {
  slug: string;
  title: string;
  webp: string;
  jpg: string;
};

/**
 * Public poster files only. Video and caption paths stay off this page
 * so a logged-out visitor never receives a media URL.
 */
export function quickBitePosterPreviews(
  episodes: readonly QuickBiteEpisode[],
  poster: (slug: string) => { webp: string; jpg: string },
  limit = HOME_QUICK_BITE_POSTER_LIMIT
): HomeQuickBitePoster[] {
  return episodes
    .filter((episode) => episode.held !== true)
    .slice(0, limit)
    .map((episode) => {
      const image = poster(episode.slug);
      return {
        slug: episode.slug,
        title: episode.title,
        webp: image.webp,
        jpg: image.jpg,
      };
    });
}

export type HomeQuickBiteTrack = {
  id: "nursing" | "pharmacy";
  title: string;
  board: "NCLEX" | "NAPLEX";
  count: number;
  countLabel: string;
  posters: HomeQuickBitePoster[];
};

/** Nursing follows the NCLEX catalog. Pharmacy follows the NAPLEX catalog. */
export function homeQuickBiteTracks(): HomeQuickBiteTrack[] {
  const nursing = QUICK_BITE_EPISODES;
  const pharmacy = PHARMACY_QUICK_BITE_EPISODES;
  const nursingCount = releasedQuickBiteCount(nursing);
  const pharmacyCount = releasedQuickBiteCount(pharmacy);
  return [
    {
      id: "nursing",
      title: "Nursing",
      board: "NCLEX",
      count: nursingCount,
      countLabel: quickBiteLessonLabel(nursingCount),
      posters: quickBitePosterPreviews(nursing, quickBitePoster),
    },
    {
      id: "pharmacy",
      title: "Pharmacy",
      board: "NAPLEX",
      count: pharmacyCount,
      countLabel: quickBiteLessonLabel(pharmacyCount),
      posters: quickBitePosterPreviews(pharmacy, pharmacyQuickBitePoster),
    },
  ];
}
