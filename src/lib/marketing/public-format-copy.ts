import type { FormatCounts } from "@/lib/inventory/active-questions";
import { SEO_LIVE_STATS } from "@/lib/seo/seo-copy";
import {
  getExamSeoConfig,
  type ExamSeoConfig,
  type ExamSeoKey,
} from "@/lib/seo/exam-config";

/**
 * Product claims for a format the board is not serving.
 * "Patient case vignettes" and "case-based pharmacotherapy" are not the
 * Case study format and must stay.
 */
const NGN_CLAIM =
  /\bNGN\b|next[- ]generation|bow-?tie|select-all-that-apply|\bSATA\b|matrix item/i;
const CASE_CLAIM = /unfolding case|case stud(?:y|ies)|CCS-style|\bCCS\b/i;

export type OfferedFormatFlags = {
  ngn: boolean;
  case: boolean;
};

export function offeredFormatFlags(
  formats: FormatCounts | null | undefined
): OfferedFormatFlags {
  return {
    ngn: (formats?.ngn ?? 0) > 0,
    case: (formats?.case ?? 0) > 0,
  };
}

export function advertisesHiddenFormat(
  text: string,
  offered: OfferedFormatFlags
): boolean {
  if (!offered.ngn && NGN_CLAIM.test(text)) return true;
  if (!offered.case && CASE_CLAIM.test(text)) return true;
  return false;
}

const NCLEX_META_WITHOUT_NGN = `NCLEX practice questions, Blueprint Roadmaps, Deep Dives & Full Exams. Clinician-built Qbank. ${SEO_LIVE_STATS.trialDays}-day free trial · no payment method required.`;

/** Exact replacements. Null drops the line. Missing keys drop unmatched claims. */
const PUBLIC_FORMAT_FALLBACKS: Record<string, string | null> = {
  "NGN formats on NCLEX": null,
  "NGN-ready NCLEX formats + teachable rationales (not template distractors)":
    "Teachable rationales on every served item (not template distractors)",
  "NGN formats on NCLEX; structured/expert rationales (growing coverage)":
    "Structured, teachable rationales across the banks (growing coverage).",
  "NGN + teachable rationales": "Teachable rationales",
  "NGN clinical judgment and prioritization.": "Clinical judgment and prioritization.",
  "NGN vignettes and clinical judgment — try a free sample, then keep going.":
    "Clinical judgment and prioritization — try a free sample, then keep going.",
  "Step-day vignettes and CCS-style reasoning — try a free sample, then keep going.":
    "Step-day vignettes — try a free sample, then keep going.",
  "Clinical judgment, NGN formats, and high-yield nursing scenarios.":
    "Clinical judgment and high-yield nursing scenarios.",
  "Clinical judgment, prioritization, and Next-Gen NCLEX formats.":
    "Clinical judgment and prioritization.",
  "Master clinical judgment, prioritization, and Next-Gen formats with nursing-first prep.":
    "Master clinical judgment and prioritization with nursing-first prep.",
  "High-yield NCLEX-RN vignettes, Next Generation NCLEX (NGN) item types, and a blueprint-aligned Roadmap — included in one affordable subscription with five other board exams.":
    "High-yield NCLEX-RN vignettes and a blueprint-aligned Roadmap — included in one affordable subscription with five other board exams.",
  "Dedicated banks for every step — basic sciences, clinical vignettes, biostatistics, and CCS-style cases — with blueprint Roadmaps and Deep Dives on a single subscription.":
    "Dedicated banks for every step — basic sciences, clinical vignettes, and biostatistics — with blueprint Roadmaps and Deep Dives on a single subscription.",
  "Dedicated banks for Step 1 basic sciences, Step 2 CK clinical management, and Step 3 biostatistics, ethics, abstracts, and CCS-style cases.":
    "Dedicated banks for Step 1 basic sciences, Step 2 CK clinical management, and Step 3 biostatistics, ethics, and abstracts.",
  "Use step-specific banks — mechanisms and pathology for Step 1, next-best-step vignettes for Step 2 CK, and biostatistics/CCS cases for Step 3.":
    "Use step-specific banks — mechanisms and pathology for Step 1, next-best-step vignettes for Step 2 CK, and biostatistics and ethics for Step 3.",
  "Step 1 basic sciences, Step 2 CK clinical vignettes, and Step 3 CCS-style cases.":
    "Step 1 basic sciences, Step 2 CK clinical vignettes, and Step 3 management.",
  "Full USMLE coverage — Step 1 basic sciences, Step 2 CK clinical vignettes, and Step 3 CCS-style cases.":
    "Full USMLE coverage — Step 1 basic sciences, Step 2 CK clinical vignettes, and Step 3 management.",
  "Curated blocks for prioritization, SATA, calculations, trap-tier judgment, and CAT-style exams.":
    "Curated blocks for prioritization, calculations, trap-tier judgment, and CAT-style exams.",
  "Domain blocks, lifespan drills, pharm, preventive care, SATA, and a timed full mock — packaged like top FNP QBanks.":
    "Domain blocks, lifespan drills, pharm, preventive care, and a timed full mock — packaged like top FNP QBanks.",
  "SATA mastery": null,
  "SATA + calc mix": "Dosage calc sprint",
  "Roadmap. Deep Dive. Sample NGN.": "Roadmap. Deep Dive. Practice.",
  "NGN NCLEX questions": null,
};

