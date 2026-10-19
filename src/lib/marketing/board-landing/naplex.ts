import type { Metadata } from "next";
import { TRIAL_DAYS, TRIAL_LIFETIME_QUESTIONS } from "@/lib/billing-config";
import { formatPlanUsd } from "@/lib/billing-plans";
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
import { homeTrialCloseHeading, homeTrialCtaLabel } from "@/lib/marketing/home-cta";
import {
  boardVideoNode,
  openBoardQuickBite,
  type BoardFormatCard,
  type BoardLandingModel,
  type LandingQuestion,
} from "@/lib/marketing/board-landing/model";
import { clinicalReviewerForExam } from "@/lib/marketing/company";
import { testimonialsForBoard } from "@/lib/marketing/why-trust-it";
import { mergeHomeTestimonials } from "@/lib/testimonials/home-stories";
import { qotdPath } from "@/lib/demo/qotd-public";
import { ROUTES } from "@/lib/routes";
import {
  DEFAULT_OG_IMAGE_HEIGHT,
  DEFAULT_OG_IMAGE_PATH,
  DEFAULT_OG_IMAGE_WIDTH,
  absoluteUrl,
  dedupeKeywords,
  getSiteUrl,
} from "@/lib/seo";
import { enforceMetaDescription, enforceMetaTitle } from "@/lib/seo/meta-budget";
import { LEGAL_ENTITY, organizationContactPoint } from "@/lib/legal";
import { SITE_NAME, formatMonthlyPrice } from "@/lib/site";
import { TIER_MONTHLY_USD } from "@/lib/subscription-tiers";

/**
 * Public 60-day NAPLEX QBank list price.
 * Checked on the vendor's NAPLEX test-bank page on Oct 18, 2026. The page shows
 * 60-day access at $299 and the course page lists the QBank starting at $299.
 * The sentence on this site does not name that vendor.
 */
export const NAPLEX_TYPICAL_LIST_PRICE_USD = 299;
export const NAPLEX_TYPICAL_LIST_PRICE_AS_OF = "Oct 18, 2026";

const PHARMACY_TYPE_GROUPS: { id: string; title: string; types: string[] }[] = [
  { id: "vignette", title: "Patient vignettes", types: ["vignette"] },
  { id: "constructed", title: "Fill-in response", types: ["constructed_response"] },
  { id: "sata", title: "Select all that apply", types: ["select_all", "sata"] },
  { id: "exhibit", title: "Exhibit items", types: ["exhibit"] },
];

function countForTypes(counts: Record<string, number>, types: readonly string[]): number {
  return types.reduce((sum, type) => sum + (counts[type.toLowerCase()] ?? 0), 0);
}

/** Cards for pharmacy item types that have a live inventory count. Zero counts stay off the page. */
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
  return enforceMetaTitle("NAPLEX Practice Questions and Pharmacy Calculations", "/naplex");
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
  const image = absoluteUrl(DEFAULT_OG_IMAGE_PATH);
  const imageAlt = "AnyExamEasy NAPLEX practice questions and pharmacy qbank";
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

function liveUnits(units: BoardQuestionUnits | null, degraded: boolean): BoardQuestionUnits | null {
  if (degraded || !units) return null;
  if (scoredQuestionCount(units) <= 0) return null;
  return units;
}

