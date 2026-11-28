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
  visualsPublicPrefix: string;
};

const TRIAL_LABEL = "Start 5-day free trial, no card required";

export { TRIAL_LABEL as PUBLIC_STUDY_GUIDE_TRIAL_LABEL };

export const PUBLIC_STUDY_GUIDES: Record<PublicStudyGuideId, PublicStudyGuide> = {
  nclex: {
    id: "nclex",
    path: "/nclex-study-guide",
    title: "NCLEX Study Guide 2026: Free Topics, No Login",
    description:
      "NCLEX study guide for the 2026 test plan: 85 to 150 items, five hours, and clinical judgment. Free to read, with no login. Independent of NCSBN.",
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
    title: "NAPLEX Study Guide 2026: Free Outline, No Login",
    description:
      "NAPLEX study guide 2026 from the NABP outline: 225 questions, six hours, and five domains. Free to read, with no login. Independent of NABP.",
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
    title: "AANP FNP Study Guide: Free Primary Care Plan",
    description:
      "AANP FNP study guide for nurse practitioner boards: Assess, Diagnose, Plan, and Evaluate across the lifespan. Free to read. No login is required.",
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
    title: "USMLE Study Guide: Step 1, Step 2 CK, and Step 3",
    description:
      "USMLE study guide for Step 1, Step 2 Clinical Knowledge, and Step 3. Free to read, no login, with a full book for each step. No passing score is quoted.",
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
    visualsPublicPrefix: "/usmle-study-guide/visuals/",
  },
  "npte-pt": {
    id: "npte-pt",
    path: "/npte-pt-study-guide",
    title: "NPTE Study Guide: Free FSBPT Outline, No Login",
    description:
      "NPTE study guide for physical therapy boards: 225 items, 180 scored, and the FSBPT body-system outline. Free to read. No login. No result is promised.",
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
    title: "USMLE Step 1 Study Guide: Free, No Login Needed",
    description:
      "USMLE Step 1 study guide for mechanisms, pathology, and pharmacology by organ system. Free to read, no login. No minimum passing score is quoted here.",
    contentDir: "content/usmle-study-guide/step-1",
    label: "Step 1",
  },
  {
    id: "step-2-ck",
    path: "/usmle-study-guide/step-2-ck",
    title: "USMLE Step 2 CK Study Guide: Free, No Login",
    description:
      "USMLE Step 2 CK study guide for diagnosis and next-step management across clerkship systems. Free to read. Clinical Knowledge, not the retired skills exam.",
    contentDir: "content/usmle-study-guide/step-2-ck",
    label: "Step 2 CK",
  },
  {
    id: "step-3",
    path: "/usmle-study-guide/step-3",
    title: "USMLE Step 3 Study Guide: Free Cases, No Login",
    description:
      "USMLE Step 3 study guide for ambulatory decisions, emergency care, and the case-simulation patterns in this book. Free to read, with no login required.",
    contentDir: "content/usmle-study-guide/step-3",
    label: "Step 3",
  },
] as const;

export { legacyStudyGuideRedirects } from "@/lib/study-guides/legacy-redirects";
