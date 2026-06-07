"use client";

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
      <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-400 lg:text-left">
        Already a member?
      </p>
      <div className="space-y-2.5">
        <GoogleSignInButton callbackUrl={callbackUrl} className="aee-social-btn aee-social-google !justify-center" />
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
