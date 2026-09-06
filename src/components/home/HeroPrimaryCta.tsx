"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MemberLoginLink } from "@/components/auth/MemberLoginLink";
import { HeroSocialAuth } from "@/components/home/HeroSocialAuth";
import { DEFAULT_AUTH_CALLBACK } from "@/lib/client/auth-routes";
import { LANDING_TRIAL_HREF } from "@/lib/landing/content";
import {
  formatMonthlyPrice,
  formatTrialEntryPrice,
  formatTrialLabel,
} from "@/lib/site";

type HeroPrimaryCtaProps = {
  callbackUrl?: string;
  className?: string;
};

export function HeroPrimaryCta({
  callbackUrl = DEFAULT_AUTH_CALLBACK,
  className = "",
}: HeroPrimaryCtaProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      <Link
        href={LANDING_TRIAL_HREF}
        className="aee-btn-hero group flex w-full items-center justify-center gap-2.5"
      >
        Start {formatTrialLabel()} — {formatTrialEntryPrice()}
        <ArrowRight
          className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
          aria-hidden
        />
      </Link>

      <Link href="/signup?plan=subscribe&interval=monthly&tier=pro" className="aee-btn-hero-secondary block w-full text-center">
        Subscribe — {formatMonthlyPrice()}/mo · full access
      </Link>

      <div className="relative py-1">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[var(--color-border)]" />
        </div>
      </div>

      <HeroSocialAuth callbackUrl={callbackUrl} />

      <MemberLoginLink
        callbackUrl={callbackUrl}
        showEmailHint
        className="!text-center lg:!text-left"
      />
    </div>
  );
}
