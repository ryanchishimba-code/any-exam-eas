import Link from "next/link";
import { examMarketingPath } from "@/lib/seo/exam-config";
import { SEO_LIVE_STATS } from "@/lib/seo/seo-copy";
import { PLATFORM_EXAM_LIST } from "@/lib/landing/content";
import { ROUTES } from "@/lib/routes";
import { formatMonthlyPrice, SITE_NAME } from "@/lib/site";

const EXAM_LINKS = [
  {
    href: examMarketingPath("nclex"),
    name: "NCLEX-RN",
    blurb: "NGN clinical judgment and prioritization.",
  },
  {
    href: examMarketingPath("usmle"),
    name: "USMLE",
    blurb: "Step 1 through Step 3 on one track.",
  },
  {
    href: examMarketingPath("naplex"),
    name: "NAPLEX",
    blurb: "Calculations, therapeutics, and cases.",
  },
  {
    href: examMarketingPath("pance"),
    name: "PANCE",
    blurb: "Organ-system vignettes for PA boards.",
  },
  {
    href: examMarketingPath("aanp-fnp"),
    name: "AANP FNP",
    blurb: "Primary-care decisions for FNP.",
  },
  {
    href: examMarketingPath("npte-pt"),
    name: "NPTE-PT",
    blurb: "Systems and clinical application.",
  },
] as const;

/**
 * Compact SEO guide for the homepage — below the conversion funnel.
 */
export function LandingSeoGuide({ questionCountLabel }: { questionCountLabel?: string }) {
  const count = questionCountLabel?.trim() || SEO_LIVE_STATS.questionCount;

  return (
    <section
      className="border-t border-[var(--color-border)] bg-[var(--color-bg)] px-5 py-16 sm:px-6 sm:py-20"
      aria-labelledby="seo-guide-heading"
    >
      <div className="mx-auto max-w-3xl">
        <h2
          id="seo-guide-heading"
          className="text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-tight tracking-tight text-[var(--color-ink)]"
        >
          Six boards. One subscription.
        </h2>
        <p className="mt-5 text-lg leading-relaxed text-[var(--color-ink)]">
          {SITE_NAME} unlocks {PLATFORM_EXAM_LIST} — {count} QA-gated items, Study Hub readiness,
          and Deep Dive lessons from {formatMonthlyPrice("pro")}/mo after a free trial.
        </p>

        <ul className="mt-10 grid gap-3 sm:grid-cols-2" role="list">
          {EXAM_LINKS.map((exam) => (
            <li key={exam.href}>
              <Link
                href={exam.href}
                className="block border-b border-[var(--color-border)] py-3 transition hover:text-[var(--color-accent)]"
              >
                <span className="text-base font-bold text-[var(--color-ink)]">{exam.name}</span>
                <span className="mt-1 block text-sm leading-snug text-[var(--color-ink-muted)]">
                  {exam.blurb}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap gap-5 text-base font-semibold">
          <Link href={ROUTES.pricing} className="text-[var(--color-accent)] hover:underline">
            Pricing →
          </Link>
          <Link href={ROUTES.toolkit} className="text-[var(--color-accent)] hover:underline">
            Toolkit →
          </Link>
          <Link href={ROUTES.compare} className="text-[var(--color-accent)] hover:underline">
            Compare →
          </Link>
        </div>
      </div>
    </section>
  );
}
