import type { Metadata } from "next";
import { TRIAL_DAYS, TRIAL_LIFETIME_QUESTIONS } from "@/lib/billing-config";
import {
  formatBoardQuestionSentence,
  formatExactQuestionCount,
  scoredQuestionCount,
  type BoardQuestionUnits,
} from "@/lib/counts";
import { NAPLEX_CONTENT_OUTLINE, NAPLEX_OUTLINE_SOURCE } from "@/lib/exam-prep/naplex/content-outline";
import type { LandingSuccessStory } from "@/lib/landing/content";
import { landingTrialHrefForExam } from "@/lib/landing/trial-href";
import { TESTIMONIAL_RESULTS_NOTE } from "@/lib/marketing/legal-copy";
import { homeTrialCtaLabel } from "@/lib/marketing/home-cta";
import { naplexFeatureCards } from "@/lib/marketing/board-landing/board-features";
import { BOARD_LANDING_FINAL_HEADING } from "@/lib/marketing/board-landing/board-landing-copy";
import { withBoardHeroMarketing } from "@/lib/marketing/board-landing/board-hero-marketing";
import {
  boardHeroChips,
  boardHeroOffer,
  boardLandingTrustPills,
} from "@/lib/marketing/board-landing/hero";
import {
  boardVideoNode,
  openBoardQuickBite,
  type BoardFormatCard,
  type BoardLandingModel,
  type LandingQuestion,
} from "@/lib/marketing/board-landing/model";
import { clinicalReviewerForExam } from "@/lib/marketing/company";
import { landingTestimonialStories } from "@/lib/testimonials/landing-stories";
import { qotdPath } from "@/lib/demo/qotd-public";
import { ROUTES } from "@/lib/routes";
import { absoluteUrl, dedupeKeywords, getSiteUrl } from "@/lib/seo";
import { landingOgImage } from "@/lib/seo/landing-og-image";
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
} from "@/lib/marketing/board-landing/board-theme";
import { SITE_NAME, formatMonthlyPrice } from "@/lib/site";

const PHARMACY_TYPE_GROUPS: { id: string; title: string; types: string[] }[] = [
  { id: "vignette", title: "Patient vignettes", types: ["vignette"] },
  { id: "constructed", title: "Fill-in response", types: ["constructed_response"] },
  { id: "sata", title: "Select all that apply", types: ["select_all", "sata"] },
  { id: "exhibit", title: "Exhibit items", types: ["exhibit"] },
];

function countForTypes(counts: Record<string, number>, types: readonly string[]): number {
  return types.reduce((sum, type) => sum + (counts[type.toLowerCase()] ?? 0), 0);
}

export function naplexFormatCards(bankTypes: Record<string, number>): BoardFormatCard[] {
  const cards: BoardFormatCard[] = [];
  for (const group of PHARMACY_TYPE_GROUPS) {
    const count = countForTypes(bankTypes, group.types);
    if (count <= 0) continue;
    cards.push({
      id: group.id,
      title: group.title,
      detail: `${formatExactQuestionCount(count)} live ${group.title.toLowerCase()} in the NAPLEX question bank.`,
    });
  }
  return cards;
}

export function naplexMetaTitle(): string {
  return enforceMetaTitle(freeBoardMetaTitle("NAPLEX"), "/naplex");
}

export function naplexMetaDescription(): string {
  return enforceMetaDescription(
    `NAPLEX practice questions and pharmacy calculations in one qbank. Try a free practice question. Pro is ${formatMonthlyPrice("pro")}/mo after a ${TRIAL_DAYS}-day trial. Cancel anytime.`,
    "/naplex"
  );
}

