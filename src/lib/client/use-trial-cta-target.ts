"use client";

import { useSession } from "next-auth/react";
import { ROUTES } from "@/lib/routes";
import { formatTrialCtaLabel } from "@/lib/site";

/**
 * Marketing “Try for free” must always navigate somewhere useful and keep the
 * same label — never a dead click, even for signed-in members.
 */
export function useTrialCtaTarget(guestHref: string): {
  href: string;
  label: string;
  /** True when we send members into the app instead of signup. */
  isMemberContinue: boolean;
} {
  const { status } = useSession();
  const label = formatTrialCtaLabel();

  if (status === "authenticated") {
    return {
      href: `${ROUTES.dashboard}?from=try-for-free`,
      label,
      isMemberContinue: true,
    };
  }

  return {
    href: guestHref,
    label,
    isMemberContinue: false,
  };
}
