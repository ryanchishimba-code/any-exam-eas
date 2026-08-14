"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { analytics } from "@/lib/analytics";
import { LANDING_TRIAL_HREF } from "@/lib/landing/content";
import { useTrialCtaTarget } from "@/lib/client/use-trial-cta-target";
import { cn } from "@/lib/utils";

type TrialCtaLinkProps = {
  href?: string;
  className?: string;
  children?: ReactNode;
  icon?: ReactNode;
  ctaName?: string;
  location?: string;
  onClick?: () => void;
};

/**
 * Always-clickable Try for free link. Guests → signup; members → Study Hub.
 * Label stays “Try for free” so the control never looks broken or swapped.
 */
export function TrialCtaLink({
  href = LANDING_TRIAL_HREF,
  className,
  children,
  icon,
  ctaName = "try_for_free",
  location = "landing",
  onClick,
}: TrialCtaLinkProps) {
  const trialCta = useTrialCtaTarget(href);

  return (
    <Link
      href={trialCta.href}
      className={cn(className)}
      onClick={() => {
        onClick?.();
        analytics.ctaClicked(
          trialCta.isMemberContinue ? `${ctaName}_member` : ctaName,
          location
        );
      }}
    >
      {children ?? trialCta.label}
      {icon}
    </Link>
  );
}
