/**
 * TOC "section" values were ingested from each chapter's first H2
 * ("Why it matters on NCLEX"), which is not a book part. Hide those so the
 * contents list shows the published chapter title only.
 */
const NOT_A_BOOK_SECTION =
  /^(why (this chapter|it) matters|study-aid disclaimer|faq)\b/i;

const PLACEHOLDER =
  /(^|[\s_-])(pending|placeholder|tbd|todo|lorem)([\s_-]|$)/i;

export function visibleBookSection(label: string | null | undefined): string | null {
  const trimmed = label?.replace(/\s+/g, " ").trim() ?? "";
  if (!trimmed) return null;
  if (PLACEHOLDER.test(trimmed)) return null;
  if (NOT_A_BOOK_SECTION.test(trimmed)) return null;
  if (trimmed.length > 36) return null;
  return trimmed;
}
