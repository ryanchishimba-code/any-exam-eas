import Link from "next/link";
import { LandingCta } from "@/components/landing/LandingCta";
import { BoardFeatureGrid } from "@/components/marketing/board-landing/BoardFeatureGrid";
import { BoardLandingInfographics } from "@/components/marketing/board-landing/BoardLandingInfographics";
import { NclexLandingCompareChart } from "@/components/marketing/board-landing/NclexLandingCompareChart";
import { NclexStudentTrustBadge } from "@/components/marketing/board-landing/NclexStudentTrustBadge";
import { BoardLandingTestimonials } from "@/components/marketing/board-landing/BoardLandingTestimonials";
import { BoardPainPoints } from "@/components/marketing/board-landing/BoardPainPoints";
import { NaplexAceDonutSection } from "@/components/marketing/board-landing/NaplexAceDonutSection";
import { HeroScene } from "@/components/marketing/board-landing/HeroScene";
import { PharmacyHero } from "@/components/marketing/board-landing/PharmacyHero";
import { HomeSamplePlayer } from "@/components/marketing/elevation/HomeSamplePlayer";
import { SamplePractice } from "@/components/marketing/board-landing/SamplePractice";
import { CollapsibleSources } from "@/components/study/questions/CollapsibleSources";
import type { HeroCaseScene } from "@/lib/marketing/board-landing/hero-case";
import type { PharmacyHeroScene } from "@/lib/marketing/board-landing/pharmacy-case";
import type { BoardLandingModel } from "@/lib/marketing/board-landing/model";
import { RATIONALE_STUDY_NOTE } from "@/lib/marketing/legal-copy";

const LETTERS = ["A", "B", "C", "D", "E", "F"] as const;

function HeroDifferentiatorChips({ chips }: { chips: NonNullable<BoardLandingModel["heroChips"]> }) {
  return (
    <ul className="bl-hero-chips" aria-label="Why students choose AnyExamEasy over other question banks">
      {chips.map((chip) => (
        <li key={chip.id}>{chip.text}</li>
      ))}
    </ul>
  );
}

function HeroOfferBand({
  offer,
  chipsAbove,
  boardName,
}: {
  offer: NonNullable<BoardLandingModel["heroOffer"]>;
  chipsAbove?: boolean;
  boardName: string;
}) {
  const questionLabel = offer.questionNoun ?? "questions";
  const typicalPeriod = offer.typicalPeriod ?? "30-day prep";
  return (
    <div
      className={`bl-hero-band${chipsAbove ? " bl-hero-band--count-only" : ""}`}
      aria-label={chipsAbove ? `Live ${boardName} question bank size` : "Live bank size and pricing"}
    >
      <p className="bl-hero-band__count">
        {offer.liveQuestions ? (
          <>
            <span className="bl-hero-band__value">{offer.liveQuestions}</span>
            <span className="bl-hero-band__label"> live {questionLabel}</span>
          </>
        ) : (
          <span className="bl-hero-band__label">Live {boardName} question bank</span>
        )}
      </p>
      {chipsAbove ? (
        <p className="bl-hero-band__trial">{offer.trialLine}</p>
      ) : (
        <>
          <p className="bl-hero-band__prices">
            <span className="bl-hero-band__ours">{offer.proPrice}</span>
            <span className="bl-hero-band__vs" aria-hidden> · </span>
            <span className="bl-hero-band__typical">
              vs {offer.typicalPrice} typical {typicalPeriod}
            </span>
          </p>
          <p className="bl-hero-band__trial">{offer.trialLine}</p>
        </>
      )}
    </div>
  );
}

function HeroCtaMicrocopy({ text }: { text: string }) {
  return <p className="bl-cta-micro">{text}</p>;
}

function SampleQuestion({
  model,
  question,
  headingId,
  anchorId,
  title,
}: {
  model: BoardLandingModel;
  question: NonNullable<BoardLandingModel["sample"]>;
  headingId: string;
  anchorId: string;
  title: string;
}) {
  const lean = Boolean(model.heroOffer);
  return (
    <article className="bl-card" id={anchorId} aria-labelledby={headingId}>
      {lean ? (
        <h2 className="bl-card-title" id={headingId}>{title}</h2>
      ) : (
        <>
          <p className="bl-kicker" id={headingId}>{model.sampleKicker}</p>
          <h2 className="bl-card-title">Try it before you sign up.</h2>
        </>
      )}
      <p className="bl-stem">{question.stem}</p>
      <SamplePractice sample={question} />
    </article>
  );
}

