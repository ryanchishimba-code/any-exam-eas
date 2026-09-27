import type { Metadata } from "next";
import Link from "next/link";
import { SupportPhoneLink } from "@/components/contact/SupportPhoneLink";
import { LEGAL_DISCLAIMERS, LEGAL_ENTITY, LEGAL_LAST_UPDATED } from "@/lib/legal";
import { formatPricingCheckoutTrialOffer } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Refunds and cancellation — Any Exam Easy" },
  description:
    "How to cancel an Any Exam Easy subscription in Settings, what happens to access, and when payments are refundable.",
  alternates: { canonical: "/legal/refunds" },
};

export default function RefundsPage() {
  const { companyName, productName, supportEmail } = LEGAL_ENTITY;

  return (
    <div className="min-h-screen px-6 pb-20 pt-24">
      <article className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-ink)]">
          Refunds and cancellation
        </h1>
        <p className="mt-2 text-xs text-[var(--color-ink-muted)]">
          Last updated: {LEGAL_LAST_UPDATED} · {productName} is a product of {companyName}
        </p>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-[var(--color-ink-muted)]">
          <section>
            <h2 className="text-base font-semibold text-[var(--color-ink)]">Trial</h2>
            <p className="mt-2">{formatPricingCheckoutTrialOffer()}.</p>
            <p className="mt-2">{LEGAL_DISCLAIMERS.subscription}</p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-[var(--color-ink)]">Cancel anytime in Settings</h2>
            <p className="mt-2">
              Open Settings and choose Cancel or manage billing. That opens the Stripe customer
              portal, where you can cancel a renewing subscription. Canceling stops the next
              charge. It does not erase the period you have already paid for.
            </p>
            <p className="mt-2">{LEGAL_DISCLAIMERS.refundsAndAccess}</p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-[var(--color-ink)]">Payments</h2>
            <p className="mt-2">{LEGAL_DISCLAIMERS.stripeProcessor}</p>
            <p className="mt-2">{LEGAL_DISCLAIMERS.paymentFailure}</p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-[var(--color-ink)]">Question issues</h2>
            <p className="mt-2">
              If a question is wrong, report it from the rationale, email {supportEmail}, or call{" "}
              <SupportPhoneLink className="font-semibold text-[var(--color-accent)] hover:underline" />.
              We review the report and can hide the item while it is repaired. That review is not a
              promise of a refund.
            </p>
          </section>
          <p>
            Related:{" "}
            <Link href="/legal/terms" className="font-semibold text-[var(--color-accent)] hover:underline">
              Terms
            </Link>
            {" · "}
            <Link href="/legal/privacy" className="font-semibold text-[var(--color-accent)] hover:underline">
              Privacy
            </Link>
            {" · "}
            <Link href="/legal/disclaimer" className="font-semibold text-[var(--color-accent)] hover:underline">
              Disclaimers
            </Link>
          </p>
        </div>
      </article>
    </div>
  );
}
