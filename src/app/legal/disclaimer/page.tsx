import { LEGAL_DISCLAIMERS, LEGAL_ENTITY, LEGAL_LAST_UPDATED, PUBLIC_DISCLAIMER_KEYS } from "@/lib/legal";

export const metadata = { title: "Disclaimers — Any Exam Easy" };

const DISCLAIMER_LABELS: Partial<Record<(typeof PUBLIC_DISCLAIMER_KEYS)[number], string>> = {
  companyRelationship: "Company & product",
  educationalPurpose: "Educational purpose only",
  noGuarantee: "No outcome guarantees",
  notMedicalAdvice: "Not professional advice",
  aiGenerated: "AI-generated content",
  progressMetrics: "Practice metrics",
  studySupport: "Study support only",
  ageRequirement: "Age requirement",
  testimonials: "Marketing examples",
  subscription: "Subscriptions & trials",
  refundsAndAccess: "Refunds & access",
  planChanges: "Plan changes",
  paymentFailure: "Payment failure",
  reactivation: "Account reactivation",
  billingCommunications: "Billing emails",
  stripeProcessor: "Payment processing",
  limitationOfLiability: "Limitation of liability",
  liabilityCap: "Liability cap",
  arbitrationSummary: "Dispute resolution",
  noClassAction: "Class actions",
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <article className="mx-auto max-w-2xl px-6">
        <h1 className="text-3xl font-semibold">Disclaimers</h1>
        <p className="mt-2 text-xs text-[var(--color-ink-muted)]">
          Last updated: {LEGAL_LAST_UPDATED} · {LEGAL_ENTITY.productName} is a product of{" "}
          {LEGAL_ENTITY.companyName}
        </p>
        <p className="mt-4 text-sm text-[var(--color-ink-muted)]">
          Please read carefully before using {LEGAL_ENTITY.productName} for academic or professional
          study. Full terms are in our{" "}
          <a href="/legal/terms" className="text-[var(--color-accent)] underline">
            Terms of Service
          </a>
          .
        </p>
        <ul className="mt-10 space-y-6">
          {PUBLIC_DISCLAIMER_KEYS.map((key) => (
            <li
              key={key}
              className="rounded-2xl bg-[var(--color-surface)] p-6 text-sm leading-relaxed"
            >
              {DISCLAIMER_LABELS[key] && (
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
                  {DISCLAIMER_LABELS[key]}
                </p>
              )}
              {LEGAL_DISCLAIMERS[key]}
            </li>
          ))}
        </ul>
        <p className="mt-10 text-xs text-[var(--color-ink-muted)]">
          These disclaimers supplement—not replace—the Terms of Service and Privacy Policy.
          Jurisdiction-specific requirements may apply. Consult a licensed attorney for compliance
          advice.
        </p>
      </article>
    </div>
  );
}
