import Link from "next/link";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { LandingCta } from "@/components/landing/LandingCta";
import { LANDING_TRIAL_HREF } from "@/lib/landing/content";
import { formatTrialCtaLabel, SITE_NAME } from "@/lib/site";
import { ROUTES } from "@/lib/routes";
import { examMarketingPath, type ExamSeoKey } from "@/lib/seo/exam-config";
import { getArticlesForExam } from "@/lib/seo/resources-content";
import { NCLEX_OFFICIAL_LINKS } from "@/lib/nursing/official-links";
import { NAPLEX_OFFICIAL_LINKS } from "@/lib/pharmacy/official-links";
import { buildToolkitHubJsonLd, buildToolkitHubMetadata } from "@/lib/seo/marketing-metadata";

export const revalidate = 86400;

export const metadata = buildToolkitHubMetadata();

/**
 * Real in-product / marketing routes used below (verified against ROUTES + examMarketingPath):
 * - Exam hubs: /usmle /nclex /naplex /pance /aanp-fnp /npte-pt
 * - Lab values & calculators: /library#hub-calculators
 * - Top 509 drugs: /study/drugs300
 * - Anatomy Explorer: /anatomy
 * - Blueprint Roadmaps (Study Hub): /dashboard
 * - Compare guides: /compare
 * - Resource articles: /resources/[slug]
 */

const EXAM_CARDS: { key: ExamSeoKey; label: string }[] = [
  { key: "usmle", label: "USMLE" },
  { key: "nclex", label: "NCLEX" },
  { key: "naplex", label: "NAPLEX" },
  { key: "pance", label: "PANCE" },
  { key: "aanp-fnp", label: "AANP FNP" },
  { key: "npte-pt", label: "NPTE-PT" },
];

const IN_PRODUCT_LINKS = [
  {
    href: `${ROUTES.library}#hub-calculators`,
    title: "Lab values & calculators",
    body: "Clinical calculators and study tools in Library.",
  },
  {
    href: ROUTES.drugs300,
    title: "Top 509 drugs",
    body: "High-yield drug cards for board prep.",
  },
  {
    href: ROUTES.anatomy,
    title: "Anatomy Explorer",
    body: "Structures and procedures for clinical exams.",
  },
  {
    href: ROUTES.dashboard,
    title: "Blueprint Roadmaps",
    body: "Domain readiness on your Study Hub dashboard.",
  },
  {
    href: ROUTES.compare,
    title: "Compare guides",
    body: "How one plan stacks up against single-exam banks.",
  },
] as const;

/** Official NAPLEX links from the brief (subset of NABP list). */
const NAPLEX_BOARD_LINKS = NAPLEX_OFFICIAL_LINKS.filter((link) =>
  [
    "https://nabp.pharmacy/wp-content/uploads/NAPLEX-Content-Outline.pdf",
    "https://nabp.pharmacy/programs/examinations/naplex/competency-statements/",
    "https://nabp.pharmacy/programs/examinations/naplex/take-the-naplex-exam/",
  ].includes(link.href)
);

const USMLE_BOARD_LINKS = [
  { label: "USMLE.org", href: "https://www.usmle.org" },
  { label: "NBME.org", href: "https://www.nbme.org" },
] as const;

const BOARD_DISCLAIMER =
  "Independent. Not affiliated with NCSBN, NABP, NBME, or the exam owners. Their documents govern the sitting.";

function ExternalBoardLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-[var(--color-accent)] hover:underline"
    >
      {label}
    </a>
  );
}

