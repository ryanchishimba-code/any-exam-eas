"use client";

import Link from "next/link";
import { ArrowRight, ChevronRight, Flame } from "lucide-react";
import { firstName } from "@/lib/client/returning-user";
import { useSessionTone } from "@/lib/library/session-tone";
import { libUi } from "@/lib/library/library-ui";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  usmleStepLabel?: string;
  userName?: string | null;
  streakDays: number;
  readinessScore: number;
  cardCount: number;
  primaryHref: string;
};

/** Compact library header — greeting, context, stats, and one primary action. */
export function LibraryHeader({
  title,
  usmleStepLabel,
  userName,
  streakDays,
  readinessScore,
  cardCount,
  primaryHref,
}: Props) {
  const { copy } = useSessionTone();
  const name = firstName(userName);

  return (
    <header className="space-y-4 px-0.5">
      <nav aria-label="Breadcrumb" className={libUi.eyebrow}>
        <ol className="flex items-center gap-1">
          <li>
            <Link
              href={ROUTES.dashboard}
              className="text-[var(--color-ink-muted)] transition hover:text-[var(--color-accent)]"
            >
              Dashboard
            </Link>
          </li>
          <li aria-hidden>
            <ChevronRight className="inline h-3 w-3 opacity-40" />
          </li>
          <li className="text-[var(--color-ink)]">Library</li>
        </ol>
      </nav>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            {usmleStepLabel ? (
              <span className="rounded-full bg-[var(--color-accent)]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[var(--color-accent)]">
                {usmleStepLabel}
              </span>
            ) : null}
            {streakDays > 0 ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/8 px-2.5 py-0.5 text-[11px] font-medium text-amber-800">
                <Flame className="h-3 w-3 text-amber-600" aria-hidden />
                {copy.streakNote(streakDays)}
              </span>
            ) : null}
          </div>
          <h1 className={cn(libUi.title, "text-balance")}>{title}</h1>
          <p className={libUi.subtitle}>
            {name ? `Hey ${name} — ` : ""}
            {cardCount} memory {cardCount === 1 ? "card" : "cards"} organized by subject.
          </p>
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            <span className={libUi.statPill}>{readinessScore}% ready</span>
            <span className={libUi.statPill}>{cardCount} cards</span>
            {streakDays > 0 ? <span className={libUi.statPill}>{streakDays}d streak</span> : null}
          </div>
        </div>

        <Link href={primaryHref} className={cn(libUi.primaryBtn, "shrink-0 sm:min-w-[10rem]")}>
          {copy.quickStartLabel}
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </div>
    </header>
  );
}
