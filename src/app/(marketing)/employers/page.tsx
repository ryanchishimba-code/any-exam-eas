import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  GraduationCap,
  Layers,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react";
import { ROUTES } from "@/lib/routes";
import {
  LANDING_TRIAL_HREF,
  PLATFORM_EXAM_LIST,
  PLATFORM_EXAM_LIST_MIDDOT,
} from "@/lib/landing/content";
import { formatMonthlyPrice, formatTrialLabel, MARKETING_DISCLAIMER } from "@/lib/site";
import { LEGAL_ENTITY } from "@/lib/legal";

export const metadata: Metadata = {
  title: "For Employers & Programs | Any Exam Easy",
  description:
    "Equip your nursing, medical, PA, NP, and pharmacy candidates with premium board prep for six licensing exams under one affordable plan. Readiness analytics, one bill, fast onboarding.",
  alternates: { canonical: "/employers" },
};

const VALUE_PROPS = [
  {
    icon: Layers,
    title: "Six boards, one subscription",
    detail: `${PLATFORM_EXAM_LIST} — every candidate gets the right exam without separate per-board purchases.`,
  },
  {
    icon: Wallet,
    title: "A fraction of per-exam pricing",
    detail: `Pro at ${formatMonthlyPrice("pro")}/seat per month vs. $200–400+ per exam elsewhere — predictable budgeting for cohorts of any size.`,
  },
  {
    icon: BarChart3,
    title: "Readiness you can see",
    detail:
      "Practice-progress analytics and weak-area signals help your faculty target support before test day.",
  },
  {
    icon: ShieldCheck,
    title: "QA-gated content",
    detail:
      "Clinical vignettes with teachable rationales are reviewed before they reach learners — quality you can stand behind.",
  },
] as const;

const AUDIENCES = [
  { icon: GraduationCap, label: "Nursing schools & NCLEX programs" },
  { icon: Building2, label: "Residency & medical education" },
  { icon: Users, label: "PA & NP programs" },
  { icon: Layers, label: "Pharmacy schools (NAPLEX)" },
  { icon: ShieldCheck, label: "Hospitals & health systems" },
  { icon: BarChart3, label: "Workforce & upskilling teams" },
] as const;

const STEPS = [
  {
    step: "01",
    title: "Tell us your cohort",
    detail: "Share your exams, seat count, and timeline — we'll recommend the right plan.",
  },
  {
    step: "02",
    title: "Onboard in minutes",
    detail: "Invite candidates by email. They pick their board and start immediately — no setup.",
  },
  {
    step: "03",
    title: "Track readiness",
    detail: "Monitor engagement and weak areas so faculty can step in where it matters.",
  },
] as const;

export default function EmployersPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Hero */}
      <section className="relative overflow-hidden pt-[var(--page-top)]">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[360px] bg-[radial-gradient(60%_60%_at_50%_0%,color-mix(in_srgb,var(--color-accent)_12%,transparent),transparent)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-3xl px-6 pt-10 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-accent)]">
            For employers &amp; programs
          </p>
          <h1 className="mt-3 text-balance text-4xl font-bold tracking-tight text-[var(--color-ink)] sm:text-5xl">
            Get your whole cohort board-ready — on one plan.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-balance text-lg leading-relaxed text-[var(--color-ink-muted)]">
            Premium prep for {PLATFORM_EXAM_LIST_MIDDOT}, with readiness analytics and one simple
            bill. Built for schools, residency programs, and health systems.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={ROUTES.feedback}
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] px-7 text-sm font-semibold text-white shadow-[var(--shadow-apple-btn)] transition hover:shadow-[var(--shadow-apple-btn-hover)]"
            >
              Talk to our team
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
            <Link
              href={LANDING_TRIAL_HREF}
              className="inline-flex h-12 items-center justify-center rounded-full border border-[var(--color-border)] px-6 text-sm font-semibold text-[var(--color-ink)] transition hover:bg-[var(--color-surface)]"
            >
              Try it free first
            </Link>
          </div>
          <p className="mt-4 text-xs font-medium text-[var(--color-ink-muted)]">
            {formatTrialLabel()} for evaluation · volume pricing available · cancel anytime
          </p>
        </div>
      </section>

      {/* Value props */}
      <section className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <div className="grid gap-5 sm:grid-cols-2">
          {VALUE_PROPS.map((vp) => {
            const Icon = vp.icon;
            return (
              <div
                key={vp.title}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-apple-sm)]"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-accent)]/10">
                  <Icon className="h-5 w-5 text-[var(--color-accent)]" strokeWidth={1.75} aria-hidden />
                </span>
                <h2 className="mt-4 text-lg font-bold text-[var(--color-ink)]">{vp.title}</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-ink-muted)]">
                  {vp.detail}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Who it's for */}
      <section className="bg-[var(--color-surface)] py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[var(--color-ink)] sm:text-4xl">
            Built for the programs that train clinicians
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--color-ink-muted)]">
            One platform that scales across disciplines — so you can standardize prep instead of
            stitching together per-exam tools.
          </p>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {AUDIENCES.map((a) => {
              const Icon = a.icon;
              return (
                <li
                  key={a.label}
                  className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5 text-left"
                >
                  <Icon className="h-5 w-5 shrink-0 text-[var(--color-accent)]" strokeWidth={1.75} aria-hidden />
                  <span className="text-sm font-semibold text-[var(--color-ink)]">{a.label}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-accent)]">
            How it works
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--color-ink)] sm:text-4xl">
            Up and running this week
          </h2>
        </div>
        <ol className="mt-10 grid gap-5 md:grid-cols-3">
          {STEPS.map((s) => (
            <li
              key={s.step}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6"
            >
              <span className="text-sm font-bold text-[var(--color-accent)]">{s.step}</span>
              <h3 className="mt-2 text-lg font-bold text-[var(--color-ink)]">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-ink-muted)]">{s.detail}</p>
            </li>
          ))}
        </ol>

        <ul className="mx-auto mt-10 flex max-w-2xl flex-col gap-2.5">
          {[
            "Centralized billing — one invoice for your whole cohort",
            "Candidates choose any of the six boards at no extra cost",
            "No long-term lock-in — adjust seats as cohorts change",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm text-[var(--color-ink)]">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-accent)]" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Final CTA */}
      <section className="bg-[var(--color-surface)] py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[var(--color-ink)] sm:text-4xl">
            Let&apos;s build your cohort&apos;s prep plan
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-[var(--color-ink-muted)]">
            Tell us about your program and we&apos;ll put together volume pricing and an onboarding
            plan that fits.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={ROUTES.feedback}
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] px-7 text-sm font-semibold text-white shadow-[var(--shadow-apple-btn)] transition hover:shadow-[var(--shadow-apple-btn-hover)]"
            >
              Talk to our team
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
            <Link
              href={ROUTES.pricing}
              className="inline-flex h-12 items-center justify-center rounded-full border border-[var(--color-border)] px-6 text-sm font-semibold text-[var(--color-ink)] transition hover:bg-[var(--color-surface-elevated)]"
            >
              View pricing
            </Link>
          </div>
          <p className="mx-auto mt-8 max-w-2xl text-xs leading-relaxed text-[var(--color-ink-muted)]">
            {MARKETING_DISCLAIMER} {LEGAL_ENTITY.productName} is a product of{" "}
            {LEGAL_ENTITY.companyName}.
          </p>
        </div>
      </section>
    </div>
  );
}
