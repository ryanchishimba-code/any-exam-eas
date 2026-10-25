import { LandingCta } from "@/components/landing/LandingCta";
import { FinishLineBadge } from "@/components/marketing/FinishLineBadge";
import {
  BOARD_LANDING_HERO_QUIZ_HREF,
  BOARD_LANDING_HERO_QUIZ_LABEL,
  BOARD_LANDING_HERO_TRIAL_LABEL,
} from "@/lib/marketing/board-landing/board-hero-marketing";
import { HOME_NO_CARD_LINE } from "@/lib/marketing/home-cta";
import { formatMonthlyPrice } from "@/lib/site";

type BoardHubHeroActionsProps = {
  trialHref: string;
  ctaName: string;
  ctaLocation: string;
};

export function BoardHubHeroActions({ trialHref, ctaName, ctaLocation }: BoardHubHeroActionsProps) {
  const price = `${formatMonthlyPrice("pro")}/mo`;

  return (
    <div className="bl-actions bl-actions--board-hub">
      <div className="bl-actions__trial-row">
        <LandingCta href={trialHref} ctaName={ctaName} location={ctaLocation}>
          {BOARD_LANDING_HERO_TRIAL_LABEL}
        </LandingCta>
        <span className="bl-hero-no-card">{HOME_NO_CARD_LINE}</span>
      </div>
      <p className="bl-hero-price">{price}</p>
      <FinishLineBadge variant="hero" className="bl-hero-finish-line" />
      <a className="bl-hero-text-link" href={BOARD_LANDING_HERO_QUIZ_HREF}>
        {BOARD_LANDING_HERO_QUIZ_LABEL}
      </a>
    </div>
  );
}
