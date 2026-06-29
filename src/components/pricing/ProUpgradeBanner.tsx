import { Crown } from "lucide-react";
import { PRO_FEATURE_LABELS } from "@/lib/require-pro-feature";
import type { SubscriptionFeature } from "@/lib/subscription-features";

export function ProUpgradeBanner({
  feature,
}: {
  feature?: string | null;
}) {
  if (!feature) return null;

  const label =
    feature in PRO_FEATURE_LABELS
      ? PRO_FEATURE_LABELS[feature as SubscriptionFeature]
      : "this Pro feature";

  return (
    <div className="mb-8 rounded-2xl border border-[var(--color-accent)]/25 bg-[var(--color-accent)]/[0.06] px-5 py-4 text-center">
      <p className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-ink)]">
        <Crown className="h-4 w-4 text-[var(--color-accent)]" aria-hidden />
        Upgrade to Pro to unlock {label}
      </p>
      <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
        One plan — unlimited questions, AI Tutor, analytics, mock exams, and everything for all 6
        boards.
      </p>
    </div>
  );
}
