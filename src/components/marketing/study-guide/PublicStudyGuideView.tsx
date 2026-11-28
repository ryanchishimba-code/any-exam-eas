import Link from "next/link";
import type { CSSProperties } from "react";
import "@/components/nclex-study-guide/study-guide-reader.css";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import {
  MARKETING_PHOTO_HEROES,
  marketingPhotoHeroSrc,
} from "@/lib/marketing/marketing-photo-heroes";
import { contentUpdatedOn } from "@/lib/study-guides/content-updated";
import type { LoadedPublicGuide } from "@/lib/study-guides/load-public-guide";
import { guideSectionToc, presentGuideHtml, readingMinutes, readingTimeLabel } from "@/lib/study-guides/present-html";
import {
  PUBLIC_STUDY_GUIDE_LIST,
  PUBLIC_STUDY_GUIDE_TRIAL_LABEL,
  USMLE_PUBLIC_STEPS,
  type PublicStudyGuide,
  type PublicStudyGuideId,
} from "@/lib/study-guides/public-catalog";
import { GUIDE_SEO, STEP_SEO, guideJsonLd, type GuideSeoCopy } from "@/lib/study-guides/seo-copy";
import "@/styles/public-study-guide.css";

function seoFor(guide: PublicStudyGuide, stepId?: string): GuideSeoCopy {
  if (stepId && STEP_SEO[stepId]) return STEP_SEO[stepId]!;
  return GUIDE_SEO[guide.id]!;
}

export function PublicStudyGuideView({
  guide,
  page,
  stepLinks,
  stepId,
  questionCount,
}: {
  guide: PublicStudyGuide;
  page: LoadedPublicGuide;
  stepLinks?: readonly { href: string; label: string }[];
  stepId?: string;
  /** Floored live total, already formatted with a plus, such as 3,900+. */
  questionCount?: string | null;
}) {
  const seo = seoFor(guide, stepId);
  const step = USMLE_PUBLIC_STEPS.find((item) => item.id === stepId);
  const canonicalPath = step?.path ?? guide.path;
  const description = step?.description ?? guide.description;
  const heroId = guide.id as PublicStudyGuideId;
  const focal = MARKETING_PHOTO_HEROES[heroId].focalPosition;
  const body = presentGuideHtml(page.html, seo.query);
  const sections = guideSectionToc(body);
  const minutes = readingMinutes(body, `${seo.lede} ${seo.answers.map((item) => item.answer).join(" ")}`);
  const contentDirs = step
    ? [step.contentDir]
    : guide.contentDirs.length > 0
      ? [...guide.contentDirs]
      : ["src/lib/exam-prep/npte-pt/content-outline.ts"];
  const updated = contentUpdatedOn(contentDirs);
  const related = PUBLIC_STUDY_GUIDE_LIST.filter((item) => item.id !== guide.id);
  const toc = (
    <ol>
      {seo.answers.map((item) => (
        <li key={item.id}>
          <a href={`#${item.id}`}>{item.question}</a>
        </li>
      ))}
      {sections.map((item) => (
        <li key={item.id}>
          <a href={`#${item.id}`}>{item.text}</a>
        </li>
      ))}
    </ol>
  );

  return (
    <article className="psg">
      <JsonLdScript
        data={guideJsonLd({
          path: canonicalPath,
          headline: seo.headline,
          description,
          answers: seo.answers,
          dateModified: updated.iso,
        })}
      />
      <header className="psg-hero" style={{ "--psg-focal": focal } as CSSProperties}>
        <picture>
          <source srcSet={marketingPhotoHeroSrc(heroId, "desktop", "avif")} type="image/avif" />
          <img
            src={marketingPhotoHeroSrc(heroId, "desktop", "webp")}
            alt=""
            width={1280}
            height={720}
            fetchPriority="high"
            decoding="async"
          />
        </picture>
        <div className="psg-hero__scrim">
          <p className="psg-kicker">{guide.boardLabel}</p>
          <h1>{seo.headline}</h1>
          <p className="psg-hero__promise">
            Read this {seo.query} for the {guide.boardLabel}, then practice.
          </p>
        </div>
      </header>

      <ul className="psg-stats">
        {questionCount ? (
          <li>
            <strong>{questionCount}</strong> board-style questions
          </li>
        ) : null}
        <li>{readingTimeLabel(minutes)}</li>
        <li>Updated {updated.label}</li>
      </ul>

      <div className="psg-wrap">
        <p className="psg-lede">{seo.lede}</p>

        <section className="psg-try" aria-label="Try a free question">
          <h2>Try a free question</h2>
          <p>
            One free question for the {guide.boardLabel} is open today. The {seo.query} stays on this page either way.
          </p>
          <Link className="aee-flagship-cta aee-flagship-cta--primary" href={guide.dailyHref}>
            Try a free question
          </Link>
        </section>

        <details className="psg-toc psg-toc--mobile">
          <summary>On this page</summary>
          {toc}
        </details>
        <nav className="psg-toc psg-toc--desktop" aria-label="On this page">
          <p className="psg-toc__label">On this page</p>
          {toc}
        </nav>

        <aside className="psg-rail">
          <p className="psg-rail__kicker">Practice when you are ready</p>
          <p>The guide stays open. The question bank starts with a 5-day trial and no card.</p>
          <Link className="aee-flagship-cta aee-flagship-cta--primary" href={guide.trialHref}>
            {PUBLIC_STUDY_GUIDE_TRIAL_LABEL}
          </Link>
          <Link className="psg-text-link" href={guide.dailyHref}>
            Try a free question
          </Link>
        </aside>

        <section className="psg-faq" aria-label="Questions people ask">
          <p className="psg-faq__label">Questions people ask</p>
          {seo.answers.map((item) => (
            <section key={item.id} className="psg-card psg-card--section" id={item.id}>
              <h2>{item.question}</h2>
              <p>{item.answer}</p>
            </section>
          ))}
        </section>

        {stepLinks && stepLinks.length > 0 ? (
          <nav className="psg-steps" aria-label="Step books">
            {stepLinks.map((step) => (
              <Link key={step.href} href={step.href}>
                {step.label}
              </Link>
            ))}
          </nav>
        ) : null}

        <div className="psg-body sg-paper sg-prose" dangerouslySetInnerHTML={{ __html: body }} />

        <aside className="psg-end">
          <h2>Read the guide. Practice when you want the bank.</h2>
          <p>
            The {seo.query} does not close. A 5-day free trial, with no card required, opens questions for{" "}
            {guide.boardLabel}.
          </p>
          <Link className="aee-flagship-cta aee-flagship-cta--primary" href={guide.trialHref}>
            {PUBLIC_STUDY_GUIDE_TRIAL_LABEL}
          </Link>
        </aside>

        <nav className="psg-links" aria-label="Related guides">
          <h2>Keep reading</h2>
          <ul>
            <li>
              <Link href={guide.boardHref}>{guide.boardLabel}</Link>
            </li>
            <li>
              <Link href={guide.dailyHref}>Today&apos;s free question</Link>
            </li>
            <li>
              <Link href={guide.resourcePath}>{guide.resourceLabel}</Link>
            </li>
            <li>
              <Link href="/toolkit">Toolkit</Link>
            </li>
            <li>
              <Link href="/compare">Compare</Link>
            </li>
            {related.map((item) => (
              <li key={item.path}>
                <Link href={item.path}>{GUIDE_SEO[item.id]?.headline ?? item.boardLabel}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </article>
  );
}
