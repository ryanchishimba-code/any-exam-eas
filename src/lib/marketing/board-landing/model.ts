import type { Metadata } from "next";
import { TRIAL_DAYS, TRIAL_LIFETIME_QUESTIONS } from "@/lib/billing-config";
import {
  formatBoardQuestionSentence,
  formatExactQuestionCount,
  scoredQuestionCount,
  type BoardQuestionUnits,
} from "@/lib/counts";
import type { LandingSuccessStory } from "@/lib/landing/content";
import { landingTrialHrefForExam } from "@/lib/landing/trial-href";
import { COMPETITOR_PRICE_AS_OF, TESTIMONIAL_RESULTS_NOTE } from "@/lib/marketing/legal-copy";
import { formatNclexPrepPriceComparison } from "@/lib/marketing/price-comparison";
import { collectedDistractorReasons } from "@/lib/exam-prep/item-qa/rationale-schema";
import { HOME_EXPLAINED_SAMPLE } from "@/lib/marketing/home-explained";
import { homeTrialCloseHeading, homeTrialCtaLabel } from "@/lib/marketing/home-cta";
import type { PublicSampleQuestion } from "@/lib/marketing/public-sample";
import { CLINICAL_REVIEWERS } from "@/lib/marketing/company";
import { COMPETITOR_PRICING } from "@/lib/seo/competitor-comparison";
import { testimonialsForBoard } from "@/lib/marketing/why-trust-it";
import { mergeHomeTestimonials } from "@/lib/testimonials/home-stories";
import {
  OPEN_PHARMACY_QUICK_BITE_SLUG,
  getPharmacyQuickBiteBySlug,
  pharmacyQuickBitePoster,
} from "@/lib/quick-bites/pharmacy-catalog";
import {
  OPEN_QUICK_BITE_SLUG,
  getQuickBiteBySlug,
  quickBitePoster,
  type QuickBiteEpisode,
} from "@/lib/quick-bites/catalog";
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
import { formatPlanUsd } from "@/lib/billing-plans";
import { qotdPath } from "@/lib/demo/qotd-public";

export type LandingOption = {
  id: string;
  text: string;
  correct: boolean;
  rationale: string | null;
};

export type LandingQuestion = {
  id: string;
  stem: string;
  rationale: string;
  sources: string[];
  options: LandingOption[];
};

export type BoardQuickBite = {
  track: "nursing" | "pharmacy";
  title: string;
  duration: string;
  slug: string;
  webp: string;
  jpg: string;
  imageAlt: string;
  mediaUrl: string;
  captions: boolean;
  uploadDate: string | null;
  isoDuration: string | null;
};

export type BoardFormatCard = {
  id: string;
  title: string;
  detail: string;
};

export type BoardLandingModel = {
  h1Lead: string;
  h1Accent: string;
  lede: string;
  trialHref: string;
  trialLabel: string;
  trust: string[];
  stats: { value: string; label: string }[];
  countLine: string | null;
  priceHeading: string;
  priceLede: string;
  prices: { id: string; label: string; amount: string; detail: string; featured: boolean }[];
  sample: LandingQuestion | null;
  formatHeading: string;
  formatLede: string;
  formats: BoardFormatCard[];
  quickBite: BoardQuickBite | null;
  reviewers: { id: string; name: string; role: string; initials: string; background: string; color: string }[];
  stories: { name: string; exam: string; quote: string; initials: string }[];
  storyNote: string;
  faqs: { question: string; answer: string }[];
  links: { href: string; label: string }[];
  finalHeading: string;
  finalLede: string;
  boardName: string;
  sampleKicker: string;
  explainedTitle: string;
  statsLabel: string;
  linksHeading: string;
  formatAnchor: string;
  sceneKicker: string;
  sceneIdPrefix: string;
  heroCtaName: string;
  heroCtaLocation: string;
  finalCtaName: string;
  finalCtaLocation: string;
  jsonLd: Record<string, unknown>;
};

