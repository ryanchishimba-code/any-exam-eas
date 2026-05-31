import { Suspense } from "react";
import { LoginCompleteClient } from "./LoginCompleteClient";

export const metadata = {
  title: "Signing in — Any Exam Easy",
};

function LoginCompleteFallback() {
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

export default function LoginCompletePage() {
  return (
    <Suspense fallback={<LoginCompleteFallback />}>
      <LoginCompleteClient />
    </Suspense>
  );
}
