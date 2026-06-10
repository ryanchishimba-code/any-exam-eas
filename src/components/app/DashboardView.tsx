"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  BookMarked,
  BookOpen,
  Bone,
  Clock,
  Layers,
  LayoutGrid,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FullExamModeButtons } from "@/components/exam/FullExamModeButtons";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import { EXAM_SELECTION_THEMES } from "@/lib/edtech/exam-selection-theme";
import {
  analyticsHref,
  anatomyHref,
  highYieldTopicsHref,
  questionBankHref,
  referenceHref,
  top500Href,
} from "@/lib/edtech/practice-links";
import { ROUTES } from "@/lib/routes";
import type { ExamSlug, StudyHubQuickStats } from "@/types/edtech";
import { StudyHubMpjePicker } from "@/components/study-hub/StudyHubMpjePicker";
import { cn } from "@/lib/utils";

type PrimaryCard = {
  title: string;
  description: string;
  href?: string;
  cta?: string;
  icon: typeof BookOpen;
  accent: string;
  examModes?: boolean;
};

export function DashboardView({
  examSlug,
  stats,
  userName,
  mpjeStateCode,
}: {
  examSlug: ExamSlug;
  stats: StudyHubQuickStats;
  userName?: string | null;
  mpjeStateCode?: string;
}) {
  const exam = EXAM_CATALOG[examSlug];
  const theme = EXAM_SELECTION_THEMES[examSlug];
  const ExamIcon = theme.icon;
  const firstName = userName?.split(" ")[0] ?? "there";

  const primaryCards: PrimaryCard[] = [
    {
      title: "Full Exam",
      description: "Start timed practice under real exam conditions with a live countdown.",
      icon: Clock,
      accent: "from-teal-500/15 to-cyan-600/10 border-teal-200/70",
      examModes: true,
    },
    {
      title: "Question Bank",
      description: "Browse adaptive questions by topic, set your count, and review rationales.",
      href: questionBankHref(examSlug),
      cta: "Browse & practice",
      icon: BookOpen,
      accent: "from-indigo-500/15 to-violet-600/10 border-indigo-200/70",
    },
    {
      title: "Analytics",
      description: "Track accuracy, weak areas, and practice trends over the last 30 days.",
      href: analyticsHref(),
      cta: "View insights",
      icon: BarChart3,
      accent: "from-emerald-500/15 to-teal-600/10 border-emerald-200/70",
    },
  ];

  const secondaryCards = [
    {
      title: "Memory Cards",
      description: "Equations, pearls, and tables — then deep dive into full modules.",
      href: referenceHref(examSlug),
      icon: BookMarked,
    },
    {
      title: "Anatomy Explorer",
      description: "Interactive 3D structures with clinical pearls and linked practice.",
      href: anatomyHref(examSlug),
      icon: Bone,
    },
    {
      title: "High-Yield Topics",
      description: "Textbook review modules and condensed summaries.",
      href: highYieldTopicsHref(examSlug),
      icon: Sparkles,
    },
    {
      title: "Top 500",
      description: "High-yield drugs for your board.",
      href: top500Href(examSlug),
      icon: Layers,
    },
  ];

  return (
    <div className="space-y-8">
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative overflow-hidden rounded-3xl border border-black/[0.06] bg-white p-6 shadow-[var(--shadow-apple-sm)] sm:p-8"
      >
        <div
          className={cn(
            "pointer-events-none absolute inset-0 opacity-[0.08] bg-gradient-to-br",
            theme.gradient
          )}
          aria-hidden
        />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg",
                theme.gradient
              )}
            >
              <ExamIcon className="h-7 w-7 text-white" aria-hidden />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-teal-600">
                Dashboard
              </p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-[var(--color-ink)] sm:text-4xl">
                Welcome back, {firstName}
              </h1>
              <p className="mt-2 text-[var(--color-ink-muted)]">
                <span className="font-semibold text-[var(--color-ink)]">{exam.name}</span>
                {examSlug === "mpje" && mpjeStateCode ? (
                  <> · {mpjeStateCode} jurisprudence</>
                ) : null}
              </p>
            </div>
          </div>
          <Link
            href={`${ROUTES.selectExam}?switch=1`}
            className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--color-ink-muted)] transition hover:border-teal-300 hover:text-teal-700"
          >
            <LayoutGrid className="h-3.5 w-3.5" aria-hidden />
            Switch exam
          </Link>
        </div>

        <div className="relative mt-6 flex flex-wrap gap-3">
          <StatPill label="Today" value={String(stats.questionsToday)} highlight />
          <StatPill label="30-day questions" value={String(stats.questionsAnswered)} />
          <StatPill label="Accuracy" value={`${stats.accuracyPct}%`} />
          <StatPill label="Streak" value={`${stats.streakDays}d`} />
        </div>
      </motion.header>

      {examSlug === "mpje" ? (
        <StudyHubMpjePicker initialStateCode={mpjeStateCode} persistPreference />
      ) : null}

      <section className="grid gap-5 lg:grid-cols-3">
        {primaryCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06, duration: 0.35 }}
          >
            {card.examModes ? (
              <Card
                className={cn(
                  "h-full border bg-gradient-to-br",
                  card.accent
                )}
              >
                <CardHeader className="pb-2">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/80 shadow-sm">
                    <card.icon className="h-5 w-5 text-[var(--color-accent)]" aria-hidden />
                  </div>
                  <CardTitle className="mt-4 text-xl">{card.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {card.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FullExamModeButtons examSlug={examSlug} />
                </CardContent>
              </Card>
            ) : (
              <Link href={card.href!} className="group block h-full">
                <Card
                  className={cn(
                    "h-full border bg-gradient-to-br transition duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-apple-md)]",
                    card.accent
                  )}
                >
                  <CardHeader className="pb-2">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/80 shadow-sm">
                      <card.icon className="h-5 w-5 text-[var(--color-accent)]" aria-hidden />
                    </div>
                    <CardTitle className="mt-4 text-xl">{card.title}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {card.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-accent)] group-hover:gap-2 transition-all">
                      {card.cta}
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            )}
          </motion.div>
        ))}
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
          Also explore
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {secondaryCards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="flex items-center gap-3 rounded-2xl border border-black/[0.06] bg-white px-4 py-4 transition hover:border-[var(--color-accent)]/30 hover:shadow-[var(--shadow-apple-sm)]"
            >
              <card.icon className="h-5 w-5 shrink-0 text-[var(--color-accent)]" aria-hidden />
              <div>
                <p className="font-semibold text-[var(--color-ink)]">{card.title}</p>
                <p className="text-sm text-[var(--color-ink-muted)]">{card.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatPill({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border px-4 py-2.5 shadow-sm",
        highlight
          ? "border-teal-200/80 bg-teal-50/90"
          : "border-black/[0.06] bg-white/90"
      )}
    >
      <p className="text-xs font-medium text-[var(--color-ink-muted)]">{label}</p>
      <p className="text-lg font-bold text-[var(--color-ink)]">{value}</p>
    </div>
  );
}
