import Link from "next/link";
import {
  BarChart3,
  BookOpen,
  Clock,
  Layers,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExamSwitcher } from "@/components/edtech/ExamSwitcher";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import {
  analyticsHref,
  highYieldTopicsHref,
  questionBankHref,
  simulatedExamHref,
  top500Href,
} from "@/lib/edtech/practice-links";
import type { ExamSlug, StudyHubQuickStats } from "@/types/edtech";

type HubCard = {
  title: string;
  description: string;
  href: string;
  cta: string;
  icon: typeof BookOpen;
  badge?: string;
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
      title: "Full Simulated Exam",
      description: `${exam.simulatedQuestionCount} questions · ${exam.simulatedDurationMin} min — test-day conditions.`,
      href: simulatedExamHref(examSlug),
      cta: "Launch simulator",
      icon: Clock,
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
      <header className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Study Hub
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              {userName ? `Welcome back, ${userName.split(" ")[0]}` : "Welcome back"}
            </h1>
          </div>
          <ExamSwitcher currentExam={examSlug} />
        </div>

        <p className="max-w-2xl text-slate-600">
          You&apos;re preparing for <strong className="font-semibold text-slate-900">{exam.name}</strong>.
          Pick a study mode below — everything is tailored to your exam.
        </p>

        <div className="flex flex-wrap gap-3">
          <StatPill label="Questions (30d)" value={String(stats.questionsAnswered)} />
          <StatPill label="Accuracy" value={`${stats.accuracyPct}%`} />
          <StatPill label="Streak" value={`${stats.streakDays}d`} />
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <HubFeatureCard key={card.title} examSlug={examSlug} {...card} />
        ))}
      </div>
    </div>
  );
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white px-4 py-2.5 shadow-sm">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-lg font-semibold text-slate-900">{value}</p>
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
}: HubCard & { examSlug: ExamSlug }) {
  return (
    <Link href={href} className="group block h-full">
      <Card className="h-full border-slate-200/80 transition hover:-translate-y-0.5 hover:border-[var(--color-accent)]/30 hover:shadow-md">
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
