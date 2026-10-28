import type { Metadata } from "next";
import { TRIAL_DAYS } from "@/lib/billing-config";
import {
  formatBoardQuestionSentence,
  formatExactQuestionCount,
  scoredQuestionCount,
  type BoardQuestionUnits,
} from "@/lib/counts";
import type { LandingSuccessStory } from "@/lib/landing/content";
import { landingTrialHrefForExam } from "@/lib/landing/trial-href";
import { boardFeatureCardsForExam } from "@/lib/marketing/board-landing/board-features";
import {
  BOARD_LANDING_FINAL_HEADING,
  boardLandingBreadcrumbName,
} from "@/lib/marketing/board-landing/board-landing-copy";
import { withBoardHeroMarketing } from "@/lib/marketing/board-landing/board-hero-marketing";
import {
  boardHeroChips,
  boardHeroOffer,
  boardLandingTrustPills,
} from "@/lib/marketing/board-landing/hero";
import type { BoardLandingModel } from "@/lib/marketing/board-landing/model";
import { openBoardQuickBite } from "@/lib/marketing/board-landing/model";
import { CLINICAL_REVIEWERS, clinicalReviewerForExam } from "@/lib/marketing/company";
import { homeTrialCtaLabel } from "@/lib/marketing/home-cta";
import { landingTestimonialStories } from "@/lib/testimonials/landing-stories";
import { EXAM_NAV_ITEMS, ROUTES } from "@/lib/routes";
import { absoluteUrl, dedupeKeywords, getSiteUrl } from "@/lib/seo";
import { landingOgImage } from "@/lib/seo/landing-og-image";
import { examMarketingPath, type ExamSeoKey } from "@/lib/seo/exam-config";
import { enforceMetaDescription, enforceMetaTitle } from "@/lib/seo/meta-budget";
import {
  BOARD_LANDING_CONTENT_YEAR,
  boardLandingBaseGraph,
  freeBoardMetaTitle,
} from "@/lib/marketing/board-landing/board-schema";
import {
  boardPainPoints,
  boardThemeClass,
  buildBoardVisuals,
  formatHeroCtaMicrocopy,
  heroWhyUs,
  type BoardSlug,
} from "@/lib/marketing/board-landing/board-theme";
import {
  SITE_NAME,
  formatLandingTrialFaqAnswer,
  formatMonthlyPrice,
} from "@/lib/site";
import { qotdPath } from "@/lib/demo/qotd-public";
import { getStudyGuideConfig } from "@/lib/nclex-study-guide/guide-registry";

const HUB_EXAM_KEYS = ["usmle", "pance", "aanp-fnp", "npte-pt"] as const;
export type HubExamKey = (typeof HUB_EXAM_KEYS)[number];

export function isHubExamKey(key: ExamSeoKey): key is HubExamKey {
  return (HUB_EXAM_KEYS as readonly string[]).includes(key);
}

type HubCopy = {
  chipMiddle: string;
  chipThird: string;
  questionNoun: string;
  metaBoardLabel: string;
  metaDescription: string;
  keywords: string[];
};

const HUB_META_LABEL: Record<HubExamKey, string> = {
  usmle: "USMLE",
  pance: "PANCE",
  "aanp-fnp": "AANP FNP",
  "npte-pt": "NPTE-PT",
};

const HUB_COPY: Record<HubExamKey, HubCopy> = {
  usmle: {
    chipMiddle: "Step 1, Step 2 CK, and Step 3 banks with teachable rationales.",
    chipThird: "Anatomy Explorer, timed blocks, and readiness score — one Pro plan.",
    questionNoun: "USMLE questions",
    metaBoardLabel: HUB_META_LABEL.usmle,
    metaDescription: `USMLE practice questions for Step 1, Step 2 CK, and Step 3 in one qbank. Try a free sample question. Pro is ${formatMonthlyPrice("pro")}/mo after a ${TRIAL_DAYS}-day trial. Cancel anytime.`,
    keywords: [
      "USMLE practice questions",
      "USMLE Step 2 CK practice",
      "USMLE question bank",
      "how to pass USMLE Step 2",
      "free USMLE practice question",
    ],
  },
  pance: {
    chipMiddle: "Board-style vignettes with teachable rationales and an included study guide.",
    chipThird: "Timed practice, readiness score, and six boards on one plan.",
    questionNoun: "PANCE questions",
    metaBoardLabel: HUB_META_LABEL.pance,
    metaDescription: `PANCE practice questions and physician assistant board prep in a live qbank. Try a free sample question. Pro is ${formatMonthlyPrice("pro")}/mo after a ${TRIAL_DAYS}-day trial.`,
    keywords: [
      "PANCE practice questions",
      "PANCE qbank",
      "physician assistant board prep",
      "how to pass PANCE first try",
      "free PANCE practice question",
    ],
  },
  "aanp-fnp": {
    chipMiddle: "FNP vignettes with teachable rationales and an included study guide.",
    chipThird: "Question of the Day, readiness score, and timed full exams.",
    questionNoun: "AANP FNP questions",
    metaBoardLabel: HUB_META_LABEL["aanp-fnp"],
    metaDescription: `AANP FNP practice questions, nurse practitioner vignettes, and study guide chapters. Try a free sample. Pro is ${formatMonthlyPrice("pro")}/mo after a ${TRIAL_DAYS}-day trial.`,
    keywords: [
      "AANP FNP practice questions",
      "FNP certification prep",
      "nurse practitioner qbank",
      "how to pass AANP FNP",
      "free FNP practice question",
    ],
  },
  "npte-pt": {
    chipMiddle: "Physical therapy items with explanations for each answer choice.",
    chipThird: "Anatomy Explorer, timed sets, and six boards on Pro.",
    questionNoun: "NPTE-PT questions",
    metaBoardLabel: HUB_META_LABEL["npte-pt"],
    metaDescription: `NPTE-PT practice questions and physical therapy board prep in a live qbank. Try a free sample question. Pro is ${formatMonthlyPrice("pro")}/mo after a ${TRIAL_DAYS}-day trial.`,
    keywords: [
      "NPTE practice questions",
      "NPTE-PT qbank",
      "physical therapy board prep",
      "how to pass NPTE first try",
      "free NPTE practice question",
    ],
  },
};

