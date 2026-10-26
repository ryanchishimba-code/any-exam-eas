import {
  getQuickBiteBySlug,
  OPEN_QUICK_BITE_SLUG,
} from "@/lib/quick-bites/catalog";
import {
  FNP_QUICK_BITE_EPISODES,
  getFnpQuickBiteBySlug,
  OPEN_FNP_QUICK_BITE_SLUG,
} from "@/lib/quick-bites/fnp-catalog";
import {
  getPanceQuickBiteBySlug,
  OPEN_PANCE_QUICK_BITE_SLUG,
  PANCE_QUICK_BITE_EPISODES,
} from "@/lib/quick-bites/pance-catalog";
import {
  getPharmacyQuickBiteBySlug,
  OPEN_PHARMACY_QUICK_BITE_SLUG,
  PHARMACY_QUICK_BITE_EPISODES,
} from "@/lib/quick-bites/pharmacy-catalog";

/** Marketing / trial track id (matches `BoardQuickBite.track` and catalog separation). */
export type QuickBiteBoardTrack = "nursing" | "pharmacy" | "fnp" | "pance";

export type PinnedOpenQuickBite = {
  track: QuickBiteBoardTrack;
  /** Stable slug in that track's catalog only. */
  slug: string;
  /** Signed media route for this track only (no cross-board API). */
  mediaApiBase: string;
};

/**
 * Pinned free-sample slugs. Never derived from catalog order, dates, user state,
 * or another board's library.
 */
export const PINNED_OPEN_QUICK_BITES: Record<QuickBiteBoardTrack, PinnedOpenQuickBite> = {
  nursing: {
    track: "nursing",
    slug: OPEN_QUICK_BITE_SLUG,
    mediaApiBase: "/api/quick-bites",
  },
  pharmacy: {
    track: "pharmacy",
    slug: OPEN_PHARMACY_QUICK_BITE_SLUG,
    mediaApiBase: "/api/quick-bites-pharmacy",
  },
  fnp: {
    track: "fnp",
    slug: OPEN_FNP_QUICK_BITE_SLUG,
    mediaApiBase: "/api/quick-bites-fnp",
  },
  pance: {
    track: "pance",
    slug: OPEN_PANCE_QUICK_BITE_SLUG,
    mediaApiBase: "/api/quick-bites-pance",
  },
};

const OWN_EPISODE_COUNT: Record<QuickBiteBoardTrack, number> = {
  nursing: 0,
  pharmacy: PHARMACY_QUICK_BITE_EPISODES.length,
  fnp: FNP_QUICK_BITE_EPISODES.length,
  pance: PANCE_QUICK_BITE_EPISODES.length,
};

/** True when the track has at least one episode in its own catalog (sample can be shown). */
export function boardTrackHasOwnQuickBiteLibrary(track: QuickBiteBoardTrack): boolean {
  if (track === "nursing") {
    return Boolean(getQuickBiteBySlug(OPEN_QUICK_BITE_SLUG));
  }
  return OWN_EPISODE_COUNT[track] > 0;
}

/** Resolve the pinned slug only from the track's catalog lookup. No cross-board fallback. */
export function pinnedEpisodeInOwnCatalog(track: QuickBiteBoardTrack) {
  const pinned = PINNED_OPEN_QUICK_BITES[track];
  switch (track) {
    case "nursing":
      return getQuickBiteBySlug(pinned.slug);
    case "pharmacy":
      return getPharmacyQuickBiteBySlug(pinned.slug);
    case "fnp":
      return getFnpQuickBiteBySlug(pinned.slug);
    case "pance":
      return getPanceQuickBiteBySlug(pinned.slug);
    default:
      return undefined;
  }
}
