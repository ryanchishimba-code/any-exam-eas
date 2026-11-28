import { LandingCta } from "@/components/landing/LandingCta";
import { HERO_TRIAL_CTA_LABEL, SEE_QUESTIONS_CTA_LABEL } from "@/lib/marketing/home-cta";

type MarketingHeroActionsProps = {
  trialHref: string;
  ctaName: string;
  ctaLocation: string;
  seeQuestionsHref: string;
  showSeeQuestions?: boolean;
  /** Trial line under the primary CTA (e.g. live count + no card). */
  trialMicrocopy?: string;
  className?: string;
  /**
   * Server-rendered only. The client session must not rewrite this link:
   * a signed-in header still keeps the public trial hero.
   */
  signedIn?: boolean;
  /** Overrides the signed-out label. An explicit signed-in render still says “Continue studying”. */
  trialLabel?: string;
};

export function MarketingHeroActions({
  trialHref,
  ctaName,
  ctaLocation,
  seeQuestionsHref,
  showSeeQuestions = true,
  trialMicrocopy,
  className = "bl-actions",
  signedIn = false,
  trialLabel = HERO_TRIAL_CTA_LABEL,
}: MarketingHeroActionsProps) {
  return (
    <div className={className}>
      <div className="bl-actions__primary">
        <LandingCta
          href={signedIn ? "/dashboard" : trialHref}
          ctaName={signedIn ? "continue_studying" : ctaName}
          location={ctaLocation}
        >
          {signedIn ? "Continue studying" : trialLabel}
        </LandingCta>
        {!signedIn && trialMicrocopy ? <p className="bl-hero-micro">{trialMicrocopy}</p> : null}
      </div>
      {showSeeQuestions ? (
        <a className="bl-button bl-button-secondary" href={seeQuestionsHref}>
          {SEE_QUESTIONS_CTA_LABEL}
        </a>
      ) : null}
    </div>
  );
}
