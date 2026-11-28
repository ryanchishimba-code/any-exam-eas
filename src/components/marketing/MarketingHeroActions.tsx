"use client";

import { useSession } from "next-auth/react";
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
  /** Signed-in visitors should not see the logged-out trial button. */
  signedIn?: boolean;
  /** Overrides the signed-out label. Signed-in visitors still see “Continue studying”. */
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
  const { data, status } = useSession();
  const authed = status === "loading" ? signedIn : status === "authenticated" && Boolean(data?.user);
  return (
    <div className={className}>
      <div className="bl-actions__primary">
        <LandingCta
          href={authed ? "/dashboard" : trialHref}
          ctaName={authed ? "continue_studying" : ctaName}
          location={ctaLocation}
        >
          {authed ? "Continue studying" : trialLabel}
        </LandingCta>
        {!authed && trialMicrocopy ? <p className="bl-hero-micro">{trialMicrocopy}</p> : null}
      </div>
      {showSeeQuestions ? (
        <a className="bl-button bl-button-secondary" href={seeQuestionsHref}>
          {SEE_QUESTIONS_CTA_LABEL}
        </a>
      ) : null}
    </div>
  );
}
