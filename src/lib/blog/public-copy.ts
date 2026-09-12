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

export function publicBlogAuthorName(name: string | null | undefined): string {
  const trimmed = name?.trim();
  if (!trimmed || PLACEHOLDER_AUTHORS.test(trimmed)) return BLOG_BRAND_BYLINE;
  return trimmed;
}

export function scrubGuaranteeCopy(text: string): string {
  return GUARANTEE_PATTERNS.reduce(
    (next, rule) => next.replace(rule.match, rule.replace),
    text
  );
}

/** Fallback when a title would otherwise stay empty after scrubbing. */
export function publicBlogTitle(title: string): string {
  const scrubbed = scrubGuaranteeCopy(title).trim();
  return scrubbed || `${SITE_NAME} study guide`;
}

export function publicBlogExcerpt(excerpt: string): string {
  return scrubGuaranteeCopy(excerpt);
}

export function publicBlogBody(html: string): string {
  return scrubGuaranteeCopy(html);
}
