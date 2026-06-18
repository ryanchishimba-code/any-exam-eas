"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  ArrowRight,
  BookMarked,
  BookOpen,
  Clock,
  Sparkles,
} from "lucide-react";
import { AnatomyExplorerCard } from "@/components/study-hub/AnatomyExplorerCard";
import { Top500DrugsCard } from "@/components/study-hub/Top500DrugsCard";
import { firstName } from "@/lib/client/returning-user";
import { useAppPreferences } from "@/lib/client/use-app-preferences";
import {
  questionBankHref,
  libraryHref,
} from "@/lib/edtech/practice-links";
import { fullExamLaunchHref } from "@/lib/full-exam/config";
import { dbUi } from "@/lib/study/dashboard-ui";
import { STUDY_HUB_PATH } from "@/lib/study-hub/config";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

const QUICK_ACTIONS = [
  {
    title: "Full Exam",
    description: "Timed board simulation",
    href: (slug: ExamSlug) => fullExamLaunchHref(slug, { mode: "full" }),
    icon: Clock,
  },
  {
    title: "Question Bank",
    description: "Practice by topic",
    href: (slug: ExamSlug) => questionBankHref(slug),
    icon: BookOpen,
  },
  {
    title: "Library",
    description: "Brief & memory cards",
    href: (slug: ExamSlug) => libraryHref(slug),
    icon: BookMarked,
  },
] as const;

export function SubscriberHome() {
  const { data: session } = useSession();
  const { examSlug } = useAppPreferences();
  const name = session?.user?.name ? firstName(session.user.name) : null;

  return (
    <section className="bg-[var(--color-surface)] py-12 sm:py-16" aria-labelledby="subscriber-home-heading">
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        <div className="text-center">
          <p className={cn(dbUi.eyebrow, "inline-flex items-center gap-1.5")}>
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Your study hub
          </p>
          <h2 id="subscriber-home-heading" className="mt-2 text-[28px] font-semibold tracking-tight text-[var(--color-ink)] sm:text-[32px]">
            {name ? `Ready to study, ${name}?` : "Ready to study?"}
          </h2>
          <p className={cn(dbUi.subtitle, "mx-auto mt-2 max-w-lg")}>
            Question banks, reference hub, anatomy, and analytics — everything for your exam in one place.
          </p>
          <Link
            href={STUDY_HUB_PATH}
            className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-[var(--color-accent)] px-6 text-[15px] font-semibold text-white shadow-[var(--shadow-apple-btn)] transition hover:shadow-[var(--shadow-apple-btn-hover)]"
          >
            Open Study Hub
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <div className={cn(dbUi.pageShell, "mt-10")}>
          <div className={dbUi.panel}>
            <div className={dbUi.panelSection}>
              <h3 className={dbUi.sectionTitle}>Quick start</h3>
              <div className={cn(dbUi.chipRow, "mt-3")}>
                {QUICK_ACTIONS.map((action) => (
                  <Link
                    key={action.title}
                    href={action.href((examSlug ?? "nclex") as ExamSlug)}
                    className={dbUi.actionCard}
                  >
                    <action.icon className="h-5 w-5 text-[var(--color-accent)]" aria-hidden />
                    <p className="mt-2 text-[15px] font-semibold text-[var(--color-ink)]">
                      {action.title}
                    </p>
                    <p className="mt-0.5 text-[12px] text-[var(--color-ink-muted)]">
                      {action.description}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-[var(--color-accent)]">
                      Go
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div className={cn(dbUi.sectionDivider, dbUi.panelSection, "grid gap-3 sm:grid-cols-2")}>
              <AnatomyExplorerCard />
              <Top500DrugsCard />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
