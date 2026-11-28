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
export const USMLE_VIDEO_WAVE3_MEDIA_VERSION = "v3-20261121";
export const USMLE_VIDEO_WAVE4_MEDIA_VERSION = "v4-20261121";

type EpisodeSeed = {
  slug: string;
  number: number;
  title: string;
  duration: string;
  mediaVersion?: string;
  /** Step 1 is mechanism and basic science. Step 2 CK is the next clinical move. */
  examStep: "step-1" | "step-2-ck" | "step-3";
  /** Hidden from students. Staff can open it only while the release flag is off. */
  held?: boolean;
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
  {
    slug: "quick-bites-usmle-ep21-glucose-calcium-cortisol",
    number: 21,
    title: "Glucose Crosses, Insulin Does Not",
    duration: "3:20",
    mediaVersion: USMLE_VIDEO_WAVE3_MEDIA_VERSION,
    examStep: "step-1",
  },
  {
    slug: "quick-bites-usmle-ep22-gram-positive-hepatitis",
    number: 22,
    title: "The Gram-Positive Tree, and Two Hepatitis Stories",
    duration: "3:35",
    mediaVersion: USMLE_VIDEO_WAVE3_MEDIA_VERSION,
    examStep: "step-1",
  },
  {
    slug: "quick-bites-usmle-ep23-do-not-wait-until-morning",
    number: 23,
    title: "Do Not Wait Until Morning",
    duration: "3:39",
    mediaVersion: USMLE_VIDEO_WAVE3_MEDIA_VERSION,
    examStep: "step-3",
  },
  {
    slug: "quick-bites-usmle-ep24-belly-emergencies",
    number: 24,
    title: "A Quiet Belly That Is an Emergency",
    duration: "4:01",
    mediaVersion: USMLE_VIDEO_WAVE3_MEDIA_VERSION,
    examStep: "step-2-ck",
  },
  {
    slug: "quick-bites-usmle-ep25-blood-emergencies",
    number: 25,
    title: "Blood Emergencies That Cannot Wait",
    duration: "3:17",
    mediaVersion: USMLE_VIDEO_WAVE3_MEDIA_VERSION,
    examStep: "step-2-ck",
  },
  {
    slug: "quick-bites-usmle-ep26-airway-pneumonia-embolus",
    number: 26,
    title: "The Inhaler, the Pneumonia, and a Clot in the Lung",
    duration: "3:25",
    mediaVersion: USMLE_VIDEO_WAVE3_MEDIA_VERSION,
    examStep: "step-2-ck",
  },
  {
    slug: "quick-bites-usmle-ep27-preeclampsia-adrenal-gdm",
    number: 27,
    title: "Pressure in Pregnancy, a Crisis, and Sugar",
    duration: "3:14",
    mediaVersion: USMLE_VIDEO_WAVE3_MEDIA_VERSION,
    examStep: "step-2-ck",
  },
  {
    slug: "quick-bites-usmle-ep28-screens-when-to-stop",
    number: 28,
    title: "Screens You Order — and When You Stop",
    duration: "3:09",
    mediaVersion: USMLE_VIDEO_WAVE3_MEDIA_VERSION,
    examStep: "step-3",
  },
  {
    slug: "quick-bites-usmle-ep29-discharge-orders",
    number: 29,
    title: "What You Write Before They Leave",
    duration: "3:07",
    mediaVersion: USMLE_VIDEO_WAVE3_MEDIA_VERSION,
    examStep: "step-3",
  },
  {
    slug: "quick-bites-usmle-ep30-safety-ethics-practice",
    number: 30,
    title: "A Report, a Colleague, and a Note You Write Now",
    duration: "3:07",
    mediaVersion: USMLE_VIDEO_WAVE3_MEDIA_VERSION,
    examStep: "step-3",
  },
  {
    slug: "quick-bites-usmle-ep31-fever-too-young",
    number: 31,
    title: "A Fever Too Young to Send Home",
    duration: "3:56",
    mediaVersion: USMLE_VIDEO_WAVE4_MEDIA_VERSION,
    examStep: "step-2-ck",
    held: true,
  },
  {
    slug: "quick-bites-usmle-ep32-next-psych-medicine",
    number: 32,
    title: "The Next Psych Medicine, and Who Cannot Wait",
    duration: "3:24",
    mediaVersion: USMLE_VIDEO_WAVE4_MEDIA_VERSION,
    examStep: "step-2-ck",
    held: true,
  },
  {
    slug: "quick-bites-usmle-ep33-four-pillars-weak-pump",
    number: 33,
    title: "Four Pillars for a Weak Pump",
    duration: "3:35",
    mediaVersion: USMLE_VIDEO_WAVE4_MEDIA_VERSION,
    examStep: "step-2-ck",
    held: true,
  },
  {
    slug: "quick-bites-usmle-ep34-bleed-after-baby",
    number: 34,
    title: "A Bleed After the Baby",
    duration: "3:30",
    mediaVersion: USMLE_VIDEO_WAVE4_MEDIA_VERSION,
    examStep: "step-2-ck",
    held: true,
  },
  {
    slug: "quick-bites-usmle-ep35-potassium-and-dialysis",
    number: 35,
    title: "Potassium You Treat Now, and When You Dialyze",
    duration: "3:21",
    mediaVersion: USMLE_VIDEO_WAVE4_MEDIA_VERSION,
    examStep: "step-2-ck",
    held: true,
  },
  {
    slug: "quick-bites-usmle-ep36-calories-change-plan",
    number: 36,
    title: "Calories That Change the Plan",
    duration: "3:25",
    mediaVersion: USMLE_VIDEO_WAVE4_MEDIA_VERSION,
    examStep: "step-2-ck",
    held: true,
  },
  {
    slug: "quick-bites-usmle-ep37-soft-tissue-and-hip",
    number: 37,
    title: "A Dying Soft Tissue, and a Hip That Broke",
    duration: "3:18",
    mediaVersion: USMLE_VIDEO_WAVE4_MEDIA_VERSION,
    examStep: "step-2-ck",
    held: true,
  },
  {
    slug: "quick-bites-usmle-ep38-first-hour-of-sepsis",
    number: 38,
    title: "The First Hour of Sepsis",
    duration: "3:18",
    mediaVersion: USMLE_VIDEO_WAVE4_MEDIA_VERSION,
    examStep: "step-2-ck",
    held: true,
  },
  {
    slug: "quick-bites-usmle-ep39-sugar-and-thyroid-storm",
    number: 39,
    title: "Sugar You Manage for Years, and a Thyroid That Storms",
    duration: "3:22",
    mediaVersion: USMLE_VIDEO_WAVE4_MEDIA_VERSION,
    examStep: "step-2-ck",
    held: true,
  },
  {
    slug: "quick-bites-usmle-ep40-birth-control-and-bleeding",
    number: 40,
    title: "Birth Control by Risk, and Bleeding That Is New",
    duration: "3:17",
    mediaVersion: USMLE_VIDEO_WAVE4_MEDIA_VERSION,
    examStep: "step-2-ck",
    held: true,
  },
  {
    slug: "quick-bites-usmle-ep41-abstract-and-advertisement",
    number: 41,
    title: "The Abstract, and the Advertisement",
    duration: "3:05",
    mediaVersion: USMLE_VIDEO_WAVE4_MEDIA_VERSION,
    examStep: "step-3",
    held: true,
  },
  {
    slug: "quick-bites-usmle-ep42-pressure-and-aspirin",
    number: 42,
    title: "Pressure You Treat for Years, and an Aspirin You Often Hold",
    duration: "3:09",
    mediaVersion: USMLE_VIDEO_WAVE4_MEDIA_VERSION,
    examStep: "step-3",
    held: true,
  },
  {
    slug: "quick-bites-usmle-ep43-first-orders-clock",
    number: 43,
    title: "First Orders, Then Advance the Clock",
    duration: "3:12",
    mediaVersion: USMLE_VIDEO_WAVE4_MEDIA_VERSION,
    examStep: "step-3",
    held: true,
  },
  {
    slug: "quick-bites-usmle-ep44-vitamin-and-feed",
    number: 44,
    title: "The Vitamin You Give First, and a Feed You Start",
    duration: "3:19",
    mediaVersion: USMLE_VIDEO_WAVE4_MEDIA_VERSION,
    examStep: "step-3",
    held: true,
  },
  {
    slug: "quick-bites-usmle-ep45-after-the-stroke",
    number: 45,
    title: "After the Stroke, the Pill That Prevents the Next",
    duration: "3:41",
    mediaVersion: USMLE_VIDEO_WAVE4_MEDIA_VERSION,
    examStep: "step-3",
    held: true,
  },
  {
    slug: "quick-bites-usmle-ep46-nodule-and-oxygen",
    number: 46,
    title: "A Nodule in the Lung, and Oxygen You Send Home",
    duration: "3:36",
    mediaVersion: USMLE_VIDEO_WAVE4_MEDIA_VERSION,
    examStep: "step-3",
    held: true,
  },
  {
    slug: "quick-bites-usmle-ep47-first-prenatal-visit",
    number: 47,
    title: "The First Prenatal Visit, and a Shot You Must Not Miss",
    duration: "3:44",
    mediaVersion: USMLE_VIDEO_WAVE4_MEDIA_VERSION,
    examStep: "step-3",
    held: true,
  },
  {
    slug: "quick-bites-usmle-ep48-breast-lump",
    number: 48,
    title: "A Breast Lump You Work Up Now",
    duration: "3:57",
    mediaVersion: USMLE_VIDEO_WAVE4_MEDIA_VERSION,
    examStep: "step-3",
    held: true,
  },
  {
    slug: "quick-bites-usmle-ep49-disclose-the-error",
    number: 49,
    title: "An Error You Disclose, and a System You Fix",
    duration: "3:39",
    mediaVersion: USMLE_VIDEO_WAVE4_MEDIA_VERSION,
    examStep: "step-3",
    held: true,
  },
  {
    slug: "quick-bites-usmle-ep50-floor-to-icu",
    number: 50,
    title: "When the Floor Patient Needs the ICU",
    duration: "3:10",
    mediaVersion: USMLE_VIDEO_WAVE4_MEDIA_VERSION,
    examStep: "step-3",
    held: true,
  },
  {
    slug: "quick-bites-usmle-ep51-hepatitis-and-polyp",
    number: 51,
    title: "The Next Hepatitis Decision, and a Polyp's Interval",
    duration: "3:50",
    mediaVersion: USMLE_VIDEO_WAVE4_MEDIA_VERSION,
    examStep: "step-3",
    held: true,
  },
  {
    slug: "quick-bites-usmle-ep52-blood-thinner",
    number: 52,
    title: "A Blood Thinner You Adjust, and When You Stop",
    duration: "3:57",
    mediaVersion: USMLE_VIDEO_WAVE4_MEDIA_VERSION,
    examStep: "step-3",
    held: true,
  },
  {
    slug: "quick-bites-usmle-ep53-mood-and-use",
    number: 53,
    title: "A Mood You Follow, and a Use Disorder You Treat",
    duration: "3:35",
    mediaVersion: USMLE_VIDEO_WAVE4_MEDIA_VERSION,
    examStep: "step-3",
    held: true,
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

export function usmleVideoEpisodesForStep(
  step: UsmleQuickBiteStep,
  includeHeld = false
): QuickBiteEpisode[] {
  return USMLE_VIDEO_QUICK_BITE_EPISODES.filter(
    (episode) => episode.examStep === step && (includeHeld || episode.held !== true)
  );
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