function liveUnits(units: BoardQuestionUnits | null, degraded: boolean): BoardQuestionUnits | null {
  if (degraded || !units) return null;
  if (scoredQuestionCount(units) <= 0) return null;
  return units;
}

function hubFaqs(
  examKey: HubExamKey,
  units: BoardQuestionUnits | null
): { question: string; answer: string }[] {
  const boardLabel = boardLandingBreadcrumbName(examKey);
  const price = formatMonthlyPrice("pro");
  const howMany = units
    ? `The live bank currently serves ${formatBoardQuestionSentence(units)} for ${boardLabel}.`
    : "We show the live total on this page when the bank lookup succeeds; we do not guess a number.";
  const base = [
    {
      question: `How many ${boardLabel} practice questions are included?`,
      answer: howMany,
    },
    {
      question: "How much does prep cost?",
      answer: `Pro is ${price}/mo for ${boardLabel} plus five other boards after your ${TRIAL_DAYS}-day free trial.`,
    },
    {
      question: "Is there a free trial?",
      answer: formatLandingTrialFaqAnswer(),
    },
    {
      question: "Are rationales included?",
      answer:
        "Keyed answer, distractor reasons, and cited sources on scored bank items.",
    },
  ];
  if (examKey === "usmle") {
    base.unshift({
      question: "Does this cover all USMLE steps?",
      answer:
        "Yes. One Pro plan includes Step 1, Step 2 CK, and Step 3 question banks with step-specific practice.",
    });
  }
  if (examKey === "aanp-fnp") {
    base.push({
      question: "Is there an FNP study guide?",
      answer: "Yes. Blueprint-aligned study guide chapters are included with Pro.",
    });
  }
  if (examKey === "pance") {
    base.push({
      question: "Is there a PANCE study guide?",
      answer: "Yes. Blueprint-aligned study guide chapters are included with Pro.",
    });
  }
  return base.slice(0, 5);
}

