import Link from "next/link";
import { ArrowRight, BadgeCheck, Map, ShieldCheck } from "lucide-react";
import { ROUTES } from "@/lib/routes";
import { COMPANY_PUBLIC } from "@/lib/marketing/company";
import { formatMonthlyPrice, formatTrialLabel } from "@/lib/site";

const TRUST_PILLARS = [
  {
    icon: ShieldCheck,
    label: "QA-gated bank",
    detail: "Items ship after an editorial gate — soft stems stay off the live bank.",
  },
  {
    icon: Map,
    label: "Blueprint Roadmaps",
    detail: "Per-exam plans tied to official outlines, not a random question firehose.",
  },
  {
    icon: BadgeCheck,
    label: formatTrialLabel(),
    detail: `No payment method required. Try a free sample, then decide if Pro is worth ${formatMonthlyPrice("pro")}/mo.`,
  },
] as const;

/**
 * Honest trust band — company + product facts, no invented clinician years.
 */
export function LandingClinicianTrust() {
  return (
    <section
      aria-labelledby="product-trust-heading"
      className="border-y border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-14 sm:px-6 sm:py-16"
    >
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-accent)]">
              {COMPANY_PUBLIC.legalName}
            </p>
            <h2
              id="product-trust-heading"
              className="mt-2 text-2xl font-bold tracking-tight text-[var(--color-ink)] sm:text-3xl"
            >
              A study product with a named company behind it.
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--color-ink-muted)]">
              {COMPANY_PUBLIC.productName} is built in Texas. We publish live bank counts, a{" "}
              {formatTrialLabel()}, and a compare table — not invented pass rates.
            </p>
          </div>
          <Link
            href={ROUTES.about}
            className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-bold text-[var(--color-accent)] transition hover:underline hover:underline-offset-4"
          >
            About the builder
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
        </div>

        <ul className="mt-8 grid gap-4 sm:grid-cols-3">
          {TRUST_PILLARS.map(({ icon: Icon, label, detail }) => (
            <li
              key={label}
              className="flex gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5 shadow-[var(--shadow-apple-sm)]"
            >
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                aria-hidden
              >
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-[var(--color-ink)]">{label}</p>
                <p className="mt-1 text-xs leading-relaxed text-[var(--color-ink-muted)]">
                  {detail}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
