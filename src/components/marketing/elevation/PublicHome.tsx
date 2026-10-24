import Link from "next/link";
import type { ReactNode } from "react";
import { LandingCta } from "@/components/landing/LandingCta";
import { BoardFeatureGrid } from "@/components/marketing/board-landing/BoardFeatureGrid";
import { BoardLandingTestimonials } from "@/components/marketing/board-landing/BoardLandingTestimonials";
import type { BoardFeatureCard } from "@/lib/marketing/board-landing/board-features";
import type { LandingTestimonialCard } from "@/lib/testimonials/landing-stories";
import {
  buildHomeHeroBenefitLine,
  buildHomeHeroChips,
  type HomeHeroBand,
} from "@/lib/marketing/board-landing/home-hero";
import { HomeCompare } from "@/components/marketing/elevation/HomeCompare";
import { HomeQuickBites } from "@/components/marketing/elevation/HomeQuickBites";
import { HomeRepeatTrialCta } from "@/components/marketing/elevation/HomeRepeatTrialCta";
import { HomeStickyCta } from "@/components/marketing/elevation/HomeStickyCta";
import { IconCheck, IconReviewers } from "@/components/marketing/elevation/home-icons";
import "@/styles/home-visual.css";
import { LANDING_HERO_EXAMS, LANDING_TRIAL_HREF } from "@/lib/landing/content";
import { HOME_FAQ } from "@/lib/marketing/home-faq";
import {
  HOME_NO_CARD_LINE,
  HOME_NO_PAYMENT_LINE,
  homeStickyCtaLabel,
  homeTrialCloseHeading,
  homeTrialCtaLabel,
} from "@/lib/marketing/home-cta";
import { HOME_PRACTICE_HEADLINE } from "@/lib/marketing/legal-copy";
import { examMarketingPath, type ExamSeoKey } from "@/lib/seo/exam-config";
import { ROUTES } from "@/lib/routes";
import { formatMonthlyPrice } from "@/lib/site";

const TRUST = [
  { icon: IconCheck, label: "Detailed rationales on scored items" },
  { icon: IconReviewers, label: "Named clinical reviewers" },
] as const;

/** First-screen board tiles. Labels match the hero; hrefs are the public board pages. */
const HERO_BOARD_TILES: { slug: ExamSeoKey; label: string }[] = [
  { slug: "nclex", label: "NCLEX" },
  { slug: "naplex", label: "NAPLEX" },
  { slug: "usmle", label: "USMLE" },
  { slug: "aanp-fnp", label: "FNP" },
  { slug: "pance", label: "PANCE" },
  { slug: "npte-pt", label: "NPTE-PT" },
];

function heroProofStory(stories: LandingTestimonialCard[]): LandingTestimonialCard | null {
  const nathan = stories.find((story) => story.name === "Nathan C.");
  return nathan ?? stories[0] ?? null;
}

