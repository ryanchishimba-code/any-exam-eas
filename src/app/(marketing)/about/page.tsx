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

const HOW_A_QUESTION_SHIPS = [
  {
    step: "1",
    title: "Written to the blueprint",
    body: "Items map to official Client Needs, content outlines, and high-yield domains — not random filler.",
  },
  {
    step: "2",
    title: "QA gate",
    body: "Serve-ready only after editorial review. Soft stems and broken keys stay off the bank.",
  },
  {
    step: "3",
    title: "Deep Dive on the miss",
    body: "Wrong answers open structured teaching in-product — then you return to practice in the same Skill Cell loop.",
  },
] as const;

const OFFICIAL_PREP_DOCS = [
  {
    label: "NCLEX 2026 RN Test Plan (PDF)",
    href: "https://www.ncsbn.org/public-files/2026_RN_Test-Plan_English-F.pdf",
  },
  {
    label: "NCSBN exam test plans hub",
    href: "https://www.ncsbn.org/exams/testplans.page",
  },
  {
    label: "NAPLEX 2025 Content Outline (PDF)",
    href: "https://nabp.pharmacy/wp-content/uploads/NAPLEX-Content-Outline.pdf",
  },
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
    { value: "Full Exam", label: "Timed simulations" },
    { value: "12+ yrs", label: "Clinician experience" },
  ];

  return (
    <>
      <JsonLdScript data={buildAboutJsonLd()} />
      <div className="bg-[var(--color-bg)]">
        {/* ── 1. Hero ──────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden px-6 pt-[var(--page-top)]">
          <div className="mx-auto max-w-4xl pb-16 text-center sm:pb-20">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-accent)]">
              AnyExamEasy · Built in Texas
            </p>

            <h1 className="mt-4 text-balance text-[clamp(2.25rem,6vw,3.5rem)] font-bold leading-[1.05] tracking-tight text-[var(--color-ink)]">
              Six boards. One standard of question.
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-balance text-lg leading-relaxed text-[var(--color-ink-muted)]">
              Clinician-built banks for USMLE, NCLEX, NAPLEX, PANCE, AANP FNP, and NPTE-PT. Same QA
              gate, one Pro plan, Roadmaps and Deep Dives included — not six logins.
            </p>
            <p className="mx-auto mt-3 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-ink-muted)]">
              <MapPin className="h-4 w-4 text-[var(--color-accent)]" aria-hidden />
              Built in Texas · {SEO_LIVE_STATS.clinicianYears} years combined clinical experience
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
              One Pro plan should cover your banks — plus Roadmaps, Deep Dives, and Full Exams.
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
                {formatMonthlyPrice("pro")}/mo after a free trial — that unlocks clinician-built banks
                for USMLE, NCLEX, NAPLEX, PANCE, AANP FNP, and NPTE-PT under the same login.
              </p>
              <p>
                That is the unique selling point of {SITE_NAME}:{" "}
                <strong className="font-semibold text-[var(--color-ink)]">
                  one affordable subscription for six exam question banks
                </strong>
                . {bankCounts.totalQuestionsLabel}. Adaptive Blueprint Roadmaps. Deep Dive modules.
                Full-length mocks. Clinician-built, QA-gated — not bulk filler.
              </p>
              <p>
                And we didn&apos;t stop at exam day.{" "}
                <strong className="font-semibold text-[var(--color-ink)]">
                  Lab values, clinical calculators, and Anatomy Explorer
                </strong>{" "}
                stay useful long after you pass — the kind of resources you&apos;ll still open on a
                busy shift years from now.
              </p>
            </div>

            <blockquote className="mt-10 rounded-3xl border-l-4 border-[var(--color-accent)] bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-apple-sm)]">
              <p className="text-xl font-semibold leading-snug tracking-tight text-[var(--color-ink)]">
                &ldquo;Premium board prep. Non-premium price. That&apos;s the whole idea.&rdquo;
              </p>
            </blockquote>
          </div>
        </section>

        {/* ── 3. How a question ships ─────────────────────────────────── */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-5xl">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-accent)]">
                How a question ships
              </p>
              <h2 className="mt-3 text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-tight tracking-tight text-[var(--color-ink)]">
                Blueprint → QA gate → Deep Dive on the miss.
              </h2>
            </div>
            <ol className="mt-10 grid gap-5 sm:grid-cols-3">
              {HOW_A_QUESTION_SHIPS.map((item) => (
                <li
                  key={item.step}
                  className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-apple-sm)]"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-accent)]">
                    Step {item.step}
                  </p>
                  <h3 className="mt-2 text-lg font-bold tracking-tight text-[var(--color-ink)]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">
                    {item.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── 4. Six exams ────────────────────────────────────────────── */}
        <section className="border-y border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-20">
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
              for high-yield study systems across the full board lineup.
            </p>
          </div>
        </section>

        {/* ── 5. What makes us different ──────────────────────────────── */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-5xl">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-accent)]">
                What makes us different
              </p>
              <h2 className="mt-3 text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-tight tracking-tight text-[var(--color-ink)]">
                Built different on purpose.
              </h2>
              <p className="mt-3 text-lg leading-relaxed text-[var(--color-ink-muted)]">
                The study system that sets us apart: Blueprint Roadmaps, Deep Dives from misses, Full
                Exam simulations, and clinician QA — so practice feels like coaching, not a content
                dump.
              </p>
            </div>
            <div className="mt-10">
              <AboutValueCards />
            </div>
          </div>
        </section>

        {/* ── 6. The Showdown (charts) ────────────────────────────────── */}
        <section className="border-y border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-20">
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
                math.
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

        {/* ── 7. Official prep docs ───────────────────────────────────── */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-accent)]">
              Official prep docs
            </p>
            <h2 className="mt-3 text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-tight tracking-tight text-[var(--color-ink)]">
              Read the board&apos;s document. We do not replace it.
            </h2>
            <ul className="mt-8 space-y-3">
              {OFFICIAL_PREP_DOCS.map((doc) => (
                <li key={doc.href}>
                  <a
                    href={doc.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 py-3 text-sm font-semibold text-[var(--color-ink)] shadow-[var(--shadow-apple-sm)] transition hover:border-[var(--color-accent)]/40"
                  >
                    {doc.label}
                    <span className="text-[var(--color-accent)]" aria-hidden>
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── 8. Verdict band ─────────────────────────────────────────── */}
        <section className="border-y border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-20">
          <div className="mx-auto max-w-4xl overflow-hidden rounded-[2rem] bg-[var(--color-accent)] px-8 py-14 text-center shadow-[var(--shadow-apple-lg)]">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-sm font-bold text-white">
              <Star className="h-4 w-4 fill-current" aria-hidden />
              The verdict
            </span>
            <p className="mx-auto mt-6 max-w-2xl text-balance text-[clamp(1.75rem,4.5vw,2.75rem)] font-extrabold leading-tight tracking-tight text-white">
              One plan. Six banks. Roadmaps, Deep Dives &amp; Full Exams.
            </p>
            <p className="mx-auto mt-4 max-w-xl text-base font-medium leading-relaxed text-white/90">
              USMLE, NCLEX, NAPLEX, PANCE, AANP FNP &amp; NPTE-PT — clinician-built coverage at a
              non-premium price.
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

        {/* ── 9. Clinician trust ──────────────────────────────────────── */}
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
                from licensed healthcare providers — baked into rationales and vignettes across all
                six boards.
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

        {/* ── 10. Final CTA ───────────────────────────────────────────── */}
        <section className="border-t border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-[clamp(2rem,5vw,3rem)] font-bold leading-tight tracking-tight text-[var(--color-ink)]">
              Ready to prep like it&apos;s premium?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-[var(--color-ink-muted)]">
              Start free, no commitment. Try a set on any board, then unlock all six when you are
              ready — one upgrade, not six.
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

        {/* ── 11. Independence ────────────────────────────────────────── */}
        <section className="border-t border-[var(--color-border)] px-6 py-12">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
              Independence
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-muted)]">
              Any Exam Easy is independent and not affiliated with NCSBN, NABP, NBME, NCCPA, AANP,
              FSBPT, UWorld, or RxPrep. Exam names are trademarks of their owners. We do not guarantee
              exam results, licensure, or employment.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
