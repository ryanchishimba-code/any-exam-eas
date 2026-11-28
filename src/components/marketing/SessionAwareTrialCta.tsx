"use client";

import { useSession } from "next-auth/react";
import { LandingCta } from "@/components/landing/LandingCta";
import { HERO_TRIAL_CTA_LABEL } from "@/lib/marketing/home-cta";

/**
 * Logged-out HTML stays the trial button so the page can be cached.
 * After the client session resolves, a signed-in visitor gets the dashboard link.
 */
export function SessionAwareTrialCta({
  trialHref,
  trialLabel = HERO_TRIAL_CTA_LABEL,
  signedOutCtaName,
  location,
  className,
}: {
  trialHref: string;
  trialLabel?: string;
  signedOutCtaName: string;
  location?: string;
  className?: string;
}) {
  const { data, status } = useSession();
  const signedIn = status === "authenticated" && Boolean(data?.user);
  return (
    <LandingCta
      href={signedIn ? "/dashboard" : trialHref}
      ctaName={signedIn ? "continue_studying" : signedOutCtaName}
      location={location}
      className={className}
    >
      {signedIn ? "Continue studying" : trialLabel}
    </LandingCta>
  );
}