/**
 * Keep the sentence when the board serves that format.
 * Unknown inventory hides the claim so a loading page cannot advertise it.
 * Returns null when the line should disappear.
 */
export function scrubPublicFormatCopy(
  text: string,
  formats: FormatCounts | null | undefined
): string | null {
  const offered = offeredFormatFlags(formats);
  if (!advertisesHiddenFormat(text, offered)) return text;
  if (Object.prototype.hasOwnProperty.call(PUBLIC_FORMAT_FALLBACKS, text)) {
    const fallback = PUBLIC_FORMAT_FALLBACKS[text];
    if (fallback == null) return null;
    return scrubPublicFormatCopy(fallback, formats);
  }
  if (text === NCLEX_META_WITHOUT_NGN) return text;
  if (
    text.startsWith("NCLEX practice questions with NGN formats")
  ) {
    return scrubPublicFormatCopy(NCLEX_META_WITHOUT_NGN, formats);
  }
  return null;
}

export function presentPublicExamSeo(
  config: ExamSeoConfig,
  formats: FormatCounts | null | undefined
): ExamSeoConfig {
  const metaDescription =
    scrubPublicFormatCopy(config.metaDescription, formats) ?? config.metaDescription;
  const heroSubline =
    scrubPublicFormatCopy(config.heroSubline, formats) ?? config.heroSubline;
  return {
    ...config,
    metaDescription,
    heroSubline,
    keywords: config.keywords.filter(
      (keyword) => scrubPublicFormatCopy(keyword, formats) === keyword
    ),
    features: config.features.flatMap((feature) => {
      const title = scrubPublicFormatCopy(feature.title, formats);
      const detail = scrubPublicFormatCopy(feature.detail, formats);
      if (!title || !detail) return [];
      return [{ title, detail }];
    }),
    studyTips: config.studyTips.flatMap((tip) => {
      const heading = scrubPublicFormatCopy(tip.heading, formats);
      const body = scrubPublicFormatCopy(tip.body, formats);
      if (!heading || !body) return [];
      return [{ heading, body }];
    }),
    faqs: config.faqs.flatMap((faq) => {
      const question = scrubPublicFormatCopy(faq.question, formats);
      const answer = scrubPublicFormatCopy(faq.answer, formats);
      if (!question || !answer) return [];
      return [{ question, answer }];
    }),
  };
}

export function publicExamSeo(
  key: ExamSeoKey,
  formats: FormatCounts | null | undefined
): ExamSeoConfig {
  return presentPublicExamSeo(getExamSeoConfig(key), formats);
}
