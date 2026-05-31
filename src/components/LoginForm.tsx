"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { LoginPanel } from "@/components/auth/LoginPanel";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetSuccess = searchParams.get("reset") === "success";
  const callbackUrl = searchParams.get("callbackUrl") ?? "/study";

  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      router.replace(callbackUrl);
    }
  }, [status, session?.user, callbackUrl, router]);

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
