import Link from "next/link";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import "@/components/nclex-study-guide/study-guide-reader.css";
import { absoluteUrl, getSiteUrl } from "@/lib/seo";
import { organizationRef } from "@/lib/seo/brand-entity";
import { presentGuideHtml } from "@/lib/study-guides/present-html";
import type { PublicGuideChapter, PublicGuideOutline } from "@/lib/study-guides/load-public-guide";
import {
  PUBLIC_STUDY_GUIDE_TRIAL_LABEL,
  type PublicStudyGuide,
} from "@/lib/study-guides/public-catalog";
import "@/styles/public-study-guide.css";

function chapterJsonLd(input: {
  guidePath: string;
  guideName: string;
  path: string;
  title: string;
  description: string;
}) {
  const site = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site },
          { "@type": "ListItem", position: 2, name: input.guideName, item: absoluteUrl(input.guidePath) },
          { "@type": "ListItem", position: 3, name: input.title, item: absoluteUrl(input.path) },
        ],
      },
      {
        "@type": "Article",
        headline: input.title,
        description: input.description,
        mainEntityOfPage: absoluteUrl(input.path),
        author: organizationRef(),
        publisher: organizationRef(),
      },
    ],
  };
}

export function PublicGuideChapterView({
  guide,
  guidePath,
  guideName,
  path,
  query,
  chapter,
  prev,
  next,
}: {
  guide: PublicStudyGuide;
  guidePath: string;
  guideName: string;
  path: string;
  query: string;
  chapter: PublicGuideChapter;
  prev: PublicGuideOutline | null;
  next: PublicGuideOutline | null;
}) {
  const body = presentGuideHtml(chapter.html, query);
  const prevHref = prev ? `${guidePath}/${prev.slug}` : null;
  const nextHref = next ? `${guidePath}/${next.slug}` : null;
  const pager = (
    <nav className="psg-pager" aria-label="Section">
      <Link href={guidePath}>All sections</Link>
      {prevHref ? <Link href={prevHref}>Previous: {prev?.title}</Link> : null}
      {nextHref ? <Link href={nextHref}>Next: {next?.title}</Link> : null}
    </nav>
  );

  return (
    <article className="psg">
      <JsonLdScript
        data={chapterJsonLd({
          guidePath,
          guideName,
          path,
          title: chapter.title,
          description: chapter.excerpt || guide.description,
        })}
      />
      <div className="psg-chapter">
        <p className="psg-chapter-kicker">
          <Link href={guidePath}>{guideName}</Link>
        </p>
        <h1>{chapter.title}</h1>
        {chapter.excerpt ? <p className="psg-lede">{chapter.excerpt}</p> : null}
        {pager}
        <div className="psg-body sg-paper sg-prose" dangerouslySetInnerHTML={{ __html: body }} />
        {pager}
        <aside className="psg-end">
          <h2>The rest of the guide is free too.</h2>
          <p>
            Every section of the {query} is public. No login is required. A 5-day free trial, with no card, opens the
            question bank when you want to practice.
          </p>
          <Link className="aee-flagship-cta aee-flagship-cta--primary" href={guide.trialHref}>
            {PUBLIC_STUDY_GUIDE_TRIAL_LABEL}
          </Link>
        </aside>
      </div>
    </article>
  );
}
