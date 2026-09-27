"use client";

import { usePathname } from "next/navigation";
import { LandingCta } from "@/components/landing/LandingCta";
import { LANDING_TRIAL_HREF } from "@/lib/landing/trial-href";
import { MARKETING_DARK_HERO_PATHS } from "@/lib/marketing/board-paths";
import { formatTrialCtaLabel } from "@/lib/site";

const HIDDEN_PREFIXES = [
  "/pricing",
  "/exam",
  "/practice",
  "/progress",
  "/admin",
  "/internal",
  "/onboarding",
  "/study",
  "/learn",
  "/register",
  "/forgot-password",
  "/reset-password",
];

/**
 * Trial CTA under the nav on public pages that do not already open with the
 * dark hero or the pricing fold. The offer sentence stays next to that page's
 * primary CTA (and in the footer), not in this banner.
 */
export function PublicFoldOffer() {
  const pathname = usePathname() || "/";
  const path = pathname.split("?")[0] || "/";
  if (
    MARKETING_DARK_HERO_PATHS.has(path) ||
    HIDDEN_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))
  ) {
    return null;
  }

  return (
    <div
      className="public-fold-offer border-b border-white/10 bg-[#071a2c] text-[#f5f5f7]"
      data-public-offer
      style={{ marginTop: "var(--nav-height)" }}
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-5 py-3 sm:flex-row sm:items-center sm:justify-end sm:px-6">
        <LandingCta
          href={LANDING_TRIAL_HREF}
          ctaName="public_fold_trial"
          location="public_fold"
          className="aee-flagship-cta--primary shrink-0 self-start sm:self-auto"
        >
          {formatTrialCtaLabel()}
        </LandingCta>
      </div>
    </div>
  );
}