export function BoardLanding({
  model,
  scene = null,
  pharmacy = null,
}: {
  model: BoardLandingModel;
  scene?: HeroCaseScene | null;
  pharmacy?: PharmacyHeroScene | null;
}) {
  const lean = Boolean(model.heroOffer);
  const nclexConversion = Boolean(model.nclexCompare && model.studentTrustBadge);
  const questionCount = model.stats.find((stat) => stat.label === "Questions")?.value ?? null;
  return (
    <div className={`board-landing ${model.themeClass}`}>
      <section className="bl-hero" aria-labelledby="board-hero-heading">
        <div className="bl-hero-copy">
          <p className="bl-kicker">
            <Link href="/">Home</Link>
            <span aria-hidden> / </span>
            <span>{model.boardName}</span>
            <span className="bl-updated"> · Updated {model.contentYear}</span>
          </p>
          <h1 id="board-hero-heading">
            {model.h1Lead} <span>{model.h1Accent}</span>
          </h1>
          {lean && model.heroWhyUs ? <p className="bl-hero-why">{model.heroWhyUs}</p> : null}
          {model.heroChips?.length ? <HeroDifferentiatorChips chips={model.heroChips} /> : null}
          {model.heroOffer ? (
            <HeroOfferBand
              offer={model.heroOffer}
              chipsAbove={Boolean(model.heroChips?.length)}
              boardName={model.boardName}
            />
          ) : null}
          {lean ? null : <p className="bl-lede">{model.lede}</p>}
          {scene || pharmacy ? null : (
            <>
              <div className="bl-actions">
                <LandingCta href={model.trialHref} ctaName={model.heroCtaName} location={model.heroCtaLocation}>
                  {model.trialLabel}
                </LandingCta>
                {model.sample ? (
                  <a className="bl-button bl-button-secondary" href="#sample-question">
                    Try a free question
                  </a>
                ) : null}
              </div>
              {lean && model.ctaMicrocopy ? <HeroCtaMicrocopy text={model.ctaMicrocopy} /> : null}
            </>
          )}
          {model.heroChips?.length ? null : (
            <ul className="bl-trust">
              {model.trust.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </div>
        {pharmacy ? (
          <PharmacyHero
            hero={pharmacy}
            trialHref={model.trialHref}
            trialLabel={model.trialLabel}
            ctaName={model.heroCtaName}
            ctaLocation={model.heroCtaLocation}
            ctaMicrocopy={lean ? model.ctaMicrocopy : undefined}
          />
        ) : scene ? (
          <HeroScene
            scene={scene}
            trialHref={model.trialHref}
            trialLabel={model.trialLabel}
            questionCount={questionCount}
            reviewers={model.reviewers}
            kicker={model.sceneKicker}
            idPrefix={model.sceneIdPrefix}
            ctaName={model.heroCtaName}
            ctaLocation={model.heroCtaLocation}
            ctaMicrocopy={lean ? model.ctaMicrocopy : undefined}
          />
        ) : model.sample ? (
          <SampleQuestion
            model={model}
            question={model.sample}
            anchorId="sample-question"
            headingId="sample-heading"
            title="Free sample question"
          />
        ) : null}
      </section>

      {nclexConversion ? (
        <>
          <BoardLandingTestimonials stories={model.stories} prominent />
          <NclexStudentTrustBadge badge={model.studentTrustBadge!} />
          <NclexLandingCompareChart data={model.nclexCompare!} />
        </>
      ) : null}

      {lean ? (
        <>
          <BoardLandingInfographics visuals={model.visuals} hidePriceBars={nclexConversion} />
          <BoardPainPoints points={model.painPoints} />
          {model.aceDonut ? <NaplexAceDonutSection model={model.aceDonut} /> : null}
        </>
      ) : null}

      {(scene || pharmacy) && model.sample ? (
        <div className="bl-sample-wrap">
          <SampleQuestion
            model={model}
            question={model.sample}
            anchorId="sample-question"
            headingId="sample-heading"
            title="Free sample question"
          />
        </div>
      ) : null}

      {model.sampleSecondary ? (
        <div className="bl-sample-wrap">
          <SampleQuestion
            model={model}
            question={model.sampleSecondary}
            anchorId="sample-question-ngn"
            headingId="sample-heading-ngn"
            title="Next Gen sample question"
          />
        </div>
      ) : null}

      {model.features.length > 0 ? (
        <BoardFeatureGrid cards={model.features} tight={lean} />
      ) : null}

      {nclexConversion ? null : <BoardLandingTestimonials stories={model.stories} />}

      {lean ? null : (
        <>
          {model.stats.length > 0 ? (
            <section className="bl-stats" aria-label={model.statsLabel}>
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
            <section className="bl-stats" aria-label={model.statsLabel}>
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
        </>
      )}

      {!lean && model.sample ? (
        <section className="bl-section" aria-labelledby="explained-heading">
          <h2 id="explained-heading">Every question explained.</h2>
          <p className="bl-section-lede">
            The keyed answer and each stored reason are on the page. A check mark opens the sources.
          </p>
          <article className="bl-card bl-explained">
            <h3>{model.explainedTitle}</h3>
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
      ) : null}

      {!lean && model.formats.length > 0 ? (
        <section className="bl-section" id={model.formatAnchor} aria-labelledby="ngn-heading">
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
        <section
          className={`bl-section${lean ? " bl-section--tight" : ""}`}
          id="quick-bites"
          aria-labelledby="quick-bites-heading"
        >
          <h2 id="quick-bites-heading">{lean ? "Quick Bites sample" : "Quick Bites"}</h2>
          {!lean ? (
            <p className="bl-section-lede">Watch one free sample. The video file loads after you press play.</p>
          ) : null}
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
          </article>
        </section>
      ) : null}

      {!lean ? (
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
      ) : null}

      {!lean && model.links.length > 0 ? (
        <section className="bl-section" aria-labelledby="links-heading">
          <h2 id="links-heading">{model.linksHeading}</h2>
          <ul className="bl-links">
            {model.links.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className={`bl-section${lean ? " bl-section--tight" : ""}`} id="faq" aria-labelledby="faq-heading">
        <h2 id="faq-heading">{lean ? "FAQ" : "Questions."}</h2>
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
        <LandingCta href={model.trialHref} ctaName={model.finalCtaName} location={model.finalCtaLocation}>
          {model.trialLabel}
        </LandingCta>
        {lean && model.ctaMicrocopy ? <HeroCtaMicrocopy text={model.ctaMicrocopy} /> : null}
      </section>
    </div>
  );
}
