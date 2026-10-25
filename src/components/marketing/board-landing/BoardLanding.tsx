import Link from "next/link";
import { LandingCta } from "@/components/landing/LandingCta";
import { BoardFeatureGrid } from "@/components/marketing/board-landing/BoardFeatureGrid";
import { BoardPainIcons } from "@/components/marketing/board-landing/BoardPainIcons";
import { BoardPriceCompare } from "@/components/marketing/board-landing/BoardPriceCompare";
import { NclexLandingCompareChart } from "@/components/marketing/board-landing/NclexLandingCompareChart";
import { NclexStudentTrustBadge } from "@/components/marketing/board-landing/NclexStudentTrustBadge";
import { BoardLandingTestimonials } from "@/components/marketing/board-landing/BoardLandingTestimonials";
import { PracticeReviewPassFlow } from "@/components/marketing/board-landing/PracticeReviewPassFlow";
import { NaplexAceDonutSection } from "@/components/marketing/board-landing/NaplexAceDonutSection";
import { BoardStatStrip } from "@/components/marketing/board-landing/BoardStatStrip";
import { HeroScene } from "@/components/marketing/board-landing/HeroScene";
import { PharmacyHero } from "@/components/marketing/board-landing/PharmacyHero";
import { HomeSamplePlayer } from "@/components/marketing/elevation/HomeSamplePlayer";
import { SamplePractice } from "@/components/marketing/board-landing/SamplePractice";
import { MarketingHeroActions } from "@/components/marketing/MarketingHeroActions";
import type { HeroCaseScene } from "@/lib/marketing/board-landing/hero-case";
import type { PharmacyHeroScene } from "@/lib/marketing/board-landing/pharmacy-case";
import type { LandingQuestion } from "@/lib/marketing/board-landing/model";
import type { BoardLandingRenderModel } from "@/lib/marketing/board-landing/render-payload";
import { BoardFreeQuizLazy } from "@/components/marketing/free-quiz/BoardFreeQuizLazy";
import { FinishLineBoardFaqItem } from "@/components/marketing/finish-line/FinishLineBoardFaqItem";
import type { FreeQuizBoardSlug } from "@/lib/marketing/free-quiz";
import {
  HERO_TRIAL_CTA_LABEL,
  boardSeeQuestionsHref,
  heroTrialPriceLine,
} from "@/lib/marketing/home-cta";

function SampleQuestion({
  question,
  headingId,
  anchorId,
  title,
}: {
  question: LandingQuestion;
  headingId: string;
  anchorId: string;
  title: string;
}) {
  return (
    <article className="bl-card" id={anchorId} aria-labelledby={headingId}>
      <h2 className="bl-card-title" id={headingId}>{title}</h2>
      <p className="bl-stem">{question.stem}</p>
      <SamplePractice sample={question} />
    </article>
  );
}

export function BoardLanding({
  model,
  scene = null,
  pharmacy = null,
  freeQuizBoard,
}: {
  model: BoardLandingRenderModel;
  scene?: HeroCaseScene | null;
  pharmacy?: PharmacyHeroScene | null;
  freeQuizBoard: FreeQuizBoardSlug;
}) {
  const nclexConversion = Boolean(model.nclexCompare && model.studentTrustBadge);
  const seeQuestionsHref = boardSeeQuestionsHref(Boolean(model.sample));
  const showHeroActions = !scene && !pharmacy;

  return (
    <div className={`board-landing board-landing--tesla ${model.themeClass}`}>
      <section className="bl-hero" aria-labelledby="board-hero-heading">
        <div className="bl-hero-copy">
          <p className="bl-kicker">
            <Link href="/">Home</Link>
            <span aria-hidden> / </span>
            <span>{model.boardName}</span>
            <span className="bl-updated"> · Updated {model.contentYear}</span>
          </p>
          <h1 id="board-hero-heading">{model.h1Lead}</h1>
          <p className="bl-hero-factual">{model.h1Accent}</p>
          {showHeroActions ? <p className="bl-hero-lede">{model.heroWhyUs}</p> : null}
          {showHeroActions ? (
            <MarketingHeroActions
              trialHref={model.trialHref}
              ctaName={model.heroCtaName}
              ctaLocation={model.heroCtaLocation}
              seeQuestionsHref={seeQuestionsHref}
              showSeeQuestions={Boolean(model.sample)}
              trialMicrocopy={model.ctaMicrocopy}
              showFinishLineOffer
            />
          ) : null}
        </div>
        {pharmacy ? (
          <PharmacyHero
            hero={pharmacy}
            trialHref={model.trialHref}
            ctaName={model.heroCtaName}
            ctaLocation={model.heroCtaLocation}
            seeQuestionsHref={seeQuestionsHref}
          />
        ) : scene ? (
          <HeroScene
            scene={scene}
            trialHref={model.trialHref}
            questionCount={model.stats.find((stat) => stat.label === "Questions")?.value ?? null}
            reviewers={model.reviewers ?? []}
            kicker={model.sceneKicker}
            idPrefix={model.sceneIdPrefix}
            ctaName={model.heroCtaName}
            ctaLocation={model.heroCtaLocation}
            seeQuestionsHref={seeQuestionsHref}
          />
        ) : model.sample ? (
          <SampleQuestion
            question={model.sample}
            anchorId="sample-question"
            headingId="sample-heading"
            title="Free sample practice question"
          />
        ) : null}
      </section>

      <BoardStatStrip stats={model.stats} label={model.statsLabel} />

      <BoardPainIcons points={model.painPoints} />

      {nclexConversion ? (
        <>
          <BoardLandingTestimonials stories={model.stories} prominent />
          <NclexStudentTrustBadge badge={model.studentTrustBadge!} />
          <NclexLandingCompareChart data={model.nclexCompare!} />
        </>
      ) : null}

      {model.naplexDonut ? <NaplexAceDonutSection {...model.naplexDonut} /> : null}

      {scene && model.sampleSecondary ? (
        <div className="bl-sample-wrap">
          <SampleQuestion
            question={model.sampleSecondary}
            anchorId="sample-question-ngn"
            headingId="sample-heading-ngn"
            title="Next Gen sample question"
          />
        </div>
      ) : null}

      {!scene && !pharmacy && model.sampleSecondary ? (
        <div className="bl-sample-wrap">
          <SampleQuestion
            question={model.sampleSecondary}
            anchorId="sample-question-ngn"
            headingId="sample-heading-ngn"
            title="Next Gen sample question"
          />
        </div>
      ) : null}

      {model.features.length > 0 ? <BoardFeatureGrid cards={model.features} tight visual /> : null}

      <PracticeReviewPassFlow />

      <div className="bl-band">
        <BoardFreeQuizLazy board={freeQuizBoard} />
      </div>

      {nclexConversion ? null : <BoardLandingTestimonials stories={model.stories} minimal />}

      {model.quickBite ? (
        <section className="bl-section bl-section--tight" id="quick-bites" aria-labelledby="quick-bites-heading">
          <h2 id="quick-bites-heading">Quick Bites</h2>
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

      <BoardPriceCompare chart={model.priceChart} />

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
          <FinishLineBoardFaqItem />
        </div>
      </section>

      <section className="bl-final" aria-labelledby="final-heading">
        <h2 id="final-heading">{model.finalHeading}</h2>
        <LandingCta href={model.trialHref} ctaName={model.finalCtaName} location={model.finalCtaLocation}>
          {HERO_TRIAL_CTA_LABEL}
        </LandingCta>
        <p className="bl-hero-price bl-final__price">{heroTrialPriceLine()}</p>
      </section>
    </div>
  );
}
