"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { isAppleAuthButtonEnabled } from "@/lib/auth/oauth-buttons";
import { parseBoardSlug, stampBoardIntentFromLocation } from "@/lib/auth/board-intent";
import { DEFAULT_AUTH_CALLBACK, loginCompleteUrl, sanitizeCallbackUrl } from "@/lib/client/auth-routes";

type AppleSignInButtonProps = {
  callbackUrl?: string;
  /** Board already chosen on the signup form, used when the URL has none. */
  board?: string | null;
  highlighted?: boolean;
  large?: boolean;
  onClick?: () => void;
  className?: string;
};

/**
 * Hidden unless NEXT_PUBLIC_APPLE_AUTH_ENABLED is exactly "true".
 * The server registers Apple only when APPLE_ID (Services ID) and APPLE_SECRET are both set.
 */
export function AppleSignInButton({
  callbackUrl = DEFAULT_AUTH_CALLBACK,
  board,
  highlighted,
  large,
  onClick,
  className = "",
}: AppleSignInButtonProps) {
  const [loading, setLoading] = useState(false);

  if (!isAppleAuthButtonEnabled()) return null;

  return (
    <Button
      type="button"
      variant="secondary"
      disabled={loading}
      className={`w-full gap-2.5 ${large ? "!py-3.5 !text-base" : ""} ${
        highlighted ? "ring-2 ring-[var(--color-accent)]/30" : ""
      } ${className}`}
      onClick={() => {
        onClick?.();
        setLoading(true);
        const carried = stampBoardIntentFromLocation() ?? parseBoardSlug(board);
        void signIn("apple", {
          callbackUrl: loginCompleteUrl(sanitizeCallbackUrl(callbackUrl), carried),
        });
      }}
    >
      <AppleIcon />
      {loading ? "Redirecting…" : "Continue with Apple"}
    </Button>
  );
}

function AppleIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden fill="currentColor">
      <path d="M16.37 12.72c.03 3.22 2.82 4.29 2.85 4.3-.02.08-.45 1.53-1.47 3.03-.89 1.3-1.81 2.59-3.26 2.62-1.43.03-1.89-.85-3.52-.85-1.64 0-2.15.82-3.5.88-1.4.05-2.47-1.4-3.37-2.69-1.83-2.65-3.23-7.48-1.35-10.74.93-1.62 2.6-2.64 4.41-2.67 1.38-.03 2.68.93 3.52.93.84 0 2.41-1.15 4.06-.98.69.03 2.63.28 3.88 2.1-.1.06-2.32 1.35-2.25 4.07zM14.2 5.18c.74-.9 1.24-2.15 1.1-3.4-1.07.04-2.36.71-3.13 1.61-.69.79-1.29 2.06-1.13 3.27 1.19.09 2.41-.61 3.16-1.48z" />
    </svg>
  );
}