function naplexFaqs(units: BoardQuestionUnits | null): { question: string; answer: string }[] {
  const price = formatMonthlyPrice("pro");
  const typical = formatPlanUsd(NAPLEX_TYPICAL_LIST_PRICE_USD);
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
      question: "How do I pass the NAPLEX on my first try?",
      answer:
        "Practice from a live question, including calculations, read why the keyed answer is right, and read a reason for each wrong option when the item has one. Then review misses before test day. A practice score is not a prediction of a license result.",
    },
    {
      question: "How much does NAPLEX prep cost?",
      answer: `AnyExamEasy Pro is ${price} a month and includes NAPLEX with five other boards. A typical public NAPLEX list price we checked is ${typical} for 60 days, as of ${NAPLEX_TYPICAL_LIST_PRICE_AS_OF}.`,
    },
    {
      question: "Can I try a free NAPLEX practice question before I pay?",
      answer: `Yes. One NAPLEX question on this page can be answered with no account. The ${TRIAL_DAYS}-day free trial includes ${TRIAL_LIFETIME_QUESTIONS} practice questions and does not ask for a payment method. Cancel in Settings before it ends and you are not charged.`,
    },
    {
      question: "What is on the NAPLEX?",
      answer: `The ${NAPLEX_OUTLINE_SOURCE} has five areas: ${domains}.`,
    },
    {
      question: "How long is the NAPLEX?",
      answer:
        "The NAPLEX is 225 questions over 6 hours. Two hundred questions are scored and 25 are pretest.",
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
  const stories = testimonialsForBoard(mergeHomeTestimonials(input.testimonials), "naplex").map((story) => ({
    name: story.name,
    exam: story.exam,
    quote: story.quote,
    initials: story.initials,
  }));
  const faqs = naplexFaqs(units);
  const quickBite = openBoardQuickBite("pharmacy");
  const price = formatMonthlyPrice("pro");
  const typical = formatPlanUsd(NAPLEX_TYPICAL_LIST_PRICE_USD);
  const trialHref = landingTrialHrefForExam("naplex");
  const pageUrl = absoluteUrl("/naplex");
  const site = getSiteUrl();
  const reviewer = clinicalReviewerForExam("naplex");
  const links = [
    ...(input.sample ? [{ href: "#sample-question", label: "Free NAPLEX practice question" }] : []),
    { href: qotdPath("naplex"), label: "Question of the Day" },
    { href: ROUTES.pricing, label: "Pricing" },
    ...(formats.length > 0 ? [{ href: "#naplex-formats", label: "NAPLEX item types" }] : []),
    { href: "/naplex/study-guide", label: "NAPLEX study guide" },
    { href: "/practice/naplex", label: "NAPLEX practice" },
    { href: ROUTES.howQuestionsAreReviewed, label: "How questions are reviewed" },
  ];
  const video = boardVideoNode(quickBite, "/naplex");
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
        { "@type": "ListItem", position: 2, name: "NAPLEX", item: pageUrl },
      ],
    },
    {
      "@type": "Product",
      name: `${SITE_NAME} Pro`,
      description: `NAPLEX practice questions, pharmacy calculations, and five other boards on one plan at ${price} a month.`,
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
  if (video) graph.push(video);

  return {
    h1Lead: "Pass the NAPLEX on your",
    h1Accent: "first try.",
    lede: "Built for PharmD candidates. Work a real NAPLEX dosing question before you create an account, then read the calculation and a reason for each other choice.",
    trialHref,
    trialLabel: homeTrialCtaLabel(),
    trust: ["No payment method to start", "Cancel anytime in Settings", "Written to the NABP content outline"],
    stats: naplexStats(units, input.degraded ? {} : input.bankTypes),
    countLine: units ? formatBoardQuestionSentence(units) : null,
    priceHeading: "NAPLEX prep, side by side.",
    priceLede: `Pro is ${price} a month for NAPLEX and five other boards. A typical public NAPLEX list price we checked is ${typical} for 60 days, as of ${NAPLEX_TYPICAL_LIST_PRICE_AS_OF}.`,
    prices: [
      {
        id: "typical",
        label: "Typical NAPLEX prep",
        amount: typical,
        detail: `60 days · public list price as of ${NAPLEX_TYPICAL_LIST_PRICE_AS_OF}`,
        featured: false,
      },
      {
        id: "ours",
        label: "AnyExamEasy",
        amount: `${price}/mo`,
        detail: `${TRIAL_DAYS}-day free trial · six boards · cancel anytime`,
        featured: true,
      },
    ],
    sample: input.sample,
    formatHeading: "Built for the NAPLEX content outline.",
    formatLede: "Only item types with live questions are listed.",
    formats,
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
    finalHeading: homeTrialCloseHeading(),
    finalLede: "No payment method required. Cancel anytime in Settings.",
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
    jsonLd: { "@context": "https://schema.org", "@graph": graph },
  };
}
