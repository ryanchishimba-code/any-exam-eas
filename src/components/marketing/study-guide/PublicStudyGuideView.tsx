import Link from "next/link";
import "@/components/nclex-study-guide/study-guide-reader.css";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import type { LoadedPublicGuide } from "@/lib/study-guides/load-public-guide";
import {
  PUBLIC_STUDY_GUIDE_TRIAL_LABEL,
  type PublicStudyGuide,
} from "@/lib/study-guides/public-catalog";
import "@/styles/public-study-guide.css";

export function PublicStudyGuideView({
  guide,
  page,
  stepLinks,
}: {
  guide: PublicStudyGuide;
  page: LoadedPublicGuide;
  stepLinks?: readonly { href: string; label: string }[];
}) {
  return (
    <article className="psg">
      <JsonLdScript data={page.jsonLd} />
      <header
        className="psg-hero"
        style={{ backgroundImage: `url(${guide.photoBase}-mobile.webp)` }}
      >
        <div className="psg-hero__copy">
          <p className="psg-kicker">Free study guide · {guide.boardLabel}</p>
          <p className="psg-hero__note">
            Read it here. No account. Practice is separate, and this page does not promise a passing result.
          </p>
          <div className="psg-actions">
            <Link className="aee-flagship-cta aee-flagship-cta--primary" href={guide.trialHref}>
              {PUBLIC_STUDY_GUIDE_TRIAL_LABEL}
            </Link>
            <Link className="psg-text-link" href={guide.dailyHref}>
              Today&apos;s free question
            </Link>
          </div>
        </div>
      </header>

      <div className="psg-layout">
        {page.toc.length > 0 ? (
          <nav className="psg-toc" aria-label="On this page">
            <p className="psg-toc__label">On this page</p>
            <ol>
              {page.toc.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`}>{item.text}</a>
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        <div className="psg-main">
          {stepLinks && stepLinks.length > 0 ? (
            <nav className="psg-steps" aria-label="USMLE books">
              {stepLinks.map((step) => (
                <Link key={step.href} href={step.href}>
                  {step.label}
                </Link>
              ))}
            </nav>
          ) : null}
          <div className="sg-paper sg-prose" dangerouslySetInnerHTML={{ __html: page.html }} />
          <aside className="psg-more" aria-label="Keep studying">
            <h2>Keep going</h2>
            <p>
              The guide is open. A 5-day free trial, with no card required, is how you practice questions
              for {guide.boardLabel}.
            </p>
            <div className="psg-actions">
              <Link className="aee-flagship-cta aee-flagship-cta--primary" href={guide.trialHref}>
                {PUBLIC_STUDY_GUIDE_TRIAL_LABEL}
              </Link>
            </div>
            <ul>
              <li>
                <Link href={guide.dailyHref}>Free daily question</Link>
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
              <li>
                <Link href={guide.boardHref}>{guide.boardLabel} practice</Link>
              </li>
            </ul>
          </aside>
        </div>
      </div>
    </article>
  );
}
