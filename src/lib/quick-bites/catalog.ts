/**
 * Video Quick Bites for the nursing boards.
 * Posters are public. MP4 and VTT files live in a private Blob store
 * and are never linked without a signature.
 */

/** How long a playback URL stays valid. Long enough to watch, short enough to expire. */
export const QUICK_BITES_URL_TTL_MS = 20 * 60 * 1000;

export type QuickBiteEpisode = {
  slug: string;
  number: number;
  title: string;
  duration: string;
  group: string;
};

type EpisodeSeed = {
  slug: string;
  number: number;
  title: string;
  duration: string;
};

const GROUPS: { title: string; episodes: EpisodeSeed[] }[] = [
  {
    title: "How the Exam Works",
    episodes: [
      {
        slug: "quick-bites-ep02-nclex-works",
        number: 1,
        title: "How the Nursing Boards Work",
        duration: "3:15",
      },
    ],
  },
  {
    title: "Core Frameworks",
    episodes: [
      {
        slug: "quick-bites-ep03-priority",
        number: 2,
        title: "Priority: Who Do You See First?",
        duration: "3:19",
      },
      {
        slug: "quick-bites-ep04-delegation",
        number: 3,
        title: "Delegation: Who Can Do What?",
        duration: "2:46",
      },
    ],
  },
  {
    title: "Fundamentals & Safety",
    episodes: [
      {
        slug: "quick-bites-ep05-isolation",
        number: 4,
        title: "Isolation Precautions",
        duration: "3:28",
      },
    ],
  },
  {
    title: "Med-Surg",
    episodes: [
      {
        slug: "quick-bites-ep08-cardiac",
        number: 5,
        title: "Cardiac Essentials",
        duration: "3:21",
      },
      {
        slug: "quick-bites-ep09-respiratory",
        number: 6,
        title: "Respiratory Essentials",
        duration: "3:02",
      },
      {
        slug: "quick-bites-ep10-endocrine",
        number: 7,
        title: "Endocrine: DKA vs HHS & Thyroid",
        duration: "3:09",
      },
      {
        slug: "quick-bites-ep11-neuro",
        number: 8,
        title: "Neuro: Stroke & Pressure in the Brain",
        duration: "2:41",
      },
    ],
  },
  {
    title: "Pharmacology",
    episodes: [
      {
        slug: "quick-bites-ep12-high-alert-pharm",
        number: 9,
        title: "High-Alert Medications",
        duration: "2:43",
      },
    ],
  },
  {
    title: "Maternity & Newborn",
    episodes: [
      {
        slug: "quick-bites-ep14-maternity",
        number: 10,
        title: "Maternity Essentials",
        duration: "2:42",
      },
    ],
  },
  {
    title: "Pediatrics",
    episodes: [
      {
        slug: "quick-bites-ep15-peds",
        number: 11,
        title: "Pediatrics Essentials",
        duration: "2:57",
      },
    ],
  },
  {
    title: "Psych / Mental Health",
    episodes: [
      {
        slug: "quick-bites-ep13-psych",
        number: 12,
        title: "Psych Essentials",
        duration: "2:55",
      },
    ],
  },
  {
    title: "Fluids, Electrolytes & Acid-Base",
    episodes: [
      {
        slug: "quick-bites-potassium",
        number: 13,
        title: "Potassium: Highs, Lows & the Heart",
        duration: "4:39",
      },
      {
        slug: "quick-bites-ep06-sodium-calcium",
        number: 14,
        title: "Sodium & Calcium",
        duration: "3:16",
      },
      {
        slug: "quick-bites-ep07-acid-base",
        number: 15,
        title: "Acid-Base Made Simple",
        duration: "3:19",
      },
    ],
  },
  {
    title: "Exam Day",
    episodes: [
      {
        slug: "quick-bites-bonus-labs-examday",
        number: 16,
        title: "Danger-Zone Labs & Exam-Day Plan",
        duration: "2:35",
      },
    ],
  },
];

export const QUICK_BITE_GROUPS: { title: string; episodes: QuickBiteEpisode[] }[] = GROUPS.map(
  (group) => ({
    title: group.title,
    episodes: group.episodes.map((episode) => ({ ...episode, group: group.title })),
  })
);

export const QUICK_BITE_EPISODES: QuickBiteEpisode[] = QUICK_BITE_GROUPS.flatMap(
  (group) => group.episodes
);

const BY_SLUG = new Map(QUICK_BITE_EPISODES.map((episode) => [episode.slug, episode]));

export function getQuickBiteBySlug(slug: string): QuickBiteEpisode | undefined {
  return BY_SLUG.get(slug);
}

export function quickBiteVideoPath(slug: string): string {
  return `quick-bites/${slug}-web.mp4`;
}

export function quickBiteCaptionsPath(slug: string): string {
  return `quick-bites/${slug}.vtt`;
}

export function quickBitePoster(slug: string): { webp: string; jpg: string } {
  return {
    webp: `/quick-bites/${slug}-poster.webp`,
    jpg: `/quick-bites/${slug}-poster.jpg`,
  };
}
