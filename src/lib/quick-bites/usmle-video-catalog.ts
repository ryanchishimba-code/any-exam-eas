/**
 * Quick Bites videos for the USMLE track.
 * Posters are public. MP4 and VTT stay in the private Blob store.
 * There is no free sample. Playback stays on the paid check.
 */

import type { QuickBiteEpisode } from "@/lib/quick-bites/catalog";
import { adjacentPlayableEpisode } from "@/lib/quick-bites/adjacent-playable";
import {
  USMLE_QUICK_BITE_STEP_CHOICES,
  isUsmleQuickBiteStep,
  type UsmleQuickBiteStep,
} from "@/lib/quick-bites/usmle-bite-shared";
import { USMLE_VIDEO_QUICK_BITES_PATH } from "@/lib/quick-bites/usmle-video-flags";

export const USMLE_VIDEO_QUICK_BITES_MEDIA_VERSION = "v1-20261121";
export const USMLE_VIDEO_WAVE2_MEDIA_VERSION = "v2-20261121";

type EpisodeSeed = {
  slug: string;
  number: number;
  title: string;
  duration: string;
  mediaVersion?: string;
  /** Step 1 is mechanism and basic science. Step 2 CK is the next clinical move. */
  examStep: "step-1" | "step-2-ck" | "step-3";
};

const EPISODES: EpisodeSeed[] = [
  {
    slug: "quick-bites-usmle-ep01-acid-base-tubule",
    number: 1,
    title: "Acid-Base, Potassium, and the Tubule",
    duration: "4:50",
    examStep: "step-1",
  },
  {
    slug: "quick-bites-usmle-ep02-glomeruli-ckd",
    number: 2,
    title: "Nephritic vs Nephrotic, Stones, and the Failing Kidney",
    duration: "4:02",
    examStep: "step-1",
  },
  {
    slug: "quick-bites-usmle-ep03-lungs",
    number: 3,
    title: "Lungs That Will Not Oxygenate",
    duration: "3:58",
    examStep: "step-1",
  },
  {
    slug: "quick-bites-usmle-ep04-anemias",
    number: 4,
    title: "Anemias and the Red Cell",
    duration: "3:48",
    examStep: "step-1",
  },
  {
    slug: "quick-bites-usmle-ep05-bleeding-cancers",
    number: 5,
    title: "Bleeding, Clots, and Blood Cancers",
    duration: "3:45",
    examStep: "step-1",
  },
  {
    slug: "quick-bites-usmle-ep06-brain-bleeds-cord",
    number: 6,
    title: "Blood in the Head, a Cut in the Cord",
    duration: "3:38",
    examStep: "step-1",
  },
  {
    slug: "quick-bites-usmle-ep07-neuro-drugs",
    number: 7,
    title: "Slow Nerves and Dangerous Drugs",
    duration: "3:47",
    examStep: "step-1",
  },
  {
    slug: "quick-bites-usmle-ep08-heart",
    number: 8,
    title: "Heart Failure, Murmurs, and a Long QT",
    duration: "3:55",
    examStep: "step-1",
  },
  {
    slug: "quick-bites-usmle-ep09-endocrine-dka",
    number: 9,
    title: "Adrenal, Pituitary, and Diabetic Ketoacidosis",
    duration: "4:16",
    examStep: "step-1",
  },
  {
    slug: "quick-bites-usmle-ep10-pregnancy-pelvis",
    number: 10,
    title: "Pregnancy Emergencies and the Pelvis",
    duration: "3:49",
    examStep: "step-1",
  },
  {
    slug: "quick-bites-usmle-ep11-joints-rashes-eye",
    number: 11,
    title: "Joints, Rashes, and an Eye at Risk",
    duration: "3:15",
    mediaVersion: USMLE_VIDEO_WAVE2_MEDIA_VERSION,
    examStep: "step-1",
  },
  {
    slug: "quick-bites-usmle-ep12-blisters-collagen-compartment",
    number: 12,
    title: "Blisters, Collagen, and a Tight Compartment",
    duration: "3:32",
    mediaVersion: USMLE_VIDEO_WAVE2_MEDIA_VERSION,
    examStep: "step-1",
  },
  {
    slug: "quick-bites-usmle-ep13-swallow-bowel-pancreas",
    number: 13,
    title: "Swallow, Bowel, and the Pancreas",
    duration: "3:25",
    mediaVersion: USMLE_VIDEO_WAVE2_MEDIA_VERSION,
    examStep: "step-1",
  },
  {
    slug: "quick-bites-usmle-ep14-liver-signatures",
    number: 14,
    title: "Four Liver Signatures",
    duration: "3:14",
    mediaVersion: USMLE_VIDEO_WAVE2_MEDIA_VERSION,
    examStep: "step-1",
  },
  {
    slug: "quick-bites-usmle-ep15-chromosomes-prostate",
    number: 15,
    title: "Chromosomes, the Prostate, and a Dangerous Mix",
    duration: "3:46",
    mediaVersion: USMLE_VIDEO_WAVE2_MEDIA_VERSION,
    examStep: "step-1",
  },
  {
    slug: "quick-bites-usmle-ep16-poisons-fat-embolus",
    number: 16,
    title: "Poisons, Small Pupils, and a Long-Bone Clue",
    duration: "3:39",
    mediaVersion: USMLE_VIDEO_WAVE2_MEDIA_VERSION,
    examStep: "step-2-ck",
  },
  {
    slug: "quick-bites-usmle-ep17-tests-prevalence",
    number: 17,
    title: "When the Test Changes With the Room",
    duration: "3:26",
    mediaVersion: USMLE_VIDEO_WAVE2_MEDIA_VERSION,
    examStep: "step-1",
  },
  {
    slug: "quick-bites-usmle-ep18-consent-decisions",
    number: 18,
    title: "Consent, Secrets, and a Decision That Is Theirs",
    duration: "3:31",
    mediaVersion: USMLE_VIDEO_WAVE2_MEDIA_VERSION,
    examStep: "step-2-ck",
  },
  {
    slug: "quick-bites-usmle-ep19-minutes-in-the-head",
    number: 19,
    title: "Minutes in the Head",
    duration: "3:45",
    mediaVersion: USMLE_VIDEO_WAVE2_MEDIA_VERSION,
    examStep: "step-2-ck",
  },
  {
    slug: "quick-bites-usmle-ep20-acs-afib",
    number: 20,
    title: "The Clock in the Chest, and a Rhythm That Clots",
    duration: "3:48",
    mediaVersion: USMLE_VIDEO_WAVE2_MEDIA_VERSION,
    examStep: "step-2-ck",
  },
];

