"use client";

import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useLoginModalOptional } from "./LoginModalProvider";

type LoginModalTriggerProps = {
  children: ReactNode;
  callbackUrl?: string;
  className?: string;
  onClick?: () => void;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "className" | "children">;

export function LoginModalTrigger({
  children,
  callbackUrl = "/studygub",
  className,
  onClick,
  ...props
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
      {...props}
    >
      {children}
    </button>
  );
}
