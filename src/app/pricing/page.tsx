import { LEGAL_DISCLAIMERS } from "@/lib/legal";
import { TRIAL_DAYS, MONTHLY_PRICE_USD } from "@/lib/stripe";
import { formatMonthlyPrice, formatTrialLabel } from "@/lib/site";
import { PricingActions } from "@/components/PricingActions";
import { PaymentMethodsList } from "@/components/PaymentMethodsList";
import { PageShell } from "@/components/PageShell";

export const metadata = {
  title: "Pricing — Any Exam Easy",
};

const included = [
  "Unlimited AI exam generation",
  "Web-informed source gathering",
  "Learning quilt with flashcards & quizzes",
  "Lesson plans by subject area",
  "Progress tracking dashboard",
];

export default function PricingPage() {
  return (
    <PageShell
      eyebrow="Pricing"
      title="Simple pricing."
      description={`Start with a ${TRIAL_DAYS}-day free trial. Then $${MONTHLY_PRICE_USD}/month, billed to the email on your account.`}
      align="center"
      maxWidth="max-w-lg"
    >
      <div className="apple-card mt-12 p-10">
        <p className="text-sm font-medium text-[var(--color-accent)]">Pro</p>
        <p className="mt-3 text-5xl font-semibold tracking-tight">
          ${MONTHLY_PRICE_USD}
          <span className="text-lg font-normal text-[var(--color-ink-muted)]">/mo</span>
        </p>
        <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
          {formatTrialLabel()} or subscribe today
        </p>

        <ul className="mt-8 space-y-3.5 text-left text-[0.9375rem]">
          {included.map((item) => (
            <li key={item} className="flex gap-3 text-[var(--color-ink-muted)]">
              <span className="font-medium text-[var(--color-accent)]">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <PaymentMethodsList />

        <div className="mt-9">
          <PricingActions />
        </div>
      </div>

      <p className="mt-8 text-left text-xs leading-relaxed text-[var(--color-ink-muted)]">
        {LEGAL_DISCLAIMERS.beta} {LEGAL_DISCLAIMERS.subscription}{" "}
        {LEGAL_DISCLAIMERS.limitationOfLiability}
      </p>
    </PageShell>
  );
}
