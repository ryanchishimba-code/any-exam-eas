import Link from "next/link";
import { BarChart3, ClipboardCheck, Crown, Repeat } from "lucide-react";
import { auth } from "@/auth";
import { getUserAccess, userHasFeature } from "@/lib/access-control";
import { proUpgradeHref } from "@/lib/require-pro-feature";
import { PRO_UPGRADE_HEADLINE } from "@/lib/subscription-tiers";
import { cn } from "@/lib/utils";

const PERKS = [
  { icon: BarChart3, label: "Advanced analytics" },
  { icon: Repeat, label: "Spaced repetition" },
  { icon: ClipboardCheck, label: "Unlimited mock exams" },
];

/**
 * Legacy in-app upgrade nudge — hidden now that Pro is the only paid tier and trial
 * includes full Pro access. Must never take down study pages on Neon blips.
 */
export async function ProBenefitsCallout({ className }: { className?: string }) {
  try {
    const session = await auth();
    if (!session?.user?.id) return null;

    const access = await getUserAccess(session.user.id);
    // Only nudge users who have access but are NOT on Pro.
    if (!access.hasPremiumAccess) return null;
    if (userHasFeature(access, "advanced_analytics")) return null;

    return (
      <div
        className={cn(
          "flex flex-col gap-4 rounded-2xl border border-[var(--color-accent)]/25 bg-[var(--color-accent)]/[0.04] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5",
          className
        )}
      >
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-sm font-bold text-[var(--color-ink)]">
            <Crown className="h-4 w-4 text-[var(--color-accent)]" aria-hidden />
            {PRO_UPGRADE_HEADLINE}
          </p>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5">
            {PERKS.map((perk) => (
              <li
                key={perk.label}
                className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-ink-muted)]"
              >
                <perk.icon className="h-3.5 w-3.5 text-[var(--color-accent)]" aria-hidden />
                {perk.label}
              </li>
            ))}
          </ul>
        </div>
        <Link
          href={proUpgradeHref("advanced_analytics")}
          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-bold text-white shadow-[var(--shadow-apple-btn)] transition hover:shadow-[var(--shadow-apple-btn-hover)] hover:brightness-105"
        >
          Upgrade to Pro
          <Crown className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </div>
    );
  } catch (error) {
    console.warn(
      "[ProBenefitsCallout] soft-fail:",
      error instanceof Error ? error.message : error
    );
    return null;
  }
}
