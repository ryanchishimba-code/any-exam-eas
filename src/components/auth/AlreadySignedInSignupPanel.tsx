import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ROUTES } from "@/lib/routes";
import { formatTrialCtaLabel } from "@/lib/site";

/** Shown on /signup when the visitor is already authenticated. */
export function AlreadySignedInSignupPanel({
  firstName,
}: {
  firstName?: string | null;
}) {
  const greeting = firstName?.trim() ? `, ${firstName.trim()}` : "";

  return (
    <div className="space-y-5 text-center">
      <div className="rounded-2xl border border-teal-500/30 bg-teal-50/70 px-5 py-6 dark:bg-teal-950/30">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">
          {formatTrialCtaLabel()}
        </p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-[var(--color-ink)]">
          You&apos;re already signed in{greeting}.
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-[var(--color-ink-muted)]">
          Your account is ready — continue in Study Hub. No need to register again.
        </p>
        <Link
          href={`${ROUTES.dashboard}?from=try-for-free`}
          className="aee-flagship-cta aee-flagship-cta--primary group mt-5 inline-flex items-center justify-center"
        >
          Continue to Study Hub
          <ArrowRight
            className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        </Link>
      </div>
      <p className="text-sm text-[var(--color-ink-muted)]">
        Need a different account? Sign out from your profile menu, then choose{" "}
        <span className="font-semibold text-[var(--color-ink)]">{formatTrialCtaLabel()}</span>{" "}
        again.
      </p>
    </div>
  );
}
