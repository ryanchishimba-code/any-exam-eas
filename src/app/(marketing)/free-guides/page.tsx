import Link from "next/link";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { LandingCta } from "@/components/landing/LandingCta";
import { LANDING_TRIAL_HREF } from "@/lib/landing/content";
import {
  formatMonthlyPrice,
  formatPricingCheckoutTrialOffer,
  formatTrialCtaLabel,
  formatTrialLabel,
  SITE_NAME,
} from "@/lib/site";
import { studyGuideOfferCards, studyGuideTrialLine } from "@/lib/marketing/study-guide-offer";
import { ROUTES } from "@/lib/routes";
import { examMarketingPath, type ExamSeoKey } from "@/lib/seo/exam-config";
import { buildFreeGuidesMetadata } from "@/lib/seo/marketing-metadata";
import { FALLBACK_QUESTION_COUNTS } from "@/lib/marketing/bank-stats";
import {
  buildLandingBankCountsDisplay,
  getCachedBankStatsBundle,
} from "@/lib/marketing/question-bank-counts";
import { TRIAL_DAYS } from "@/lib/billing-config";
import { absoluteUrl } from "@/lib/seo";

/** Guide index prints the live bank total. Do not keep yesterday's snapshot. */
export const dynamic = "force-dynamic";

export const metadata = buildFreeGuidesMetadata();

const TOOLKIT_WINS = [
  {
    href: ROUTES.drugs300,
    title: "Top 500 Drugs",
    body: "High-yield drug cards plus FDA reference search.",
  },
  {
    href: ROUTES.anatomy,
    title: "Anatomy Explorer",
    body: "Structures and procedures for clinical exams.",
  },
  {
    href: `${ROUTES.library}#hub-calculators`,
    title: "Lab values & calculators",
    body: "Board-relevant ranges and clinical calculators.",
  },
  {
    href: ROUTES.toolkit,
    title: "Full toolkit",
    body: "Official blueprints, compare guides, and more free tools.",
  },
] as const;

const BOARD_HUBS: { key: ExamSeoKey; label: string }[] = [
  { key: "nclex", label: "NCLEX" },
  { key: "usmle", label: "USMLE" },
  { key: "naplex", label: "NAPLEX" },
  { key: "pance", label: "PANCE" },
  { key: "aanp-fnp", label: "AANP FNP" },
  { key: "npte-pt", label: "NPTE-PT" },
];

function buildFreeGuidesJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Free board tools and premium reference books",
    url: absoluteUrl(ROUTES.freeGuides),
    description: `Free toolkit tools and board hubs from ${SITE_NAME}. Reference books are not a free preview. ${studyGuideTrialLine()}`,
  };
}

