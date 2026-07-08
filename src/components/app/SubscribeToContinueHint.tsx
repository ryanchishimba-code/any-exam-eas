"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { postTrialCheckoutHref } from "@/lib/dashboard/upgrade-banner";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  compact?: boolean;
};

/** Visible lock affordance for post-trial users — CTA links to checkout. */
export function SubscribeToContinueHint({ className, compact = false }: Props) {
  return (
    <p
      className={cn(
        "flex items-start gap-1.5 text-[var(--color-ink-muted)]",
        compact ? "text-[10px] leading-snug" : "text-xs leading-snug",
        className
      )}
    >
      <Lock className={cn("mt-0.5 shrink-0", compact ? "h-3 w-3" : "h-3.5 w-3.5")} aria-hidden />
      <span>
        Subscribe to continue studying.{" "}
        <Link
          href={postTrialCheckoutHref()}
          className="font-semibold text-[var(--color-accent)] underline-offset-2 hover:underline"
        >
          Go to checkout
        </Link>
      </span>
    </p>
  );
}
