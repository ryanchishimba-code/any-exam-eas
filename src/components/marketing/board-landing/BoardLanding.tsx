import Link from "next/link";
import { LandingCta } from "@/components/landing/LandingCta";
import { HeroScene } from "@/components/marketing/board-landing/HeroScene";
import { HomeSamplePlayer } from "@/components/marketing/elevation/HomeSamplePlayer";
import { SamplePractice } from "@/components/marketing/board-landing/SamplePractice";
import type { HeroCaseScene } from "@/lib/marketing/board-landing/hero-case";
import type { BoardLandingModel } from "@/lib/marketing/board-landing/model";
function HeroOfferBand({ offer }: { offer: BoardLandingModel["heroOffer"] }) {
  return (
    <div className="bl-hero-band" aria-label="Live bank size and pricing">
      <p className="bl-hero-band__count">
        {offer.liveQuestions ? (
          <>
            <span className="bl-hero-band__value">{offer.liveQuestions}</span>
            <span className="bl-hero-band__label"> live NCLEX questions</span>
          </>
        ) : (
          <span className="bl-hero-band__label">Live NCLEX question bank</span>
        )}
      </p>
      <p className="bl-hero-band__prices">
        <span className="bl-hero-band__ours">{offer.proPrice}</span>
        <span className="bl-hero-band__vs" aria-hidden> · </span>
        <span className="bl-hero-band__typical">vs {offer.typicalPrice} typical 30-day prep</span>
      </p>
      <p className="bl-hero-band__trial">{offer.trialLine}</p>
    </div>
  );
}

function SampleQuestion({ model }: { model: BoardLandingModel }) {
  return (
    <article className="bl-card" id="sample-question" aria-labelledby="sample-heading">
      <h2 className="bl-card-title" id="sample-heading">Free sample question</h2>
      <p className="bl-stem">{model.sample.stem}</p>
      <SamplePractice sample={model.sample} />
    </article>
  );
}

export function BoardLanding({
  model,
  scene = null,
}: {
  model: BoardLandingModel;
  scene?: HeroCaseScene | null;
}) {
  const questionCount = model.stats.find((stat) => stat.label === "Questions")?.value ?? null;
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
          <HeroOfferBand offer={model.heroOffer} />
          <p className="bl-lede">{model.lede}</p>
          {scene ? null : (
            <div className="bl-actions">
              <LandingCta href={model.trialHref} ctaName="nclex_hero_trial" location="nclex_hero">
                {model.trialLabel}
              </LandingCta>
              <a className="bl-button bl-button-secondary" href="#sample-question">
                Try a free question
              </a>
            </div>
          )}
          <ul className="bl-trust">
            {model.trust.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        {scene ? (
          <HeroScene
            scene={scene}
            trialHref={model.trialHref}
            trialLabel={model.trialLabel}
            questionCount={questionCount}
            reviewers={model.reviewers}
          />
        ) : (
          <SampleQuestion model={model} />
        )}
      </section>

      {scene ? (
        <div className="bl-sample-wrap">
          <SampleQuestion model={model} />
        </div>
      ) : null}

      <section className="bl-proof" aria-label="Why students use AnyExamEasy">
        <ul>
          {model.proofPoints.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </section>

      {model.quickBite ? (
        <section className="bl-section bl-section--tight" id="quick-bites" aria-labelledby="quick-bites-heading">
          <h2 id="quick-bites-heading">Quick Bites sample</h2>
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

      <section className="bl-section bl-section--tight" id="faq" aria-labelledby="faq-heading">
        <h2 id="faq-heading">FAQ</h2>
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
