import Link from "next/link";
import { ArrowRight, Check, Crown, Map, BookOpen, BarChart3 } from "lucide-react";
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
import { LandingPricingPreview } from "@/components/landing/LandingPricingPreview";
import { HowWeCompare } from "@/components/home/HowWeCompare";
import { ROUTES } from "@/lib/routes";
import {
  formatMonthlyPrice,
  formatTrialCtaLabel,
  formatTrialLabel,
  TRIAL_PAYMENT_DISCLOSURE,
} from "@/lib/site";
import { getExamHub } from "@/lib/exams/catalog";

type Props = { examKey: ExamSeoKey };

export function ExamMarketingLanding({ examKey }: Props) {
  const config = getExamSeoConfig(examKey);
  const hub = getExamHub(examKey);
  const relatedArticles = getArticlesForExam(examKey).slice(0, 3);
  const otherExams = EXAM_SEO_KEYS.filter((k) => k !== examKey);

  return (
    <div className="aee-exam-marketing">
      <section className="aee-exam-marketing__hero">
        <div className="aee-flagship-inner mx-auto max-w-5xl px-5 pb-16 pt-[var(--page-top)] sm:px-6">
          <nav aria-label="Breadcrumb" className="text-sm text-[var(--color-ink-muted)]">
            <Link href={ROUTES.home} className="hover:text-[var(--color-accent)]">
              Home
            </Link>
            <span className="mx-2 opacity-40">/</span>
            <span className="font-medium text-[var(--color-ink)]">{config.shortName} Prep</span>
          </nav>

          <header className="mt-8 max-w-3xl">
            <p className="aee-flagship-hero__eyebrow" style={{ color: config.accentColor }}>
              {config.blueprintLabel} · Updated 2026
            </p>
            <h1
              className="aee-flagship-hero__headline aee-flagship-hero__headline--punchy mt-3"
              style={{ color: config.accentColor }}
            >
              {config.h1}
            </h1>
            <p className="aee-flagship-hero__subline mt-4">{config.heroSubline}</p>
            {hub ? (
              <p className="mt-3 text-sm font-semibold text-[var(--color-ink)]">
                {hub.questionBankLabel} · plus 5 other board exams on the same plan
              </p>
            ) : null}
            <p className="aee-flagship-hero__value-line">{config.heroSubline}</p>

            <ul className="aee-hero-trust-pills mt-4" aria-label="Platform trust signals">
              {LANDING_HERO_TRUST_SIGNALS.map((signal, index) => (
                <li key={signal} className="aee-hero-trust-pills__item">
                  {index > 0 ? (
                    <span className="aee-hero-trust-pills__dot" aria-hidden>
                      ·
                    </span>
                  ) : null}
                  <span>{signal}</span>
                </li>
              ))}
            </ul>

            <div className="aee-flagship-hero__ctas aee-flagship-hero__ctas--conversion mt-6">
              <LandingCta
                href={LANDING_TRIAL_HREF}
                className="aee-flagship-cta--hero aee-flagship-cta--xl group w-full sm:w-auto"
                icon={
                  <ArrowRight
                    className="h-5 w-5 transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                }
              >
                {formatTrialCtaLabel()}
              </LandingCta>
              <Link href="#pricing" className="aee-flagship-cta aee-flagship-cta--secondary">
                View pricing
              </Link>
              <Link href={ROUTES.home} className="aee-flagship-hero__sample-link aee-flagship-hero__sample-link--muted">
                See all 6 exams
              </Link>
            </div>
            <p className="aee-flagship-hero__disclosure aee-flagship-hero__disclosure--prominent">
              {LANDING_HERO_CTA_DISCLOSURE}
            </p>
          </header>
        </div>
      </section>

      <section className="aee-exam-marketing__features">
        <div className="aee-flagship-inner mx-auto max-w-5xl px-5 py-12 sm:px-6">
          <header className="aee-flagship-header aee-flagship-header--center mx-auto max-w-2xl text-center">
            <p className="aee-flagship-eyebrow">Built for {config.shortName}</p>
            <h2 className="aee-flagship-title">
              Blueprint-aligned prep —{" "}
              <span className="aee-flagship-gradient-text">without a $300+ QBank.</span>
            </h2>
          </header>

          <ul className="aee-platform-advantages mt-10" aria-labelledby="exam-usps">
            <h2 id="exam-usps" className="sr-only">
              Why students choose AnyExamEasy for {config.shortName}
            </h2>
            {config.features.map((feature) => (
              <li key={feature.title} className="aee-platform-advantage">
                <h3 className="aee-platform-advantage__title">{feature.title}</h3>
                <p className="aee-platform-advantage__detail">{feature.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="aee-exam-marketing__includes">
        <div className="aee-flagship-inner mx-auto max-w-5xl px-5 py-12 sm:px-6">
          <div className="aee-exam-marketing__includes-card" aria-labelledby="platform-includes">
            <h2 id="platform-includes" className="aee-flagship-title text-xl">
              Everything on your {config.shortName} study plan
            </h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                `${config.shortName} question bank + ${formatTrialLabel()}`,
                "Blueprint-aligned Exam Roadmap",
                "Normal lab values & clinical calculators",
                "Top 503 Drugs pharmacology deck",
                "Timed full-length exam simulations",
                "Five other board exams on the same subscription",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-[var(--color-ink-muted)]">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--flagship-teal)]" strokeWidth={2.5} aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold">
              <span className="inline-flex items-center gap-1.5 text-[var(--color-ink)]">
                <Map className="h-4 w-4 text-[var(--flagship-teal)]" aria-hidden /> Roadmap
              </span>
              <span className="inline-flex items-center gap-1.5 text-[var(--color-ink)]">
                <BookOpen className="h-4 w-4 text-[var(--flagship-teal)]" aria-hidden />
                Deep Dives
                <span className="aee-platform-advantage__badge">
                  <Crown className="h-3 w-3" aria-hidden />
                  Pro
                </span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-[var(--color-ink)]">
                <BarChart3 className="h-4 w-4 text-[var(--flagship-teal)]" aria-hidden />
                Analytics
                <span className="aee-platform-advantage__badge">
                  <Crown className="h-3 w-3" aria-hidden />
                  Pro
                </span>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="aee-flagship-compare-wrap" aria-labelledby="compare-heading">
        <div className="aee-flagship-inner mx-auto max-w-5xl px-5 sm:px-6">
          <HowWeCompare />
        </div>
      </section>

      <section id="pricing" className="aee-exam-marketing__pricing scroll-mt-24">
        <div className="aee-flagship-inner mx-auto max-w-5xl px-5 py-14 sm:px-6">
          <header className="aee-flagship-header aee-flagship-header--center mx-auto max-w-2xl text-center">
            <p className="aee-flagship-eyebrow">Simple pricing</p>
            <h2 className="aee-flagship-title">
              Basic from {formatMonthlyPrice("basic")}/mo ·{" "}
              <span className="aee-flagship-gradient-text">Pro from {formatMonthlyPrice("pro")}/mo</span>
            </h2>
            <p className="aee-flagship-subtitle">
              {formatTrialLabel()} · {PLATFORM_EXAM_LIST_MIDDOT} · save up to 20% on annual
            </p>
          </header>
          <div className="mt-10">
            <LandingPricingPreview />
          </div>
        </div>
      </section>

      <div className="aee-flagship-inner mx-auto max-w-5xl px-5 pb-20 sm:px-6">
        <section className="mt-14" aria-labelledby="study-tips">
          <h2 id="study-tips" className="aee-flagship-title text-xl">
            {config.shortName} study tips for 2026
          </h2>
          <div className="mt-5 space-y-6">
            {config.studyTips.map((tip) => (
              <article key={tip.heading}>
                <h3 className="text-lg font-semibold text-[var(--color-ink)]">{tip.heading}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">{tip.body}</p>
              </article>
            ))}
          </div>
        </section>

        {relatedArticles.length > 0 ? (
          <section className="mt-14" aria-labelledby="related-guides">
            <h2 id="related-guides" className="aee-flagship-title text-xl">
              {config.shortName} study guides & resources
            </h2>
            <ul className="mt-5 space-y-3">
              {relatedArticles.map((article) => (
                <li key={article.slug}>
                  <Link
                    href={`/resources/${article.slug}`}
                    className="group flex items-center justify-between gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 py-3 transition hover:border-[var(--color-accent)]"
                  >
                    <span className="text-sm font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-accent)]">
                      {article.title}
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-[var(--color-ink-muted)]" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/resources" className="mt-4 inline-block text-sm font-semibold text-[var(--color-accent)]">
              Browse all resources →
            </Link>
          </section>
        ) : null}

        <section className="mt-14" aria-labelledby="exam-faq">
          <h2 id="exam-faq" className="aee-flagship-title text-xl">
            {config.shortName} prep FAQ
          </h2>
          <dl className="mt-5 space-y-5">
            {config.faqs.map((faq) => (
              <div key={faq.question} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5">
                <dt className="font-semibold text-[var(--color-ink)]">{faq.question}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-14 border-t border-[var(--color-border)] pt-10" aria-labelledby="other-boards">
          <h2 id="other-boards" className="aee-flagship-eyebrow">
            All six boards — one subscription
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {otherExams.map((key) => {
              const other = EXAM_SEO_CONFIG[key];
              return (
                <li key={key}>
                  <Link
                    href={examMarketingPath(key)}
                    className="inline-block rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-bold transition hover:border-transparent"
                    style={{ color: other.accentColor }}
                  >
                    {other.shortName}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="aee-flagship-final-cta mt-14 rounded-2xl px-6 py-10 text-center sm:px-10">
          <div className="aee-flagship-final-cta__bg rounded-2xl" aria-hidden />
          <div className="relative">
            <h2 className="aee-flagship-final-cta__title">
              Start {config.shortName} prep — {formatTrialLabel()}
            </h2>
            <p className="aee-flagship-final-cta__subtitle">
              Basic from {formatMonthlyPrice("basic")}/mo · Pro from {formatMonthlyPrice("pro")}/mo · All six board exams
            </p>
            <div className="aee-flagship-final-cta__actions mt-6">
              <LandingCta
                href={LANDING_TRIAL_HREF}
                variant="primary"
                className="aee-flagship-cta--hero aee-flagship-cta--xl group aee-flagship-cta--on-dark"
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
