import { CreditCard, RotateCcw, ShieldCheck } from "lucide-react";
import { TRIAL_PAYMENT_DISCLOSURE } from "@/lib/site";
import { PaymentMethodBadges } from "@/components/PaymentMethodBadges";

const items = [
  { icon: ShieldCheck, label: "Secure Stripe checkout" },
  { icon: RotateCcw, label: "Cancel anytime" },
  { icon: CreditCard, label: "No charge during trial" },
] as const;

export function LandingTrialTrust({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <p className="text-center text-xs font-medium text-slate-600 lg:text-left">
        {TRIAL_PAYMENT_DISCLOSURE}
      </p>
      <PaymentMethodBadges className="mt-3" size="sm" />
      <ul
        className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 lg:justify-start"
        aria-label="Billing trust signals"
      >
        {items.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-1.5 text-[0.6875rem] text-slate-500">
            <Icon className="h-3.5 w-3.5 text-teal-600" strokeWidth={2} aria-hidden />
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}
