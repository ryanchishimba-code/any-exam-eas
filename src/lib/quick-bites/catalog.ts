/**
 * Video Quick Bites for the nursing boards (NCLEX track only).
 * Episodes follow the NCLEX study guide: frameworks, then systems, then the exam-day close.
 * Wave 2 fills the renal, GI, hematology, musculoskeletal, surgical, and dosage chapters.
 * Posters are public. MP4 and VTT files live in a private Blob store
 * and are never linked without a signature.
 */

/** How long a playback URL stays valid. Long enough to watch, short enough to expire. */
export const QUICK_BITES_URL_TTL_MS = 20 * 60 * 1000;

/** Public sample: How the Nursing Boards Work. Everyone else stays on the paid check. */
export const OPEN_QUICK_BITE_SLUG = "quick-bites-ep02-nclex-works";

export function isOpenQuickBite(slug: string): boolean {
  return slug === OPEN_QUICK_BITE_SLUG;
}

export type QuickBiteEpisode = {
  slug: string;
  number: number;
  title: string;
  duration: string;
  group: string;
  /** Slot stays visible. The current video is not uploaded or playable. */
  held?: boolean;
  /**
   * Private Blob subfolder for a re-rendered video. Set only when a replacement was
   * uploaded under a new path so the old file keeps serving until this ships.
   */
  mediaVersion?: string;
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
        duration: "2:44",
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
        duration: "3:25",
      },
    ],
  },
  {
    title: "Kidneys",
    episodes: [
      {
        slug: "quick-bites-ep19-kidneys-dialysis",
        number: 16,
        title: "Kidneys: Acute vs Chronic & Dialysis",
        duration: "3:53",
      },
    ],
  },
  {
    title: "Blood Transfusions",
    episodes: [
      {
        slug: "quick-bites-ep20-transfusion",
        number: 17,
        title: "Blood Transfusions: Safe Setup & Reactions",
        duration: "3:38",
      },
    ],
  },
  {
    title: "Med-Surg: GI & Liver",
    episodes: [
      {
        slug: "quick-bites-ep17-gi-bleed-obstruction",
        number: 18,
        title: "GI Bleeds & Bowel Obstruction",
        duration: "3:23",
      },
      {
        slug: "quick-bites-ep18-liver-pancreas",
        number: 19,
        title: "Liver & Pancreas: Cirrhosis vs Pancreatitis",
        duration: "3:53",
      },
    ],
  },
  {
    title: "Musculoskeletal",
    episodes: [
      {
        slug: "quick-bites-ep24-ortho",
        number: 20,
        title: "Orthopedics: Compartment Syndrome, Fat Embolism, Hip Precautions",
        duration: "3:32",
      },
    ],
  },
  {
    title: "Hematology & Oncology",
    episodes: [
      {
        slug: "quick-bites-ep21-neutropenia-sickle-cell",
        number: 21,
        title: "Cancer Care & Sickle Cell: Neutropenia, Low Platelets, Crisis",
        duration: "4:07",
      },
    ],
  },
  {
    title: "Surgery, Wounds & Burns",
    episodes: [
      {
        slug: "quick-bites-ep22-surgery-wounds",
        number: 22,
        title: "Surgery & Wounds: Pre-Op, Post-Op, Pressure Injuries",
        duration: "4:08",
      },
      {
        slug: "quick-bites-ep23-burns",
        number: 23,
        title: "Burns: Airway, Rule of Nines, Fluids",
        duration: "3:33",
      },
    ],
  },
  {
    title: "Dosage Calculations",
    episodes: [
      {
        slug: "quick-bites-ep25-dosage-calc",
        number: 24,
        title: "Dosage Calculations: Drip Rates & Weight-Based Dosing",
        duration: "4:44",
      },
    ],
  },
  {
    title: "Exam Day",
    episodes: [
      {
        slug: "quick-bites-bonus-labs-examday",
        number: 25,
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

export function isQuickBiteHeld(slug: string): boolean {
  return BY_SLUG.get(slug)?.held === true;
}

/** Paid members can play every released episode. Anyone signed in can play the open one. */
export function isQuickBiteEpisodePlayable(episode: QuickBiteEpisode, canPlayLibrary: boolean): boolean {
  return episode.held !== true && (canPlayLibrary || isOpenQuickBite(episode.slug));
}

/** The next released episode this viewer is allowed to play, if there is one. */
export function nextPlayableQuickBite(
  slug: string,
  canPlayLibrary: boolean
): QuickBiteEpisode | null {
  const start = QUICK_BITE_EPISODES.findIndex((episode) => episode.slug === slug);
  if (start < 0) return null;
  for (const episode of QUICK_BITE_EPISODES.slice(start + 1)) {
    if (isQuickBiteEpisodePlayable(episode, canPlayLibrary)) return episode;
  }
  return null;
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
