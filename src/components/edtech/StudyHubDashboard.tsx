import Link from "next/link";
import {
  BarChart3,
  BookOpen,
  Bone,
  Clock,
  Layers,
  Sparkles,
  ArrowRight,
  LayoutGrid,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FullExamModeButtons } from "@/components/exam/FullExamModeButtons";
import { ExamSwitcher } from "@/components/edtech/ExamSwitcher";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import { EXAM_SELECTION_THEMES } from "@/lib/edtech/exam-selection-theme";
import { ROUTES } from "@/lib/routes";
import {
  analyticsHref,
  anatomyHref,
  highYieldTopicsHref,
  questionBankHref,
  top500Href,
} from "@/lib/edtech/practice-links";
import type { ExamSlug, StudyHubQuickStats } from "@/types/edtech";
import { displayFirstName } from "@/lib/display-name";
import { cn } from "@/lib/utils";

type HubCard = {
  title: string;
  description: string;
  href?: string;
  cta?: string;
  icon: typeof BookOpen;
  badge?: string;
  examModes?: boolean;
};

export function StudyHubDashboard({
  examSlug,
  stats,
  userName,
}: {
  examSlug: ExamSlug;
  stats: StudyHubQuickStats;
  userName?: string | null;
}) {
  const exam = EXAM_CATALOG[examSlug];
  const theme = EXAM_SELECTION_THEMES[examSlug];
  const ExamIcon = theme.icon;

  const cards: HubCard[] = [
    {
      title: "High-Yield Topics",
      description: "15 condensed, exam-specific summaries with must-know facts and pearls.",
      href: highYieldTopicsHref(examSlug),
      cta: "Browse topics",
      icon: Sparkles,
      badge: "Top 15",
    },
    {
      title: "Question Bank",
      description: "Adaptive practice by topic. Filter, set count, and review rationales.",
      href: questionBankHref(examSlug),
      cta: "Start practicing",
      icon: BookOpen,
    },
    {
      title: "Anatomy Explorer",
      description: "Explore high-yield structures in 3D — rotate, click, and link to practice.",
      href: anatomyHref(examSlug),
      cta: "Open explorer",
      icon: Bone,
      badge: "3D",
    },
    {
      title: "Full Simulated Exam",
      description: `${exam.simulatedQuestionCount} questions · ${exam.simulatedDurationMin} min — test-day conditions.`,
      icon: Clock,
      examModes: true,
    },
    {
      title: "Analytics",
      description: "Accuracy trends, weak areas, and readiness over the last 30 days.",
      href: analyticsHref(),
      cta: "View analytics",
      icon: BarChart3,
    },
    {
      title: "Top 500",
      description: "High-yield drugs and must-know pharmacology for your board.",
      href: top500Href(examSlug),
      cta: "Open Top 500",
      icon: Layers,
    },
  ];

  return (
    <div className="space-y-8">
      <header className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 sm:p-8">
        <div
          className={cn(
            "pointer-events-none absolute inset-0 opacity-[0.07] bg-gradient-to-br dark:opacity-[0.12]",
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
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-teal-600 dark:text-teal-400">
                Study Hub
              </p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                {userName ? `Welcome back, ${displayFirstName(userName)}` : "Welcome back"}
              </h1>
              <p className="mt-2 max-w-xl text-slate-600 dark:text-slate-400">
                Preparing for{" "}
                <strong className="font-semibold text-slate-900 dark:text-white">{exam.name}</strong>
                — pick a mode below to keep momentum.
              </p>
            </div>
          </div>
          <ExamSwitcher currentExam={examSlug} />
        </div>

        <div className="relative mt-6 flex flex-wrap gap-3">
          <StatPill label="Today" value={String(stats.questionsToday)} highlight />
          <StatPill label="Questions (30d)" value={String(stats.questionsAnswered)} />
          <StatPill label="Accuracy" value={`${stats.accuracyPct}%`} />
          <StatPill label="Streak" value={`${stats.streakDays}d`} />
          <Link
            href={`${ROUTES.selectExam}?switch=1`}
            className="inline-flex items-center gap-1.5 self-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-teal-300 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
          >
            <LayoutGrid className="h-3.5 w-3.5" aria-hidden />
            Change exam
          </Link>
        </div>
        {stats.streakDays >= 3 ? (
          <p className="relative mt-4 text-sm font-medium text-teal-700 dark:text-teal-300">
            🔥 {stats.streakDays}-day streak — keep the momentum going!
          </p>
        ) : stats.questionsToday === 0 ? (
          <p className="relative mt-4 text-sm text-slate-600 dark:text-slate-400">
            Start with High-Yield Topics or a quick 10-question set today.
          </p>
        ) : null}
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <HubFeatureCard key={card.title} examSlug={examSlug} {...card} />
        ))}
      </div>
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
        "rounded-xl border px-4 py-2.5 shadow-sm backdrop-blur-sm",
        highlight
          ? "border-teal-200/80 bg-teal-50/90 dark:border-teal-800 dark:bg-teal-950/40"
          : "border-slate-200/80 bg-white/90 dark:border-slate-700 dark:bg-slate-900/90"
      )}
    >
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
      <p className="text-lg font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}

function HubFeatureCard({
  title,
  description,
  href,
  cta,
  icon: Icon,
  badge,
  examModes,
  examSlug,
}: HubCard & { examSlug: ExamSlug }) {
  if (examModes) {
    return (
      <Card className="h-full border-slate-200/80 dark:border-slate-800">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-accent)]/10">
              <Icon className="h-5 w-5 text-[var(--color-accent)]" aria-hidden />
            </div>
            {badge ? (
              <Badge className="shrink-0 bg-slate-100 text-slate-700">
                {badge}
              </Badge>
            ) : null}
          </div>
          <CardTitle className="mt-3">{title}</CardTitle>
          <CardDescription className="leading-relaxed">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <FullExamModeButtons examSlug={examSlug} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Link href={href!} className="group block h-full">
      <Card className="h-full border-slate-200/80 transition duration-200 hover:-translate-y-0.5 hover:border-teal-300/50 hover:shadow-lg hover:shadow-teal-50/50 dark:border-slate-800 dark:hover:border-teal-700/40 dark:hover:shadow-teal-950/20">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-accent)]/10">
              <Icon className="h-5 w-5 text-[var(--color-accent)]" aria-hidden />
            </div>
            {badge ? (
              <Badge className="shrink-0 bg-slate-100 text-slate-700">
                {badge}
              </Badge>
            ) : null}
          </div>
          <CardTitle className="mt-3">{title}</CardTitle>
          <CardDescription className="leading-relaxed">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-accent)] group-hover:gap-2 transition-all">
            {cta}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
