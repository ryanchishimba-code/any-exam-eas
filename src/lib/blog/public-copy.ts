import { SITE_NAME } from "@/lib/site";

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

/** Stale marketing numbers / trial language from older CMS drafts. */
const STALE_OFFER_PATTERNS: Array<{ match: RegExp; replace: string }> = [
  { match: /\b48,775\b/g, replace: "47,969" },
  { match: /\b43,000\+?/g, replace: "47,969" },
  { match: /\b3-day (?:free )?trial\b/gi, replace: "5-day free trial" },
];

const SPAMMY_TITLE_PATTERNS: Array<{ match: RegExp; replace: string }> = [
  { match: /\bhow to pass ([^—]+?) first try\b/gi, replace: "How to prepare for $1" },
  { match: /\bspend less,? pass easy\b/gi, replace: "Study smarter on one plan" },
];

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

export function scrubStaleOfferCopy(text: string): string {
  return applyPatterns(text, STALE_OFFER_PATTERNS);
}

function scrubPublicMarketingCopy(text: string): string {
  return scrubStaleOfferCopy(scrubGuaranteeCopy(text));
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
