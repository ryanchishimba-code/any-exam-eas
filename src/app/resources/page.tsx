import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { PageShell } from "@/components/PageShell";
import {
  EXAM_SEO_CONFIG,
  EXAM_SEO_KEYS,
  examMarketingPath,
} from "@/lib/seo/exam-config";
import {
  buildResourcesHubJsonLd,
  buildResourcesHubMetadata,
} from "@/lib/seo/marketing-metadata";
import {
  RESOURCE_ARTICLES,
  RESOURCE_DOWNLOADS,
} from "@/lib/seo/resources-content";
import { LANDING_TRIAL_HREF } from "@/lib/landing/content";
import { formatTrialCtaLabel } from "@/lib/site";

export const metadata = buildResourcesHubMetadata();

export default function ResourcesHubPage() {
  return (
    <>
      <JsonLdScript data={buildResourcesHubJsonLd()} />
      <PageShell
        eyebrow="Study resources"
        title="Board exam guides & free downloads"
        description="SEO-friendly study guides for NCLEX, USMLE, NAPLEX, PANCE, AANP FNP, and NPTE-PT — plus printable planners and cheat sheets when you start your free trial."
        maxWidth="max-w-5xl"
      >
        <Link
          href={LANDING_TRIAL_HREF}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-bold text-white"
        >
          {formatTrialCtaLabel()}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>

        <section className="mt-14" aria-labelledby="free-downloads">
          <h2 id="free-downloads" className="text-xl font-bold text-[var(--color-ink)]">
            Free downloads (with trial)
          </h2>
          {RESOURCE_DOWNLOADS.length > 0 ? (
            <Link
              href={RESOURCE_DOWNLOADS[0]!.signupHref}
              className="group mt-5 flex flex-col justify-between gap-4 rounded-3xl border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/[0.05] p-6 sm:flex-row sm:items-center"
            >
              <div>
                <span className="inline-flex rounded-full bg-[var(--color-accent)] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                  Most popular
                </span>
                <h3 className="mt-3 text-lg font-bold text-[var(--color-ink)]">
                  {RESOURCE_DOWNLOADS[0]!.title}
                </h3>
                <p className="mt-1.5 max-w-xl text-sm text-[var(--color-ink-muted)]">
                  {RESOURCE_DOWNLOADS[0]!.description}
                </p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-bold text-white transition group-hover:gap-3">
                Get access
                <ArrowRight className="h-4 w-4" aria-hidden />
              </span>
            </Link>
          ) : null}
          {RESOURCE_DOWNLOADS.length > 1 ? (
            <ul className="mt-4 grid gap-4 sm:grid-cols-2">
              {RESOURCE_DOWNLOADS.slice(1).map((item) => (
                <li
                  key={item.slug}
                  className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5"
                >
                  <h3 className="font-bold text-[var(--color-ink)]">{item.title}</h3>
                  <p className="mt-2 text-sm text-[var(--color-ink-muted)]">{item.description}</p>
                  <Link
                    href={item.signupHref}
                    className="mt-4 inline-flex text-sm font-semibold text-[var(--color-accent)]"
                  >
                    Get access →
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </section>

        <section className="mt-14" aria-labelledby="exam-guides">
          <h2 id="exam-guides" className="text-xl font-bold text-[var(--color-ink)]">
            Exam prep guides
          </h2>
          <ul className="mt-5 divide-y divide-[var(--color-border)] rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
            {RESOURCE_ARTICLES.map((article) => (
              <li key={article.slug}>
                <Link
                  href={`/resources/${article.slug}`}
                  className="group flex flex-wrap items-center justify-between gap-3 px-5 py-4 transition hover:bg-[var(--color-surface)]"
                >
                  <div>
                    <p className="font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-accent)]">
                      {article.title}
                    </p>
                    <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
                      {article.readingMinutes} min read ·{" "}
                      {article.examTags.map((t) => EXAM_SEO_CONFIG[t].shortName).join(", ")}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[var(--color-ink-muted)]" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14" aria-labelledby="exam-hubs">
          <h2 id="exam-hubs" className="text-xl font-bold text-[var(--color-ink)]">
            Exam prep hubs
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {EXAM_SEO_KEYS.map((key) => {
              const config = EXAM_SEO_CONFIG[key];
              return (
                <li key={key}>
                  <Link
                    href={examMarketingPath(key)}
                    className="inline-block rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-bold"
                    style={{ color: config.accentColor }}
                  >
                    {config.shortName} prep
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </PageShell>
    </>
  );
}
