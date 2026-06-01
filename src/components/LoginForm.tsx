"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { LoginPanel } from "@/components/auth/LoginPanel";
import { sanitizeCallbackUrl } from "@/lib/client/auth-routes";
import { completeLoginFlow } from "@/lib/client/post-login";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirecting = useRef(false);
  const [redirectMessage, setRedirectMessage] = useState<string | null>(null);
  const resetSuccess = searchParams.get("reset") === "success";
  const callbackUrl = sanitizeCallbackUrl(searchParams.get("callbackUrl"));

  const { data: session, status } = useSession();

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
          ? "Welcome back! Opening your dashboard…"
          : "Welcome back! Opening your dashboard…"
      );
    })();
  }, [callbackUrl, router, session?.user?.email, session?.user?.name, status]);

  if (status === "authenticated") {
    return (
      <div className="apple-card mt-10 flex flex-col items-center gap-3 p-10 text-center">
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
    <div className="apple-card mt-10 space-y-5 p-8 md:p-10">
      {resetSuccess && (
        <StatusMessage variant="success">
          Your password was updated. Log in with your new password.
        </StatusMessage>
      )}

      <LoginPanel callbackUrl={callbackUrl} />

      <p className="text-center text-xs text-[var(--color-ink-muted)]">
        Need access?{" "}
        <Link href="/signup?plan=trial" className="font-medium text-[var(--color-accent)] hover:underline">
          Start trial
        </Link>
      </p>
    </div>
  );
}
