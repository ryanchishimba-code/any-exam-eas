"use client";

/**
 * LandingOfferingV2 — a concise "what you get" clarity band placed right after
 * the hero (AMBOSS leads with QBanks / Reference / Educator pillars). Answers
 * "what is this?" in three scannable pillars before the deeper showcase.
 */

import { Reveal } from "@/components/landing/v2/Reveal";
import { LANDING_OFFERING_PILLARS } from "@/lib/landing/content";

export function LandingOfferingV2() {
  return (
    <section
      className="aee-hero-handoff bg-[var(--color-bg)] py-16 sm:py-20"
      aria-labelledby="offering-heading"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-accent)]">
            What you get
          </p>
          <h2
            id="offering-heading"
            className="mt-3 text-3xl font-bold tracking-tight text-[var(--color-ink)] sm:text-4xl"
          >
            Everything for board day — in one place.
          </h2>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {LANDING_OFFERING_PILLARS.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <Reveal key={pillar.title} delay={i * 0.05}>
                <div className="flex h-full flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-apple-sm)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-apple-md)]">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-accent)]/10">
                    <Icon className="h-5 w-5 text-[var(--color-accent)]" strokeWidth={1.75} aria-hidden />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-[var(--color-ink)]">{pillar.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-ink-muted)]">
                    {pillar.detail}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
