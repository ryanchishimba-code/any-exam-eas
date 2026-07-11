import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  HeartPulse,
  MapPin,
  ShieldCheck,
  Star,
} from "lucide-react";
import { LandingCta } from "@/components/landing/LandingCta";
import { AboutValueCards } from "@/components/about/AboutValueCards";
import { AboutShowdownLazy } from "@/components/about/AboutShowdownLazy";
import { LANDING_TRIAL_HREF, PLATFORM_EXAM_LIST } from "@/lib/landing/content";
import { ROUTES } from "@/lib/routes";
import { formatMonthlyPrice, formatTrialCtaLabel, formatTrialLabel, SITE_NAME } from "@/lib/site";
import { buildAboutMetadata, buildAboutJsonLd } from "@/lib/seo/marketing-metadata";
import { examMarketingPath } from "@/lib/seo/exam-config";
import { SEO_LIVE_STATS } from "@/lib/seo/seo-copy";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import {
  buildLandingBankCountsDisplay,
  getCachedQuestionBankCounts,
} from "@/lib/marketing/question-bank-counts";

export const revalidate = 3600;

export async function generateMetadata() {
  try {
    const snapshot = await getCachedQuestionBankCounts();
    const display = buildLandingBankCountsDisplay(snapshot);
    if (!snapshot.degraded && display.totalServed > 0) {
      return buildAboutMetadata(display.totalQuestionsLabel);
    }
  } catch {
    /* static fallback */
  }
  return buildAboutMetadata();
}

const TRUST_POINTS = [
  {
    icon: ShieldCheck,
    title: "Written by licensed providers",
    blurb:
      "Real healthcare professionals build and review the content — not anonymous content mills.",
  },
  {
    icon: HeartPulse,
    title: "Frontline-tested rationales",
    blurb:
      "12+ years of combined bedside experience means explanations that actually teach, not just label.",
  },
  {
    icon: BadgeCheck,
    title: "QA-gated, not crowd-sourced",
    blurb:
      "Every item clears a quality gate before it reaches you, so you can trust what you're studying.",
  },
];

const EXAM_HUB_LINKS = [
  { href: examMarketingPath("nclex"), label: "NCLEX-RN question bank" },
  { href: examMarketingPath("usmle"), label: "USMLE Steps 1–3" },
  { href: examMarketingPath("naplex"), label: "NAPLEX" },
  { href: examMarketingPath("pance"), label: "PANCE" },
  { href: examMarketingPath("aanp-fnp"), label: "AANP FNP" },
  { href: examMarketingPath("npte-pt"), label: "NPTE-PT" },
] as const;

