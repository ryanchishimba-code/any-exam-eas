import Link from "next/link";
import { SupportPhoneLink } from "@/components/contact/SupportPhoneLink";
import { LEGAL_ENTITY } from "@/lib/legal";
import { ROUTES } from "@/lib/routes";
import { formatPricingCheckoutTrialOffer } from "@/lib/site";

/**
 * Billing reassurance that sits next to a price or trial CTA.
 * The first line is the approved trial sentence, unchanged.
 */
export function PurchaseTrustNotes({
  className = "",
  tone = "default",
  showTrialOffer = true,
}: {
  className?: string;
  tone?: "default" | "onDark";
  /** Paid checkout must not repeat the card-free trial line. */
  showTrialOffer?: boolean;
}) {
  const ink = tone === "onDark" ? "text-white" : "text-[var(--color-ink)]";
  const muted = tone === "onDark" ? "text-white/75" : "text-[var(--color-ink-muted)]";
  const link = tone === "onDark" ? "text-white underline" : "text-[var(--color-accent)] hover:underline";
  return (
    <div className={`mx-auto max-w-xl text-center ${className}`} data-purchase-trust>
      {showTrialOffer ? (
        <p className={`text-sm font-medium tracking-[-0.01em] ${ink}`}>
          {formatPricingCheckoutTrialOffer()}
        </p>
      ) : null}
      <p className={`mt-2 text-sm leading-relaxed ${muted}`}>
        Cancel anytime in Settings. Card payments go through Stripe — we do not store full card
        numbers. Paid charges are non-refundable except where the law requires a refund, and access
        runs through the period already paid.
      </p>
      <p className={`mt-2 text-sm ${muted}`}>
        <Link href="/legal/refunds" className={`font-semibold ${link}`}>
          Refunds and cancellation
        </Link>
        <span aria-hidden> · </span>
        <Link href="/legal/terms" className={`font-semibold ${link}`}>
          Terms
        </Link>
        <span aria-hidden> · </span>
        <Link href="/legal/privacy" className={`font-semibold ${link}`}>
          Privacy
        </Link>
        <span aria-hidden> · </span>
        <Link href={ROUTES.howQuestionsAreReviewed} className={`font-semibold ${link}`}>
          How questions are reviewed
        </Link>
        <span aria-hidden> · </span>
        <a href={`mailto:${LEGAL_ENTITY.supportEmail}`} className={`font-semibold ${link}`}>
          {LEGAL_ENTITY.supportEmail}
        </a>
        <span aria-hidden> · </span>
        <SupportPhoneLink className={`font-semibold ${link}`} />
      </p>
    </div>
  );
}
