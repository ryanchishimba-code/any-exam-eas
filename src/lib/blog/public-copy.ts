import { SITE_NAME } from "@/lib/site";
import { TRIAL_DAYS } from "@/lib/billing-config";
import {
  formatExactServeReadyCount,
  getPublishedQuestionStats,
} from "@/lib/marketing/bank-stats";

/** Public byline when CMS still has a placeholder author. */
export const BLOG_BRAND_BYLINE = "AnyExamEasy";

const PLACEHOLDER_AUTHORS = /^(dev user|test user|admin user|admin)$/i;

/** Guarantee-style claims that must never appear on public blog surfaces. */
const GUARANTEE_PATTERNS: Array<{ match: RegExp; replace: string }> = [
  { match: /\bfirst[- ]time pass guaranteed\b/gi, replace: "First-Time Pass Strategy" },
  { match: /\bpass guaranteed\b/gi, replace: "Pass-Focused Prep" },
  { match: /\bguaranteed pass\b/gi, replace: "Pass-Focused Prep" },
  { match: /\bguaranteed to pass\b/gi, replace: "built to help you prepare" },
  { match: /\bwe guarantee (?:you'?ll |you will )?pass\b/gi, replace: "we help you prepare" },
];

const SPAMMY_TITLE_PATTERNS: Array<{ match: RegExp; replace: string }> = [
  { match: /\bhow to pass ([^—]+?) first try\b/gi, replace: "How to prepare for $1" },
  { match: /\bspend less,? pass easy\b/gi, replace: "Study smarter on one plan" },
];

/** Invented marketing attributions that must never ship on public blog pages. */
const INVENTED_NAME_ALT =
  "Gerard N\\.|Prisca M\\.|Nathan C\\.|Brittany V\\.|Marcus W\\.|Keona T\\.|James O\\.|Sofia R\\.|Deja H\\.|Rachel B\\.|Maria L\\.|Ben K\\.|Priya S\\.|Alex T\\.";

function publishedTotalLabel(): string {
  return formatExactServeReadyCount(getPublishedQuestionStats().totalPublished);
}

export function publicBlogAuthorName(name: string | null | undefined): string {
  const trimmed = name?.trim();
  if (!trimmed || PLACEHOLDER_AUTHORS.test(trimmed)) return BLOG_BRAND_BYLINE;
  return trimmed;
}

function applyPatterns(
  text: string,
  patterns: Array<{ match: RegExp; replace: string }>
): string {
  return patterns.reduce((next, rule) => next.replace(rule.match, rule.replace), text);
}

export function scrubGuaranteeCopy(text: string): string {
  return applyPatterns(text, GUARANTEE_PATTERNS);
}

/** Stale bank totals + trial length from older CMS drafts (table cells included). */
export function scrubStaleOfferCopy(text: string): string {
  const total = publishedTotalLabel();
  const trialDays = String(TRIAL_DAYS);
  return text
    .replace(/\b48,775\b/g, total)
    .replace(/\b43(?:&#44;|,)?000(?:\s*<[^>]+>)*\s*\+?/g, total)
    .replace(/\b43k\+?\b/gi, total)
    .replace(/\b3-day(?:s)?(?:\s+free)?\s+trial\b/gi, `${trialDays}-day free trial`)
    .replace(/\b3\s+day(?:s)?(?:\s+free)?\s+trial\b/gi, `${trialDays}-day free trial`)
    .replace(/>(\s*)3[\s-]Days?(\s*)</gi, `>$1${trialDays} Days$2<`)
    .replace(/(?<=Free Trial[\s\S]{0,160})\b3[\s-]Days?\b/gi, `${trialDays} Days`);
}

function scrubInventedSocialProof(html: string): string {
  let next = html.replace(
    new RegExp(`<blockquote\\b[^>]*>[\\s\\S]*?(?:${INVENTED_NAME_ALT})[\\s\\S]*?<\\/blockquote>`, "gi"),
    ""
  );
  next = next.replace(
    new RegExp(
      `[“"‘'][^“"‘']{8,320}[”"’']\\s*(?:<[^>]+>\\s*)*[—–\\-]\\s*(?:${INVENTED_NAME_ALT})`,
      "gi"
    ),
    ""
  );
  next = next.replace(
    new RegExp(`<(p|li|h[1-6])\\b[^>]*>[\\s\\S]*?(?:${INVENTED_NAME_ALT})[\\s\\S]*?<\\/\\1>`, "gi"),
    ""
  );
  next = next.replace(/Students Are Saving Hundreds/gi, "What you can verify");
  return next;
}

function scrubPublicMarketingCopy(text: string): string {
  return scrubInventedSocialProof(scrubStaleOfferCopy(scrubGuaranteeCopy(text)));
}

/** Fallback when a title would otherwise stay empty after scrubbing. */
export function publicBlogTitle(title: string): string {
  const scrubbed = applyPatterns(scrubPublicMarketingCopy(title), SPAMMY_TITLE_PATTERNS).trim();
  return scrubbed || `${SITE_NAME} study guide`;
}

export function publicBlogExcerpt(excerpt: string): string {
  return scrubPublicMarketingCopy(excerpt);
}

export function publicBlogBody(html: string): string {
  return scrubPublicMarketingCopy(html);
}
