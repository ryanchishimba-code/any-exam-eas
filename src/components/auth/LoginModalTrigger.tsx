"use client";

import Link from "next/link";
import { useLoginModalOptional } from "./LoginModalProvider";

type LoginModalTriggerProps = {
  children: React.ReactNode;
  callbackUrl?: string;
  className?: string;
  onClick?: () => void;
};

export function LoginModalTrigger({
  children,
  callbackUrl = "/study",
  className,
  onClick,
}: LoginModalTriggerProps) {
  const modal = useLoginModalOptional();

  if (!modal) {
    return (
      <Link href="/login" className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        onClick?.();
        modal.openLoginModal(callbackUrl);
      }}
    >
      {children}
    </button>
  );
}
