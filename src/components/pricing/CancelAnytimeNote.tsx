import { Check } from "lucide-react";
import { CANCEL_ANYTIME_LABEL } from "@/lib/billing-plans";
import { cn } from "@/lib/utils";

/**
 * Tesla-style reassurance: one clear line, not buried in policy fine print.
 * Hidden for pay-once (there is no subscription to cancel).
 */
export function CancelAnytimeNote({
  className,
  hidden = false,
}: {
  className?: string;
  /** Pay-once purchases have no renewal to cancel. */
  hidden?: boolean;
}) {
  if (hidden) return null;

  return (
    <p
      className={cn(
        "flex items-center justify-center gap-1.5 text-sm font-semibold text-[var(--color-ink)]",
        className
      )}
    >
      <Check
        className="h-4 w-4 shrink-0 text-[var(--color-accent)]"
        aria-hidden
        strokeWidth={2.5}
      />
      {CANCEL_ANYTIME_LABEL}
    </p>
  );
}
