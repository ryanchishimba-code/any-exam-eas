"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { sanitizeCallbackUrl } from "@/lib/client/auth-routes";
import { completeLoginFlow } from "@/lib/client/post-login";

export function LoginCompleteClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const started = useRef(false);

  const callbackUrl = sanitizeCallbackUrl(searchParams.get("callbackUrl"));

  useEffect(() => {
    if (started.current) return;

    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.replace(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
      return;
    }

    const email = session?.user?.email;
    if (!email) return;

    started.current = true;
    void completeLoginFlow({
      router,
      callbackUrl,
      email,
      name: session.user?.name,
      method: "google",
    });
  }, [callbackUrl, router, session?.user?.email, session?.user?.name, status]);

  return (
    <div
      className="flex min-h-[40vh] flex-col items-center justify-center gap-3 px-6 pt-24"
      aria-live="polite"
      aria-busy="true"
    >
      <span
        className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-accent)] border-t-transparent"
        aria-hidden
      />
      <p className="text-sm text-[var(--color-ink-muted)]">Signing you in…</p>
    </div>
  );
}
