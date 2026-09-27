"use client";

import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";
import { DEFAULT_AUTH_CALLBACK } from "@/lib/client/auth-routes";
import { useLoginModalOptional } from "./LoginModalProvider";

type LoginModalTriggerProps = {
  children: ReactNode;
  callbackUrl?: string;
  className?: string;
  onClick?: () => void;
  "aria-label"?: string;
};

export function LoginModalTrigger({
  children,
  callbackUrl = DEFAULT_AUTH_CALLBACK,
  className,
  onClick,
  "aria-label": ariaLabel,
}: LoginModalTriggerProps) {
  const modal = useLoginModalOptional();

  return (
    <Link
      href="/auth/login"
      className={className}
      aria-label={ariaLabel}
      onClick={(event: MouseEvent<HTMLAnchorElement>) => {
        onClick?.();
        if (!modal) return;
        if (
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          event.button !== 0
        ) {
          return;
        }
        event.preventDefault();
        modal.openLoginModal(callbackUrl);
      }}
    >
      {children}
    </Link>
  );
}
