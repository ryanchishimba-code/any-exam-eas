"use client";

/**
 * LandingWhyChoose — the persuasion block.
 * Benefit cards → UWorld comparison → brief, honest social proof.
 */

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Minus } from "lucide-react";
import {
  LANDING_UNIQUE_FEATURES,
  LANDING_SOCIAL_PROOF,
  LANDING_SUCCESS_STORIES,
  UWORLD_COMPARE_ROWS,
} from "@/lib/landing/content";

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-48px" }}
      transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function LandingWhyChoose() {
  const testimonials = LANDING_SUCCESS_STORIES.slice(0, 3);

  return (
    <section
      id="why"
      className="scroll-mt-24 bg-[var(--color-surface)] py-20 sm:py-24"
      aria-labelledby="why-heading"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-accent)]">
            Why students choose AnyExamEasy
          </p>
          <h2
            id="why-heading"
            className="mt-3 text-3xl font-bold tracking-tight text-[var(--color-ink)] sm:text-4xl"
          >
            Six boards, premium quality — for less than one UWorld plan.
          </h2>
          <p className="mt-4 text-lg text-[var(--color-ink-muted)]">
            Everything serious candidates need, without stacking $200–400 subscriptions per exam.
          </p>
        </div>

        {/* Benefit cards */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {LANDING_UNIQUE_FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <Reveal key={feature.title} delay={i * 0.04}>
                <div className="flex h-full flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-apple-sm)] transition hover:shadow-[var(--shadow-apple-md)]">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-accent)]/10">
                      <Icon className="h-5 w-5 text-[var(--color-accent)]" strokeWidth={1.75} aria-hidden />
                    </span>
                    {feature.proOnly ? (
                      <span className="rounded-full bg-[var(--color-ink)]/[0.06] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--color-ink-muted)]">
                        Pro
                      </span>
                    ) : null}
                  </div>
                  <h3 className="mt-4 text-base font-bold text-[var(--color-ink)]">{feature.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-ink-muted)]">
                    {feature.detail}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Comparison */}
        <Reveal className="mt-16">
          <div className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-[var(--shadow-apple-md)]">
            {/* Header — desktop only; mobile uses inline labels per cell */}
            <div className="hidden gap-2 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-7 py-4 text-sm font-bold sm:grid sm:grid-cols-[1.2fr_1fr_1fr]">
              <span className="text-[var(--color-ink-muted)]">How we compare</span>
              <span className="text-[var(--color-accent)]">AnyExamEasy</span>
              <span className="text-[var(--color-ink-muted)]">UWorld</span>
            </div>
            <ul className="divide-y divide-[var(--color-border)] sm:divide-y-0">
              {UWORLD_COMPARE_ROWS.map((row, i) => (
                <li
                  key={row.label}
                  className={`grid grid-cols-1 gap-x-2 gap-y-2 px-5 py-4 text-sm sm:grid-cols-[1.2fr_1fr_1fr] sm:px-7 ${
                    i % 2 === 1 ? "sm:bg-[var(--color-surface)]/40" : ""
                  }`}
                >
                  <span className="font-bold text-[var(--color-ink)] sm:font-semibold">
                    {row.label}
                  </span>
                  <span className="flex items-start gap-1.5 text-[var(--color-ink)]">
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-accent)]"
                      aria-hidden
                    />
                    <span>
                      <span className="font-semibold text-[var(--color-accent)] sm:hidden">
                        AnyExamEasy:{" "}
                      </span>
                      {row.us}
                    </span>
                  </span>
                  <span className="flex items-start gap-1.5 text-[var(--color-ink-muted)]">
                    <Minus className="mt-0.5 h-4 w-4 shrink-0 opacity-50" aria-hidden />
                    <span>
                      <span className="font-semibold sm:hidden">UWorld: </span>
                      {row.them}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-3 text-center text-xs text-[var(--color-ink-muted)]">
            Comparison reflects publicly advertised UWorld per-exam pricing and feature scope;
            UWorld is a trademark of its respective owner and is not affiliated with AnyExamEasy.
          </p>
        </Reveal>

        {/* Social proof */}
        <div className="mt-16">
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {LANDING_SOCIAL_PROOF.map((stat) => (
              <li
                key={stat.label}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5 text-center"
              >
                <p className="text-2xl font-bold text-[var(--color-ink)]">{stat.value}</p>
                <p className="mt-1 text-xs font-semibold text-[var(--color-ink)]">{stat.label}</p>
                <p className="mt-1 text-[11px] leading-snug text-[var(--color-ink-muted)]">
                  {stat.detail}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.05}>
                <figure className="flex h-full flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-apple-sm)]">
                  <figcaption className="flex items-center gap-3">
                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
                      style={{ background: t.avatarGradient }}
                      aria-hidden
                    >
                      {t.initials}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-[var(--color-ink)]">{t.name}</p>
                      <p className="text-xs text-[var(--color-ink-muted)]">{t.exam}</p>
                    </div>
                  </figcaption>
                  <p className="mt-3 text-xs font-bold uppercase tracking-wide text-[var(--color-accent)]">
                    {t.outcome}
                  </p>
                  <blockquote className="mt-2 text-sm leading-relaxed text-[var(--color-ink)]">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                </figure>
              </Reveal>
            ))}
          </div>
          <p className="mt-4 text-center text-[11px] text-[var(--color-ink-muted)]">
            Individual results vary — illustrative student feedback; we do not guarantee licensure
            outcomes.
          </p>
        </div>
      </div>
    </section>
  );
}
