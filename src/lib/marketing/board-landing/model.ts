import type { Metadata } from "next";
import { TRIAL_DAYS } from "@/lib/billing-config";
import {
  formatBoardQuestionSentence,
  formatExactQuestionCount,
  publishedNgnItemCount,
  scoredQuestionCount,
  type BoardQuestionUnits,
} from "@/lib/counts";
import type { LandingSuccessStory } from "@/lib/landing/content";
import { landingTrialHrefForExam } from "@/lib/landing/trial-href";
import { collectedDistractorReasons } from "@/lib/exam-prep/item-qa/rationale-schema";
import { HOME_EXPLAINED_SAMPLE } from "@/lib/marketing/home-explained";
import { homeTrialCtaLabel } from "@/lib/marketing/home-cta";
import type { NaplexAceDonutModel } from "@/lib/marketing/board-landing/naplex-ace-donut";
import type { PublicSampleQuestion } from "@/lib/marketing/public-sample";
import { CLINICAL_REVIEWERS } from "@/lib/marketing/company";
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
import { nclexFeatureCards, type BoardFeatureCard } from "@/lib/marketing/board-landing/board-features";
import {
  BOARD_LANDING_FINAL_HEADING,
  boardLandingBreadcrumbName,
} from "@/lib/marketing/board-landing/board-landing-copy";
import { withBoardHeroMarketing } from "@/lib/marketing/board-landing/board-hero-marketing";
import { boardLandingTrustPills } from "@/lib/marketing/board-landing/hero";
import { landingTestimonialStories } from "@/lib/testimonials/landing-stories";
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
  type BoardLandingVisuals,
  type BoardPainPoint,
} from "@/lib/marketing/board-landing/board-theme";
import { buildNclexCompareChartData, type NclexCompareChartData } from "@/lib/marketing/board-landing/nclex-compare-chart";
import { studentTrustBadgeFromCount, type StudentTrustBadge } from "@/lib/marketing/student-trust-count";
import {
  SITE_NAME,
  formatLandingHeroTrialLine,
  formatLandingTrialFaqAnswer,
  formatMonthlyPrice,
} from "@/lib/site";
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
  heroOffer?: {
    liveQuestions: string | null;
    proPrice: string;
    questionNoun?: string;
    trialLine: string;
  };
  /** Short above-the-fold differentiators (lean NCLEX hero). */
  heroChips?: { id: string; text: string }[];
  proofPoints: string[];
  features: BoardFeatureCard[];
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
  themeClass: string;
  heroWhyUs: string;
  /** Consented quote shown in the hero when present. */
  heroTestimonial: { name: string; quote: string; board: string } | null;
  ctaMicrocopy: string;
  contentYear: number;
  painPoints: BoardPainPoint[];
  visuals: BoardLandingVisuals;
  sampleSecondary: LandingQuestion | null;
  /** NAPLEX-only feature donut on `/naplex`. */
  aceDonut?: NaplexAceDonutModel;
  /** NCLEX-only conversion band (compare chart + trust badge). */
  nclexCompare?: NclexCompareChartData;
  studentTrustBadge?: StudentTrustBadge;
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
  return enforceMetaTitle(freeBoardMetaTitle(boardLandingBreadcrumbName("nclex")), "/nclex");
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
  const image = landingOgImage("nclex");
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

