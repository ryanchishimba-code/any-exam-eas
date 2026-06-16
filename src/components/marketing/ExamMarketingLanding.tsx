import Link from "next/link";
import { ArrowRight, Check, Map, BookOpen, BarChart3 } from "lucide-react";
import {
  EXAM_SEO_CONFIG,
  EXAM_SEO_KEYS,
  examMarketingPath,
  getExamSeoConfig,
  type ExamSeoKey,
} from "@/lib/seo/exam-config";
import { getArticlesForExam } from "@/lib/seo/resources-content";
import { LANDING_TRIAL_HREF } from "@/lib/landing/content";
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
  const otherExams = EXAM_SEO_KEYS.filter((k) => k !== examKey).slice(0, 5);

  return (
    <div className="aee-exam-marketing">
      <div className="mx-auto max-w-5xl px-5 pb-20 pt-[var(--page-top)] sm:px-6">
        <nav aria-label="Breadcrumb" className="text-sm text-[var(--color-ink-muted)]">
          <Link href={ROUTES.home} className="hover:text-[var(--color-accent)]">
            Home
          </Link>
          <span className="mx-2 opacity-40">/</span>
          <span className="font-medium text-[var(--color-ink)]">{config.shortName} Prep</span>
        </nav>

        <header className="mt-8">
          <p
            className="text-xs font-bold uppercase tracking-[0.14em]"
            style={{ color: config.accentColor }}
          >
            {config.blueprintLabel}
          </p>
          <h1
            className="mt-3 text-[clamp(2rem,5.5vw,3.25rem)] font-black leading-[1.02] tracking-[-0.04em]"
            style={{ color: config.accentColor }}
          >
            {config.h1}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[var(--color-ink-muted)]">
            {config.heroSubline}
          </p>
          {hub ? (
            <p className="mt-3 text-sm font-semibold text-[var(--color-ink)]">{hub.questionBankLabel}</p>
          ) : null}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href={LANDING_TRIAL_HREF}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-6 py-3.5 text-base font-bold text-white shadow-[var(--shadow-apple-btn)] transition hover:shadow-[var(--shadow-apple-btn-hover)]"
            >
              {formatTrialCtaLabel()}
              <ArrowRight className="h-5 w-5" aria-hidden />
            </Link>
            <Link
              href={ROUTES.pricing}
              className="inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-5 py-3.5 text-sm font-semibold text-[var(--color-ink)] transition hover:border-[var(--color-accent)]"
            >
              View pricing — Basic from {formatMonthlyPrice("basic")}/mo
            </Link>
          </div>
          <p className="mt-3 text-xs text-[var(--color-ink-muted)]">{TRIAL_PAYMENT_DISCLOSURE}</p>
        </header>

        <section className="mt-14 grid gap-4 sm:grid-cols-3" aria-labelledby="exam-usps">
          <h2 id="exam-usps" className="sr-only">
            Why students choose AnyExamEasy for {config.shortName}
          </h2>
          {config.features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5 shadow-[var(--shadow-apple-sm)]"
            >
              <h3 className="text-base font-bold text-[var(--color-ink)]">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">{feature.detail}</p>
            </div>
          ))}
        </section>

        <section className="mt-14 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8" aria-labelledby="platform-includes">
          <h2 id="platform-includes" className="text-xl font-bold text-[var(--color-ink)]">
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
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-accent)]" strokeWidth={2.5} aria-hidden />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold">
            <span className="inline-flex items-center gap-1.5 text-[var(--color-ink)]">
              <Map className="h-4 w-4 text-[var(--color-accent)]" aria-hidden /> Roadmap
            </span>
            <span className="inline-flex items-center gap-1.5 text-[var(--color-ink)]">
              <BookOpen className="h-4 w-4 text-[var(--color-accent)]" aria-hidden /> Deep Dives (Pro)
            </span>
            <span className="inline-flex items-center gap-1.5 text-[var(--color-ink)]">
              <BarChart3 className="h-4 w-4 text-[var(--color-accent)]" aria-hidden /> Analytics (Pro)
            </span>
          </div>
        </section>

        <section className="mt-14" aria-labelledby="study-tips">
          <h2 id="study-tips" className="text-xl font-bold text-[var(--color-ink)]">
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
            <h2 id="related-guides" className="text-xl font-bold text-[var(--color-ink)]">
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
          <h2 id="exam-faq" className="text-xl font-bold text-[var(--color-ink)]">
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
          <h2 id="other-boards" className="text-sm font-bold uppercase tracking-wide text-[var(--color-ink-muted)]">
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

        <section className="mt-14 rounded-2xl bg-[var(--color-ink)] px-6 py-10 text-center sm:px-10">
          <h2 className="text-2xl font-bold text-[var(--color-bg)]">
            Start {config.shortName} prep — {formatTrialLabel()}
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-white/80">
            Basic from {formatMonthlyPrice("basic")}/mo · Pro from {formatMonthlyPrice("pro")}/mo · All six board exams included
          </p>
          <Link
            href={LANDING_TRIAL_HREF}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-8 py-3.5 text-base font-bold text-white"
          >
            {formatTrialCtaLabel()}
            <ArrowRight className="h-5 w-5" aria-hidden />
          </Link>
        </section>
      </div>
    </div>
  );
}