export default async function FreeGuidesPage() {
  const { snapshot } = await getCachedBankStatsBundle();
  const bankCounts = buildLandingBankCountsDisplay(snapshot);
  const liveTotal = !bankCounts.degraded && bankCounts.totalServed > 0;
  const questionTotal = liveTotal ? bankCounts.totalLabel : FALLBACK_QUESTION_COUNTS.total;
  return (
    <>
      <JsonLdScript data={buildFreeGuidesJsonLd()} />
      <div className="min-h-screen bg-[var(--color-bg)]">
        <section className="relative overflow-hidden px-6 pt-[var(--page-top)] pb-16 sm:pb-20">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-[320px] bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,color-mix(in_srgb,var(--color-accent)_10%,transparent),transparent)]"
            aria-hidden
          />
          <div className="relative mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
              Free guides
            </p>
            <h1 className="apple-display mt-5 leading-[1.05]">
              Start with the free tools.
            </h1>
            <p className="apple-subhead mx-auto mt-6 max-w-xl text-[var(--color-ink)]">
              Drug cards, anatomy, and six board hubs are open. Reference books — with
              bookmarks and highlights — open on a {TRIAL_DAYS}-day free trial, then Pro
              at {formatMonthlyPrice("pro")}/mo. {questionTotal}{" "}
              {liveTotal
                ? "active questions across six boards"
                : "is the published floor while the live count is unavailable"}
              .
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <LandingCta href={LANDING_TRIAL_HREF}>{formatTrialCtaLabel()}</LandingCta>
              <Link
                href={ROUTES.toolkit}
                className="text-base font-semibold text-[var(--color-accent)] hover:underline"
              >
                Browse the toolkit →
              </Link>
            </div>
          </div>
        </section>

        <section
          className="border-y border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-[var(--landing-section-py,4rem)]"
          id="study-guides"
          aria-labelledby="free-guides-books-heading"
        >
          <div className="mx-auto max-w-6xl">
            <h2
              id="free-guides-books-heading"
              className="text-center text-[clamp(1.75rem,4vw,2.75rem)] font-bold tracking-tight text-[var(--color-ink)]"
            >
              Reference books
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-base leading-relaxed text-[var(--color-ink-muted)]">
              The study guide is included with the 5-day free trial. {studyGuideTrialLine()} Bookmarks
              and highlights save on the trial or Pro plan.
            </p>
            <ul className="mt-12 grid gap-6 sm:grid-cols-3" role="list">
              {studyGuideOfferCards().map((item) => (
                <li key={item.exam}>
                  <article className="flex h-full flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6">
                    <h3 className="text-lg font-bold tracking-tight text-[var(--color-ink)]">
                      {item.title}
                    </h3>
                    <p className="mt-2 flex-1 text-base leading-relaxed text-[var(--color-ink-muted)]">
                      {item.body}
                    </p>
                    <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
                      <Link
                        href={item.trialHref}
                        className="text-sm font-semibold text-[var(--color-accent)] hover:underline"
                      >
                        Start {formatTrialLabel()}
                      </Link>
                      <Link
                        href={item.signInHref}
                        className="text-sm font-semibold text-[var(--color-ink)] hover:underline"
                      >
                        Sign in
                      </Link>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          className="px-6 py-[var(--landing-section-py,4rem)]"
          aria-labelledby="free-guides-toolkit-heading"
        >
          <div className="mx-auto max-w-6xl">
            <h2
              id="free-guides-toolkit-heading"
              className="text-[clamp(1.75rem,4vw,2.75rem)] font-bold tracking-tight text-[var(--color-ink)]"
            >
              Toolkit
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--color-ink-muted)]">
              Drugs, anatomy, and calculators — the same tools inside the product.
            </p>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" role="list">
              {TOOLKIT_WINS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block h-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition hover:border-[var(--color-accent)]/40"
                  >
                    <span className="text-lg font-bold text-[var(--color-ink)]">{item.title}</span>
                    <span className="mt-2 block text-base leading-relaxed text-[var(--color-ink-muted)]">
                      {item.body}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          className="border-t border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-[var(--landing-section-py,4rem)]"
          aria-labelledby="free-guides-boards-heading"
        >
          <div className="mx-auto max-w-6xl">
            <h2
              id="free-guides-boards-heading"
              className="text-center text-[clamp(1.75rem,4vw,2.75rem)] font-bold tracking-tight text-[var(--color-ink)]"
            >
              Board hubs
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-base leading-relaxed text-[var(--color-ink-muted)]">
              One login for six boards. Open the hub for the exam in front of you.
            </p>
            <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="list">
              {BOARD_HUBS.map(({ key, label }) => (
                <li key={key}>
                  <Link
                    href={examMarketingPath(key)}
                    className="block rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-6 py-5 text-lg font-bold text-[var(--color-ink)] transition hover:border-[var(--color-accent)]/40 hover:text-[var(--color-accent)]"
                  >
                    {label} prep →
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-t border-[var(--color-border)] px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-base leading-relaxed text-[var(--color-ink-muted)]">
              Ready to practice? {formatPricingCheckoutTrialOffer()}.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <LandingCta href={LANDING_TRIAL_HREF}>{formatTrialCtaLabel()}</LandingCta>
              <Link
                href={ROUTES.pricing}
                className="text-base font-semibold text-[var(--color-accent)] hover:underline"
              >
                View pricing →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
