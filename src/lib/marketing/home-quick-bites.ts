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

/**
 * The pharmacy catalog keeps a closing item titled "Bonus: …" after the
 * numbered lessons. A title that starts with Bonus is that extra, not another
 * lesson. The nursing exam-day episode is a lesson even though its slug
 * contains "bonus".
 */
export function isQuickBiteBonus(episode: { title: string }): boolean {
  return /^bonus\b/i.test(episode.title.trim());
}

/** Released episodes only. A held slot stays out of the homepage count. */
export function releasedQuickBites<T extends { held?: boolean }>(episodes: readonly T[]): T[] {
  return episodes.filter((episode) => episode.held !== true);
}

/**
 * Lesson count for released episodes. One Bonus title is called out
 * beside that count. More than one uses a plural bonus count.
 */
export function quickBiteCountLabel(episodes: readonly { title: string; held?: boolean }[]): string {
  const released = releasedQuickBites(episodes);
  const bonuses = released.filter(isQuickBiteBonus).length;
  const lessons = released.length - bonuses;
  const lessonLabel = `${lessons.toLocaleString("en-US")} ${lessons === 1 ? "lesson" : "lessons"}`;
  if (bonuses === 0) return lessonLabel;
  if (bonuses === 1) return `${lessonLabel} + bonus`;
  return `${lessonLabel} + ${bonuses.toLocaleString("en-US")} bonuses`;
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
  return releasedQuickBites(episodes)
    .filter((episode) => !isQuickBiteBonus(episode))
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
  countLabel: string;
  posters: HomeQuickBitePoster[];
};

/** Nursing follows the NCLEX catalog. Pharmacy follows the NAPLEX catalog. */
export function homeQuickBiteTracks(): HomeQuickBiteTrack[] {
  return [
    {
      id: "nursing",
      title: "Nursing",
      board: "NCLEX",
      countLabel: quickBiteCountLabel(QUICK_BITE_EPISODES),
      posters: quickBitePosterPreviews(QUICK_BITE_EPISODES, quickBitePoster),
    },
    {
      id: "pharmacy",
      title: "Pharmacy",
      board: "NAPLEX",
      countLabel: quickBiteCountLabel(PHARMACY_QUICK_BITE_EPISODES),
      posters: quickBitePosterPreviews(PHARMACY_QUICK_BITE_EPISODES, pharmacyQuickBitePoster),
    },
  ];
}
