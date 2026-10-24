import { LandingCta } from "@/components/landing/LandingCta";
import {
  HERO_TRIAL_CTA_LABEL,
  SEE_QUESTIONS_CTA_LABEL,
  heroTrialPriceLine,
} from "@/lib/marketing/home-cta";

type MarketingHeroActionsProps = {
  trialHref: string;
  ctaName: string;
  ctaLocation: string;
  seeQuestionsHref: string;
  showSeeQuestions?: boolean;
  /** Trial line under the primary CTA (e.g. live count + no card). */
  trialMicrocopy?: string;
  className?: string;
};

export function MarketingHeroActions({
  trialHref,
  ctaName,
  ctaLocation,
  seeQuestionsHref,
  showSeeQuestions = true,
  trialMicrocopy,
  className = "bl-actions",
}: MarketingHeroActionsProps) {
  return (
    <div className={className}>
      <div className="bl-actions__primary">
        <LandingCta href={trialHref} ctaName={ctaName} location={ctaLocation}>
          {HERO_TRIAL_CTA_LABEL}
        </LandingCta>
        <p className="bl-hero-price">{heroTrialPriceLine()}</p>
        {trialMicrocopy ? <p className="bl-hero-micro">{trialMicrocopy}</p> : null}
      </div>
      {showSeeQuestions ? (
        <a className="bl-button bl-button-secondary" href={seeQuestionsHref}>
          {SEE_QUESTIONS_CTA_LABEL}
        </a>
      ) : null}
    </div>
  );
}
