import {
  BOARD_MARKETING_SLUGS,
  type BoardMarketingSlug,
} from "@/lib/landing/tokens";
import type { ExamSeoKey } from "@/lib/seo/exam-config";

const SLUG_SET = new Set<string>(BOARD_MARKETING_SLUGS);

export function isBoardMarketingSlug(value: string): value is BoardMarketingSlug {
  return SLUG_SET.has(value);
}

/** Map app exam slugs and SEO keys to marketing board slugs. */
export function toBoardMarketingSlug(slug: string): BoardMarketingSlug | null {
  if (slug === "aanpFnp") return "aanp-fnp";
  if (slug === "nptePt") return "npte-pt";
  if (isBoardMarketingSlug(slug)) return slug;
  return null;
}

export function boardAccentPillClass(slug: string): string {
  const board = toBoardMarketingSlug(slug);
  if (!board) return "aee-board-pill";
  return `aee-board-pill aee-board-pill--${board}`;
}

export function boardAccentFromHref(href: string): BoardMarketingSlug | null {
  const segment = href.replace(/^\//, "").split("/")[0] ?? "";
  return toBoardMarketingSlug(segment);
}

export function boardAccentForExamKey(exam: ExamSeoKey): BoardMarketingSlug {
  return toBoardMarketingSlug(exam) ?? "nclex";
}
