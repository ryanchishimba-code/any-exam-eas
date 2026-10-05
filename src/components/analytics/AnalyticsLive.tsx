"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { StudentAnalyticsDashboard } from "@/components/analytics/StudentAnalyticsDashboard";
import { ReadinessProofPanel } from "@/components/dashboard/ReadinessProofPanel";
import { Skeleton } from "@/components/ui/skeleton";
import type { AnalyticsSnapshot } from "@/lib/learning/analytics-snapshot";
import { ROUTES } from "@/lib/routes";
import type { ExamSlug } from "@/types/edtech";

function AnalyticsSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading analytics">
      <div className="space-y-2">
        <Skeleton className="h-3 w-24 rounded-full" />
        <Skeleton className="h-9 w-48 max-w-full rounded-xl" />
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
      </div>
      <Skeleton className="mt-4 h-80 w-full rounded-[28px]" />
    </div>
  );
}

/**
 * The analytics document closes on the shell. This fills the same panels
 * the server used to await inside the stream.
 */
export function AnalyticsLive({ examSlug }: { examSlug: ExamSlug }) {
  const [snapshot, setSnapshot] = useState<AnalyticsSnapshot | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setSnapshot(null);
    setFailed(false);
    fetch(`/api/learning/analytics-snapshot?exam=${encodeURIComponent(examSlug)}`, {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("analytics");
        return (await res.json()) as AnalyticsSnapshot;
      })
      .then((data) => {
        if (!data?.dashboard || !data.profile) throw new Error("analytics");
        setSnapshot(data);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setFailed(true);
      });
    return () => controller.abort();
  }, [examSlug]);

  if (!snapshot) {
    return failed ? (
      <p className="text-[15px] text-[var(--color-ink-muted)]">
        Analytics is temporarily unavailable. Refresh the page to try again.
      </p>
    ) : (
      <AnalyticsSkeleton />
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:block sm:space-y-8">
      <div className="order-2 sm:order-none">
        <p className="mb-3 text-[14px]">
          <Link href={ROUTES.readiness} className="font-semibold text-[var(--color-accent)]">
            Readiness checks
          </Link>
        </p>
        <ReadinessProofPanel
          readiness={snapshot.readiness}
          domainsLabel={snapshot.domainsLabel}
          coverage={snapshot.coverage}
        />
      </div>
      <div className="order-1 sm:order-none">
        <StudentAnalyticsDashboard
          examSlug={snapshot.examSlug}
          examName={snapshot.examName}
          fieldId={snapshot.fieldId}
          openRemediation={snapshot.openRemediation}
          initialData={{ dashboard: snapshot.dashboard, profile: snapshot.profile }}
          formats={snapshot.formats}
        />
      </div>
    </div>
  );
}
