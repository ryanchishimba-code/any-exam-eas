"use client";

import Link from "next/link";
import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  BookOpen,
  Clock,
  Bone,
  HeartPulse,
  Map,
  Pill,
  Stethoscope,
  Zap,
} from "lucide-react";
import { ExamCard } from "@/components/exams/ExamCard";
import { getExamHub } from "@/lib/exams/catalog";
import { roadmapHref } from "@/lib/learning/roadmap-links";
import {
  PANCE_FEATURED_DRILLS,
  panceTaskPracticeHref,
} from "@/lib/exam-prep/pance/practice-focus";
import { practiceHref, ROUTES, type ExamRouteSlug } from "@/lib/routes";
import { cn } from "@/lib/utils";

const ICONS = {
  nclex: Activity,
  usmle: Stethoscope,
  naplex: Pill,
  pance: HeartPulse,
  "aanp-fnp": HeartPulse,
  "npte-pt": Bone,
} as const;

const ALL_EXAMS: ExamRouteSlug[] = ["nclex", "usmle", "naplex", "pance", "aanp-fnp", "npte-pt"];

type Props = { slug: ExamRouteSlug };

export function ExamLanding({ slug }: Props) {
  const hub = getExamHub(slug);

  useEffect(() => {
    void fetch("/api/user/exam-preference", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ examSlug: slug }),
    });
  }, [slug]);

  if (!hub) return null;

  const Icon = ICONS[slug];

  return (
    <div className="mx-auto max-w-5xl px-5 pb-20 pt-[var(--page-top)] sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <Link
          href={ROUTES.dashboard}
          className="text-sm font-medium text-[var(--color-ink-muted)] transition hover:text-[var(--color-accent)]"
        >
          ← Dashboard
        </Link>

        <div className="mt-6 flex flex-wrap items-start gap-4">
          <span
            className={cn(
              "inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br shadow-sm ring-1 ring-black/[0.04]",
              hub.accentClass
            )}
          >
            <Icon className="h-7 w-7 text-[var(--color-ink)]" strokeWidth={1.5} aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              Exam prep
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-4xl">
              {hub.title}
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--color-ink-muted)]">
              {hub.subtitle}
            </p>
            <p className="mt-2 text-sm font-medium text-[var(--color-ink-muted)]">{hub.questionBankLabel}</p>
          </div>
        </div>
      </motion.div>

      {slug === "pance" && (
        <section className="mt-10 aee-card p-6" aria-labelledby="pance-roadmap">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 id="pance-roadmap" className="text-lg font-semibold text-[var(--color-ink)]">
                NCCPA Exam Roadmap
              </h2>
              <p className="mt-1 max-w-xl text-sm text-[var(--color-ink-muted)]">
                Track readiness across 14 NCCPA knowledge areas and 8 task areas — cardiovascular,
                pulmonary, diagnosis, pharmacotherapy, and more.
              </p>
            </div>
            <Link
              href={roadmapHref("pance")}
              className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700"
            >
              <Map className="h-4 w-4" aria-hidden />
              Open roadmap
            </Link>
          </div>
        </section>
      )}

      {slug === "pance" && (
        <section className="mt-8" aria-labelledby="pance-task-drills">
          <h2
            id="pance-task-drills"
            className="text-sm font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]"
          >
            Task-area practice
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--color-ink-muted)]">
            Board-style vignettes filtered by NCCPA task — differential diagnosis, pharmacotherapy,
            and clinical intervention.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {PANCE_FEATURED_DRILLS.map((drill) => (
              <Link
                key={drill.id}
                href={panceTaskPracticeHref(drill.taskCategory, {
                  count: drill.count,
                  autostart: true,
                })}
                className="group flex h-full flex-col rounded-2xl border border-[var(--color-border)]/60 bg-[var(--color-surface-elevated)] p-4 shadow-[var(--shadow-apple-sm)] transition hover:-translate-y-0.5 hover:border-rose-200/80"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-rose-600">
                  {drill.count} questions
                </p>
                <h3 className="mt-2 font-semibold text-[var(--color-ink)] group-hover:text-rose-700">
                  {drill.title}
                </h3>
                <p className="mt-1 flex-1 text-sm leading-relaxed text-[var(--color-ink-muted)]">
                  {drill.subtitle}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-accent)]">
                  Start drill
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-10" aria-labelledby="practice-modes">
        <h2 id="practice-modes" className="text-sm font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
          Start practicing
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ModeTile
            icon={Zap}
            title="Adaptive practice"
            description="Personalized question mix based on your weak areas."
            href={practiceHref(slug, { mode: "bank" })}
          />
          <ModeTile
            icon={Clock}
            title="Timed simulation"
            description="Board-length session with per-question timer."
            href={practiceHref(slug, { mode: "timed" })}
          />
          <ModeTile
            icon={BookOpen}
            title="Deep dive modules"
            description="Textbook-style review tied to your question bank."
            href={`${ROUTES.highYieldTopics}?mode=deep`}
          />
        </div>
      </section>

      <section className="mt-12 border-t border-[var(--color-border)] pt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
          Other exams
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {ALL_EXAMS.filter((s) => s !== slug)
            .slice(0, 3)
            .map((s) => {
              const h = getExamHub(s)!;
              const OtherIcon = ICONS[s];
              return (
                <ExamCard
                  key={s}
                  href={`/exams/${s}`}
                  title={h.title}
                  description={h.subtitle}
                  stat={h.questionBankLabel}
                  icon={OtherIcon}
                  accentClass={h.accentClass}
                />
              );
            })}
        </div>
      </section>
    </div>
  );
}

function ModeTile({
  icon: Icon,
  title,
  description,
  href,
}: {
  icon: typeof Zap;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5 shadow-[var(--shadow-apple-sm)] transition hover:-translate-y-0.5 hover:border-indigo-200/80"
    >
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <h3 className="mt-4 font-semibold text-[var(--color-ink)] group-hover:text-indigo-700">
        {title}
      </h3>
      <p className="mt-1 flex-1 text-sm leading-relaxed text-[var(--color-ink-muted)]">{description}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-accent)]">
        Start
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
      </span>
    </Link>
  );
}
