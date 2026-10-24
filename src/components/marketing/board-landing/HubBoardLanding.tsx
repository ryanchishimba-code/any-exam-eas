import { LandingCta } from "@/components/landing/LandingCta";
import { BoardFeatureGrid } from "@/components/marketing/board-landing/BoardFeatureGrid";
import { BoardLandingHero } from "@/components/marketing/board-landing/BoardLandingHero";
import { BoardLandingTestimonials } from "@/components/marketing/board-landing/BoardLandingTestimonials";
import { BoardLiveCountBarChart } from "@/components/marketing/board-landing/BoardLiveCountBarChart";
import { BoardPainIcons } from "@/components/marketing/board-landing/BoardPainIcons";
import { BoardPriceCompare } from "@/components/marketing/board-landing/BoardPriceCompare";
import { BoardStatStrip } from "@/components/marketing/board-landing/BoardStatStrip";
import { HubBoardDonutSection } from "@/components/marketing/board-landing/HubBoardDonutSection";
import { PracticeReviewPassFlow } from "@/components/marketing/board-landing/PracticeReviewPassFlow";
import { HomeSamplePlayer } from "@/components/marketing/elevation/HomeSamplePlayer";
import { hubLiveBarChartHeading } from "@/lib/marketing/board-landing/hub-live-bar-chart";
import type { HubBoardLandingRenderModel } from "@/lib/marketing/board-landing/render-payload";
import { BoardFreeQuizLazy } from "@/components/marketing/free-quiz/BoardFreeQuizLazy";
import type { FreeQuizBoardSlug } from "@/lib/marketing/free-quiz";
import { HERO_TRIAL_CTA_LABEL, heroTrialPriceLine } from "@/lib/marketing/home-cta";

export function HubBoardLanding({
  model,
  freeQuizBoard,
}: {
  model: HubBoardLandingRenderModel;
  freeQuizBoard: FreeQuizBoardSlug;
}) {
  const barHeadingId = `hub-bar-${model.layout.replace(/[^a-z0-9]/g, "-")}`;

  return (
    <div className={`board-landing board-landing--tesla board-landing--board-flow ${model.themeClass}`}>
      <BoardLandingHero
        headline={model.h1Lead}
        subline={model.heroWhyUs}
        testimonial={model.heroTestimonial}
        trialHref={model.trialHref}
        heroCtaName={model.heroCtaName}
        heroCtaLocation={model.heroCtaLocation}
      />

      <div className="bl-band bl-band--stats">
        <BoardStatStrip stats={model.stats} label={model.statsLabel} />
      </div>

      <div className="bl-band bl-band--alt">
        <BoardLandingTestimonials
          stories={model.stories}
          prominent
          heading={model.testimonialsHeading}
        />
      </div>

      <div className="bl-band bl-charts">
        <HubBoardDonutSection {...model.hubDonut} />
        <BoardLiveCountBarChart
          heading={hubLiveBarChartHeading(model.layout)}
          headingId={barHeadingId}
          rows={model.liveBarRows}
        />
        <PracticeReviewPassFlow />
      </div>

      <div className="bl-band bl-band--alt">
        <BoardPainIcons points={model.painPoints} />
      </div>

      <div className="bl-band">
        <BoardFreeQuizLazy board={freeQuizBoard} />
      </div>

      {model.features.length > 0 ? (
        <div className="bl-band">
          <BoardFeatureGrid cards={model.features} tight visual />
        </div>
      ) : null}

      {model.quickBite ? (
        <div className="bl-band bl-band--alt" id="quick-bites">
          <section className="bl-section bl-section--tight" aria-labelledby="quick-bites-heading">
            <h2 id="quick-bites-heading">Quick Bites</h2>
            <article className="bl-card bl-card--media">
              <h3 className="sr-only">{model.quickBite.title}</h3>
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
        </div>
      ) : null}

      <div className="bl-band">
        <BoardPriceCompare chart={model.priceChart} />
      </div>

      <section className="bl-final bl-band bl-band--final" aria-labelledby="final-heading">
        <h2 id="final-heading">{model.finalHeading}</h2>
        <LandingCta href={model.trialHref} ctaName={model.finalCtaName} location={model.finalCtaLocation}>
          {HERO_TRIAL_CTA_LABEL}
        </LandingCta>
        <p className="bl-hero-price bl-final__price">{heroTrialPriceLine()}</p>
      </section>

      <div className="bl-band bl-band--alt bl-band--faq">
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
      </div>
    </div>
  );
}
