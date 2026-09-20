"use client";

import { useSession } from "next-auth/react";
import { useCampaignAwareHref } from "@/lib/client/use-campaign-href";
import { ROUTES } from "@/lib/routes";
import { formatTrialCtaLabel } from "@/lib/site";

/** Destination for marketing “Try for free” when the visitor may already be signed in. */
export function useTrialCtaTarget(guestHref: string): {
  href: string;
  label: string;
  /** True when we send members to the app instead of signup. */
  isMemberContinue: boolean;
} {
  const { status } = useSession();
  const campaignHref = useCampaignAwareHref(guestHref);
  if (status === "authenticated") {
    return {
      href: ROUTES.dashboard,
      label: "Open Study Hub",
      isMemberContinue: true,
    };
  }
  return {
    href: campaignHref,
    label: formatTrialCtaLabel(),
    isMemberContinue: false,
  };
}
