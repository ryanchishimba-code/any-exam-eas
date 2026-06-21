import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Check,
  Crown,
  Map,
  Sparkles,
  Timer,
  TrendingUp,
} from "lucide-react";
import {
  EXAM_SEO_CONFIG,
  EXAM_SEO_KEYS,
  examMarketingPath,
  getExamSeoConfig,
  type ExamSeoKey,
} from "@/lib/seo/exam-config";
import { getArticlesForExam } from "@/lib/seo/resources-content";
import {
  LANDING_HERO_CTA_DISCLOSURE,
  LANDING_HERO_TRUST_SIGNALS,
  LANDING_TRIAL_HREF,
  PLATFORM_EXAM_LIST_MIDDOT,
} from "@/lib/landing/content";
import { LandingCta } from "@/components/landing/LandingCta";
import { HighlightedPrice } from "@/components/landing/HighlightedPrice";
import { LandingPricingPreview } from "@/components/landing/LandingPricingPreview";
import { ProBenefitsComparison } from "@/components/pricing/ProBenefitsComparison";
import { CostComparisonChart } from "@/components/landing/CostComparisonChart";
import { UsmleStepShowcase } from "@/components/marketing/UsmleStepShowcase";
import { HowWeCompare } from "@/components/home/HowWeCompare";
import { ROUTES } from "@/lib/routes";
import {
  formatMonthlyPrice,
  formatTrialCtaLabel,
  formatTrialLabel,
  TRIAL_PAYMENT_DISCLOSURE,
} from "@/lib/site";
type Props = {
  examKey: ExamSeoKey;
  /** Live compact question count for this exam, e.g. "8.2K+". */
  questionCountLabel?: string;
};

/** Feature section icons cycle through these 3 by index. */
const FEATURE_ICONS = [
  <BookOpen key="book" className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden />,
  <Timer key="timer" className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden />,
  <Map key="map" className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden />,
  <TrendingUp key="trend" className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden />,
];

