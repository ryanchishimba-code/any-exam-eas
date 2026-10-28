import { VerifyEmailInboxCard } from "@/components/auth/verify-email/VerifyEmailInboxCard";
import { maskEmail } from "@/lib/client/returning-user";

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

  const displayEmail = email?.trim() ? maskEmail(email.trim()) : "your email";

  return (
    <div className="mx-auto flex min-h-[min(70vh,640px)] w-full max-w-lg flex-col items-center justify-center px-4 py-12">
      <VerifyEmailInboxCard emailLabel={displayEmail} showChangeEmailLink />
    </div>
  );
}
