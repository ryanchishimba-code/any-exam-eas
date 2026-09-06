"use client";

import { VerifyEmailPrompt } from "@/components/auth/VerifyEmailPrompt";

export function AccessBlockedNotice({
  reason,
  email,
}: {
  reason: "suspended" | "email_unverified";
  email?: string | null;
}) {
  if (reason === "suspended") {
    return (
      <div className="apple-card mt-10 a11y-banner a11y-banner--error flex-col items-center p-8 text-center">
        <h2 className="text-xl font-semibold">Account suspended</h2>
        <p className="mt-3 text-sm">
          Your account has been suspended. Contact support if you believe this is an error.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-10 w-full max-w-xl px-4">
      <VerifyEmailPrompt email={email} required />
    </div>
  );
}
