import Link from "next/link";
import { LandingCta } from "@/components/landing/LandingCta";
import { BoardFeatureGrid } from "@/components/marketing/board-landing/BoardFeatureGrid";
import { BoardLandingHero } from "@/components/marketing/board-landing/BoardLandingHero";
import { BoardLandingTestimonials } from "@/components/marketing/board-landing/BoardLandingTestimonials";
import { BoardLiveCountBarChart } from "@/components/marketing/board-landing/BoardLiveCountBarChart";
import { BoardPainIcons } from "@/components/marketing/board-landing/BoardPainIcons";
import { BoardStatStrip } from "@/components/marketing/board-landing/BoardStatStrip";
import { WhyAnyExamEasy } from "@/components/marketing/WhyAnyExamEasy";
import { HubBoardDonutSection } from "@/components/marketing/board-landing/HubBoardDonutSection";
import { PracticeReviewPassFlow } from "@/components/marketing/board-landing/PracticeReviewPassFlow";
import { HomeSamplePlayer } from "@/components/marketing/elevation/HomeSamplePlayer";
import { hubLiveBarChartHeading } from "@/lib/marketing/board-landing/hub-live-bar-chart";
import type { HubBoardLandingRenderModel } from "@/lib/marketing/board-landing/render-payload";
import { BoardCrosswordPromo } from "@/components/marketing/board-landing/BoardCrosswordPromo";
import { BoardPublicLinks } from "@/components/marketing/board-landing/BoardPublicLinks";
import type { PublicStudyGuideId } from "@/lib/study-guides/public-catalog";
import { FreePracticeLink } from "@/components/marketing/free-practice/FreePracticeLink";
import { BoardFreeQuizLazy } from "@/components/marketing/free-quiz/BoardFreeQuizLazy";
import type { FreeQuizBoardSlug } from "@/lib/marketing/free-quiz";
import { boardHeroProofFacts, storiesBelowHero } from "@/lib/marketing/board-landing/board-hero-marketing";
import { BOARD_PHOTO_HERO_TRIAL_LABEL, HERO_TRIAL_CTA_LABEL } from "@/lib/marketing/home-cta";
import { getCachedSession } from "@/lib/auth/session";
import { ROUTES } from "@/lib/routes";

export async function HubBoardLanding({
  model,
  freeQuizBoard,
}: {
  model: HubBoardLandingRenderModel;
  freeQuizBoard: FreeQuizBoardSlug;
}) {
  const session = await getCachedSession();
  const signedIn = Boolean(session?.user);
  const barHeadingId = `hub-bar-${model.layout.replace(/[^a-z0-9]/g, "-")}`;
  const stories = storiesBelowHero(model.stories, model.heroTestimonial?.quote);
  const crosswordAfterPricing = model.layout === "pance" || model.layout === "aanp-fnp";
  const heroTrialLabel = crosswordAfterPricing ? BOARD_PHOTO_HERO_TRIAL_LABEL : undefined;

  return (
    <div className={`board-landing board-landing--tesla board-landing--board-flow ${model.themeClass}`}>
      <BoardLandingHero
        photoHeroId={model.layout}
        headline={model.h1Lead}
        subline={model.heroWhyUs}
        trialHref={model.trialHref}
        heroCtaName={model.heroCtaName}
        heroCtaLocation={model.heroCtaLocation}
        testimonial={model.heroTestimonial}
        proofFacts={boardHeroProofFacts(model.heroOffer)}
        boardName={model.boardName}
        signedIn={signedIn}
        trialLabel={heroTrialLabel}
        trail={
          <>
      <BoardPublicLinks exam={model.layout as PublicStudyGuideId} />
      <div className="bl-band">
        <FreePracticeLink board={freeQuizBoard} prominent />
      </div>
      {crosswordAfterPricing ? null : (
        <div className="bl-band">
          <BoardCrosswordPromo board={freeQuizBoard} />
        </div>
      )}
      <div className="bl-band bl-band--stats">
        <BoardStatStrip stats={model.stats} label={model.statsLabel} />
      </div>
      {model.layout === "pance" ? (
        <section className="bl-band" aria-labelledby="pance-blueprint-heading">
          <h2 id="pance-blueprint-heading">PANCE blueprint for 2026</h2>
          <p>
            The NCCPA blueprint effective January 2025 is the outline this question bank follows in 2026.
            It has 300 questions in five blocks of 60. Cardiovascular disease is 11% and pulmonary disease
            is 9%. The score scale is 200 to 800, and the passing score is 350. This page is independent
            of NCCPA and does not predict a result.
          </p>
          <p className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <Link href="/pance-study-guide" className="font-semibold text-[#0f766e] underline-offset-2 hover:underline">
              Read the PANCE study guide
            </Link>
            <Link href="/daily/pance" className="font-semibold text-[#0f766e] underline-offset-2 hover:underline">
              PANCE question of the day
            </Link>
          </p>
        </section>
      ) : null}

      {stories.length > 0 ? (
        <div className="bl-band bl-band--alt">
          <BoardLandingTestimonials stories={stories} prominent heading={model.testimonialsHeading} />
        </div>
      ) : null}

      <div className="bl-band bl-charts">
        <HubBoardDonutSection {...model.hubDonut} />
        <BoardLiveCountBarChart
          heading={hubLiveBarChartHeading(model.layout)}
          headingId={barHeadingId}
          rows={model.liveBarRows}
        />
        <PracticeReviewPassFlow boardSlug={model.layout} />
      </div>

      <div className="bl-band bl-band--alt">
        <BoardPainIcons points={model.painPoints} />
      </div>

      <div className="bl-band">
        <BoardFreeQuizLazy board={freeQuizBoard} />
      </div>
          </>
        }
      />

      <WhyAnyExamEasy board={freeQuizBoard} trialHref={model.trialHref} signedIn={signedIn} />

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

      <section className="bl-final bl-band bl-band--final" aria-labelledby="final-heading">
        <h2 id="final-heading">{model.finalHeading}</h2>
        <LandingCta
          href={signedIn ? ROUTES.dashboard : model.trialHref}
          ctaName={signedIn ? "continue_studying" : model.finalCtaName}
          location={model.finalCtaLocation}
        >
          {signedIn ? "Continue studying" : HERO_TRIAL_CTA_LABEL}
        </LandingCta>
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
      {crosswordAfterPricing ? (
        <div className="bl-band">
          <BoardCrosswordPromo board={freeQuizBoard} />
        </div>
      ) : null}
    </div>
  );
}
