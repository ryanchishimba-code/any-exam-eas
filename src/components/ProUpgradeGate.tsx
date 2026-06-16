import Link from "next/link";
import { Crown, Sparkles } from "lucide-react";
import { auth } from "@/auth";
import { getUserAccess, userHasFeature } from "@/lib/access-control";
import {
  PRO_FEATURE_LABELS,
  proUpgradeHref,
} from "@/lib/require-pro-feature";
import type { SubscriptionFeature } from "@/lib/subscription-features";
import { Button } from "@/components/ui/Button";
import type { ReactNode } from "react";

type ProUpgradeGateProps = {
  feature: SubscriptionFeature;
  children: ReactNode;
  callbackPath?: string;
};

/** Renders children for Pro users; upgrade prompt for Basic subscribers. */
export async function ProUpgradeGate({
  feature,
  children,
  callbackPath = "/pricing",
}: ProUpgradeGateProps) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const access = await getUserAccess(session.user.id);
  if (!access.hasPremiumAccess || userHasFeature(access, feature)) {
    return <>{children}</>;
  }

  const label = PRO_FEATURE_LABELS[feature];

  return (
    <div className="mx-auto max-w-lg rounded-[28px] border border-[var(--color-accent)]/20 bg-gradient-to-b from-[var(--color-accent)]/[0.06] to-white p-8 text-center shadow-[var(--shadow-apple-sm)]">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-accent)]/10">
        <Crown className="h-6 w-6 text-[var(--color-accent)]" aria-hidden />
      </div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-accent)]">
        Pro feature
      </p>
      <h2 className="mt-2 text-xl font-semibold text-[var(--color-ink)]">
        Upgrade to unlock {label}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-muted)]">
        Your Basic plan includes all 6 exams, question banks, Roadmaps, and clinical tools.
        {label} is part of Pro — plus advanced analytics, unlimited mock exams, spaced repetition,
        and enhanced explanations.
      </p>
      <div className="mt-6 flex flex-col items-center gap-3">
        <Button href={proUpgradeHref(feature)} className="gap-2">
          <Sparkles className="h-4 w-4" aria-hidden />
          Upgrade to Pro
        </Button>
        <Link
          href={callbackPath}
          className="text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-accent)]"
        >
          Compare plans
        </Link>
      </div>
    </div>
  );
}