export default async function AboutPage() {
  const snapshot = await getCachedQuestionBankCounts();
  const bankCounts = buildLandingBankCountsDisplay(snapshot);

  const heroStats = [
    {
      value: bankCounts.totalLabel,
      label: "Serve-ready questions",
    },
    { value: "6", label: "Boards, one plan" },
    { value: String(SEO_LIVE_STATS.topDrugsCount), label: "Top drugs + pearls" },
    { value: "12+ yrs", label: "Clinician experience" },
  ];

  return (
    <>
      <JsonLdScript data={buildAboutJsonLd()} />
      <div className="bg-[var(--color-bg)]">
        {/* ── 1. Hero ──────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden px-6 pt-[var(--page-top)]">
          <div className="mx-auto max-w-4xl pb-16 text-center sm:pb-20">
            <span className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--color-accent)_30%,transparent)] bg-[color-mix(in_srgb,var(--color-accent)_10%,var(--color-surface-elevated))] px-4 py-1.5 text-sm font-bold text-[var(--color-accent)] shadow-[var(--shadow-apple-sm)]">
              <MapPin className="h-4 w-4" aria-hidden />
              Built in the heart of Texas
            </span>

            <h1 className="mt-6 text-balance text-[clamp(2.25rem,6vw,3.5rem)] font-bold leading-[1.05] tracking-tight text-[var(--color-ink)]">
              The NCLEX &amp; USMLE question bank built for{" "}
              <span className="aee-flagship-gradient-text">six exams, one price.</span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-balance text-lg leading-relaxed text-[var(--color-ink-muted)]">
              {SITE_NAME} is a clinician-built platform for ambitious students who need serious{" "}
              <strong className="font-semibold text-[var(--color-ink)]">NCLEX practice questions</strong>,
              a full{" "}
              <strong className="font-semibold text-[var(--color-ink)]">USMLE question bank</strong>, and
              the same depth for NAPLEX, PANCE, AANP FNP, and NPTE-PT — without stacking six
              subscriptions.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <LandingCta href={LANDING_TRIAL_HREF} icon={<ArrowRight className="h-4 w-4" />}>
                {formatTrialCtaLabel()}
              </LandingCta>
              <Link
                href={ROUTES.pricing}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-5 py-2.5 text-sm font-bold text-[var(--color-ink)] shadow-[var(--shadow-apple-sm)] transition hover:shadow-[var(--shadow-apple-md)]"
              >
                See the pricing →
              </Link>
            </div>

            <dl className="mx-auto mt-12 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
              {heroStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 py-4 shadow-[var(--shadow-apple-sm)]"
                >
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="text-2xl font-extrabold tracking-tight text-[var(--color-ink)]">
                    {stat.value}
                  </dd>
                  <p className="mt-1 text-xs font-medium text-[var(--color-ink-muted)]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── 2. Mission / Philosophy ─────────────────────────────────── */}
        <section className="border-y border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-20">
          <div className="mx-auto max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-accent)]">
              Why we built this
            </p>
            <h2 className="mt-3 text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-tight tracking-tight text-[var(--color-ink)]">
              One affordable subscription should cover your NCLEX question bank — and everything after.
            </h2>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-[var(--color-ink-muted)]">
              <p>
                Here&apos;s the deal: the people grinding hardest for these licenses are usually the
                ones with the least to spend. Then they get hit with{" "}
                <strong className="font-semibold text-[var(--color-ink)]">
                  $200–400 per exam
                </strong>{" "}
                question banks — buy three or four and you&apos;ve spent more than a month&apos;s rent.
              </p>
              <p>
                We thought that was backwards. So we built one Pro plan — from{" "}
                {formatMonthlyPrice("pro")}/mo after a free trial — that unlocks a serious{" "}
                <strong className="font-semibold text-[var(--color-ink)]">NCLEX question bank</strong>,
                high-yield{" "}
                <strong className="font-semibold text-[var(--color-ink)]">NCLEX practice questions</strong>{" "}
                (including NGN-style clinical judgment), and a full{" "}
                <strong className="font-semibold text-[var(--color-ink)]">USMLE question bank</strong>{" "}
                spanning Steps 1, 2 CK, and 3 — plus NAPLEX, PANCE, AANP FNP, and NPTE-PT under the
                same login.
              </p>
              <p>
                That is the unique selling point of {SITE_NAME}:{" "}
                <strong className="font-semibold text-[var(--color-ink)]">
                  one affordable subscription for six exam question banks
                </strong>
                . {bankCounts.totalQuestionsLabel}. AI Tutor on misses. Adaptive Blueprint Roadmaps.
                Spaced Repetition. Full-length mocks. Clinician-built, QA-gated — not bulk filler.
              </p>
              <p>
                And we didn&apos;t stop at exam day. The{" "}
                <strong className="font-semibold text-[var(--color-ink)]">
                  {SEO_LIVE_STATS.topDrugsLabel}
                </strong>{" "}
                and clinical pearls are built to stay useful long after you pass — the kind of
                resource you&apos;ll still open on a busy shift years from now.
              </p>
            </div>

            <blockquote className="mt-10 rounded-3xl border-l-4 border-[var(--color-accent)] bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-apple-sm)]">
              <p className="text-xl font-semibold leading-snug tracking-tight text-[var(--color-ink)]">
                &ldquo;Premium board prep. Non-premium price. That&apos;s the whole idea.&rdquo;
              </p>
            </blockquote>
          </div>
        </section>

        {/* ── 3. Six exams ────────────────────────────────────────────── */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-accent)]">
              What&apos;s included
            </p>
            <h2 className="mt-3 text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-tight tracking-tight text-[var(--color-ink)]">
              Six boards. One study system.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-[var(--color-ink-muted)]">
              Whether you are sitting NCLEX-RN this month or mapping a multi-year path through{" "}
              {PLATFORM_EXAM_LIST}, you get the same QA standard and the same tools — so you are not
              relearning a new platform every time your career track shifts.
            </p>
            <h3 className="mt-10 text-lg font-bold text-[var(--color-ink)]">
              Jump to an exam prep page
            </h3>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {EXAM_HUB_LINKS.map((exam) => (
                <li key={exam.href}>
                  <Link
                    href={exam.href}
                    className="flex items-center justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 py-3 text-sm font-semibold text-[var(--color-ink)] shadow-[var(--shadow-apple-sm)] transition hover:border-[var(--color-accent)]/40"
                  >
                    {exam.label}
                    <span className="text-[var(--color-accent)]" aria-hidden>
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-base leading-relaxed text-[var(--color-ink-muted)]">
              Prefer strategy first? Browse the{" "}
              <Link href={ROUTES.toolkit} className="font-semibold text-[var(--color-accent)] hover:underline">
                Toolkit
              </Link>{" "}
              for exam breakdowns and readiness guides, or read the{" "}
              <Link href={ROUTES.blog} className="font-semibold text-[var(--color-accent)] hover:underline">
                blog
              </Link>{" "}
              for high-yield study systems across NCLEX, USMLE, and the rest of the board lineup.
            </p>
          </div>
        </section>

        {/* ── 4. What makes us different ──────────────────────────────── */}
        <section className="border-y border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-20">
          <div className="mx-auto max-w-5xl">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-accent)]">
                What makes us different
              </p>
              <h2 className="mt-3 text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-tight tracking-tight text-[var(--color-ink)]">
                Built different on purpose.
              </h2>
              <p className="mt-3 text-lg leading-relaxed text-[var(--color-ink-muted)]">
                Four things we refused to compromise on — so your NCLEX practice questions and USMLE
                sets feel like coaching, not a content dump.
              </p>
            </div>
            <div className="mt-10">
              <AboutValueCards />
            </div>
          </div>
        </section>

        {/* ── 5. The Showdown (charts) ────────────────────────────────── */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-5xl">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-accent)]">
                The showdown
              </p>
              <h2 className="mt-3 text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-tight tracking-tight text-[var(--color-ink)]">
                Let&apos;s talk numbers.
              </h2>
              <p className="mt-3 text-lg leading-relaxed text-[var(--color-ink-muted)]">
                Per-exam banks add up. One {SITE_NAME} subscription covers six. Here&apos;s the honest
                math — and why students comparing NCLEX and USMLE options land here.
              </p>
            </div>
            <div className="mt-10">
              <AboutShowdownLazy />
            </div>
            <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-[var(--color-ink-muted)]">
              Want a deeper side-by-side? See our{" "}
              <Link href={ROUTES.compare} className="font-semibold text-[var(--color-accent)] hover:underline">
                compare page
              </Link>{" "}
              and{" "}
              <Link href={ROUTES.pricing} className="font-semibold text-[var(--color-accent)] hover:underline">
                pricing
              </Link>
              .
            </p>
          </div>
        </section>

        {/* ── 6. Verdict band ─────────────────────────────────────────── */}
        <section className="border-y border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-20">
          <div className="mx-auto max-w-4xl overflow-hidden rounded-[2rem] bg-[var(--color-accent)] px-8 py-14 text-center shadow-[var(--shadow-apple-lg)]">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-sm font-bold text-white">
              <Star className="h-4 w-4 fill-current" aria-hidden />
              The verdict
            </span>
            <p className="mx-auto mt-6 max-w-2xl text-balance text-[clamp(1.75rem,4.5vw,2.75rem)] font-extrabold leading-tight tracking-tight text-white">
              One plan. Six question banks. The clear value winner.
            </p>
            <p className="mx-auto mt-4 max-w-xl text-base font-medium leading-relaxed text-white/90">
              NCLEX, USMLE, NAPLEX, PANCE, AANP FNP &amp; NPTE-PT — most coverage, expert curation,
              smartest price.
            </p>
            <div className="mt-8 flex justify-center">
              <LandingCta
                href={LANDING_TRIAL_HREF}
                variant="ghost-on-dark"
                icon={<ArrowRight className="h-4 w-4" />}
              >
                {formatTrialCtaLabel()}
              </LandingCta>
            </div>
          </div>
        </section>

        {/* ── 7. Clinician trust ──────────────────────────────────────── */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-5xl">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-accent)]">
                Who&apos;s behind it
              </p>
              <h2 className="mt-3 text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-tight tracking-tight text-[var(--color-ink)]">
                Curated by people who&apos;ve done the job.
              </h2>
              <p className="mt-3 text-lg leading-relaxed text-[var(--color-ink-muted)]">
                <strong className="font-semibold text-[var(--color-ink)]">
                  {SEO_LIVE_STATS.clinicianYears} years of combined frontline experience
                </strong>{" "}
                from licensed healthcare providers — baked into every NCLEX rationale, USMLE vignette,
                and multi-exam explanation.
              </p>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-3">
              {TRUST_POINTS.map((point) => {
                const Icon = point.icon;
                return (
                  <div
                    key={point.title}
                    className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-apple-sm)]"
                  >
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <h3 className="mt-4 text-base font-bold tracking-tight text-[var(--color-ink)]">
                      {point.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">
                      {point.blurb}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 8. Final CTA ────────────────────────────────────────────── */}
        <section className="border-t border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-[clamp(2rem,5vw,3rem)] font-bold leading-tight tracking-tight text-[var(--color-ink)]">
              Ready to prep like it&apos;s premium?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-[var(--color-ink-muted)]">
              Start free, no commitment. Try NCLEX practice questions or a USMLE set, then unlock all
              six boards when you are ready — one upgrade, not six.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <LandingCta href={LANDING_TRIAL_HREF} icon={<ArrowRight className="h-4 w-4" />}>
                {formatTrialCtaLabel()}
              </LandingCta>
              <Link
                href={ROUTES.pricing}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-5 py-2.5 text-sm font-bold text-[var(--color-ink)] shadow-[var(--shadow-apple-sm)] transition hover:shadow-[var(--shadow-apple-md)]"
              >
                Compare plans →
              </Link>
            </div>
            <p className="mt-4 text-sm font-medium text-[var(--color-ink-muted)]">
              {formatTrialLabel()} · all 6 boards included
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
