"use client";

import Link from "next/link";
import { useTransition } from "react";
import { GraduationCap, MapPin, LogOut } from "lucide-react";
import { signOutAndCleanup } from "@/lib/client/sign-out";
import { MpjeStateSelect } from "@/components/study/MpjeStateSelect";
import { AppearanceSettings } from "@/components/settings/AppearanceSettings";
import { BillingSettingsSection } from "@/components/settings/BillingSettingsSection";
import { saveMpjePreferences } from "@/lib/edtech/actions";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import { ROUTES } from "@/lib/routes";
import type { ExamSlug } from "@/types/edtech";
import type { MpjeVariant } from "@/lib/mpje/config";

export function SettingsClient({
  email,
  name,
  examSlug,
  mpjeStateCode,
  mpjeVariant,
}: {
  email: string;
  name?: string | null;
  examSlug: ExamSlug | null;
  mpjeStateCode?: string;
  mpjeVariant?: MpjeVariant;
}) {
  const [pending, startTransition] = useTransition();

  function onMpjeStateChange(code: string) {
    startTransition(() => {
      void saveMpjePreferences({ stateCode: code, variant: mpjeVariant ?? "state" });
    });
  }

  return (
    <div className="space-y-6">
      <AppearanceSettings />

      <section className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-apple-sm)]">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">Account</h2>
        <p className="mt-3 text-lg font-semibold text-[var(--color-ink)]">
          {name ?? "Student"}
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
          className="mt-4 inline-flex rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700"
        >
          Change exam
        </Link>
      </section>

      {examSlug === "mpje" ? (
        <section className="rounded-3xl border border-violet-200/80 bg-gradient-to-br from-violet-50/80 to-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-apple-sm)] dark:border-violet-900/50 dark:from-violet-950/30 dark:to-[var(--color-surface-elevated)]">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-violet-600 dark:text-violet-400" aria-hidden />
            <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
              MPJE state
            </h2>
          </div>
          <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
            Your default jurisdiction for question bank and practice filters.
          </p>
          <div className="mt-4">
            <MpjeStateSelect
              value={mpjeStateCode ?? ""}
              onChange={onMpjeStateChange}
              disabled={pending}
            />
          </div>
        </section>
      ) : null}

      <BillingSettingsSection />

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
