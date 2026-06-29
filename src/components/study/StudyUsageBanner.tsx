"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type StudyUsageResponse = {
  plan: "trial" | "free" | "pro" | "staff";
  usedToday: number;
  remainingToday: number | null;
  dailyLimit: number | null;
  usedTrialTotal: number | null;
  remainingTrialTotal: number | null;
  trialLimit: number | null;
  limits: {
    maxPerSession: number | null;
    maxTimedExamLength: number | null;
  };
};

type StudyUsageBannerProps = {
  className?: string;
  compact?: boolean;
};

/** Shown for trial and free-tier users — Pro subscribers have unlimited question access. */
export function StudyUsageBanner({ className, compact }: StudyUsageBannerProps) {
  const [usage, setUsage] = useState<StudyUsageResponse | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/study/usage")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data) setUsage(data as StudyUsageResponse);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (!usage || (usage.plan !== "trial" && usage.plan !== "free")) return null;

  const upgradeHref = "/pricing?upgrade=subscribe&reason=study_limits";
  const isFree = usage.plan === "free";
  const runningLow =
    (usage.remainingToday ?? 99) <= 5 ||
    (!isFree &&
      usage.remainingTrialTotal != null &&
      usage.remainingTrialTotal <= 20);

  if (compact) {
    return (
      <p className={cn("text-xs text-[var(--color-ink-muted)]", className)}>
        {isFree ? (
          <>
            Free plan: {usage.remainingToday ?? 0} questions left today
            {usage.limits.maxPerSession != null
              ? ` · max ${usage.limits.maxPerSession} per session`
              : ""}
            .{" "}
          </>
        ) : (
          <>
            Trial: {usage.remainingToday ?? 0} questions left today
            {usage.remainingTrialTotal != null
              ? ` · ${usage.remainingTrialTotal} total remaining`
              : ""}
            .{" "}
          </>
        )}
        <Link href={upgradeHref} className="text-[var(--color-accent)] hover:underline">
          {isFree ? "Upgrade to Pro" : "Subscribe for unlimited access"}
        </Link>
      </p>
    );
  }

  return (
    <div
      className={cn(
        "rounded-2xl border px-4 py-3 sm:px-5 sm:py-4",
        runningLow
          ? "border-amber-200 bg-amber-50"
          : "border-[var(--color-border)] bg-[var(--color-surface-elevated)]",
        className
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-sm font-medium text-[var(--color-ink)]">
            {runningLow ? (
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" aria-hidden />
            ) : (
              <Zap className="h-4 w-4 shrink-0 text-[var(--color-accent)]" aria-hidden />
            )}
            {isFree ? "Free plan — limited question access" : "Free trial — limited question access"}
          </p>
          <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
            {isFree ? (
              <>
                Up to {usage.dailyLimit ?? 10} questions/day · max{" "}
                {usage.limits.maxPerSession ?? 10} per session · short timed drills only. Upgrade to
                Pro for unlimited questions and advanced tools.
              </>
            ) : (
              <>
                Up to {usage.dailyLimit} questions/day · {usage.trialLimit} total during trial · max{" "}
                {usage.limits.maxPerSession ?? 15} per session · short timed drills only. Subscribe
                for unlimited questions; upgrade to Pro for advanced tools.
              </>
            )}
          </p>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-white/80 px-2.5 py-1 font-medium text-[var(--color-ink)]">
              Today: {usage.usedToday}/{usage.dailyLimit ?? "∞"}
            </span>
            {!isFree && usage.trialLimit != null && (
              <span className="rounded-full bg-white/80 px-2.5 py-1 font-medium text-[var(--color-ink)]">
                Trial total: {usage.usedTrialTotal}/{usage.trialLimit}
              </span>
            )}
          </div>
        </div>
        <Button href={upgradeHref} className="shrink-0 gap-1.5">
          <Sparkles className="h-4 w-4" aria-hidden />
          {isFree ? "Upgrade to Pro" : "Subscribe now"}
        </Button>
      </div>
    </div>
  );
}
