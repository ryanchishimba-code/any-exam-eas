/** Board URL slugs. Kept separate so nav and pricing do not import exam SEO or study guides. */
export const MARKETING_BOARD_SLUGS = [
  "nclex",
  "usmle",
  "naplex",
  "pance",
  "aanp-fnp",
  "npte-pt",
] as const;

export type MarketingBoardSlug = (typeof MARKETING_BOARD_SLUGS)[number];

export const MARKETING_DARK_HERO_PATHS = new Set<string>([
  "/",
  ...MARKETING_BOARD_SLUGS.map((slug) => `/${slug}`),
]);

export function marketingExamKeyFromPath(pathname: string): MarketingBoardSlug | null {
  const slug = pathname.replace(/^\//, "").split("/")[0] ?? "";
  return (MARKETING_BOARD_SLUGS as readonly string[]).includes(slug)
    ? (slug as MarketingBoardSlug)
    : null;
}
