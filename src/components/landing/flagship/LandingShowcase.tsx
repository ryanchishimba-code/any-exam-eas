"use client";

/**
 * LandingShowcase — "see the product" section.
 *
 * Device-framed real screenshots (dashboard, question bank, analytics) with
 * short benefit captions, plus two high-yield reference proofs rendered in-code
 * for crisp, dark-mode-safe fidelity: the Anatomy Explorer and a real Top-503
 * drug card.
 */

import type { ReactNode } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Activity, HeartPulse, Pill } from "lucide-react";
import { LandingVisualSlot } from "@/components/home/LandingVisualSlot";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

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

/** Browser-style chrome frame wrapping a screenshot. */
function BrowserFrame({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-[var(--shadow-apple-lg)]",
        className
      )}
    >
      <div className="flex items-center gap-2 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </span>
        <span className="ml-2 truncate text-[11px] font-medium text-[var(--color-ink-muted)]">
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}

const SUPPORTING = [
  {
    visualId: "screenshot-analytics",
    label: "anyexameasy.com/analytics",
    title: "Progress analytics",
    caption: "Weak-area targeting and readiness signals so you study where points are lost.",
  },
  {
    visualId: "hero-app-mockup",
    label: "anyexameasy.com/dashboard",
    title: "Daily study dashboard",
    caption: "Your Roadmap, streak, and what to do next — the calm home base for every session.",
  },
] as const;

/** A real Top-503 Drugs reference card. */
function DrugCard() {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5 shadow-[var(--shadow-apple-md)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-apple-lg)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-accent)]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--color-accent)]">
            <Pill className="h-3 w-3" aria-hidden />
            Top 503 Drugs
          </span>
          <h4 className="mt-2.5 text-lg font-bold text-[var(--color-ink)]">Atorvastatin</h4>
          <p className="text-sm text-[var(--color-ink-muted)]">
            Brand: Lipitor · HMG-CoA reductase inhibitor (statin)
          </p>
        </div>
      </div>

      <dl className="mt-4 space-y-2.5 text-sm">
        <div>
          <dt className="text-[11px] font-bold uppercase tracking-wide text-[var(--color-ink-muted)]">
            Mechanism
          </dt>
          <dd className="text-[var(--color-ink)]">
            Inhibits HMG-CoA reductase → ↓ hepatic cholesterol synthesis, upregulates LDL
            receptors → ↓ LDL-C.
          </dd>
        </div>
        <div>
          <dt className="text-[11px] font-bold uppercase tracking-wide text-[var(--color-ink-muted)]">
            Key adverse effects
          </dt>
          <dd className="text-[var(--color-ink)]">
            Myalgia/myopathy (rare rhabdomyolysis), ↑ transaminases, new-onset diabetes.
          </dd>
        </div>
        <div>
          <dt className="text-[11px] font-bold uppercase tracking-wide text-[var(--color-ink-muted)]">
            High-yield pearl
          </dt>
          <dd className="text-[var(--color-ink)]">
            Long half-life — dose any time of day. Avoid grapefruit juice (CYP3A4).
          </dd>
        </div>
      </dl>

      <p className="mt-auto pt-4 text-[11px] font-semibold text-[var(--color-ink-muted)]">
        Generic · brand · MOA · adverse effects — shared across nursing, medical, PA & pharmacy prep.
      </p>
    </div>
  );
}

/** Anatomy Explorer reference panel. */
function AnatomyCard() {
  const structures = [
    "Right atrium",
    "Right ventricle",
    "Left atrium",
    "Left ventricle",
    "Aortic valve",
    "Coronary arteries",
  ];
  return (
    <div className="flex h-full flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5 shadow-[var(--shadow-apple-md)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-apple-lg)]">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10">
          <HeartPulse className="h-5 w-5 text-rose-500" aria-hidden />
        </span>
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-accent)]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--color-accent)]">
            <Activity className="h-3 w-3" aria-hidden />
            Anatomy Explorer
          </span>
          <h4 className="mt-1.5 text-lg font-bold text-[var(--color-ink)]">Heart</h4>
        </div>
      </div>

      <p className="mt-3 text-sm text-[var(--color-ink-muted)]">
        Tap any structure for clinical pearls, guided tours, scrollable CT slices, and one-click
        jumps back to related practice.
      </p>

      <ul className="mt-4 flex flex-wrap gap-2">
        {structures.map((s) => (
          <li
            key={s}
            className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-xs font-medium text-[var(--color-ink)]"
          >
            {s}
          </li>
        ))}
      </ul>

      <div className="mt-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-sm">
        <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--color-ink-muted)]">
          Clinical pearl
        </p>
        <p className="mt-1 text-[var(--color-ink)]">
          LAD occlusion → anterior MI (ST elevation V1–V4). The “widow-maker” supplies the
          anterior LV and septum.
        </p>
      </div>
    </div>
  );
}

export function LandingShowcase() {
  return (
    <section
      id="product"
      className="scroll-mt-24 border-y border-[var(--color-border)] bg-[var(--color-surface)] py-20 sm:py-24"
      aria-labelledby="showcase-heading"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-accent)]">
            See it in action
          </p>
          <h2
            id="showcase-heading"
            className="mt-3 text-3xl font-bold tracking-tight text-[var(--color-ink)] sm:text-4xl"
          >
            Everything you need to prepare — in one calm, focused workspace.
          </h2>
          <p className="mt-4 text-lg text-[var(--color-ink-muted)]">
            A study dashboard, question bank, analytics, and a full reference hub — built to feel
            premium and reduce study overwhelm.
          </p>
        </div>

        {/* Featured question bank */}
        <Reveal className="relative mt-12">
          <BrowserFrame label="anyexameasy.com/question-bank" className="mx-auto max-w-4xl">
            <LandingVisualSlot
              visualId="screenshot-question-bank"
              fit="cover"
              className="aspect-[16/10] w-full"
            />
          </BrowserFrame>
          <div className="pointer-events-none absolute -bottom-4 left-1/2 hidden -translate-x-1/2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 py-2 text-sm font-semibold text-[var(--color-ink)] shadow-[var(--shadow-apple-md)] sm:block">
            Teachable rationales — not template-swapped distractors
          </div>
        </Reveal>

        {/* Supporting screenshots */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {SUPPORTING.map((item, i) => (
            <Reveal key={item.visualId} delay={i * 0.05}>
              <BrowserFrame label={item.label}>
                <LandingVisualSlot
                  visualId={item.visualId}
                  fit="cover"
                  className="aspect-[16/10] w-full"
                />
              </BrowserFrame>
              <h3 className="mt-4 text-base font-bold text-[var(--color-ink)]">{item.title}</h3>
              <p className="mt-1 text-sm text-[var(--color-ink-muted)]">{item.caption}</p>
            </Reveal>
          ))}
        </div>

        {/* Reference hub proofs */}
        <div className="mt-16">
          <div className="mx-auto max-w-2xl text-center">
            <h3 className="text-2xl font-bold tracking-tight text-[var(--color-ink)]">
              A reference hub that does the memorizing with you
            </h3>
            <p className="mt-3 text-[var(--color-ink-muted)]">
              High-yield drug cards and an interactive Anatomy Explorer — linked right from your
              practice.
            </p>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <Reveal>
              <DrugCard />
            </Reveal>
            <Reveal delay={0.05}>
              <AnatomyCard />
            </Reveal>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link
            href={ROUTES.resources}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-accent)] transition hover:gap-2.5"
          >
            Explore study resources
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
