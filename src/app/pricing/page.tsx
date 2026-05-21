import { LEGAL_DISCLAIMERS } from "@/lib/legal";
import { MONTHLY_PRICE_USD, TRIAL_DAYS } from "@/lib/stripe";
import { PricingActions } from "@/components/PricingActions";

export const metadata = {
  title: "Pricing — Any Exam Easy",
};

const included = [
  "Unlimited AI exam generation",
  "Web-informed source gathering",
  "Learning quilt with flashcards & quizzes",
  "Lesson plans (K–12 & professional)",
  "Progress tracking dashboard",
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)] pt-24 pb-20">
      <div className="mx-auto max-w-lg px-6 text-center">
        <h1 className="text-4xl font-semibold tracking-tight">Simple pricing.</h1>
        <p className="mt-3 text-[var(--color-ink-muted)]">
          Start with a {TRIAL_DAYS}-day free trial. Then ${MONTHLY_PRICE_USD}/month,
          billed to the email on your account.
        </p>

        <div className="mt-12 rounded-3xl bg-white p-10 shadow-sm">
          <p className="text-sm font-medium text-[var(--color-accent)]">Pro</p>
          <p className="mt-2 text-5xl font-semibold">
            ${MONTHLY_PRICE_USD}
            <span className="text-lg font-normal text-[var(--color-ink-muted)]">/mo</span>
          </p>
          <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
            {TRIAL_DAYS}-day free trial included
          </p>

          <ul className="mt-8 space-y-3 text-left text-sm">
            {included.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-[var(--color-accent)]">✓</span>
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <PricingActions />
          </div>
        </div>

        <p className="mt-8 text-left text-xs leading-relaxed text-[var(--color-ink-muted)]">
          {LEGAL_DISCLAIMERS.subscription} {LEGAL_DISCLAIMERS.limitationOfLiability}
        </p>
      </div>
    </div>
  );
}
