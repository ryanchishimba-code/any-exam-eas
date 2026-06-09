"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LoginModalTrigger } from "@/components/auth/LoginModalTrigger";
import { ReturningQuickSignIn } from "@/components/auth/ReturningQuickSignIn";
import { DEFAULT_AUTH_CALLBACK } from "@/lib/client/auth-routes";
import {
  formatMonthlyPrice,
  formatTrialEntryPrice,
  formatTrialLabel,
} from "@/lib/site";

type LandingAuthCtaProps = {
  callbackUrl?: string;
  className?: string;
  compact?: boolean;
};

export function LandingAuthCta({
  callbackUrl = DEFAULT_AUTH_CALLBACK,
  className = "",
  compact = false,
}: LandingAuthCtaProps) {
  return (
    <div className={`flex flex-col items-stretch gap-4 ${className}`}>
      <div
        className={`flex flex-col gap-3 ${compact ? "" : "sm:flex-row sm:items-stretch"}`}
      >
        <Link
          href="/signup?plan=trial"
          className={`aee-btn-primary group flex flex-1 items-center justify-center gap-2 ${
            compact ? "px-6 py-3.5 text-[0.9375rem]" : "px-8 py-4 text-base"
          }`}
        >
          Start {formatTrialLabel()} — {formatTrialEntryPrice()}
          <ArrowRight
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
            aria-hidden
          />
        </Link>

        <LoginModalTrigger
          callbackUrl={callbackUrl}
          className={`aee-btn-login flex flex-1 items-center justify-center ${
            compact ? "px-6 py-3.5 text-[0.9375rem]" : "px-8 py-4 text-base"
          }`}
        >
          Log in
        </LoginModalTrigger>
      </div>

      {!compact && (
        <Link href="/signup?plan=subscribe" className="aee-btn-secondary text-center">
          Subscribe — {formatMonthlyPrice()}/mo
        </Link>
      )}

      <ReturningQuickSignIn callbackUrl={callbackUrl} className="pt-1" />
    </div>
  );
}
