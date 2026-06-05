"use client";

import { useSession } from "next-auth/react";
import { LoginModalTrigger } from "@/components/auth/LoginModalTrigger";
import { useReturningUserHint } from "@/hooks/useReturningUserHint";
import { maskEmail } from "@/lib/client/returning-user";

type MemberLoginLinkProps = {
  callbackUrl?: string;
  className?: string;
  showEmailHint?: boolean;
};

export function MemberLoginLink({
  callbackUrl = "/studygub",
  className = "",
  showEmailHint = false,
}: MemberLoginLinkProps) {
  const { data: session, status } = useSession();
  const hint = useReturningUserHint();

  if (status === "authenticated" && session?.user) return null;
  if (status === "loading") return null;

  const emailHint =
    showEmailHint && hint?.email ? maskEmail(hint.email) : null;

  return (
    <p className={`text-sm text-[var(--color-ink-muted)] ${className}`}>
      Already a member?{" "}
      <LoginModalTrigger
        callbackUrl={callbackUrl}
        className="font-semibold text-teal-600 hover:text-teal-700"
      >
        Log in{emailHint ? ` as ${emailHint}` : ""}
      </LoginModalTrigger>
    </p>
  );
}
