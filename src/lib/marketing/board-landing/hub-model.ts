import type { Metadata } from "next";
import { TRIAL_DAYS, TRIAL_LIFETIME_QUESTIONS } from "@/lib/billing-config";
import { formatPlanUsd } from "@/lib/billing-plans";
import {
  formatBoardQuestionSentence,
  formatExactQuestionCount,
  scoredQuestionCount,
  type BoardQuestionUnits,
} from "@/lib/counts";
import type { LandingSuccessStory } from "@/lib/landing/content";
import { landingTrialHrefForExam } from "@/lib/landing/trial-href";
import { boardFeatureCardsForExam } from "@/lib/marketing/board-landing/board-features";
import { boardHeroChips, boardHeroOffer } from "@/lib/marketing/board-landing/hero";
import {
  landingQuestionFromPublic,
  type BoardLandingModel,
  type LandingQuestion,
} from "@/lib/marketing/board-landing/model";
import { typicalPrepForExam } from "@/lib/marketing/board-landing/typical-prep";
import { CLINICAL_REVIEWERS, clinicalReviewerForExam } from "@/lib/marketing/company";
import type { PublicSampleQuestion } from "@/lib/marketing/public-sample";
import { homeTrialCtaLabel } from "@/lib/marketing/home-cta";
import { EXAM_NAV_ITEMS, ROUTES } from "@/lib/routes";
import {
  DEFAULT_OG_IMAGE_HEIGHT,
  DEFAULT_OG_IMAGE_PATH,
  DEFAULT_OG_IMAGE_WIDTH,
  absoluteUrl,
  dedupeKeywords,
  getSiteUrl,
} from "@/lib/seo";
import { getExamSeoConfig, examMarketingPath, type ExamSeoKey } from "@/lib/seo/exam-config";
import { enforceMetaDescription, enforceMetaTitle } from "@/lib/seo/meta-budget";
import { LEGAL_ENTITY, organizationContactPoint } from "@/lib/legal";
import { SITE_NAME, formatMonthlyPrice } from "@/lib/site";
import { TIER_MONTHLY_USD } from "@/lib/subscription-tiers";
import { qotdPath } from "@/lib/demo/qotd-public";

const HUB_EXAM_KEYS = ["usmle", "pance", "aanp-fnp", "npte-pt"] as const;
export type HubExamKey = (typeof HUB_EXAM_KEYS)[number];

export function isHubExamKey(key: ExamSeoKey): key is HubExamKey {
  return (HUB_EXAM_KEYS as readonly string[]).includes(key);
}

type HubCopy = {
  h1Lead: string;
  h1Accent: string;
  chipMiddle: string;
  chipThird: string;
  questionNoun: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
};