export default function ToolkitPage() {
  return (
    <>
      <JsonLdScript data={buildToolkitHubJsonLd()} />
      <div className="min-h-screen bg-[var(--color-bg)]">
        <section className="relative overflow-hidden px-6 pt-[var(--page-top)] pb-16 sm:pb-20">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-[320px] bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,color-mix(in_srgb,var(--color-accent)_10%,transparent),transparent)]"
            aria-hidden
          />
          <div className="relative mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
              {SITE_NAME} Toolkit
            </p>
            <h1 className="apple-display mt-5 leading-[1.05]">
              Tools for the board in front of you.
            </h1>
            <p className="apple-subhead mx-auto mt-6 max-w-xl text-[var(--color-ink)]">
              Official blueprints, lab values, Top 509 drugs, Anatomy Explorer, and exam guides. One
              login for six boards.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <LandingCta href={LANDING_TRIAL_HREF}>{formatTrialCtaLabel()}</LandingCta>
              <Link
                href={ROUTES.auth.login}
                className="text-base font-semibold text-[var(--color-accent)] hover:underline"
              >
                Log in →
              </Link>
            </div>
          </div>
        </section>

        <section
          className="border-y border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-[var(--landing-section-py,4rem)]"
          aria-labelledby="toolkit-exams-heading"
        >
          <div className="mx-auto max-w-6xl">
            <h2
              id="toolkit-exams-heading"
              className="text-center text-[clamp(1.75rem,4vw,2.75rem)] font-bold tracking-tight text-[var(--color-ink)]"
            >
              Choose your exam
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-base leading-relaxed text-[var(--color-ink-muted)]">
              Open the prep hub, then jump into guides already published for that board.
            </p>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {EXAM_CARDS.map(({ key, label }) => {
                const articles = getArticlesForExam(key).slice(0, 4);
                return (
                  <div
                    key={key}
                    className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6"
                  >
                    <Link
                      href={examMarketingPath(key)}
                      className="text-xl font-bold text-[var(--color-ink)] hover:text-[var(--color-accent)]"
                    >
                      {label} →
                    </Link>
                    {articles.length > 0 ? (
                      <ul className="mt-4 space-y-2.5" role="list">
                        {articles.map((article) => (
                          <li key={article.slug}>
                            <Link
                              href={`/resources/${article.slug}`}
                              className="text-base leading-snug text-[var(--color-ink-muted)] hover:text-[var(--color-accent)]"
                            >
                              {article.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-3 text-base text-[var(--color-ink-muted)]">
                        Prep hub and practice for this board.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section
          className="px-6 py-[var(--landing-section-py,4rem)]"
          aria-labelledby="toolkit-product-heading"
        >
          <div className="mx-auto max-w-6xl">
            <h2
              id="toolkit-product-heading"
              className="text-[clamp(1.75rem,4vw,2.75rem)] font-bold tracking-tight text-[var(--color-ink)]"
            >
              In the product
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--color-ink-muted)]">
              Live study instruments — open them where you already practice.
            </p>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="list">
              {IN_PRODUCT_LINKS.map((item) => (
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
          aria-labelledby="toolkit-boards-heading"
        >
          <div className="mx-auto max-w-6xl">
            <h2
              id="toolkit-boards-heading"
              className="text-[clamp(1.75rem,4vw,2.75rem)] font-bold tracking-tight text-[var(--color-ink)]"
            >
              From the boards
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--color-ink-muted)]">
              Official documents and program pages — open in a new tab.
            </p>

            <div className="mt-12 grid gap-10 md:grid-cols-3">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--color-ink)]">
                  NCLEX
                </h3>
                <ul className="mt-4 space-y-3 text-base">
                  {NCLEX_OFFICIAL_LINKS.map((link) => (
                    <li key={link.href}>
                      <ExternalBoardLink href={link.href} label={link.label} />
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--color-ink)]">
                  NAPLEX
                </h3>
                <ul className="mt-4 space-y-3 text-base">
                  {NAPLEX_BOARD_LINKS.map((link) => (
                    <li key={link.href}>
                      <ExternalBoardLink href={link.href} label={link.label} />
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--color-ink)]">
                  USMLE
                </h3>
                <ul className="mt-4 space-y-3 text-base">
                  {USMLE_BOARD_LINKS.map((link) => (
                    <li key={link.href}>
                      <ExternalBoardLink href={link.href} label={link.label} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="mt-10 max-w-3xl text-sm leading-relaxed text-[var(--color-ink-muted)]">
              {BOARD_DISCLAIMER}
            </p>
          </div>
        </section>

        <section className="border-t border-[var(--color-border)] px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-base leading-relaxed text-[var(--color-ink-muted)]">
              Ready to practice? Start a trial or open pricing.
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
