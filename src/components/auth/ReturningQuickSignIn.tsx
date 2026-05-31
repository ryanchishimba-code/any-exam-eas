"use client";

import { useSession } from "next-auth/react";
import { MemberLoginLink } from "@/components/auth/MemberLoginLink";
import { LoginModalTrigger } from "@/components/auth/LoginModalTrigger";
import { useReturningUserHint } from "@/hooks/useReturningUserHint";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { maskEmail, saveReturningUserHint, type LoginMethod } from "@/lib/client/returning-user";

type ReturningQuickSignInProps = {
  callbackUrl?: string;
  className?: string;
};

export function ReturningQuickSignIn({
  callbackUrl = "/dashboard",
  className = "",
}: ReturningQuickSignInProps) {
  const { data: session, status } = useSession();
  const hint = useReturningUserHint();

  if (status === "authenticated" && session?.user) return null;
  if (status === "loading") return null;

  if (!hint?.email) {
    return (
      <div className={className}>
        <MemberLoginLink callbackUrl={callbackUrl} />
      </div>
    );
  }

  const preferred = hint.lastMethod;
  const masked = maskEmail(hint.email);
  const googleEnabled = process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true";
  const useGoogle =
    googleEnabled &&
    (preferred === "google" ||
      preferred === "apple" ||
      preferred === "magic" ||
      !preferred);

  function track(method: LoginMethod) {
    saveReturningUserHint({ email: hint!.email, name: hint!.name, lastMethod: method });
  }

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      {useGoogle && googleEnabled ? (
        <div className="flex flex-col items-center gap-1.5">
          <p className="text-xs font-medium text-teal-700">
            Welcome back — one tap to continue
          </p>
          <GoogleSignInButton
            callbackUrl={callbackUrl}
            highlighted
            large
            onClick={() => track("google")}
          />
        </div>
      ) : (
        <LoginModalTrigger
          callbackUrl={callbackUrl}
          className="login-modal-btn-primary w-full max-w-sm sm:w-auto sm:min-w-[14rem]"
        >
          Log in as {masked}
        </LoginModalTrigger>
      )}

      <MemberLoginLink callbackUrl={callbackUrl} />
    </div>
  );
}