export function PublicHome({
  proof,
  ngnCaseStudies = false,
  heroBand,
  featureCards = [],
  testimonialStories = [],
}: {
  proof?: ReactNode;
  /** Set when the same snapshot has published NCLEX case studies. */
  ngnCaseStudies?: boolean;
  heroBand?: HomeHeroBand;
  featureCards?: BoardFeatureCard[];
  testimonialStories?: LandingTestimonialCard[];
}) {
  const cta = homeTrialCtaLabel();
  const stickyLabel = homeStickyCtaLabel();
  const headlineBreak = HOME_PRACTICE_HEADLINE.lastIndexOf(". ");
  const headlineLead =
    headlineBreak === -1 ? HOME_PRACTICE_HEADLINE : HOME_PRACTICE_HEADLINE.slice(0, headlineBreak + 1);
  const headlineAccent =
    headlineBreak === -1 ? "" : HOME_PRACTICE_HEADLINE.slice(headlineBreak + 2);
  const band = heroBand ?? null;
  const heroChips = band ? buildHomeHeroChips(band) : [];
  const benefitLine = band ? buildHomeHeroBenefitLine(band.liveTotal) : null;
  const proofStory = heroProofStory(testimonialStories);

  return (
    <div className="home-visual home-has-sticky">
      <section className="home-hero" aria-labelledby="hero-heading">
        <div className="home-laptop">
          <div className="home-laptop__lid">
            <div className="home-laptop__bezel">
              <span className="home-laptop__camera" aria-hidden="true" />
              <div className="home-laptop__screen">
                <div className="home-hero__panel">
                  <h1 id="hero-heading">
                    <span className="home-hero__line">{headlineLead}</span>{" "}
                    <span className="home-hero__accent">{headlineAccent}</span>
                  </h1>
                  {benefitLine ? <p className="home-hero__benefit">{benefitLine}</p> : null}
                  {heroChips.length > 0 ? (
                    <ul className="bl-hero-chips home-hero__chips" aria-label="Why students choose AnyExamEasy">
                      {heroChips.map((chip) => (
                        <li key={chip.id}>{chip.text}</li>
                      ))}
                    </ul>
                  ) : null}
                  {band ? (
                    <div
                      className="bl-hero-band bl-hero-band--count-only home-hero__band"
                      aria-label="Live bank size and pricing"
                    >
                      <p className="bl-hero-band__prices">
                        <span className="bl-hero-band__ours">{band.proPrice}</span>
                        <span className="bl-hero-band__vs" aria-hidden> · </span>
                        <span className="bl-hero-band__typical">
                          vs {band.typicalPrice} typical {band.typicalPeriod}
                        </span>
                      </p>
                      <p className="bl-hero-band__trial">{band.trialLine}</p>
                    </div>
                  ) : null}
                  <nav className="home-hero__boards" aria-label="Board exams">
                    <ul>
                      {HERO_BOARD_TILES.map((board) => (
                        <li key={board.slug}>
                          <Link href={examMarketingPath(board.slug)}>{board.label}</Link>
                        </li>
                      ))}
                    </ul>
                  </nav>
                  <p className="home-hero__sub">Every exam, every rationale, one plan.</p>
                  <div className="home-hero__actions">
                    <LandingCta href={LANDING_TRIAL_HREF} ctaName="hero_trial" location="hero">
                      {cta}
                    </LandingCta>
                  </div>
                  <p className="home-hero__note">{HOME_NO_CARD_LINE}</p>
                  <ul className="home-trust" aria-label="What is included">
                    {TRUST.map((item) => (
                      <li key={item.label}>
                        <item.icon />
                        <span>{item.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="home-laptop__hinge" aria-hidden="true" />
          </div>
          <div className="home-laptop__base" aria-hidden="true" />
        </div>
        {proofStory ? (
          <p className="home-hero__proof">
            <span className="home-hero__proof-quote">&ldquo;{proofStory.quote}&rdquo;</span>
            <span className="home-hero__proof-by">— {proofStory.name}</span>
          </p>
        ) : null}
      </section>

      {proof}

      {featureCards.length > 0 ? (
        <div className="home-features board-landing">
          <BoardFeatureGrid cards={featureCards} tight />
        </div>
      ) : null}

      {testimonialStories.length > 0 ? (
        <div className="board-landing">
          <BoardLandingTestimonials stories={testimonialStories} />
          <HomeRepeatTrialCta label={cta} ctaName="home_testimonials_trial" location="home_testimonials" />
        </div>
      ) : null}

      <HomeQuickBites />
      <HomeCompare ngnCaseStudies={ngnCaseStudies} />
      <HomeRepeatTrialCta label={cta} ctaName="home_compare_trial" location="home_compare" />

      <section className="home-section home-section--mist home-rise" aria-labelledby="price-heading">
        <h2 id="price-heading">Six boards. One price.</h2>
        <article className="home-price">
          <p className="home-price__plan">Pro</p>
          <p className="home-price__amount">{formatMonthlyPrice("pro")}</p>
          <p className="home-price__period">a month</p>
          <p className="home-price__trial">{HOME_NO_PAYMENT_LINE}</p>
          <ul className="home-boards">
            {LANDING_HERO_EXAMS.map((exam) => (
              <li key={exam.slug}>
                <Link href={examMarketingPath(exam.slug)}>{exam.label}</Link>
              </li>
            ))}
          </ul>
          <LandingCta href={LANDING_TRIAL_HREF} ctaName="home_price_trial" location="home_price">
            {cta}
          </LandingCta>
        </article>
      </section>

      <section
        id="faq"
        className="home-section home-section--mist home-faq home-rise"
        aria-labelledby="faq-heading"
      >
        <h2 id="faq-heading">Questions.</h2>
        <div className="home-faq__list">
          {HOME_FAQ.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
        <p className="home-faq__more-wrap">
          <Link className="home-faq__more" href={ROUTES.faq}>
            All questions
          </Link>
        </p>
      </section>

      <section className="home-close" aria-labelledby="close-heading">
        <h2 id="close-heading">{homeTrialCloseHeading()}</h2>
        <p>{HOME_NO_PAYMENT_LINE}</p>
        <LandingCta href={LANDING_TRIAL_HREF} ctaName="home_close_trial" location="home_close">
          {cta}
        </LandingCta>
      </section>

      <HomeStickyCta label={stickyLabel} />
    </div>
  );
}
