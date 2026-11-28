import { landingTrialHrefForExam } from "@/lib/landing/trial-href";

export type PublicStudyGuideId =
  | "nclex"
  | "naplex"
  | "pance"
  | "aanp-fnp"
  | "usmle"
  | "npte-pt";

export type PublicStudyGuide = {
  id: PublicStudyGuideId;
  path: string;
  title: string;
  description: string;
  /** Spelled-out board name for visible copy. */
  boardLabel: string;
  boardHref: string;
  resourcePath: string;
  resourceLabel: string;
  dailyHref: string;
  trialHref: string;
  photoBase: string;
  /** Markdown directories, relative to the repo. Empty when the page is built from structured outline data. */
  contentDirs: string[];
  /** When set, only these filename prefixes are loaded (the hub, not a whole book). */
  filePrefixes?: string[];
  visualsPublicPrefix: string;
};

const TRIAL_LABEL = "Start 5-day free trial, no card required";

export { TRIAL_LABEL as PUBLIC_STUDY_GUIDE_TRIAL_LABEL };

export const PUBLIC_STUDY_GUIDES: Record<PublicStudyGuideId, PublicStudyGuide> = {
  nclex: {
    id: "nclex",
    path: "/nclex-study-guide",
    title: "Free NCLEX Study Guide for the 2026 Test Plan",
    description:
      "Free NCLEX study guide for nursing boards: test-plan systems, clinical judgment, and cited rationales. No login required. Independent of NCSBN.",
    boardLabel: "nursing boards",
    boardHref: "/nclex",
    resourcePath: "/resources/nclex-study-guide-roadmap",
    resourceLabel: "NCLEX resources guide",
    dailyHref: "/daily/nclex",
    trialHref: landingTrialHrefForExam("nclex"),
    photoBase: "/images/marketing/heroes/nclex",
    contentDirs: ["content/nclex-study-guide"],
    visualsPublicPrefix: "/nclex-study-guide/visuals/",
  },
  naplex: {
    id: "naplex",
    path: "/naplex-study-guide",
    title: "Free NAPLEX Study Guide from the NABP Outline",
    description:
      "Free NAPLEX study guide for pharmacy boards: calculations, therapeutics, and the NABP content outline. No login required. Independent of NABP.",
    boardLabel: "pharmacy boards",
    boardHref: "/naplex",
    resourcePath: "/resources/naplex-study-guide-blueprint",
    resourceLabel: "NAPLEX resources guide",
    dailyHref: "/daily/naplex",
    trialHref: landingTrialHrefForExam("naplex"),
    photoBase: "/images/marketing/heroes/naplex",
    contentDirs: ["content/naplex-study-guide"],
    visualsPublicPrefix: "/naplex-study-guide/visuals/",
  },
  pance: {
    id: "pance",
    path: "/pance-study-guide",
    title: "Free PANCE Study Guide (2026): NCCPA Blueprint",
    description:
      "Free PANCE study guide for the NCCPA blueprint: 300 questions in five blocks, a $550 application fee, passing score 350, and study plans. Independent of NCCPA.",
    boardLabel: "physician assistant boards",
    boardHref: "/pance",
    resourcePath: "/resources/pance-study-guide-nccpa-blueprint",
    resourceLabel: "PANCE resources guide",
    dailyHref: "/daily/pance",
    trialHref: landingTrialHrefForExam("pance"),
    photoBase: "/images/marketing/heroes/pance",
    contentDirs: ["content/pance-study-guide"],
    visualsPublicPrefix: "/pance-study-guide/visuals/",
  },
  "aanp-fnp": {
    id: "aanp-fnp",
    path: "/aanp-fnp-study-guide",
    title: "Free AANP FNP Study Guide for Primary Care",
    description:
      "Free AANP FNP study guide for nurse practitioner boards: assessment, diagnosis, and primary care across the lifespan. No account is required.",
    boardLabel: "nurse practitioner boards",
    boardHref: "/aanp-fnp",
    resourcePath: "/resources/aanp-fnp-study-guide-blueprint",
    resourceLabel: "FNP resources guide",
    dailyHref: "/daily/aanp-fnp",
    trialHref: landingTrialHrefForExam("aanp-fnp"),
    photoBase: "/images/marketing/heroes/aanp-fnp",
    contentDirs: ["content/aanp-fnp-study-guide"],
    visualsPublicPrefix: "/aanp-fnp-study-guide/visuals/",
  },
  usmle: {
    id: "usmle",
    path: "/usmle-study-guide",
    title: "Free USMLE Study Guide for Step 1, 2 CK, and 3",
    description:
      "Free USMLE study guide for physician boards: how Step 1, Step 2 CK, and Step 3 are organized, with links into each full book. No login required.",
    boardLabel: "physician boards",
    boardHref: "/usmle",
    resourcePath: "/resources/usmle-step-2-study-guide-roadmap",
    resourceLabel: "USMLE resources guide",
    dailyHref: "/daily/usmle",
    trialHref: landingTrialHrefForExam("usmle"),
    photoBase: "/images/marketing/heroes/usmle",
    contentDirs: [
      "content/usmle-study-guide/step-1",
      "content/usmle-study-guide/step-2-ck",
      "content/usmle-study-guide/step-3",
    ],
    filePrefixes: ["00-", "17-"],
    visualsPublicPrefix: "/usmle-study-guide/visuals/",
  },
  "npte-pt": {
    id: "npte-pt",
    path: "/npte-pt-study-guide",
    title: "Free NPTE-PT Study Guide from the FSBPT Outline",
    description:
      "Free NPTE study guide for physical therapy boards: 225 items, 180 scored, and the FSBPT body-system outline. No account. Not a pass promise.",
    boardLabel: "physical therapy boards",
    boardHref: "/npte-pt",
    resourcePath: "/resources/npte-pt-study-guide-fsbpt-blueprint",
    resourceLabel: "NPTE resources guide",
    dailyHref: "/daily/npte-pt",
    trialHref: landingTrialHrefForExam("npte-pt"),
    photoBase: "/images/marketing/heroes/npte-pt",
    contentDirs: [],
    visualsPublicPrefix: "/npte-pt-study-guide/visuals/",
  },
};

