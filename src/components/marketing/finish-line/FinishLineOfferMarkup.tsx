import Link from "next/link";
import {
  FINISH_LINE_FINE_PRINT_BEFORE_TERMS,
  FINISH_LINE_HERO_LINE,
  FINISH_LINE_TERMS_PATH,
} from "@/lib/marketing/finish-line-offer";
import { cn } from "@/lib/utils";

export type FinishLineOfferVariant = "hero" | "pricing" | "checkout" | "inline";

type Props = {
  variant?: FinishLineOfferVariant;
  className?: string;
};

const variantClass: Record<FinishLineOfferVariant, string> = {
  hero: "max-w-md",
  pricing: "max-w-lg text-left",
  checkout: "max-w-lg text-left",
  inline: "max-w-sm",
};

export function FinishLineOfferMarkup({
  variant = "hero",
  className,
}: Props) {
  return (
    <aside
      className={cn(
        "rounded-lg border border-[color-mix(in_srgb,var(--color-accent)_24%,transparent)] bg-[color-mix(in_srgb,var(--color-accent)_7%,var(--color-surface-elevated))] px-3 py-2.5 text-left",
        variantClass[variant],
        className
      )}
      data-finish-line-offer="badge"
      aria-label="Finish Line Refund"
    >
      <p className="text-sm font-semibold leading-snug text-[var(--color-ink)]">
        {FINISH_LINE_HERO_LINE}
      </p>
      <p className="mt-1 text-xs leading-snug text-[var(--color-ink-muted)]">
        {FINISH_LINE_FINE_PRINT_BEFORE_TERMS}{" "}
        <Link
          href={FINISH_LINE_TERMS_PATH}
          prefetch={false}
          className="font-semibold text-[var(--color-accent)] underline underline-offset-2"
        >
          See terms
        </Link>
      </p>
    </aside>
  );
}
