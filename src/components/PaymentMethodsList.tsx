import type { ReactNode } from "react";
import { PAYMENT_METHODS } from "@/lib/payments";
import { PaymentMethodBadges } from "@/components/PaymentMethodBadges";
import { CreditCard, Smartphone } from "lucide-react";

const icons: Record<string, ReactNode> = {
  card: <CreditCard className="h-5 w-5" aria-hidden />,
  apple_pay: <Smartphone className="h-5 w-5" aria-hidden />,
  google_pay: <Smartphone className="h-5 w-5" aria-hidden />,
  link: <CreditCard className="h-5 w-5" aria-hidden />,
};

export function PaymentMethodsList({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="space-y-3 text-center">
        <p className="text-xs text-[var(--color-ink-muted)]">
          Pay with card, Link, Apple Pay, or Google Pay — processed securely by Stripe.
        </p>
        <PaymentMethodBadges className="justify-center" size="sm" />
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      <PaymentMethodBadges />
      <ul className="space-y-3 text-left">
      {PAYMENT_METHODS.map((method) => (
        <li
          key={method.id}
          className="flex gap-3 rounded-xl border border-black/[0.06] bg-[var(--color-surface-elevated)] px-4 py-3"
        >
          <span className="mt-0.5 text-[var(--color-accent)]">
            {icons[method.id] ?? <CreditCard className="h-5 w-5" />}
          </span>
          <div>
            <p className="text-sm font-medium text-[var(--color-ink)]">{method.label}</p>
            <p className="text-xs text-[var(--color-ink-muted)]">{method.description}</p>
          </div>
        </li>
      ))}
      </ul>
    </div>
  );
}
