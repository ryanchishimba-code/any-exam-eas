"use client";

import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, LogOut, Map } from "lucide-react";
import { signOutAndCleanup } from "@/lib/client/sign-out";
import { AppearanceSettings } from "@/components/settings/AppearanceSettings";
import { BillingSettingsSection } from "@/components/settings/BillingSettingsSection";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import { ROUTES } from "@/lib/routes";
import { formatDisplayName } from "@/lib/display-name";
import { CONVERSION_EVENTS, trackConversion } from "@/lib/analytics";
import { requestTourReplay } from "@/lib/onboarding/tour-client";
import { SettingsExamOutcome } from "@/components/readiness/SettingsExamOutcome";
import type { ExamSlug } from "@/types/edtech";

export function SettingsClient({
  email,
  name,
  examSlug,
}: {
  email: string;
  name?: string | null;
  examSlug: ExamSlug | null;
}) {
  useTransition();
  const router = useRouter();

  function replayTour() {
    requestTourReplay();
    trackConversion(CONVERSION_EVENTS.TOUR_REPLAYED, { from: "settings" });
    router.push(ROUTES.dashboard);
  }

  return (
    <div className="space-y-6">
      <AppearanceSettings />

      <section className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-apple-sm)]">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">Account</h2>
        <p className="mt-3 text-lg font-semibold text-[var(--color-ink)]">
          {formatDisplayName(name) ?? "Student"}
        </p>
        <p className="text-sm text-[var(--color-ink-muted)]">{email}</p>
      </section>

      <section className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-apple-sm)]">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-[var(--color-accent)]" aria-hidden />
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
            Primary exam
          </h2>
        </div>
        <p className="mt-3 text-[var(--color-ink)]">
          {examSlug ? EXAM_CATALOG[examSlug].name : "No exam selected yet"}
        </p>
        <Link
          href={`${ROUTES.selectExam}?switch=1`}
          className="mt-4 inline-flex rounded-xl bg-[var(--color-accent)] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Change exam
        </Link>
      </section>

      <BillingSettingsSection />

      {examSlug ? <SettingsExamOutcome examSlug={examSlug} /> : null}

      <section
        id="help"
        className="scroll-mt-[calc(var(--nav-height)+1rem)] rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-apple-sm)]"
      >
        <div className="flex items-center gap-2">
          <Map className="h-5 w-5 text-[var(--color-accent)]" aria-hidden />
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
            Help
          </h2>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-muted)]">
          Walk through Today&apos;s block, the question bank, and readiness again.
        </p>
        <button
          type="button"
          onClick={replayTour}
          className="mt-4 inline-flex min-h-11 items-center rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm font-semibold text-[var(--color-ink)] transition hover:border-[var(--color-accent)]/40"
        >
          Replay tour
        </button>
      </section>

      <button
        type="button"
        onClick={() => void signOutAndCleanup({ callbackUrl: "/" })}
        className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-ink-muted)] transition hover:text-red-600"
      >
        <LogOut className="h-4 w-4" aria-hidden />
        Sign out
      </button>
    </div>
  );
}