export function buildNaplexLandingMetadata(): Metadata {
  const title = naplexMetaTitle();
  const description = naplexMetaDescription();
  const path = "/naplex";
  const image = landingOgImage("naplex");
  return {
    title: { absolute: title },
    description,
    metadataBase: new URL(getSiteUrl()),
    alternates: { canonical: path },
    keywords: dedupeKeywords([
      "NAPLEX practice questions",
      "NAPLEX qbank",
      "NAPLEX calculations",
      "pharmacy practice questions",
      "how to pass NAPLEX first try",
      "free NAPLEX practice question",
      "NAPLEX question bank",
    ]),
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

function liveUnits(units: BoardQuestionUnits | null, degraded: boolean): BoardQuestionUnits | null {
  if (degraded || !units) return null;
  if (scoredQuestionCount(units) <= 0) return null;
  return units;
}

function naplexFaqs(units: BoardQuestionUnits | null): { question: string; answer: string }[] {
  const price = formatMonthlyPrice("pro");
  const howMany = units
    ? `AnyExamEasy currently serves ${formatBoardQuestionSentence(units)} for NAPLEX. That total is the live scored bank, not a rounded marketing claim.`
    : "The live NAPLEX question count is shown on this page when the bank lookup succeeds. We do not publish a guessed total.";
  const domains = NAPLEX_CONTENT_OUTLINE.map((domain) => `${domain.label} (${domain.weightLabel})`).join("; ");
  return [
    {
      question: "How many NAPLEX practice questions does AnyExamEasy have?",
      answer: howMany,
    },
    {
      question: "How should I prepare for the NAPLEX?",
      answer:
        "Practice from a live question, including calculations, read why the keyed answer is right, and read a reason for each wrong option when the item has one. Then review misses before test day. A practice score is not a prediction of a license result.",
    },
    {
      question: "How much does NAPLEX prep cost?",
      answer: `AnyExamEasy Pro is ${price} a month and includes NAPLEX with five other boards after your ${TRIAL_DAYS}-day free trial.`,
    },
    {
      question: "Can I try a free NAPLEX practice question before I pay?",
      answer: `Yes. Open NAPLEX practice for a scored sample with no account. The ${TRIAL_DAYS}-day free trial includes ${TRIAL_LIFETIME_QUESTIONS} practice questions and does not ask for a payment method. Cancel in Settings before it ends and you are not charged.`,
    },
    {
      question: "What is on the NAPLEX?",
      answer: `The ${NAPLEX_OUTLINE_SOURCE} has five areas: ${domains}.`,
    },
  ];
}

function naplexStats(
  units: BoardQuestionUnits | null,
  bankTypes: Record<string, number>
): { value: string; label: string }[] {
  if (!units) return [];
  const stats = [{ value: formatExactQuestionCount(scoredQuestionCount(units)), label: "Questions" }];
  const vignettes = bankTypes.vignette ?? 0;
  if (vignettes > 0) {
    stats.push({ value: formatExactQuestionCount(vignettes), label: "Patient vignettes" });
  }
  stats.push({ value: "5 areas", label: "NABP outline" });
  return stats;
}

export function buildNaplexLandingModel(input: {
  degraded: boolean;
  units: BoardQuestionUnits | null;
  bankTypes: Record<string, number>;
  sample: LandingQuestion | null;
  testimonials: LandingSuccessStory[];
}): BoardLandingModel {
  const units = liveUnits(input.units, input.degraded);
  const formats = input.degraded ? [] : naplexFormatCards(input.bankTypes);
  const stories = landingTestimonialStories(input.testimonials, "naplex");
  const faqs = naplexFaqs(units);
  const quickBite = openBoardQuickBite("pharmacy");
  const features = naplexFeatureCards({
    degraded: input.degraded,
    bankTypes: input.bankTypes,
    quickBite,
  });
  const heroOffer = boardHeroOffer("naplex", units, { questionNoun: "NAPLEX questions" });
  const heroChips = boardHeroChips(
    heroOffer,
    "Calculation walkthroughs and distractor reasons on scored pharmacy items.",
    "NAPLEX item types, toolkit, and timed practice — no per-exam add-ons."
  );
  const price = formatMonthlyPrice("pro");
  const trialHref = landingTrialHrefForExam("naplex");
  const reviewer = clinicalReviewerForExam("naplex");
  const links = [
    { href: "/practice/naplex", label: "Free NAPLEX practice question" },
    { href: qotdPath("naplex"), label: "Question of the Day" },
    { href: ROUTES.pricing, label: "Pricing" },
    ...(formats.length > 0 ? [{ href: "#naplex-formats", label: "NAPLEX item types" }] : []),
    { href: "/naplex/study-guide", label: "NAPLEX study guide" },
    { href: "/practice/naplex", label: "NAPLEX practice" },
    { href: ROUTES.howQuestionsAreReviewed, label: "How questions are reviewed" },
  ];
  const video = boardVideoNode(quickBite, "/naplex");
  const graph = boardLandingBaseGraph({
    pagePath: "/naplex",
    breadcrumbName: "NAPLEX",
    pageName: naplexMetaTitle(),
    productDescription: `NAPLEX practice questions, pharmacy calculations, and five other boards on one plan at ${price}/mo.`,
    trialHref,
    faqs,
  });
  if (video) graph.push(video);
  const visuals = buildBoardVisuals({
    slug: "naplex",
    examKey: "naplex",
    units,
    offer: heroOffer,
    bankTypes: input.degraded ? {} : input.bankTypes,
  });

  return withBoardHeroMarketing("naplex", {
    h1Lead: "",
    h1Accent: "",
    lede: heroWhyUs("naplex"),
    trialHref,
    trialLabel: homeTrialCtaLabel(),
    trust: boardLandingTrustPills(),
    heroOffer,
    heroChips,
    proofPoints: [],
    features,
    stats: naplexStats(units, input.degraded ? {} : input.bankTypes),
    countLine: null,
    priceHeading: "Simple pricing.",
    priceLede: `Pro is ${price} a month for NAPLEX and five other boards after your ${TRIAL_DAYS}-day trial.`,
    prices: [
      {
        id: "ours",
        label: "AnyExamEasy Pro",
        amount: `${price}/mo`,
        detail: `${TRIAL_DAYS}-day free trial · six boards · cancel anytime`,
        featured: true,
      },
    ],
    sample: input.sample,
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
      : [],
    stories,
    storyNote: TESTIMONIAL_RESULTS_NOTE,
    faqs,
    links,
    finalHeading: BOARD_LANDING_FINAL_HEADING,
    finalLede: "No payment method required.",
    boardName: "NAPLEX",
    sampleKicker: "Free NAPLEX practice question",
    explainedTitle: "Sample NAPLEX question",
    statsLabel: "Live NAPLEX bank counts",
    linksHeading: "More NAPLEX practice",
    formatAnchor: "naplex-formats",
    sceneKicker: "NAPLEX case",
    sceneIdPrefix: "naplex",
    heroCtaName: "naplex_hero_trial",
    heroCtaLocation: "naplex_hero",
    finalCtaName: "naplex_final_trial",
    finalCtaLocation: "naplex_final",
    themeClass: boardThemeClass("naplex"),
    heroWhyUs: heroWhyUs("naplex"),
    heroTestimonial: null,
    ctaMicrocopy: formatHeroCtaMicrocopy(heroOffer.liveQuestions),
    contentYear: BOARD_LANDING_CONTENT_YEAR,
    painPoints: boardPainPoints("naplex"),
    visuals,
    sampleSecondary: null,
    jsonLd: { "@context": "https://schema.org", "@graph": graph },
  });
}
