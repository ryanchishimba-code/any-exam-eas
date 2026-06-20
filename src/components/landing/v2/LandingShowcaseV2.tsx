"use client";

/**
 * LandingShowcaseV2 — "see the product" section.
 *
 * Everything is rendered in-code (no external screenshot assets) so it stays
 * crisp in light/dark mode and never ships a broken image. Four proofs:
 *  1. The core question + teachable-rationale experience (browser-framed)
 *  2. Progress analytics with weak-area targeting
 *  3. A real Top-503 drug card
 *  4. The Anatomy Explorer
 */

import type { ReactNode } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BarChart3,
  BookOpen,
  Check,
  HeartPulse,
  Pill,
  Scan,
  Sparkles,
} from "lucide-react";
import { Reveal } from "@/components/landing/v2/Reveal";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

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

/** The core question + rationale experience. */
function QuestionMockup() {
  const options = [
    { text: "Obtain blood cultures and start broad-spectrum antibiotics", correct: true },
    { text: "Apply a warm compress to the central line site", correct: false },
    { text: "Encourage oral fluids and reassess in 4 hours", correct: false },
    { text: "Document and continue routine monitoring", correct: false },
  ];
  return (
    <div className="grid gap-0 lg:grid-cols-[1.4fr_1fr]">
      {/* Question */}
      <div className="p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[var(--color-accent)]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[var(--color-accent)]">
            NCLEX-RN · Vignette
          </span>
          <span className="text-[11px] font-medium text-[var(--color-ink-muted)]">Item 24 / 75</span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink)]">
          A client with a tunneled central line has a temperature of 38.9&deg;C and an absolute
          neutrophil count of 320/mm&sup3;. Which action should the nurse take{" "}
          <span className="font-semibold">first</span>?
        </p>
        <ul className="mt-4 space-y-2">
          {options.map((opt, i) => (
            <li
              key={opt.text}
              className={cn(
                "flex items-start gap-2.5 rounded-xl border p-3 text-sm",
                opt.correct
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)]/5 text-[var(--color-ink)]"
                  : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink-muted)]"
              )}
            >
              <span
                className={cn(
                  "grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[10px] font-bold",
                  opt.correct
                    ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                    : "border-[var(--color-border)] text-[var(--color-ink-muted)]"
                )}
                aria-hidden
              >
                {opt.correct ? <Check className="h-3 w-3" strokeWidth={3} /> : String.fromCharCode(65 + i)}
              </span>
              <span>{opt.text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Rationale rail */}
      <div className="border-t border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:border-l sm:border-t-0 sm:p-6">
        <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[var(--color-accent)]">
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          Why it&apos;s correct
        </p>
        <p className="mt-2.5 text-sm leading-relaxed text-[var(--color-ink)]">
          Febrile neutropenia with a central line is an oncologic emergency. Cultures plus empiric
          broad-spectrum antibiotics within the hour reduce mortality — comfort measures and
          watchful waiting delay life-saving treatment.
        </p>
        <div className="mt-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-3">
          <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--color-ink-muted)]">
            Linked review
          </p>
          <p className="mt-1 text-[13px] font-semibold text-[var(--color-ink)]">
            Deep Dive: Sepsis &amp; neutropenic fever &rarr;
          </p>
        </div>
      </div>
    </div>
  );
}

