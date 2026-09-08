/** Highlight colors for the Study Guide reader. */
export const SG_HIGHLIGHT_COLORS = [
  "yellow",
  "teal",
  "gold",
  "rose",
  "lavender",
] as const;

export type SgHighlightColor = (typeof SG_HIGHLIGHT_COLORS)[number];

export function isSgHighlightColor(v: string): v is SgHighlightColor {
  return (SG_HIGHLIGHT_COLORS as readonly string[]).includes(v);
}

export type SgExamTrack = "rn" | "pn";

export type SgTocChapter = {
  id: string;
  slug: string;
  title: string;
  sectionLabel: string;
  sortOrder: number;
  estimatedMinutes: number;
};

/** A deep dive reachable from a chapter. Each href is only present when there is
 *  real content behind it, so the reader can render whatever it is given. */
export type SgRelatedTopic = {
  slug: string;
  title: string;
  summary?: string;
  /** High-Yield review module. Absent for topics the hub cannot display. */
  deepDiveHref?: string;
  libraryHref?: string;
  libraryCardCount: number;
  anatomyHref?: string;
  anatomyLabel?: string;
};

/** Chapter as sent to the reader. Raw markdown is deliberately excluded — the
 *  client renders `bodyHtml`, and shipping both roughly doubles the payload. */
export type SgChapterDto = SgTocChapter & {
  guideId: string;
  bodyHtml: string;
  prevSlug: string | null;
  nextSlug: string | null;
  relatedTopics: SgRelatedTopic[];
};

export type SgReaderPrefs = {
  fontSize: "sm" | "md" | "lg" | "xl";
  lineHeight: "snug" | "normal" | "relaxed";
  theme: "paper" | "dim" | "dark";
};
