"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { FeatureShortcuts } from "@/components/dashboard/FeatureShortcuts";
import { ReadinessRing } from "@/components/ui/ReadinessRing";
import { StreakBadge } from "@/components/ui/StreakBadge";
import type { StudentDashboardData } from "@/lib/learning/student-dashboard";
import { firstName } from "@/lib/client/returning-user";

export function SubscriberHome() {
  const { data: session } = useSession();
  const [dashboard, setDashboard] = useState<StudentDashboardData | null>(null);

  useEffect(() => {
    fetch("/api/learning/dashboard")
      .then((r) => r.json())
      .then((d) => setDashboard(d.dashboard ?? null))
      .catch(() => {});
  }, []);

  const headline = dashboard?.headline;
  const name = session?.user?.name ? firstName(session.user.name) : null;

  return (
    <section className="aee-subscriber-home" aria-labelledby="subscriber-home-heading">
      <div className="mx-auto max-w-[1140px] px-5 py-14 sm:px-6 sm:py-16">
        <div className="aee-subscriber-home-hero">
          <div className="max-w-2xl">
            <p className="aee-subscriber-home-eyebrow">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Your study dashboard
            </p>
            <h2 id="subscriber-home-heading" className="aee-subscriber-home-title">
              {name ? `Ready to study, ${name}?` : "Ready to study?"}
            </h2>
            <p className="aee-subscriber-home-lead">
              Jump into board-style practice, drug mastery, and adaptive sessions — everything
              you need is one tap away.
            </p>
            <Link href="/dashboard" className="aee-subscriber-home-dashboard-link group">
              Open full dashboard
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          </div>

          {headline && (
            <div className="aee-subscriber-home-stats">
              {headline.studyStreakDays > 0 && <StreakBadge days={headline.studyStreakDays} />}
              <ReadinessRing score={headline.readinessScore} size={72} />
              {headline.overallAccuracy != null && (
                <p className="text-sm text-[var(--color-ink-muted)]">
                  <span className="font-semibold text-[var(--color-ink)]">
                    {headline.overallAccuracy}%
                  </span>{" "}
                  accuracy
                </p>
              )}
            </div>
          )}
        </div>

        <FeatureShortcuts variant="grid" className="mt-10" />
      </div>
    </section>
  );
}
