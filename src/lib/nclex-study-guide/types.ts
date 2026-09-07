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

export type SgChapterDto = SgTocChapter & {
  guideId: string;
  bodyMd: string;
  bodyHtml: string;
  prevSlug: string | null;
  nextSlug: string | null;
};

export type SgReaderPrefs = {
  fontSize: "sm" | "md" | "lg" | "xl";
  lineHeight: "snug" | "normal" | "relaxed";
  theme: "paper" | "dim" | "dark";
};