export const USMLE_VIDEO_QUICK_BITE_EPISODES: QuickBiteEpisode[] = EPISODES.map((episode) => ({
  ...episode,
  group: "USMLE",
  mediaVersion: episode.mediaVersion ?? USMLE_VIDEO_QUICK_BITES_MEDIA_VERSION,
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

export const USMLE_VIDEO_STEP_STORAGE_KEY = "aee-usmle-video-step";

export function usmleVideoStepLabel(step: UsmleQuickBiteStep): string {
  return USMLE_QUICK_BITE_STEP_CHOICES.find((choice) => choice.id === step)?.label ?? "Step 1";
}

export function usmleVideoEpisodesForStep(step: UsmleQuickBiteStep): QuickBiteEpisode[] {
  return USMLE_VIDEO_QUICK_BITE_EPISODES.filter((episode) => episode.examStep === step);
}

export function usmleVideoStepFromQuery(step: string | undefined | null): UsmleQuickBiteStep | null {
  if (!step?.trim()) return null;
  return USMLE_QUICK_BITE_STEP_CHOICES.find((choice) => choice.query === step.trim())?.id ?? null;
}

export function usmleVideoStepHref(step: UsmleQuickBiteStep): string {
  const choice = USMLE_QUICK_BITE_STEP_CHOICES.find((item) => item.id === step);
  if (!choice || choice.query === "1") return USMLE_VIDEO_QUICK_BITES_PATH;
  return `${USMLE_VIDEO_QUICK_BITES_PATH}?step=${choice.query}`;
}

export function rememberedUsmleVideoStep(stored: string | null | undefined): UsmleQuickBiteStep {
  return stored && isUsmleQuickBiteStep(stored) ? stored : "step-1";
}