const HUB_COPY: Record<HubExamKey, HubCopy> = {
  usmle: {
    h1Lead: "Pass USMLE steps on your",
    h1Accent: "first try.",
    chipMiddle: "Step 1, Step 2 CK, and Step 3 banks with teachable rationales.",
    chipThird: "Anatomy Explorer, timed blocks, and readiness score—one Pro plan.",
    questionNoun: "USMLE questions",
    metaTitle: "USMLE Practice Questions for Step 1, Step 2 CK & Step 3",
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
    h1Lead: "Pass the PANCE on your",
    h1Accent: "first try.",
    chipMiddle: "Board-style vignettes with keyed answers and distractor reasons.",
    chipThird: "Timed practice, readiness score, and six boards on one plan.",
    questionNoun: "PANCE questions",
    metaTitle: "PANCE Practice Questions and Physician Assistant Qbank",
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
    h1Lead: "Pass the AANP FNP on your",
    h1Accent: "first try.",
    chipMiddle: "FNP vignettes with teachable rationales and an included study guide.",
    chipThird: "Question of the Day, readiness score, and timed full exams.",
    questionNoun: "AANP FNP questions",
    metaTitle: "AANP FNP Practice Questions and Nurse Practitioner Qbank",
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
    h1Lead: "Pass the NPTE-PT on your",
    h1Accent: "first try.",
    chipMiddle: "Physical therapy items with explanations for each answer choice.",
    chipThird: "Anatomy Explorer, timed sets, and six boards on Pro.",
    questionNoun: "NPTE-PT questions",
    metaTitle: "NPTE-PT Practice Questions and Physical Therapy Qbank",
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

function sampleForExam(sample: PublicSampleQuestion | null): LandingQuestion | null {
  if (!sample) return null;
  return landingQuestionFromPublic(sample);
}

function hubFaqs(
  examKey: HubExamKey,
  units: BoardQuestionUnits | null,
  config: ReturnType<typeof getExamSeoConfig>
): { question: string; answer: string }[] {
  const price = formatMonthlyPrice("pro");
  const typical = typicalPrepForExam(examKey);
  const typicalLabel = formatPlanUsd(typical.amountUsd);
  const howMany = units
    ? `The live bank currently serves ${formatBoardQuestionSentence(units)} for ${config.shortName}.`
    : "We show the live total on this page when the bank lookup succeeds; we do not guess a number.";
  const base = [
    {
      question: `How many ${config.shortName} practice questions are included?`,
      answer: howMany,
    },
    {
      question: "How much does prep cost?",
      answer: `Pro is ${price}/mo for ${config.shortName} plus five other boards. Typical ${typical.periodLabel} we checked lists around ${typicalLabel} (as of ${typical.asOf}).`,
    },
    {
      question: "Is there a free trial?",
      answer: `Start a ${TRIAL_DAYS}-day trial with ${TRIAL_LIFETIME_QUESTIONS} practice questions. No payment method required; cancel in Settings anytime.`,
    },
    {
      question: "Are rationales included?",
      answer:
        "Every scored item shows the keyed answer and a short reason for each distractor when one is stored.",
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
  return base.slice(0, 6);
}

export function buildHubLandingMetadata(examKey: HubExamKey): Metadata {
  const copy = HUB_COPY[examKey];
  const path = examMarketingPath(examKey);
  const title = enforceMetaTitle(copy.metaTitle, path);
  const description = enforceMetaDescription(copy.metaDescription, path);
  const image = absoluteUrl(DEFAULT_OG_IMAGE_PATH);
  const imageAlt = `AnyExamEasy ${copy.metaTitle}`;
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
      images: [{ url: image, width: DEFAULT_OG_IMAGE_WIDTH, height: DEFAULT_OG_IMAGE_HEIGHT, alt: imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
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
  sample: PublicSampleQuestion | null;
  usmleStepCounts?: Partial<Record<"step1" | "step2" | "step3", number>>;
}): BoardLandingModel {
  const config = getExamSeoConfig(input.examKey);
  const copy = HUB_COPY[input.examKey];
  const units = liveUnits(input.units, input.degraded);
  const path = examMarketingPath(input.examKey);
  const pageUrl = absoluteUrl(path);
  const site = getSiteUrl();
  const trialHref = landingTrialHrefForExam(input.examKey);
  const price = formatMonthlyPrice("pro");
  const typical = typicalPrepForExam(input.examKey);
  const typicalLabel = formatPlanUsd(typical.amountUsd);
  const heroOffer = boardHeroOffer(input.examKey, units, { questionNoun: copy.questionNoun });
  const heroChips = boardHeroChips(heroOffer, copy.chipMiddle, copy.chipThird);
  const features = boardFeatureCardsForExam(input.examKey, {
    degraded: input.degraded,
    units,
    bankTypes: {},
    quickBite: null,
    usmleStepCounts: input.usmleStepCounts,
  });
  const sample = sampleForExam(input.sample);
  const faqs = hubFaqs(input.examKey, units, config);
  const nav = EXAM_NAV_ITEMS.find((item) => item.slug === input.examKey);
  const reviewer = clinicalReviewerForExam(input.examKey);
  const links = [
    ...(sample ? [{ href: "#sample-question", label: `Free ${config.shortName} practice question` }] : []),
    { href: qotdPath(input.examKey), label: "Question of the Day" },
    { href: ROUTES.pricing, label: "Pricing" },
    { href: nav?.practiceHref ?? `/practice/${input.examKey}`, label: `${config.shortName} practice` },
    { href: ROUTES.howQuestionsAreReviewed, label: "How questions are reviewed" },
  ];
  const stats = units
    ? [{ value: formatExactQuestionCount(scoredQuestionCount(units)), label: "Questions" }]
    : [];
  const graph: Record<string, unknown>[] = [
    {
      "@type": "Organization",
      "@id": `${site}/#organization`,
      name: LEGAL_ENTITY.companyName,
      legalName: LEGAL_ENTITY.companyName,
      url: site,
      logo: absoluteUrl("/icons/icon-192.png"),
      contactPoint: organizationContactPoint(),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: site },
        { "@type": "ListItem", position: 2, name: config.shortName, item: pageUrl },
      ],
    },
    {
      "@type": "Product",
      name: `${SITE_NAME} Pro`,
      description: `${config.shortName} practice questions and five other boards on one plan at ${price} a month.`,
      image: absoluteUrl(DEFAULT_OG_IMAGE_PATH),
      brand: { "@type": "Brand", name: SITE_NAME },
      url: absoluteUrl(ROUTES.pricing),
      offers: {
        "@type": "Offer",
        price: TIER_MONTHLY_USD.pro.toFixed(2),
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        url: absoluteUrl(trialHref),
        description: `${TRIAL_DAYS}-day free trial, then ${price} a month. No payment method to start.`,
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${pageUrl}#faq`,
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
  ];

  return {
    h1Lead: copy.h1Lead,
    h1Accent: copy.h1Accent,
    lede: "Try the free sample below, then start your trial when you are ready.",
    trialHref,
    trialLabel: homeTrialCtaLabel(),
    trust: ["5-day free trial", "No payment method to start", "Cancel in Settings"],
    heroOffer,
    heroChips,
    proofPoints: [],
    features,
    stats,
    countLine: null,
    priceHeading: "Simple pricing.",
    priceLede: `${price}/mo for ${config.shortName} and five other boards after your ${TRIAL_DAYS}-day trial.`,
    prices: [
      {
        id: "typical",
        label: `Typical ${typical.periodLabel}`,
        amount: typicalLabel,
        detail: `Public list prices we checked · ${typical.asOf}`,
        featured: false,
      },
      {
        id: "ours",
        label: "AnyExamEasy Pro",
        amount: `${price}/mo`,
        detail: `${TRIAL_DAYS}-day free trial · cancel anytime`,
        featured: true,
      },
    ],
    sample,
    formatHeading: "",
    formatLede: "",
    formats: [],
    quickBite: null,
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
    stories: [],
    storyNote: "",
    faqs,
    links,
    finalHeading: "Start your free trial.",
    finalLede: "No payment method required.",
    boardName: config.shortName,
    sampleKicker: `Free ${config.shortName} practice question`,
    explainedTitle: `Sample ${config.shortName} question`,
    statsLabel: `Live ${config.shortName} bank counts`,
    linksHeading: `More ${config.shortName} practice`,
    formatAnchor: "formats",
    sceneKicker: `${config.shortName} case`,
    sceneIdPrefix: input.examKey.replace(/[^a-z0-9]/g, "-"),
    heroCtaName: `${input.examKey.replace(/-/g, "_")}_hero_trial`,
    heroCtaLocation: `${input.examKey}_hero`,
    finalCtaName: `${input.examKey.replace(/-/g, "_")}_final_trial`,
    finalCtaLocation: `${input.examKey}_final`,
    jsonLd: { "@context": "https://schema.org", "@graph": graph },
  };
}

/** Field id used in `getPublicSampleQuestions` for each hub exam. */
export function hubSampleFieldId(examKey: HubExamKey): string {
  return EXAM_NAV_ITEMS.find((item) => item.slug === examKey)?.fieldId ?? examKey;
}
