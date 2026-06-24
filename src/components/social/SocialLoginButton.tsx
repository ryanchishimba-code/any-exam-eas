"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { DEFAULT_AUTH_CALLBACK, loginCompleteUrl, sanitizeCallbackUrl } from "@/lib/client/auth-routes";

/**
 * Reusable OAuth sign-in button. Currently wired for LinkedIn; Google keeps its
 * own dedicated component (GoogleSignInButton) for brand-exact styling.
 *
 * Renders nothing unless the provider is enabled via its NEXT_PUBLIC_*_AUTH_ENABLED
 * flag, mirroring GoogleSignInButton so disabled providers never show a dead button.
 */
type Provider = "linkedin";

const PROVIDER_ENABLED: Record<Provider, () => boolean> = {
  linkedin: () => process.env.NEXT_PUBLIC_LINKEDIN_AUTH_ENABLED === "true",
};

const PROVIDER_LABEL: Record<Provider, string> = {
  linkedin: "Continue with LinkedIn",
};

type SocialLoginButtonProps = {
  provider?: Provider;
  callbackUrl?: string;
  large?: boolean;
  onClick?: () => void;
  className?: string;
};

export function SocialLoginButton({
  provider = "linkedin",
  callbackUrl = DEFAULT_AUTH_CALLBACK,
  large,
  onClick,
  className = "",
}: SocialLoginButtonProps) {
  const [loading, setLoading] = useState(false);

  if (!PROVIDER_ENABLED[provider]()) return null;

  const oauthCallback = loginCompleteUrl(sanitizeCallbackUrl(callbackUrl));

  return (
    <Button
      type="button"
      variant="secondary"
      disabled={loading}
      className={`w-full gap-2.5 ${large ? "!py-3.5 !text-base" : ""} ${className}`}
      onClick={() => {
        onClick?.();
        setLoading(true);
        void signIn(provider, { callbackUrl: oauthCallback });
      }}
    >
      <LinkedInIcon />
      {loading ? "Redirecting…" : PROVIDER_LABEL[provider]}
    </Button>
  );
}

function LinkedInIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="#0A66C2" aria-hidden>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}