export const PUBLIC_STUDY_GUIDE_LIST = Object.values(PUBLIC_STUDY_GUIDES);

export function publicStudyGuide(id: PublicStudyGuideId): PublicStudyGuide {
  return PUBLIC_STUDY_GUIDES[id];
}

export const USMLE_PUBLIC_STEPS = [
  {
    id: "step-1",
    path: "/usmle-study-guide/step-1",
    title: "Free USMLE Step 1 Study Guide",
    description:
      "Free USMLE Step 1 study guide: mechanisms, pathology, and pharmacology organized the way the exam is written. No account. Not a pass promise.",
    contentDir: "content/usmle-study-guide/step-1",
    label: "Step 1",
  },
  {
    id: "step-2-ck",
    path: "/usmle-study-guide/step-2-ck",
    title: "Free USMLE Step 2 CK Study Guide",
    description:
      "Free USMLE Step 2 CK study guide: diagnosis and next-step management across the clerkship systems. No login required. Clinical Knowledge, not CS.",
    contentDir: "content/usmle-study-guide/step-2-ck",
    label: "Step 2 CK",
  },
  {
    id: "step-3",
    path: "/usmle-study-guide/step-3",
    title: "Free USMLE Step 3 Study Guide",
    description:
      "Free USMLE Step 3 study guide: ambulatory care, emergency decisions, and the CCS-style cases in this book. No login required to read it here.",
    contentDir: "content/usmle-study-guide/step-3",
    label: "Step 3",
  },
] as const;

export { legacyStudyGuideRedirects } from "@/lib/study-guides/legacy-redirects";
