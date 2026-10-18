import Link from "next/link";
import { LandingCta } from "@/components/landing/LandingCta";
import { HomeSamplePlayer } from "@/components/marketing/elevation/HomeSamplePlayer";
import { SamplePractice } from "@/components/marketing/board-landing/SamplePractice";
import { CollapsibleSources } from "@/components/study/questions/CollapsibleSources";
import type { BoardLandingModel } from "@/lib/marketing/board-landing/model";
import { RATIONALE_STUDY_NOTE } from "@/lib/marketing/legal-copy";
import { ROUTES } from "@/lib/routes";

const LETTERS = ["A", "B", "C", "D", "E", "F"] as const;

/**
 * Board marketing page. Copy and counts come from the model so a later
 * pharmacy page can pass its own content through the same sections.
 */
export function BoardLanding({ model }: { model: BoardLandingModel }) {
  return (
    <div className="board-landing">
      <section className="bl-hero" aria-labelledby="board-hero-heading">
        <div className="bl-hero-copy">
          <p className="bl-kicker">
            <Link href="/">Home</Link>
            <span aria-hidden> / </span>
            <span>NCLEX</span>
          </p>
          <h1 id="board-hero-heading">
            {model.h1Lead} <span>{model.h1Accent}</span>
          </h1>
          <p className="bl-lede">{model.lede}</p>
          <div className="bl-actions">
            <LandingCta href={model.trialHref} ctaName="nclex_hero_trial" location="nclex_hero">
              {model.trialLabel}
            </LandingCta>
            <a className="bl-button bl-button-secondary" href="#sample-question">
              Try a free question
            </a>
          </div>
          <ul className="bl-trust">
            {model.trust.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <article className="bl-card" id="sample-question" aria-labelledby="sample-heading">
          <p className="bl-kicker" id="sample-heading">
            Free NCLEX practice question
          </p>
          <h2 className="bl-card-title">Try it before you sign up.</h2>
          <p className="bl-stem">{model.sample.stem}</p>
          <SamplePractice sample={model.sample} />
        </article>
      </section>

      {model.stats.length > 0 ? (
        <section className="bl-stats" aria-label="Live NCLEX bank counts">
          <dl>
            {model.stats.map((stat) => (
              <div key={stat.label}>
                <dt>{stat.label}</dt>
                <dd>{stat.value}</dd>
              </div>
            ))}
          </dl>
          {model.countLine ? <p>{model.countLine}</p> : null}
        </section>
      ) : (
        <section className="bl-stats" aria-label="Live NCLEX bank counts">
          <p>Live question counts are unavailable right now.</p>
        </section>
      )}

      <section className="bl-price" aria-labelledby="price-heading">
        <h2 id="price-heading">{model.priceHeading}</h2>
        <p>{model.priceLede}</p>
        <div className="bl-price-grid">
          {model.prices.map((price) => (
            <article key={price.id} className={price.featured ? "is-featured" : undefined}>
              <h3>{price.label}</h3>
              <p className="bl-amount">{price.amount}</p>
              <p>{price.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bl-section" aria-labelledby="explained-heading">
        <h2 id="explained-heading">Every question explained.</h2>
        <p className="bl-section-lede">
          The keyed answer and each stored reason are on the page. A check mark opens the sources.
        </p>
        <article className="bl-card bl-explained">
          <h3>Sample NCLEX question</h3>
          <p className="bl-stem">{model.sample.stem}</p>
          <ol className="bl-explained-list">
            {model.sample.options.map((option, index) => (
              <li key={option.id} className={option.correct ? "is-correct" : undefined}>
                <p>
                  <span className="bl-letter" aria-hidden>
                    {LETTERS[index] ?? index + 1}
                  </span>
                  {option.text}
                </p>
                {option.rationale ? (
                  <p className="bl-reason">
                    <span className="bl-reason-label">{option.correct ? "Correct. " : "Why not. "}</span>
                    {option.rationale}
                  </p>
                ) : (
                  <p className="bl-reason">This option is not the keyed answer.</p>
                )}
              </li>
            ))}
          </ol>
          <p className="bl-study-note">{RATIONALE_STUDY_NOTE}</p>
          {model.sample.sources.length > 0 ? (
            <CollapsibleSources count={model.sample.sources.length} resetKey={`${model.sample.id}-static`}>
              <ul>
                {model.sample.sources.map((source) => (
                  <li key={source}>
                    <cite>{source}</cite>
                  </li>
                ))}
              </ul>
            </CollapsibleSources>
          ) : null}
        </article>
      </section>

      {model.formats.length > 0 ? (
        <section className="bl-section" id="next-gen" aria-labelledby="ngn-heading">
          <h2 id="ngn-heading">{model.formatHeading}</h2>
          <p className="bl-section-lede">{model.formatLede}</p>
          <ul className="bl-format-grid">
            {model.formats.map((card) => (
              <li key={card.id}>
                <h3>{card.title}</h3>
                <p>{card.detail}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {model.quickBite ? (
        <section className="bl-section" id="quick-bites" aria-labelledby="quick-bites-heading">
          <h2 id="quick-bites-heading">Quick Bites</h2>
          <p className="bl-section-lede">Watch one free sample. The video file loads after you press play.</p>
          <article className="bl-card">
            <h3>
              {model.quickBite.title}
              <span className="bl-duration"> · {model.quickBite.duration}</span>
            </h3>
            <HomeSamplePlayer
              title={model.quickBite.title}
              webp={model.quickBite.webp}
              jpg={model.quickBite.jpg}
              mediaUrl={model.quickBite.mediaUrl}
              captions={model.quickBite.captions}
              imageAlt={model.quickBite.imageAlt}
            />
            <p className="bl-bite-cta">
              <Link href={ROUTES.pricing}>Get full access</Link>
            </p>
          </article>
        </section>
      ) : null}

      <section className="bl-section" aria-labelledby="reviewers-heading">
        <h2 id="reviewers-heading">Content review.</h2>
        <ul className="bl-reviewers">
          {model.reviewers.map((reviewer) => (
            <li key={reviewer.id}>
              <span
                className="bl-avatar"
                style={{ background: reviewer.background, color: reviewer.color }}
                aria-hidden
              >
                {reviewer.initials}
              </span>
              <h3>{reviewer.name}</h3>
              <p>{reviewer.role}</p>
            </li>
          ))}
        </ul>
      </section>

      {model.stories.length > 0 ? (
        <section className="bl-section" aria-labelledby="stories-heading">
          <h2 id="stories-heading">From students.</h2>
          <p className="bl-section-lede">{model.storyNote}</p>
          <ul className="bl-stories">
            {model.stories.map((story) => (
              <li key={story.name}>
                <blockquote>
                  <p>{story.quote}</p>
                </blockquote>
                <p className="bl-story-by">
                  <span aria-hidden>{story.initials}</span>
                  {story.name}
                  <span> · {story.exam}</span>
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="bl-section" aria-labelledby="links-heading">
        <h2 id="links-heading">More NCLEX practice</h2>
        <ul className="bl-links">
          {model.links.map((link) => (
            <li key={link.href}>
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="bl-section" id="faq" aria-labelledby="faq-heading">
        <h2 id="faq-heading">Questions.</h2>
        <div className="bl-faq">
          {model.faqs.map((faq) => (
            <details key={faq.question}>
              <summary>
                <h3>{faq.question}</h3>
              </summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="bl-final" aria-labelledby="final-heading">
        <h2 id="final-heading">{model.finalHeading}</h2>
        <p>{model.finalLede}</p>
        <LandingCta href={model.trialHref} ctaName="nclex_final_trial" location="nclex_final">
          {model.trialLabel}
        </LandingCta>
      </section>
    </div>
  );
}
