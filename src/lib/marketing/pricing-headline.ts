import { examSlugFromFieldId } from "@/lib/edtech/exams";
import { marketingExamKeyFromPath, type MarketingBoardSlug } from "@/lib/marketing/board-paths";

const PREP_HEADLINE: Record<MarketingBoardSlug, string> = {
  nclex: "NCLEX-RN prep",
  usmle: "USMLE prep",
  naplex: "NAPLEX prep",
  pance: "PANCE prep",
  "aanp-fnp": "AANP FNP prep",
  "npte-pt": "NPTE-PT prep",
};

/** Pricing H1 when the visitor arrived with a board. Generic pages stay "Pro". */
export function pricingPrepHeadline(examKey: string): string {
  if (examKey in PREP_HEADLINE) return PREP_HEADLINE[examKey as MarketingBoardSlug];
  return "Pro";
}

export function pricingHeadlineFromField(field: string | null | undefined): string | null {
  const trimmed = field?.trim();
  if (!trimmed) return null;
  const slug = examSlugFromFieldId(trimmed);
  if (!slug || slug === "top500") return null;
  return pricingPrepHeadline(slug);
}

export function pricingHeadlineFromPath(pathname: string | null | undefined): string | null {
  if (!pathname) return null;
  const key = marketingExamKeyFromPath(pathname);
  return key ? pricingPrepHeadline(key) : null;
}

/**
 * Board context for /pricing: `?field=` (or `?exam=`) wins over the referrer.
 * Referrer may be a board hub path or a URL that already carries `field`.
 */
export function pricingHeadlineFromContext(input: {
  field?: string | null;
  exam?: string | null;
  referrerPath?: string | null;
  referrerField?: string | null;
}): string {
  return (
    pricingHeadlineFromField(input.field) ??
    pricingHeadlineFromPath(input.exam ? `/${input.exam.replace(/^\//, "")}` : null) ??
    pricingHeadlineFromField(input.referrerField) ??
    pricingHeadlineFromPath(input.referrerPath) ??
    "Pro"
  );
}
