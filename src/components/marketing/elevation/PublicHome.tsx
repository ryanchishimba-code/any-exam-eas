import Link from "next/link";
import type { ReactNode } from "react";
import { BoardFeatureGrid } from "@/components/marketing/board-landing/BoardFeatureGrid";
import { BoardLandingTestimonials } from "@/components/marketing/board-landing/BoardLandingTestimonials";
import { MarketingHeroActions } from "@/components/marketing/MarketingHeroActions";
import type { BoardFeatureCard } from "@/lib/marketing/board-landing/board-features";
import type { LandingTestimonialCard } from "@/lib/testimonials/landing-stories";
import { HomeQuickBites } from "@/components/marketing/elevation/HomeQuickBites";
import { HomeStickyCta } from "@/components/marketing/elevation/HomeStickyCta";
import "@/styles/home-visual.css";
import { LANDING_TRIAL_HREF } from "@/lib/landing/content";
import { HOME_FAQ } from "@/lib/marketing/home-faq";
import {
  HERO_TRIAL_CTA_LABEL,
  HOME_SEE_QUESTIONS_HREF,
  homeStickyCtaLabel,
  homeTrialCloseHeading,
} from "@/lib/marketing/home-cta";
import { HOME_PRACTICE_HEADLINE } from "@/lib/marketing/legal-copy";
import { boardAccentPillClass } from "@/lib/marketing/board-accent";
import { HOME_OWNER_VALUE_LINE } from "@/lib/marketing/owner-value-line";
import { examMarketingPath, type ExamSeoKey } from "@/lib/seo/exam-config";
import { ROUTES } from "@/lib/routes";
import { LandingCta } from "@/components/landing/LandingCta";

/** First-screen board tiles. Labels match the hero; hrefs are the public board pages. */
const HERO_BOARD_TILES: { slug: ExamSeoKey; label: string }[] = [
  { slug: "nclex", label: "NCLEX" },
  { slug: "naplex", label: "NAPLEX" },
  { slug: "usmle", label: "USMLE" },
  { slug: "aanp-fnp", label: "FNP" },
  { slug: "pance", label: "PANCE" },
  { slug: "npte-pt", label: "NPTE-PT" },
];

export function PublicHome({
  proof,
  featureCards = [],
  testimonialStories = [],
}: {
  proof?: ReactNode;
  ngnCaseStudies?: boolean;
  heroBand?: unknown;
  featureCards?: BoardFeatureCard[];
  testimonialStories?: LandingTestimonialCard[];
}) {
  const stickyLabel = homeStickyCtaLabel();
  const headlineBreak = HOME_PRACTICE_HEADLINE.lastIndexOf(". ");
  const headlineLead =
    headlineBreak === -1 ? HOME_PRACTICE_HEADLINE : HOME_PRACTICE_HEADLINE.slice(0, headlineBreak + 1);
  const headlineAccent =
    headlineBreak === -1 ? "" : HOME_PRACTICE_HEADLINE.slice(headlineBreak + 2);

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
                  <p className="home-hero__value">{HOME_OWNER_VALUE_LINE}</p>
                  <nav className="home-hero__boards" aria-label="Board exams">
                    <ul>
                      {HERO_BOARD_TILES.map((board) => (
                        <li key={board.slug}>
                          <Link
                            href={examMarketingPath(board.slug)}
                            className={boardAccentPillClass(board.slug)}
                          >
                            {board.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </nav>
                  <MarketingHeroActions
                    trialHref={LANDING_TRIAL_HREF}
                    ctaName="hero_trial"
                    ctaLocation="hero"
                    seeQuestionsHref={HOME_SEE_QUESTIONS_HREF}
                    className="home-hero__actions bl-actions"
                  />
                </div>
              </div>
            </div>
            <div className="home-laptop__hinge" aria-hidden="true" />
          </div>
          <div className="home-laptop__base" aria-hidden="true" />
        </div>
      </section>

      {proof}

      {featureCards.length > 0 ? (
        <div className="home-features board-landing">
          <BoardFeatureGrid cards={featureCards} tight />
        </div>
      ) : null}

      {testimonialStories.length > 0 ? (
        <div className="board-landing">
          <BoardLandingTestimonials stories={testimonialStories} minimal />
        </div>
      ) : null}

      <HomeQuickBites />

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
        <LandingCta href={LANDING_TRIAL_HREF} ctaName="home_close_trial" location="home_close">
          {HERO_TRIAL_CTA_LABEL}
        </LandingCta>
      </section>

      <HomeStickyCta label={stickyLabel} />
    </div>
  );
}
