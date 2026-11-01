"use client";

import { AppleSignInButton } from "@/components/auth/AppleSignInButton";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { LoginModalTrigger } from "@/components/auth/LoginModalTrigger";

import { DEFAULT_AUTH_CALLBACK } from "@/lib/client/auth-routes";

type HeroSocialAuthProps = {
  callbackUrl?: string;
  className?: string;
};

export function HeroSocialAuth({
  callbackUrl = DEFAULT_AUTH_CALLBACK,
  className = "",
}: HeroSocialAuthProps) {
  return (
    <div className={className}>
      <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-muted)] lg:text-left">
        Already a member?
      </p>
      <div className="space-y-2.5">
        <GoogleSignInButton callbackUrl={callbackUrl} className="aee-social-btn aee-social-google !justify-center" />
        <AppleSignInButton
          callbackUrl={callbackUrl}
          className="aee-social-btn aee-social-apple !justify-center !border-[#1d1d1f] !bg-[#1d1d1f] !text-white hover:!bg-[#333336]"
        />
        <LoginModalTrigger
          callbackUrl={callbackUrl}
          className="aee-btn-hero-secondary block w-full text-center !py-3 !text-sm"
        >
          Log in with email
        </LoginModalTrigger>
      </div>
    </div>
  );
}
