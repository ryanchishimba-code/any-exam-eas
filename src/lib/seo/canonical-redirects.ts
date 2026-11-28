/**
 * Public aliases that must 301 to one canonical URL.
 * Sitemap entries never use the source path.
 * Retired study-hub rules stay 308 in their own module.
 */
export const CONTENT_CANONICAL_REDIRECTS: ReadonlyArray<{
  source: string;
  destination: string;
}> = [
  { source: "/npte", destination: "/npte-pt" },
  { source: "/blog/strategies", destination: "/blog/nclex-study-plan-rn-pn" },
  { source: "/blog/why", destination: "/blog/affordable-nclex-prep" },
  { source: "/blog/okay", destination: "/blog/naplex-study-plan" },
  {
    source: "/resources/uworld-alternative-multi-exam-prep-2026",
    destination: "/resources/multi-exam-board-prep-2026",
  },
  {
    source: "/resources/nclex-vs-uworld-comparison-2026",
    destination: "/resources/nclex-single-exam-qbank-comparison-2026",
  },
  {
    source: "/resources/nclex-vs-archer-comparison-2026",
    destination: "/resources/nclex-cat-workflow-prep-comparison-2026",
  },
  {
    source: "/resources/naplex-vs-rxprep-comparison-2026",
    destination: "/resources/naplex-single-exam-qbank-comparison-2026",
  },
  { source: "/resources", destination: "/toolkit" },
  { source: "/feedback", destination: "/contact" },
  { source: "/methodology", destination: "/how-questions-are-reviewed" },
  { source: "/terms", destination: "/legal/terms" },
  { source: "/privacy", destination: "/legal/privacy" },
  { source: "/refund", destination: "/legal/refunds" },
  { source: "/refunds", destination: "/legal/refunds" },
  { source: "/cancel", destination: "/legal/refunds" },
  { source: "/cancellation", destination: "/legal/refunds" },
  { source: "/cookies", destination: "/legal/privacy" },
  { source: "/fnp", destination: "/aanp-fnp" },
  { source: "/free-questions", destination: "/#try-questions" },
  { source: "/sample", destination: "/#try-questions" },
  { source: "/auth/signup", destination: "/signup" },
  { source: "/mpje", destination: "/naplex" },
  { source: "/mpje/practice-exam", destination: "/naplex" },
  { source: "/mpje/:path*", destination: "/naplex" },
  { source: "/exams/mpje", destination: "/naplex" },
  { source: "/usmle/step-1", destination: "/usmle" },
  { source: "/usmle/step-2", destination: "/usmle" },
  { source: "/usmle/step-2-ck", destination: "/usmle" },
  { source: "/usmle/step-3", destination: "/usmle" },
  { source: "/studygub", destination: "/dashboard" },
  { source: "/dashboard/roadmap", destination: "/dashboard" },
  { source: "/exams/:exam", destination: "/:exam" },
];

export function contentCanonicalRedirectRules(): Array<{
  source: string;
  destination: string;
  statusCode: 301;
}> {
  return CONTENT_CANONICAL_REDIRECTS.map((rule) => ({
    source: rule.source,
    destination: rule.destination,
    statusCode: 301,
  }));
}

/** Exact paths (no patterns) that must never appear in a sitemap loc. */
export function exactRedirectSources(): string[] {
  return CONTENT_CANONICAL_REDIRECTS.filter((rule) => !rule.source.includes(":")).map(
    (rule) => rule.source
  );
}
