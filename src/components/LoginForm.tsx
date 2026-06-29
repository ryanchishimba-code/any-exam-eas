"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { ForgotPasswordPanel } from "@/components/auth/ForgotPasswordPanel";
import { LoginPanel } from "@/components/auth/LoginPanel";
import { loadReturningUserHint } from "@/lib/client/returning-user";
import { sanitizeCallbackUrl } from "@/lib/client/auth-routes";
import { completeLoginFlow } from "@/lib/client/post-login";
import { messageForSignInError } from "@/lib/auth-client";

const panelMotion = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as const },
};

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirecting = useRef(false);
  const [redirectMessage, setRedirectMessage] = useState<string | null>(null);
  const [view, setView] = useState<"login" | "forgot">("login");
  const [hintEmail, setHintEmail] = useState("");
  const resetSuccess = searchParams.get("reset") === "success";
  const authError = searchParams.get("error");
  const authCode = searchParams.get("code");
  const ipLimitError = authError === "too_many_ips" || authCode === "too_many_ips";
  const ipRequiredError = authError === "ip_required" || authCode === "ip_required";
  const callbackUrl = sanitizeCallbackUrl(searchParams.get("callbackUrl"));

  const { data: session, status } = useSession();

  useEffect(() => {
    setHintEmail(loadReturningUserHint()?.email ?? "");
  }, []);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.email || redirecting.current) {
      return;
    }

    const email = session.user.email;
    if (!email) return;

    redirecting.current = true;
    void (async () => {
      const result = await completeLoginFlow({
        router,
        callbackUrl,
        email,
        name: session.user?.name,
        method: "email",
      });
      setRedirectMessage(
        result.isPremium
          ? "Welcome back! Opening your Study Hub…"
          : "Welcome back! Opening your Study Hub…"
      );
    })();
  }, [callbackUrl, router, session?.user?.email, session?.user?.name, status]);

  if (status === "authenticated") {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <span
          className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-accent)] border-t-transparent"
          aria-hidden
        />
        <p className="text-sm text-[var(--color-ink-muted)]">
          {redirectMessage ?? "Welcome back! Redirecting…"}
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full space-y-5">
      {resetSuccess && view === "login" && (
        <StatusMessage variant="success">
          Your password was updated. Log in with your new password.
        </StatusMessage>
      )}

      {ipLimitError && view === "login" && (
        <StatusMessage variant="error">{messageForSignInError("too_many_ips")}</StatusMessage>
      )}

      {ipRequiredError && view === "login" && (
        <StatusMessage variant="error">{messageForSignInError("ip_required")}</StatusMessage>
      )}

      {authError &&
        !ipLimitError &&
        !ipRequiredError &&
        view === "login" && (
          <StatusMessage variant="error">
            {messageForSignInError(authError, authCode)}
          </StatusMessage>
        )}

      <AnimatePresence mode="wait" initial={false}>
        {view === "login" ? (
          <motion.div key="login-view" {...panelMotion} className="space-y-5">
            <LoginPanel
              callbackUrl={callbackUrl}
              onSuccess={() => {
                redirecting.current = true;
              }}
              onForgotPassword={() => setView("forgot")}
            />

            <p className="text-center text-xs text-[var(--color-ink-muted)]">
              Need access?{" "}
              <Link
                href="/signup?plan=trial"
                className="font-medium text-[var(--color-accent)] hover:underline"
              >
                Start trial
              </Link>
            </p>
          </motion.div>
        ) : (
          <motion.div key="forgot-view" {...panelMotion}>
            <ForgotPasswordPanel
              variant="page"
              defaultEmail={hintEmail}
              onBackToLogin={() => setView("login")}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
