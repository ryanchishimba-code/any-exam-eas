"use client";

import { Suspense, useState } from "react";
import { AuthFocusLayout } from "@/components/auth/AuthFocusLayout";
import { LoginForm } from "@/components/LoginForm";

export function LoginPageView() {
  const [view, setView] = useState<"login" | "forgot">("login");
  const forgot = view === "forgot";

  return (
    <AuthFocusLayout
      title={forgot ? "Reset your password." : "Sign in."}
      detail={
        forgot
          ? "Enter the email on your account. We'll send a link to choose a new one."
          : "Your practice picks up where you left off."
      }
    >
      <Suspense
        fallback={
          <div className="space-y-3 py-1" aria-hidden>
            <div className="h-12 animate-pulse rounded-xl bg-[#e2e8f0]" />
            <div className="h-12 animate-pulse rounded-xl bg-[#e2e8f0]" />
            <div className="h-11 animate-pulse rounded-full bg-[#e2e8f0]" />
          </div>
        }
      >
        <LoginForm onViewChange={setView} />
      </Suspense>
    </AuthFocusLayout>
  );
}
