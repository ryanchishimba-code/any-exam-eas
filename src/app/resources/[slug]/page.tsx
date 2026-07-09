import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import {
  EXAM_SEO_CONFIG,
  examMarketingPath,
} from "@/lib/seo/exam-config";
import {
  buildArticleJsonLd,
  buildResourceArticleMetadata,
} from "@/lib/seo/marketing-metadata";
import { getResourceArticle, getArticlesForExam, RESOURCE_ARTICLES } from "@/lib/seo/resources-content";
import { ResourceArticleSection } from "@/components/resources/ResourceArticleSection";
import { LANDING_TRIAL_HREF } from "@/lib/landing/content";
import { ROUTES } from "@/lib/routes";
import { formatTrialCtaLabel } from "@/lib/site";
import { seoResourcesCtaLine } from "@/lib/seo/trial-copy";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return RESOURCE_ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const article = getResourceArticle(slug);
  if (!article) return { title: "Resource not found" };
  return buildResourceArticleMetadata(article);
}

export default async function ResourceArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getResourceArticle(slug);
  if (!article) notFound();

  const primaryExam = article.primaryExam;
  const relatedArticles = primaryExam
    ? getArticlesForExam(primaryExam).filter((a) => a.slug !== slug).slice(0, 4)
    : [];

  return (
    <>
      <JsonLdScript data={buildArticleJsonLd(article)} />
      <article className="mx-auto max-w-3xl px-5 pb-20 pt-[var(--page-top)] sm:px-6">
        <nav className="text-sm text-[var(--color-ink-muted)]">
          <Link href={ROUTES.home} className="hover:text-[var(--color-accent)]">
            Home
          </Link>
          <span className="mx-2 opacity-40">/</span>
          <Link href="/toolkit" className="hover:text-[var(--color-accent)]">
            Toolkit
          </Link>
        </nav>

        <header className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-accent)]">
            {article.examTags.map((t) => EXAM_SEO_CONFIG[t].shortName).join(" · ")} ·{" "}
            {article.readingMinutes} min read
          </p>
          <h1 className="mt-2 text-[clamp(1.75rem,4vw,2.5rem)] font-black leading-tight tracking-[-0.03em] text-[var(--color-ink)]">
            {article.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-[var(--color-ink-muted)]">{article.intro}</p>
        </header>

        <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert">
          {article.sections.map((section) => (
            <ResourceArticleSection key={section.heading} section={section} />
          ))}
        </div>

        {relatedArticles.length > 0 ? (
          <nav className="mt-10 rounded-2xl border border-[var(--color-border)] p-6" aria-label="Related study guides">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-ink)]">
              Related guides
            </h2>
            <ul className="mt-3 space-y-2" role="list">
              {relatedArticles.map((related) => (
                <li key={related.slug}>
                  <Link
                    href={`/resources/${related.slug}`}
                    className="text-sm font-medium text-[var(--color-accent)] hover:underline"
                  >
                    {related.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        <aside className="mt-12 rounded-2xl bg-[var(--color-ink)] px-6 py-8 text-center">
          <h2 className="text-xl font-bold text-[var(--color-bg)]">{formatTrialCtaLabel()}</h2>
          <p className="mt-2 text-sm text-white/80">{seoResourcesCtaLine()}</p>
          <Link
            href={LANDING_TRIAL_HREF}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-bold text-white"
          >
            {formatTrialCtaLabel()}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          {primaryExam ? (
            <p className="mt-4">
              <Link
                href={examMarketingPath(primaryExam)}
                className="text-sm font-semibold text-[var(--color-accent)]"
              >
                Explore {EXAM_SEO_CONFIG[primaryExam].shortName} prep hub →
              </Link>
            </p>
          ) : null}
        </aside>

        <footer className="mt-10 border-t border-[var(--color-border)] pt-6">
          <Link href="/toolkit" className="text-sm font-semibold text-[var(--color-accent)]">
            ← Toolkit
          </Link>
        </footer>
      </article>
    </>
  );
}
