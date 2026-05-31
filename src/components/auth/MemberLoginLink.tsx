"use client";

import { useSession } from "next-auth/react";
import { LoginModalTrigger } from "@/components/auth/LoginModalTrigger";
import { useReturningUserHint } from "@/hooks/useReturningUserHint";
import { maskEmail } from "@/lib/client/returning-user";

type MemberLoginLinkProps = {
  callbackUrl?: string;
  className?: string;
  variant?: "default" | "dark" | "muted";
  showEmailHint?: boolean;
};

const variantStyles = {
  default: "text-[var(--color-ink-muted)]",
  muted: "text-[var(--color-ink-muted)]",
  dark: "text-[#86868b]",
};

const linkStyles = {
  default: "font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400",
  muted: "font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400",
  dark: "font-semibold text-[#2997ff] hover:text-[#64b5ff]",
};

export function MemberLoginLink({
  callbackUrl = "/dashboard",
  className = "",
  variant = "default",
  showEmailHint = false,
}: MemberLoginLinkProps) {
  const { data: session, status } = useSession();
  const hint = useReturningUserHint();

  if (status === "authenticated" && session?.user) return null;
  if (status === "loading") return null;

  const emailHint =
    showEmailHint && hint?.email ? maskEmail(hint.email) : null;

  return (
    <p className={`text-sm ${variantStyles[variant]} ${className}`}>
      Already a member?{" "}
      <LoginModalTrigger callbackUrl={callbackUrl} className={linkStyles[variant]}>
        Log in{emailHint ? ` as ${emailHint}` : ""}
      </LoginModalTrigger>
    </p>
  );
}