const BANK_TYPE_GROUPS: { id: string; title: string; types: string[] }[] = [
  { id: "sata", title: "Select all that apply", types: ["select_all", "sata"] },
  { id: "bowtie", title: "Bow-tie", types: ["ngn_bowtie", "bow_tie", "bowtie"] },
  { id: "matrix", title: "Matrix / grid", types: ["ngn_matrix", "matrix"] },
  { id: "ordered", title: "Ordered response", types: ["ordered_response"] },
  { id: "highlight", title: "Highlight", types: ["ngn_highlight", "highlight"] },
  { id: "drag", title: "Drag and drop", types: ["drag_drop"] },
  { id: "constructed", title: "Fill-in response", types: ["constructed_response"] },
];

/** Clock `m:ss` from the Quick Bites catalog, as an ISO 8601 duration. */
export function iso8601Duration(clock: string): string | null {
  const match = /^(\d+):([0-5]\d)$/.exec(clock.trim());
  if (!match) return null;
  return `PT${Number(match[1])}M${Number(match[2])}S`;
}

/** Upload day stamped on a re-rendered media folder, when the catalog records one. */
export function mediaVersionUploadDate(mediaVersion: string | undefined): string | null {
  const match = /^v\d+-(\d{4})(\d{2})(\d{2})$/.exec(mediaVersion ?? "");
  if (!match) return null;
  return `${match[1]}-${match[2]}-${match[3]}`;
}

export function nclexMetaTitle(): string {
  return enforceMetaTitle("NCLEX-RN Practice Questions & Next Gen NCLEX Qbank", "/nclex");
}

export function nclexMetaDescription(): string {
  return enforceMetaDescription(
    `NCLEX-RN practice questions and a Next Gen NCLEX qbank with NGN case studies. Try a free practice question. Pro is ${formatMonthlyPrice("pro")}/mo after a ${TRIAL_DAYS}-day trial.`,
    "/nclex"
  );
}

