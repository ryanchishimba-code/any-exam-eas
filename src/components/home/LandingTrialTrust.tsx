import { CreditCard, RotateCcw, ShieldCheck } from "lucide-react";
import { NoPaymentTrialCallout } from "@/components/marketing/NoPaymentTrialCallout";
import {
  formatTrialQuestionLimit,
  NO_PAYMENT_TRIAL_HEADLINE,
  TRIAL_PAYMENT_DISCLOSURE,
} from "@/lib/site";
import { BILLING_POLICY_SHORT } from "@/lib/billing-plans";
import { PaymentMethodBadges } from "@/components/PaymentMethodBadges";

const secondaryItems = [
  { icon: ShieldCheck, label: formatTrialQuestionLimit() },
  { icon: RotateCcw, label: BILLING_POLICY_SHORT },
] as const;

export function LandingTrialTrust({
  className = "",
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <div className={className}>
        <NoPaymentTrialCallout variant="compact" />
        <PaymentMethodBadges className="mt-2 lg:justify-start" size="sm" />
      </div>
    );
  }

  return (
    <div className={className}>
      <NoPaymentTrialCallout variant="badge" className="mx-auto lg:mx-0" />
      <p className="mt-3 text-center text-xs font-medium text-[var(--color-ink-muted)] lg:text-left">
        {TRIAL_PAYMENT_DISCLOSURE}
      </p>
      <PaymentMethodBadges className="mt-3" size="sm" />
      <ul
        className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 lg:justify-start"
        aria-label="Billing trust signals"
      >
        {secondaryItems.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-1.5 text-[0.6875rem] text-[var(--color-ink-muted)]">
            <Icon className="h-3.5 w-3.5 text-teal-600" strokeWidth={2} aria-hidden />
            {label}
          </li>
        ))}
        <li className="flex items-center gap-1.5 text-[0.6875rem] font-semibold text-emerald-800">
          <CreditCard className="h-3.5 w-3.5 text-emerald-600" strokeWidth={2} aria-hidden />
          {NO_PAYMENT_TRIAL_HEADLINE}
        </li>
      </ul>
    </div>
  );
}
