import Link from "next/link";
import { ArrowRight, BadgeCheck, HeartPulse, ShieldCheck } from "lucide-react";
import { ROUTES } from "@/lib/routes";

const TRUST_PILLARS = [
  {
    icon: HeartPulse,
    label: "Licensed healthcare providers",
    detail: "Real clinicians build and review every question and rationale.",
  },
  {
    icon: ShieldCheck,
    label: "QA-gated, not crowd-sourced",
    detail: "Every item clears a quality gate before it ever reaches you.",
  },
  {
    icon: BadgeCheck,
    label: "12+ yrs frontline experience",
    detail: "Bedside expertise baked into explanations — not just textbook recall.",
  },
] as const;

/**
 * Compact "Built by Clinicians" trust band.
 *
 * Sits between the Why-Choose and Pro Benefits sections of the landing page
 * to reinforce content credibility before the pricing section.
 */
export function LandingClinicianTrust() {
  return (
    <section
      aria-labelledby="clinician-trust-heading"
      className="border-y border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-14 sm:px-6 sm:py-16"
    >
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-accent)]">
              Built by clinicians
            </p>
            <h2
              id="clinician-trust-heading"
              className="mt-2 text-2xl font-bold tracking-tight text-[var(--color-ink)] sm:text-3xl"
            >
              Questions written by people who&apos;ve done the job.
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--color-ink-muted)]">
              12+ years of combined frontline healthcare experience goes into every
              vignette, rationale, and clinical pearl — so you study the real thing,
              not a template.
            </p>
          </div>
          <Link
            href={ROUTES.about}
            className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-bold text-[var(--color-accent)] transition hover:underline hover:underline-offset-4"
          >
            Our story
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
        </div>

        {/* Pillars */}
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