export function buildNclexLandingMetadata(): Metadata {
  const title = nclexMetaTitle();
  const description = nclexMetaDescription();
  const path = "/nclex";
  const image = absoluteUrl(DEFAULT_OG_IMAGE_PATH);
  const imageAlt = "AnyExamEasy NCLEX-RN practice questions and Next Gen NCLEX qbank";
  return {
    title: { absolute: title },
    description,
    metadataBase: new URL(getSiteUrl()),
    alternates: { canonical: path },
    keywords: dedupeKeywords([
      "NCLEX-RN practice questions",
      "NCLEX qbank",
      "Next Gen NCLEX practice",
      "NGN case studies",
      "NCLEX free practice question",
      "NCLEX practice questions",
      "how to pass NCLEX first try",
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

function countForTypes(counts: Record<string, number>, types: readonly string[]): number {
  return types.reduce((sum, type) => sum + (counts[type.toLowerCase()] ?? 0), 0);
}

/**
 * Cards for item types that have a live count.
 * A positive NGN bucket with no type split stays one unnamed card.
 * Zero counts are omitted.
 */
export function nclexFormatCards(input: {
  bankTypes: Record<string, number>;
  caseStudies: number;
  caseItems: number;
  standaloneNgn: number;
  bankNgnStyle: number;
  bankCaseStyle: number;
}): BoardFormatCard[] {
  const cards: BoardFormatCard[] = [];
  if (input.caseStudies > 0 || input.bankCaseStyle > 0) {
    const parts: string[] = [];
    if (input.caseStudies > 0) {
      parts.push(
        input.caseItems > 0
          ? `${formatExactQuestionCount(input.caseStudies)} published case studies with ${formatExactQuestionCount(input.caseItems)} scored items`
          : `${formatExactQuestionCount(input.caseStudies)} published case studies`
      );
    }
    if (input.bankCaseStyle > 0) {
      parts.push(
        `${formatExactQuestionCount(input.bankCaseStyle)} case-style items in the question bank`
      );
    }
    cards.push({ id: "case", title: "Case studies", detail: `${parts.join(". ")}.` });
  }

  let namedBank = 0;
  for (const group of BANK_TYPE_GROUPS) {
    const count = countForTypes(input.bankTypes, group.types);
    if (count <= 0) continue;
    namedBank += count;
    cards.push({
      id: group.id,
      title: group.title,
      detail: `${formatExactQuestionCount(count)} live ${group.title.toLowerCase()} items in the NCLEX question bank.`,
    });
  }

  if (input.bankNgnStyle > namedBank) {
    const rest = input.bankNgnStyle - namedBank;
    cards.push({
      id: "ngn-style",
      title: "NGN-style items",
      detail: `${formatExactQuestionCount(rest)} more NGN-style items are live. Types with no live items stay off this page.`,
    });
  }

  if (input.standaloneNgn > 0) {
    cards.push({
      id: "standalone",
      title: "Standalone NGN items",
      detail: `${formatExactQuestionCount(input.standaloneNgn)} published standalone NGN items, counted apart from the question bank.`,
    });
  }
  return cards;
}

export function landingQuestionFromPublic(sample: PublicSampleQuestion): LandingQuestion {
  const reasons = collectedDistractorReasons({
    question: sample.stem,
    options: sample.options,
    correctAnswer: sample.correct,
    explanation: sample.rationale,
  });
  return {
    id: sample.id,
    stem: sample.stem,
    rationale: sample.rationale,
    sources: sample.sources,
    options: sample.options.map((text, index) => ({
      id: `${sample.id}-${index}`,
      text,
      correct: text === sample.correct,
      rationale: text === sample.correct ? sample.rationale : (reasons[text] ?? null),
    })),
  };
}

export function fallbackNclexQuestion(): LandingQuestion {
  return {
    id: "nclex-explained-preview",
    stem: HOME_EXPLAINED_SAMPLE.stem,
    rationale: HOME_EXPLAINED_SAMPLE.options.find((option) => option.correct)?.rationale ?? "",
    sources: [],
    options: HOME_EXPLAINED_SAMPLE.options.map((option, index) => ({
      id: `nclex-explained-preview-${index}`,
      text: option.text,
      correct: option.correct,
      rationale: option.rationale.trim() ? option.rationale : null,
    })),
  };
}

function openEpisodeBite(
  track: "nursing" | "pharmacy",
  episode: QuickBiteEpisode | undefined,
  poster: { webp: string; jpg: string },
  mediaUrl: string,
  captions: boolean
): BoardQuickBite | null {
  if (!episode || episode.held) return null;
  return {
    track,
    title: episode.title,
    duration: episode.duration,
    slug: episode.slug,
    webp: poster.webp,
    jpg: poster.jpg,
    imageAlt: `Poster for the free ${track === "nursing" ? "nursing" : "pharmacy"} Quick Bites sample, ${episode.title}.`,
    mediaUrl,
    captions,
    uploadDate: mediaVersionUploadDate(episode.mediaVersion),
    isoDuration: iso8601Duration(episode.duration),
  };
}

/** One public sample for a board. No episode list and no lesson count. */
export function openBoardQuickBite(track: "nursing" | "pharmacy"): BoardQuickBite | null {
  if (track === "pharmacy") {
    const episode = getPharmacyQuickBiteBySlug(OPEN_PHARMACY_QUICK_BITE_SLUG);
    return openEpisodeBite(
      "pharmacy",
      episode,
      episode ? pharmacyQuickBitePoster(episode.slug) : { webp: "", jpg: "" },
      episode ? `/api/quick-bites-pharmacy/${episode.slug}/media` : "",
      false
    );
  }
  const episode = getQuickBiteBySlug(OPEN_QUICK_BITE_SLUG);
  return openEpisodeBite(
    "nursing",
    episode,
    episode ? quickBitePoster(episode.slug) : { webp: "", jpg: "" },
    episode ? `/api/quick-bites/${episode.slug}/media` : "",
    true
  );
}

function liveUnits(units: BoardQuestionUnits | null, degraded: boolean): BoardQuestionUnits | null {
  if (degraded || !units) return null;
  if (scoredQuestionCount(units) <= 0) return null;
  return units;
}

function nclexFaqs(units: BoardQuestionUnits | null, formats: BoardFormatCard[]): { question: string; answer: string }[] {
  const howMany = units
    ? `AnyExamEasy currently serves ${formatBoardQuestionSentence(units)} for NCLEX. That total is the live scored bank, not a rounded marketing claim.`
    : "The live NCLEX question count is shown on this page when the bank lookup succeeds. We do not publish a guessed total.";
  const ngnNames = formats.map((card) => card.title);
  const ngnList =
    ngnNames.length <= 1
      ? (ngnNames[0] ?? "")
      : `${ngnNames.slice(0, -1).join(", ")}, and ${ngnNames[ngnNames.length - 1]}`;
  const ngn = formats.length
    ? `Yes. Live Next Gen NCLEX practice on this page includes ${ngnList}. Item types with no live questions stay off this page.`
    : "Next Gen item types are listed on this page only when the live bank is serving them. Classic NCLEX-RN practice questions stay on the Pro plan.";
  const price = formatMonthlyPrice("pro");
  const typical = formatPlanUsd(COMPETITOR_PRICING.uworldNclex30d);
  return [
    {
      question: "How many NCLEX practice questions does AnyExamEasy have?",
      answer: howMany,
    },
    {
      question: "Does AnyExamEasy include Next Gen NCLEX and NGN case studies?",
      answer: ngn,
    },
    {
      question: "How do I pass the NCLEX on my first try?",
      answer:
        "Practice from a live question, read why the keyed answer is right, and read a reason for each wrong option when the item has one. Then use timed sets and review misses before test day. A practice score is not a prediction of a license result.",
    },
    {
      question: "How much does NCLEX prep cost?",
      answer: `AnyExamEasy Pro is ${price} a month and includes NCLEX with five other boards. ${formatNclexPrepPriceComparison(price)} A typical public NCLEX list price we checked is ${typical} for 30 days, as of ${COMPETITOR_PRICE_AS_OF}.`,
    },
    {
      question: "Can I try a free NCLEX practice question before I pay?",
      answer: `Yes. One NCLEX question on this page can be answered with no account. The ${TRIAL_DAYS}-day free trial includes ${TRIAL_LIFETIME_QUESTIONS} practice questions and does not ask for a payment method. Cancel in Settings before it ends and you are not charged.`,
    },
  ];
}

function nclexStats(units: BoardQuestionUnits | null): { value: string; label: string }[] {
  if (!units) return [];
  const stats = [{ value: formatExactQuestionCount(scoredQuestionCount(units)), label: "Questions" }];
  if (units.caseStudies > 0) {
    stats.push({ value: formatExactQuestionCount(units.caseStudies), label: "Case studies" });
  }
  const ngn = units.bankNgnStyle + units.standaloneNgn;
  if (ngn > 0) {
    stats.push({ value: formatExactQuestionCount(ngn), label: "NGN items" });
  }
  stats.push({ value: "Aligned", label: "NCSBN test plan" });
  return stats;
}

export function boardVideoNode(bite: BoardQuickBite | null, pagePath: string): Record<string, unknown> | null {
  if (!bite) return null;
  const node: Record<string, unknown> = {
    "@type": "VideoObject",
    name: bite.title,
    description: `Free sample Quick Bites video: ${bite.title}.`,
    thumbnailUrl: absoluteUrl(bite.webp),
    embedUrl: absoluteUrl(`${pagePath}#quick-bites`),
  };
  if (bite.uploadDate) node.uploadDate = bite.uploadDate;
  if (bite.isoDuration) node.duration = bite.isoDuration;
  return node;
}

export function buildNclexLandingModel(input: {
  degraded: boolean;
  units: BoardQuestionUnits | null;
  bankTypes: Record<string, number>;
  sample: PublicSampleQuestion | null;
  testimonials: LandingSuccessStory[];
}): BoardLandingModel {
  const units = liveUnits(input.units, input.degraded);
  const formats = nclexFormatCards({
    bankTypes: input.bankTypes,
    caseStudies: units?.caseStudies ?? 0,
    caseItems: units?.caseItems ?? 0,
    standaloneNgn: units?.standaloneNgn ?? 0,
    bankNgnStyle: units?.bankNgnStyle ?? 0,
    bankCaseStyle: units?.bankCaseStyle ?? 0,
  });
  const sample = input.sample ? landingQuestionFromPublic(input.sample) : fallbackNclexQuestion();
  const stories = testimonialsForBoard(mergeHomeTestimonials(input.testimonials), "nclex").map((story) => ({
    name: story.name,
    exam: story.exam,
    quote: story.quote,
    initials: story.initials,
  }));
  const faqs = nclexFaqs(units, formats);
  const quickBite = openBoardQuickBite("nursing");
  const price = formatMonthlyPrice("pro");
  const typical = formatPlanUsd(COMPETITOR_PRICING.uworldNclex30d);
  const trialHref = landingTrialHrefForExam("nclex");
  const pageUrl = absoluteUrl("/nclex");
  const site = getSiteUrl();
  const links = [
    { href: "#sample-question", label: "Free NCLEX practice question" },
    { href: qotdPath("nclex"), label: "Question of the Day" },
    { href: ROUTES.pricing, label: "Pricing" },
    ...(formats.length > 0 ? [{ href: "#next-gen", label: "Next Gen NCLEX" }] : []),
    { href: ROUTES.nclexStudyGuide, label: "NCLEX study guide" },
    { href: "/practice/nclex", label: "NCLEX practice" },
    { href: ROUTES.howQuestionsAreReviewed, label: "How questions are reviewed" },
  ];
  const video = boardVideoNode(quickBite, "/nclex");
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
        { "@type": "ListItem", position: 2, name: "NCLEX", item: pageUrl },
      ],
    },
    {
      "@type": "Product",
      name: `${SITE_NAME} Pro`,
      description: `NCLEX-RN practice questions, Next Gen NCLEX practice, and five other boards on one plan at ${price} a month.`,
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
    h1Lead: "Pass the NCLEX on your",
    h1Accent: "first try.",
    lede: "Answer a real NCLEX practice question before you create an account. See the keyed answer, a reason for each wrong option when the item has one, and the price before you start.",
    trialHref,
    trialLabel: homeTrialCtaLabel(),
    trust: [
      "No payment method to start",
      "Cancel anytime in Settings",
      "Written to the NCSBN test plan",
    ],
    stats: nclexStats(units),
    countLine: units ? formatBoardQuestionSentence(units) : null,
    priceHeading: "Same practice. A fraction of the price.",
    priceLede: `Pro is ${price} a month for NCLEX and five other boards. ${formatNclexPrepPriceComparison(price)}`,
    prices: [
      {
        id: "typical",
        label: "Typical NCLEX prep",
        amount: typical,
        detail: `30 days · public list price as of ${COMPETITOR_PRICE_AS_OF}`,
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
    sample,
    formatHeading: "Built for the Next Gen NCLEX.",
    formatLede: "Only item types with live questions are listed.",
    formats,
    quickBite,
    reviewers: CLINICAL_REVIEWERS.map((reviewer) => ({
      id: reviewer.id,
      name: reviewer.displayName,
      role: reviewer.role,
      initials: reviewer.initials,
      background: reviewer.avatar.background,
      color: reviewer.avatar.color,
    })),
    stories,
    storyNote: TESTIMONIAL_RESULTS_NOTE,
    faqs,
    links,
    finalHeading: homeTrialCloseHeading(),
    finalLede: "No payment method required. Cancel anytime in Settings.",
    boardName: "NCLEX",
    sampleKicker: "Free NCLEX practice question",
    explainedTitle: "Sample NCLEX question",
    statsLabel: "Live NCLEX bank counts",
    linksHeading: "More NCLEX practice",
    formatAnchor: "next-gen",
    sceneKicker: "Next Gen case",
    sceneIdPrefix: "nclex",
    heroCtaName: "nclex_hero_trial",
    heroCtaLocation: "nclex_hero",
    finalCtaName: "nclex_final_trial",
    finalCtaLocation: "nclex_final",
    jsonLd: { "@context": "https://schema.org", "@graph": graph },
  };
}
