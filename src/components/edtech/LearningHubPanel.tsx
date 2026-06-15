"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock, Target, Zap } from "lucide-react";
import type { DailyAssignmentPlan, DailyAssignmentTask } from "@/lib/edtech/learning-hub";
import {
  USMLE_LEARNING_STAGES,
  USMLE_TOPIC_MODULES,
  modulesForStage,
} from "@/lib/edtech/learning-hub";
import { highYieldTopicsHref, deepDiveTopicHref, highYieldTopicHref, practiceTopicHref } from "@/lib/edtech/practice-links";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

const TASK_ICONS: Record<DailyAssignmentTask["kind"], typeof BookOpen> = {
  review: BookOpen,
  practice: Target,
  "weak-area": Zap,
  "timed-block": Clock,
  reference: BookOpen,
};

export function LearningHubPanel({ examSlug }: { examSlug: ExamSlug }) {
  const [plan, setPlan] = useState<DailyAssignmentPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/learning/daily-assignment")
      .then((r) => r.json())
      .then((d) => setPlan(d.plan ?? null))
      .catch(() => setPlan(null))
      .finally(() => setLoading(false));
  }, [examSlug]);

  const clerkshipModules = examSlug === "usmle" ? modulesForStage("clerkship").slice(0, 4) : [];

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-indigo-600">
            Learning hub
          </p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-[var(--color-ink)]">
            {plan?.headline ?? "Your daily study plan"}
          </h2>
          <p className="mt-1 max-w-xl text-sm text-[var(--color-ink-muted)]">
            Curated paths: review module → practice vignettes → weak-area drill. Built for students
            preparing for boards.
          </p>
        </div>
        <Link
          href={highYieldTopicsHref(examSlug)}
          className="text-sm font-semibold text-[var(--color-accent)] hover:underline"
        >
          All topics →
        </Link>
      </div>

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-2xl border border-black/[0.06] bg-black/[0.03]"
            />
          ))}
        </div>
      ) : plan && plan.tasks.length > 0 ? (
        <div className="grid gap-3 lg:grid-cols-3">
          {plan.tasks.slice(0, 3).map((task, i) => (
            <TaskCard key={task.id} task={task} index={i} />
          ))}
        </div>
      ) : null}

      {examSlug === "usmle" && (
        <>
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-ink)]">Learning stages</h3>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {USMLE_LEARNING_STAGES.map((stage) => (
                <div
                  key={stage.id}
                  className="rounded-xl border border-black/[0.06] bg-white px-4 py-3"
                >
                  <p className="font-semibold text-[var(--color-ink)]">{stage.label}</p>
                  <p className="mt-0.5 text-xs text-[var(--color-ink-muted)]">{stage.audience}</p>
                  <p className="mt-2 text-xs leading-relaxed text-[var(--color-ink-muted)]">
                    {stage.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[var(--color-ink)]">Topic modules</h3>
            <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
              {USMLE_TOPIC_MODULES.length} modules · curated Qs + review where available
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {clerkshipModules.map((mod) => (
                <Link
                  key={mod.id}
                  href={
                    mod.reviewTopicSlug
                      ? deepDiveTopicHref("usmle", mod.reviewTopicSlug)
                      : highYieldTopicHref("usmle", mod.slug)
                  }
                  className="group rounded-xl border border-black/[0.06] bg-white px-4 py-3 transition hover:border-indigo-200 hover:shadow-sm"
                >
                  <p className="text-xs font-medium uppercase tracking-wide text-indigo-600">
                    {mod.system}
                  </p>
                  <p className="mt-1 font-semibold text-[var(--color-ink)] group-hover:text-indigo-700">
                    {mod.title}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs text-[var(--color-ink-muted)]">
                    {mod.overview}
                  </p>
                  <p className="mt-2 text-xs text-[var(--color-ink-muted)]">
                    ~{mod.estimatedMinutes} min · {mod.questions.reviewCount} Qs
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
}

function TaskCard({ task, index }: { task: DailyAssignmentTask; index: number }) {
  const Icon = TASK_ICONS[task.kind];
  return (
    <Link
      href={task.href}
      className={cn(
        "group flex h-full flex-col rounded-2xl border border-black/[0.06] bg-white p-4 transition",
        "hover:-translate-y-0.5 hover:border-indigo-200/80 hover:shadow-[var(--shadow-apple-sm)]"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
          <Icon className="h-4 w-4" aria-hidden />
        </div>
        <span className="text-xs font-medium text-[var(--color-ink-muted)]">
          Step {index + 1} · ~{task.estimatedMinutes}m
        </span>
      </div>
      <p className="mt-3 font-semibold text-[var(--color-ink)]">{task.title}</p>
      <p className="mt-1 flex-1 text-sm leading-relaxed text-[var(--color-ink-muted)]">
        {task.description}
      </p>
      <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-accent)] group-hover:gap-2 transition-all">
        Start
        <ArrowRight className="h-4 w-4" aria-hidden />
      </span>
    </Link>
  );
}