/** Progress analytics with weak-area targeting. */
function AnalyticsMockup() {
  const topics = [
    { label: "Cardiology", value: 84, tone: "good" },
    { label: "Pharmacology", value: 61, tone: "mid" },
    { label: "Acid–base", value: 38, tone: "weak" },
  ] as const;
  const toneColor: Record<string, string> = {
    good: "var(--color-accent)",
    mid: "#f59e0b",
    weak: "#ef4444",
  };
  return (
    <div className="p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-[var(--color-ink)]">Practice progress</p>
        <span className="rounded-full bg-[var(--color-surface)] px-2 py-0.5 text-[10px] font-semibold text-[var(--color-ink-muted)]">
          Last 30 days
        </span>
      </div>
      <div className="mt-4 flex items-end gap-1.5" aria-hidden>
        {[40, 52, 48, 64, 58, 72, 66, 80, 74, 88].map((h, i) => (
          <span
            key={i}
            className="flex-1 rounded-t-md bg-[var(--color-accent)]/65"
            style={{ height: `${h * 0.9}px` }}
          />
        ))}
      </div>
      <p className="mt-4 text-[11px] font-bold uppercase tracking-wide text-[var(--color-ink-muted)]">
        Weak areas to target
      </p>
      <ul className="mt-2 space-y-2">
        {topics.map((t) => (
          <li key={t.label} className="flex items-center gap-3 text-sm">
            <span className="w-28 shrink-0 text-[var(--color-ink)]">{t.label}</span>
            <span className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--color-surface)]">
              <span
                className="block h-full rounded-full"
                style={{ width: `${t.value}%`, background: toneColor[t.tone] }}
              />
            </span>
            <span className="w-9 shrink-0 text-right text-xs font-semibold text-[var(--color-ink-muted)]">
              {t.value}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DrugCard() {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5 shadow-[var(--shadow-apple-md)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-apple-lg)]">
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
      <dl className="mt-4 space-y-2.5 text-sm">
        <div>
          <dt className="text-[11px] font-bold uppercase tracking-wide text-[var(--color-ink-muted)]">
            Mechanism
          </dt>
          <dd className="text-[var(--color-ink)]">
            Inhibits HMG-CoA reductase &rarr; &darr; hepatic cholesterol synthesis, upregulates LDL
            receptors &rarr; &darr; LDL-C.
          </dd>
        </div>
        <div>
          <dt className="text-[11px] font-bold uppercase tracking-wide text-[var(--color-ink-muted)]">
            Key adverse effects
          </dt>
          <dd className="text-[var(--color-ink)]">
            Myalgia/myopathy (rare rhabdomyolysis), &uarr; transaminases, new-onset diabetes.
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
        Generic · brand · MOA · adverse effects — shared across nursing, medical, PA &amp; pharmacy
        prep.
      </p>
    </div>
  );
}

function AnatomyCard() {
  const structures = ["Right atrium", "Left ventricle", "Aortic valve", "LAD", "SA node", "Pericardium"];
  const modes = [
    { icon: Activity, label: "3D Atlas" },
    { icon: Scan, label: "CT Mode" },
    { icon: BookOpen, label: "Guided Tours" },
  ];
  return (
    <div className="flex h-full flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5 shadow-[var(--shadow-apple-md)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-apple-lg)]">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10">
            <HeartPulse className="h-5 w-5 text-rose-500" aria-hidden />
          </span>
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-accent)]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--color-accent)]">
              <Activity className="h-3 w-3" aria-hidden />
              Anatomy Explorer
            </span>
            <h4 className="mt-1 text-lg font-bold text-[var(--color-ink)]">Heart — Cardiovascular</h4>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-teal-600 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
          Unique feature
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5" aria-label="Available modes">
        {modes.map(({ icon: Icon, label }) => (
          <span
            key={label}
            className="inline-flex items-center gap-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1 text-[10px] font-semibold text-[var(--color-ink-muted)]"
          >
            <Icon className="h-3 w-3" aria-hidden />
            {label}
          </span>
        ))}
      </div>

      <ul className="mt-3 flex flex-wrap gap-1.5">
        {structures.map((s) => (
          <li
            key={s}
            className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1 text-[11px] font-medium text-[var(--color-ink)]"
          >
            {s}
          </li>
        ))}
      </ul>

      <div className="mt-3 rounded-xl border border-rose-100 bg-rose-50/60 p-3 dark:border-rose-900/30 dark:bg-rose-950/20">
        <p className="text-[10px] font-bold uppercase tracking-wide text-rose-700 dark:text-rose-400">
          Clinical pearl — LAD
        </p>
        <p className="mt-1 text-[13px] leading-relaxed text-[var(--color-ink)]">
          <span className="font-semibold">LAD occlusion — anterior MI (V1–V4).</span> The
          &ldquo;widow-maker&rdquo; supplies the anterior LV and septum — tap to open the full
          coronary tree in 3D.
        </p>
      </div>

      <p className="mt-auto pt-3 text-[11px] font-medium text-[var(--color-ink-muted)]">
        32 structures · 9 systems · CT Atlas · guided tours · drug &amp; procedure links
      </p>
    </div>
  );
}

export function LandingShowcaseV2() {
  return (
    <section
      id="showcase"
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
            A calm, focused workspace built to make hard prep feel simple.
          </h2>
          <p className="mt-4 text-lg text-[var(--color-ink-muted)]">
            Practice, analytics, and a full reference hub — designed to cut study overwhelm and
            point you at the next right thing.
          </p>
        </div>

        {/* Featured question experience */}
        <Reveal className="relative mt-12">
          <BrowserFrame label="anyexameasy.com/question-bank" className="mx-auto max-w-4xl">
            <QuestionMockup />
          </BrowserFrame>
          <div className="pointer-events-none absolute -bottom-4 left-1/2 hidden -translate-x-1/2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 py-2 text-sm font-semibold text-[var(--color-ink)] shadow-[var(--shadow-apple-md)] sm:block">
            Teachable rationales — not template-swapped distractors
          </div>
        </Reveal>

        {/* Analytics + caption */}
        <div className="mt-16 grid items-center gap-8 lg:grid-cols-2">
          <Reveal>
            <BrowserFrame label="anyexameasy.com/analytics">
              <AnalyticsMockup />
            </BrowserFrame>
          </Reveal>
          <Reveal delay={0.05}>
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-accent)]/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[var(--color-accent)]">
                <BarChart3 className="h-3.5 w-3.5" aria-hidden />
                Analytics
              </span>
              <h3 className="mt-3 text-2xl font-bold tracking-tight text-[var(--color-ink)]">
                Study where the points actually are.
              </h3>
              <p className="mt-3 text-[var(--color-ink-muted)]">
                Weak-area targeting and trend lines turn raw practice into a plan. Your Roadmap
                reshuffles around the topics dragging your score — so no session is wasted.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-[var(--color-ink)]">
                {[
                  "Per-topic mastery with weak-area flags",
                  "Readiness trends across every block",
                  "One tap from a weak topic to a focused drill",
                ].map((line) => (
                  <li key={line} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-accent)]" aria-hidden />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        {/* Reference hub proofs */}
        <div className="mt-16">
          <div className="mx-auto max-w-2xl text-center">
            <h3 className="text-2xl font-bold tracking-tight text-[var(--color-ink)]">
              A reference hub that memorizes with you
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
