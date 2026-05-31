"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LoginModalTrigger } from "@/components/auth/LoginModalTrigger";
import { ReturningQuickSignIn } from "@/components/auth/ReturningQuickSignIn";
import {
  formatMonthlyPrice,
  formatTrialIntroPrice,
  formatTrialLabel,
} from "@/lib/site";

type LandingAuthCtaProps = {
  variant?: "light" | "dark";
  callbackUrl?: string;
  className?: string;
  compact?: boolean;
};

export function LandingAuthCta({
  variant = "light",
  callbackUrl = "/dashboard",
  className = "",
  compact = false,
}: LandingAuthCtaProps) {
  const isDark = variant === "dark";

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
          Start {formatTrialLabel()} — {formatTrialIntroPrice()}
          <ArrowRight
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
            aria-hidden
          />
        </Link>

        <LoginModalTrigger
          callbackUrl={callbackUrl}
          className={`aee-btn-login flex flex-1 items-center justify-center ${
            compact ? "px-6 py-3.5 text-[0.9375rem]" : "px-8 py-4 text-base"
          } ${isDark ? "aee-btn-login-dark" : ""}`}
        >
          Log in
        </LoginModalTrigger>
      </div>

      {!compact && (
        <Link
          href="/signup?plan=subscribe"
          className={`aee-btn-secondary text-center ${
            isDark ? "aee-btn-secondary-dark" : ""
          }`}
        >
          Subscribe — {formatMonthlyPrice()}/mo
        </Link>
      )}

      <ReturningQuickSignIn
        callbackUrl={callbackUrl}
        variant={isDark ? "dark" : "default"}
        className="pt-1"
      />
    </div>
  );
}