function nclexFaqs(units: BoardQuestionUnits | null): { question: string; answer: string }[] {
  const price = formatMonthlyPrice("pro");
  const howMany = units
    ? `The live bank currently serves ${formatBoardQuestionSentence(units)} for NCLEX-RN.`
    : "We show the live total on this page when the bank lookup succeeds; we do not guess a number.";
  return [
    {
      question: "How many NCLEX practice questions are included?",
      answer: howMany,
    },
    {
      question: "Does this include Next Gen NCLEX (NGN)?",
      answer:
        "Yes. Pro includes NGN case studies and standalone NGN items alongside classic NCLEX-RN questions.",
    },
    {
      question: "How much does NCLEX prep cost?",
      answer: `Pro is ${price}/mo for NCLEX plus five other boards after your ${TRIAL_DAYS}-day free trial.`,
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
}

function nclexProofPoints(): string[] {
  return ["Reviewed by RN and PharmD clinicians", "Every answer explained"];
}

function nclexHeroOffer(
  units: BoardQuestionUnits | null
): NonNullable<BoardLandingModel["heroOffer"]> {
  const price = formatMonthlyPrice("pro");
  return {
    liveQuestions: units ? formatExactQuestionCount(scoredQuestionCount(units)) : null,
    proPrice: `${price}/mo`,
    questionNoun: "NCLEX questions",
    trialLine: formatLandingHeroTrialLine(),
  };
}

/** Three verifiable differentiators for the lean NCLEX hero (pricing comes from live config). */
export function nclexHeroChips(offer: NonNullable<BoardLandingModel["heroOffer"]>): BoardLandingModel["heroChips"] {
  return [
    {
      id: "price",
      text: `${offer.proPrice} · ${TRIAL_DAYS}-day free trial`,
    },
    {
      id: "explained",
      text: "Detailed rationales with sources on scored bank items.",
    },
    {
      id: "included",
      text: "NGN case studies, CAT-style exams, and readiness in your dashboard — no add-ons.",
    },
  ];
}

function nclexStats(units: BoardQuestionUnits | null): { value: string; label: string }[] {
  if (!units) return [];
  const stats = [{ value: formatExactQuestionCount(scoredQuestionCount(units)), label: "Questions" }];
  if (units.caseStudies > 0) {
    stats.push({ value: formatExactQuestionCount(units.caseStudies), label: "Case studies" });
  }
  const ngn = publishedNgnItemCount(units);
  if (ngn > 0) {
    stats.push({ value: formatExactQuestionCount(ngn), label: "Published NGN items" });
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
  bankTypes?: Record<string, number>;
  sample: PublicSampleQuestion | null;
  sampleSecondary?: LandingQuestion | null;
  testimonials?: LandingSuccessStory[];
  nclexTrustAudienceCount?: number;
}): BoardLandingModel {
  const units = liveUnits(input.units, input.degraded);
  const formats: BoardFormatCard[] = [];
  const sample = input.sample ? landingQuestionFromPublic(input.sample) : fallbackNclexQuestion();
  const stories = landingTestimonialStories(input.testimonials ?? [], "nclex");
  const faqs = nclexFaqs(units);
  const proofPoints = nclexProofPoints();
  const heroOffer = nclexHeroOffer(units);
  const heroChips = nclexHeroChips(heroOffer);
  const bankTypes = input.bankTypes ?? {};
  const quickBite = openBoardQuickBite("nursing");
  const features = nclexFeatureCards({ units, bankTypes, quickBite });
  const price = formatMonthlyPrice("pro");
  const trialHref = landingTrialHrefForExam("nclex");
  const nclexLabel = boardLandingBreadcrumbName("nclex");
  const links: BoardLandingModel["links"] = [];
  const video = boardVideoNode(quickBite, "/nclex");
  const graph = boardLandingBaseGraph({
    pagePath: "/nclex",
    breadcrumbName: nclexLabel,
    pageName: nclexMetaTitle(),
    productDescription: `NCLEX-RN practice questions, Next Gen NCLEX practice, and five other boards on one plan at ${price}/mo.`,
    trialHref,
    faqs,
  });
  if (video) graph.push(video);
  const visuals = buildBoardVisuals({
    slug: "nclex",
    examKey: "nclex",
    units,
    offer: heroOffer,
    bankTypes,
  });
  const secondary =
    input.sampleSecondary && input.sampleSecondary.stem !== sample.stem ? input.sampleSecondary : null;
  return withBoardHeroMarketing("nclex", {
    h1Lead: "",
    h1Accent: "",
    lede: heroWhyUs("nclex"),
    trialHref,
    trialLabel: homeTrialCtaLabel(),
    trust: boardLandingTrustPills(),
    heroOffer,
    heroChips,
    proofPoints: [],
    features,
    stats: nclexStats(units),
    countLine: null,
    priceHeading: "Simple pricing.",
    priceLede: `${price}/mo for NCLEX and five other boards after your ${TRIAL_DAYS}-day trial.`,
    prices: [
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
    storyNote: "",
    faqs,
    links,
    finalHeading: BOARD_LANDING_FINAL_HEADING,
    finalLede: "No payment method required.",
    boardName: nclexLabel,
    sampleKicker: "Free NCLEX-RN practice question",
    explainedTitle: "Sample NCLEX-RN question",
    statsLabel: "Live NCLEX-RN bank counts",
    linksHeading: "More NCLEX practice",
    formatAnchor: "next-gen",
    sceneKicker: "Next Gen case",
    sceneIdPrefix: "nclex",
    heroCtaName: "nclex_hero_trial",
    heroCtaLocation: "nclex_hero",
    finalCtaName: "nclex_final_trial",
    finalCtaLocation: "nclex_final",
    themeClass: boardThemeClass("nclex"),
    heroWhyUs: heroWhyUs("nclex"),
    heroTestimonial: null,
    ctaMicrocopy: formatHeroCtaMicrocopy(heroOffer.liveQuestions),
    contentYear: BOARD_LANDING_CONTENT_YEAR,
    painPoints: boardPainPoints("nclex"),
    visuals,
    sampleSecondary: secondary,
    nclexCompare: buildNclexCompareChartData(units),
    studentTrustBadge: studentTrustBadgeFromCount(input.nclexTrustAudienceCount ?? 0),
    jsonLd: { "@context": "https://schema.org", "@graph": graph },
  });
}