export function buildHubLandingMetadata(examKey: HubExamKey): Metadata {
  const copy = HUB_COPY[examKey];
  const path = examMarketingPath(examKey);
  const title = enforceMetaTitle(freeBoardMetaTitle(copy.metaBoardLabel), path);
  const description = enforceMetaDescription(copy.metaDescription, path);
  const image = landingOgImage(examKey);
  return {
    title: { absolute: title },
    description,
    metadataBase: new URL(getSiteUrl()),
    alternates: { canonical: path },
    keywords: dedupeKeywords(copy.keywords),
    openGraph: {
      type: "website",
      locale: "en_US",
      url: absoluteUrl(path),
      siteName: SITE_NAME,
      title,
      description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
  };
}

export function buildHubLandingModel(input: {
  examKey: HubExamKey;
  degraded: boolean;
  units: BoardQuestionUnits | null;
  testimonials?: LandingSuccessStory[];
  usmleStepCounts?: Partial<Record<"step1" | "step2" | "step3", number>>;
}): BoardLandingModel {
  const copy = HUB_COPY[input.examKey];
  const boardLabel = boardLandingBreadcrumbName(input.examKey);
  const units = liveUnits(input.units, input.degraded);
  const path = examMarketingPath(input.examKey);
  const trialHref = landingTrialHrefForExam(input.examKey);
  const price = formatMonthlyPrice("pro");
  const heroOffer = boardHeroOffer(input.examKey, units, { questionNoun: copy.questionNoun });
  const heroChips = boardHeroChips(heroOffer, copy.chipMiddle, copy.chipThird);
  const quickBite =
    input.examKey === "pance"
      ? openBoardQuickBite("pance")
      : input.examKey === "aanp-fnp"
        ? openBoardQuickBite("fnp")
        : null;
  const features = boardFeatureCardsForExam(input.examKey, {
    degraded: input.degraded,
    units,
    bankTypes: {},
    quickBite,
    usmleStepCounts: input.usmleStepCounts,
  });
  const faqs = hubFaqs(input.examKey, units);
  const nav = EXAM_NAV_ITEMS.find((item) => item.slug === input.examKey);
  const reviewer = clinicalReviewerForExam(input.examKey);
  const guide = getStudyGuideConfig(input.examKey);
  const links = [
    { href: nav?.practiceHref ?? `/practice/${input.examKey}`, label: `${boardLabel} practice` },
    { href: qotdPath(input.examKey), label: "Question of the Day" },
    { href: ROUTES.pricing, label: "Pricing" },
    ...(guide ? [{ href: guide.routeBase, label: `${boardLabel} study guide` }] : []),
    { href: ROUTES.howQuestionsAreReviewed, label: "How questions are reviewed" },
  ];
  const stats: { value: string; label: string }[] = [];
  if (units) {
    stats.push({ value: formatExactQuestionCount(scoredQuestionCount(units)), label: "Questions" });
  }
  if (input.examKey === "usmle" && input.usmleStepCounts) {
    const stepLabels: { key: "step1" | "step2" | "step3"; label: string }[] = [
      { key: "step1", label: "Step 1" },
      { key: "step2", label: "Step 2 CK" },
      { key: "step3", label: "Step 3" },
    ];
    for (const step of stepLabels) {
      const count = input.usmleStepCounts[step.key] ?? 0;
      if (count > 0) {
        stats.push({ value: formatExactQuestionCount(count), label: step.label });
      }
    }
  }
  const graph = boardLandingBaseGraph({
    pagePath: path,
    breadcrumbName: boardLabel,
    pageName: enforceMetaTitle(freeBoardMetaTitle(copy.metaBoardLabel), path),
    productDescription: `${boardLabel} practice questions and five other boards on one plan at ${price}/mo.`,
    trialHref,
    faqs,
  });
  const hubSlug = input.examKey as BoardSlug;
  const visuals = buildBoardVisuals({
    slug: hubSlug,
    examKey: input.examKey,
    units,
    offer: heroOffer,
    bankTypes: {},
  });
  return withBoardHeroMarketing(hubSlug, {
    h1Lead: "",
    h1Accent: "",
    lede: "Start your free trial, then drill the live bank with teachable rationales.",
    trialHref,
    trialLabel: homeTrialCtaLabel(),
    trust: boardLandingTrustPills(),
    heroOffer,
    heroChips,
    proofPoints: [],
    features,
    stats,
    countLine: null,
    priceHeading: "Simple pricing.",
    priceLede: `${price}/mo for ${boardLabel} and five other boards after your ${TRIAL_DAYS}-day trial.`,
    prices: [
      {
        id: "ours",
        label: "AnyExamEasy Pro",
        amount: `${price}/mo`,
        detail: `${TRIAL_DAYS}-day free trial · cancel anytime`,
        featured: true,
      },
    ],
    sample: null,
    formatHeading: "",
    formatLede: "",
    formats: [],
    quickBite,
    reviewers: reviewer
      ? [
          {
            id: reviewer.id,
            name: reviewer.displayName,
            role: reviewer.role,
            initials: reviewer.initials,
            background: reviewer.avatar.background,
            color: reviewer.avatar.color,
          },
        ]
      : CLINICAL_REVIEWERS.slice(0, 2).map((row) => ({
          id: row.id,
          name: row.displayName,
          role: row.role,
          initials: row.initials,
          background: row.avatar.background,
          color: row.avatar.color,
        })),
    stories: landingTestimonialStories(input.testimonials ?? [], input.examKey),
    storyNote: "",
    faqs,
    links,
    finalHeading: BOARD_LANDING_FINAL_HEADING,
    finalLede: "No payment method required.",
    boardName: boardLabel,
    sampleKicker: `Free ${boardLabel} practice question`,
    explainedTitle: `Sample ${boardLabel} question`,
    statsLabel: `Live ${boardLabel} bank counts`,
    linksHeading: `More ${boardLabel} practice`,
    formatAnchor: "formats",
    sceneKicker: `${boardLabel} case`,
    sceneIdPrefix: input.examKey.replace(/[^a-z0-9]/g, "-"),
    heroCtaName: `${input.examKey.replace(/-/g, "_")}_hero_trial`,
    heroCtaLocation: `${input.examKey}_hero`,
    finalCtaName: `${input.examKey.replace(/-/g, "_")}_final_trial`,
    finalCtaLocation: `${input.examKey}_final`,
    themeClass: boardThemeClass(hubSlug),
    heroWhyUs: heroWhyUs(hubSlug),
    heroTestimonial: null,
    ctaMicrocopy: formatHeroCtaMicrocopy(heroOffer.liveQuestions),
    contentYear: BOARD_LANDING_CONTENT_YEAR,
    painPoints: boardPainPoints(hubSlug),
    visuals,
    sampleSecondary: null,
    jsonLd: { "@context": "https://schema.org", "@graph": graph },
  });
}

/** Bank field id for inventory lookups on each hub exam. */
export function hubSampleFieldId(examKey: HubExamKey): string {
  return EXAM_NAV_ITEMS.find((item) => item.slug === examKey)?.fieldId ?? examKey;
}
