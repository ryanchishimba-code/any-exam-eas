"use client";

import { useEffect, useRef } from "react";
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
  const resetSuccess = searchParams.get("reset") === "success";
  const callbackUrl = sanitizeCallbackUrl(searchParams.get("callbackUrl"));

  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.email || redirecting.current) {
      return;
    }

    redirecting.current = true;
    void completeLoginFlow({
      router,
      callbackUrl,
      email: session.user.email,
      name: session.user.name,
      method: "email",
    });
  }, [callbackUrl, router, session?.user?.email, session?.user?.name, status]);

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