export function ExamMarketingLanding({ examKey, questionCountLabel }: Props) {
  const config = getExamSeoConfig(examKey);
  const relatedArticles = getArticlesForExam(examKey).slice(0, 3);
  const otherExams = EXAM_SEO_KEYS.filter((k) => k !== examKey);
  const isUsmle = examKey === "usmle";

  // Premium hero stat chips — lead with the live, accurate count.
  const heroStats: { value: string; label: string; accent?: boolean }[] = [
    ...(questionCountLabel
      ? [{ value: questionCountLabel, label: "serve-ready questions", accent: true }]
      : []),
    { value: "QA-gated", label: "no bulk filler" },
    { value: "6 exams", label: "one subscription" },
  ];

  return (
    <div className="aee-exam-marketing">
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="aee-exam-marketing__hero border-b border-[var(--color-border)]/40">
        <div className="mx-auto max-w-5xl px-5 pb-12 pt-[var(--page-top)] sm:px-6">
          <nav aria-label="Breadcrumb" className="text-sm text-[var(--color-ink-muted)]">
            <Link href={ROUTES.home} className="transition-colors hover:text-[var(--color-accent)]">
              Home
            </Link>
            <span className="mx-2 opacity-40">/</span>
            <span className="font-medium text-[var(--color-ink)]">{config.shortName} Prep</span>
          </nav>

          <header className="mt-8 max-w-3xl">
            <p
              className="text-[10px] font-extrabold uppercase tracking-widest"
              style={{ color: config.accentColor }}
            >
              {config.blueprintLabel} · 2026
            </p>
            <p className="mt-0.5 text-[9px] text-[var(--color-ink-muted)] opacity-70">
              Not affiliated with or endorsed by the exam owner. Blueprint reference is for study alignment only.
            </p>
            <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-[var(--color-ink)] sm:text-4xl">
              {config.h1}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-[var(--color-ink-muted)] sm:text-lg">
              {config.heroSubline}
            </p>
            <dl className="mt-5 flex flex-wrap gap-2.5" aria-label={`${config.shortName} at a glance`}>
              {heroStats.map((stat) => (
                <div
                  key={stat.label}
                  className="inline-flex items-baseline gap-1.5 rounded-full border px-3 py-1.5"
                  style={
                    stat.accent
                      ? {
                          borderColor: `${config.accentColor}55`,
                          background: `${config.accentColor}12`,
                        }
                      : { borderColor: "var(--color-border)", background: "var(--color-surface)" }
                  }
                >
                  <dd
                    className="text-sm font-extrabold tracking-tight"
                    style={{ color: stat.accent ? config.accentColor : "var(--color-ink)" }}
                  >
                    {stat.value}
                  </dd>
                  <dt className="text-xs font-medium text-[var(--color-ink-muted)]">{stat.label}</dt>
                </div>
              ))}
            </dl>

            <ul
              className="mt-4 flex flex-wrap gap-x-4 gap-y-1"
              aria-label="Platform trust signals"
            >
              {LANDING_HERO_TRUST_SIGNALS.map((signal) => (
                <li
                  key={signal}
                  className="flex items-center gap-1.5 text-sm text-[var(--color-ink-muted)]"
                >
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: config.accentColor }}
                    aria-hidden
                  />
                  {signal}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <LandingCta
                href={LANDING_TRIAL_HREF}
                className="aee-flagship-cta--hero group w-full sm:w-auto"
                icon={
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                }
              >
                {formatTrialCtaLabel()}
              </LandingCta>
              <Link
                href="#pricing"
                className="text-sm font-semibold text-[var(--color-ink-muted)] transition-colors hover:text-[var(--color-ink)]"
              >
                View pricing →
              </Link>
            </div>
            <div
              className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2"
              aria-label="Starting price and free trial"
            >
              <span className="inline-flex items-baseline gap-1.5 text-base font-bold text-[var(--color-ink)]">
                From
                <HighlightedPrice size="hero" period="/mo" />
              </span>
              <span className="text-sm font-semibold text-[var(--color-ink-muted)]">
                all 6 exams
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[color-mix(in_srgb,var(--color-accent)_38%,transparent)] bg-[color-mix(in_srgb,var(--color-accent)_14%,var(--color-surface-elevated))] px-3.5 py-1.5 text-sm font-extrabold tracking-tight text-[var(--color-accent)] shadow-[var(--shadow-apple-sm)]">
                <Sparkles className="h-4 w-4" aria-hidden />
                {formatTrialLabel()}
              </span>
            </div>
            <p className="mt-3 text-xs text-[var(--color-ink-muted)]">
              {LANDING_HERO_CTA_DISCLOSURE}
            </p>
          </header>
        </div>
      </section>

      {/* ── USMLE Step Selector (wheel + segmented hybrid) ──────────────── */}
      {isUsmle && (
        <section className="border-b border-[var(--color-border)]/40 py-12">
          <div className="mx-auto max-w-5xl px-5 sm:px-6">
            <UsmleStepShowcase />
          </div>
        </section>
      )}

      {/* ── Feature cards ──────────────────────────────────────────────── */}
      <section className="border-b border-[var(--color-border)]/40 py-12">
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <header className="mx-auto max-w-2xl text-center">
            <p className="aee-flagship-eyebrow">Built for {config.shortName}</p>
            <h2 className="aee-flagship-title">
              Blueprint-aligned prep —{" "}
              <span className="aee-flagship-gradient-text">without a $300+ QBank.</span>
            </h2>
          </header>

          <ul
            className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            aria-labelledby="exam-usps"
          >
            <h2 id="exam-usps" className="sr-only">
              Why students choose AnyExamEasy for {config.shortName}
            </h2>
            {config.features.map((feature, i) => (
              <li
                key={feature.title}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5"
                style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.04)" }}
              >
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{ background: `${config.accentColor}18`, color: config.accentColor }}
                  aria-hidden
                >
                  {FEATURE_ICONS[i % FEATURE_ICONS.length]}
                </div>
                <h3 className="mt-3 text-sm font-bold text-[var(--color-ink)]">
                  {feature.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-ink-muted)]">
                  {feature.detail}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Study plan checklist ────────────────────────────────────────── */}
      <section className="border-b border-[var(--color-border)]/40 py-12">
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <div
            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 sm:p-8"
            style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}
          >
            <h2 className="text-base font-bold text-[var(--color-ink)] sm:text-lg">
              Everything on your {config.shortName} study plan
            </h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {[
                `${config.shortName} question bank + ${formatTrialLabel()}`,
                "Blueprint-aligned Exam Roadmap",
                "Normal lab values & clinical calculators",
                "Top 503 Drugs pharmacology deck",
                "Timed full-length exam simulations",
                "Five other board exams on the same subscription",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-[var(--color-ink-muted)]"
                >
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0"
                    style={{ color: config.accentColor }}
                    strokeWidth={2.5}
                    aria-hidden
                  />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-4 text-sm font-semibold text-[var(--color-ink)]">
              <span className="inline-flex items-center gap-1.5">
                <Map className="h-4 w-4" style={{ color: config.accentColor }} aria-hidden />
                Roadmap
              </span>
              <span className="inline-flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" style={{ color: config.accentColor }} aria-hidden />
                Deep Dives
                <span className="inline-flex items-center gap-1 rounded bg-[var(--color-surface)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--color-ink-muted)]">
                  <Crown className="h-2.5 w-2.5" aria-hidden /> Pro
                </span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <BarChart3
                  className="h-4 w-4"
                  style={{ color: config.accentColor }}
                  aria-hidden
                />
                Analytics
                <span className="inline-flex items-center gap-1 rounded bg-[var(--color-surface)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--color-ink-muted)]">
                  <Crown className="h-2.5 w-2.5" aria-hidden /> Pro
                </span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── vs UWorld comparison ────────────────────────────────────────── */}
      <section
        className="aee-flagship-compare-wrap border-b border-[var(--color-border)]/40"
        aria-labelledby="compare-heading"
      >
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <HowWeCompare />
          <div className="mt-10">
            <CostComparisonChart />
          </div>
        </div>
      </section>

      {/* ── Pro benefits ────────────────────────────────────────────────── */}
      <section className="border-b border-[var(--color-border)]/40 py-14">
        <ProBenefitsComparison />
      </section>

      {/* ── Pricing ─────────────────────────────────────────────────────── */}
      <section
        id="pricing"
        className="scroll-mt-24 border-b border-[var(--color-border)]/40 py-14"
      >
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <header className="mx-auto max-w-2xl text-center">
            <p className="aee-flagship-eyebrow">Simple pricing</p>
            <h2 className="aee-flagship-title">
              Basic from {formatMonthlyPrice("basic")}/mo ·{" "}
              <span className="aee-flagship-gradient-text">
                Pro from {formatMonthlyPrice("pro")}/mo
              </span>
            </h2>
            <p className="aee-flagship-subtitle">
              {formatTrialLabel()} · {PLATFORM_EXAM_LIST_MIDDOT} · save up to 20% annual
            </p>
          </header>
          <div className="mt-10">
            <LandingPricingPreview />
          </div>
        </div>
      </section>

      {/* ── Study tips, FAQ, resources ──────────────────────────────────── */}
      <div className="mx-auto max-w-5xl px-5 pb-20 pt-12 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Study tips */}
          <section aria-labelledby="study-tips">
            <h2
              id="study-tips"
              className="text-lg font-bold text-[var(--color-ink)]"
            >
              {config.shortName} study tips for 2026
            </h2>
            <div className="mt-4 space-y-3">
              {config.studyTips.map((tip) => (
                <article
                  key={tip.heading}
                  className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4"
                >
                  <h3 className="text-sm font-bold text-[var(--color-ink)]">
                    {tip.heading}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-ink-muted)]">
                    {tip.body}
                  </p>
                </article>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section aria-labelledby="exam-faq">
            <h2
              id="exam-faq"
              className="text-lg font-bold text-[var(--color-ink)]"
            >
              Frequently asked questions
            </h2>
            <dl className="mt-4 space-y-3">
              {config.faqs.map((faq) => (
                <div
                  key={faq.question}
                  className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4"
                >
                  <dt className="text-sm font-bold text-[var(--color-ink)]">
                    {faq.question}
                  </dt>
                  <dd className="mt-1.5 text-sm leading-relaxed text-[var(--color-ink-muted)]">
                    {faq.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        {/* Related articles */}
        {relatedArticles.length > 0 && (
          <section className="mt-12" aria-labelledby="related-guides">
            <h2
              id="related-guides"
              className="text-lg font-bold text-[var(--color-ink)]"
            >
              {config.shortName} study guides &amp; resources
            </h2>
            <ul className="mt-4 space-y-2">
              {relatedArticles.map((article) => (
                <li key={article.slug}>
                  <Link
                    href={`/resources/${article.slug}`}
                    className="group flex items-center justify-between gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 py-3 transition hover:border-[var(--color-accent)]"
                  >
                    <span className="text-sm font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-accent)]">
                      {article.title}
                    </span>
                    <ArrowRight
                      className="h-4 w-4 shrink-0 text-[var(--color-ink-muted)]"
                      aria-hidden
                    />
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/resources"
              className="mt-4 inline-block text-sm font-semibold text-[var(--color-accent)]"
            >
              Browse all resources →
            </Link>
          </section>
        )}

        {/* Other boards */}
        <section
          className="mt-10 border-t border-[var(--color-border)] pt-8"
          aria-labelledby="other-boards"
        >
          <h2
            id="other-boards"
            className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-ink-muted)]"
          >
            All six boards — one subscription
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {otherExams.map((key) => {
              const other = EXAM_SEO_CONFIG[key];
              return (
                <li key={key}>
                  <Link
                    href={examMarketingPath(key)}
                    className="inline-block rounded-full border border-[var(--color-border)] px-4 py-1.5 text-sm font-bold transition hover:border-transparent"
                    style={{ color: other.accentColor }}
                  >
                    {other.shortName}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Final CTA */}
        <section className="aee-flagship-final-cta mt-12 rounded-2xl px-6 py-10 text-center sm:px-10">
          <div className="aee-flagship-final-cta__bg rounded-2xl" aria-hidden />
          <div className="relative">
            <h2 className="aee-flagship-final-cta__title">
              Start {config.shortName} prep — {formatTrialLabel()}
            </h2>
            <p className="aee-flagship-final-cta__subtitle">
              Basic from {formatMonthlyPrice("basic")}/mo · Pro from{" "}
              {formatMonthlyPrice("pro")}/mo · All six board exams
            </p>
            <div className="aee-flagship-final-cta__actions mt-6">
              <LandingCta
                href={LANDING_TRIAL_HREF}
                variant="primary"
                className="aee-flagship-cta--hero group aee-flagship-cta--on-dark"
                icon={
                  <ArrowRight
                    className="h-5 w-5 transition-transform group-hover:translate-x-1"
                    aria-hidden
                  />
                }
              >
                {formatTrialCtaLabel()}
              </LandingCta>
            </div>
            <p className="aee-flagship-final-cta__legal mt-4">{TRIAL_PAYMENT_DISCLOSURE}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
