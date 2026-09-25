"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExamOutcomeForm, type OutcomeChoice } from "@/components/readiness/ExamOutcomeForm";
import { dbUi } from "@/lib/study/dashboard-ui";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { ExamSlug } from "@/types/edtech";

type CardPayload = {
  mode: "outcome" | "resume" | "result" | "invite" | "quiet";
  length: number;
  hasStudyAccess: boolean;
  examDate: string | null;
  outcome: { result: string } | null;
  resume: { answered: number; total: number } | null;
  result: {
    overallLevel: string | null;
    overallLabel: string | null;
    summaryLine: string | null;
    retakeDue: boolean;
    daysUntilSuggest: number | null;
  } | null;
};

function CardShell({ children, busy = false }: { children: React.ReactNode; busy?: boolean }) {
  return (
    <section
      className={cn(dbUi.surface, "min-h-[168px] p-5 sm:p-6")}
      aria-busy={busy}
      data-readiness-card="true"
    >
      {children}
    </section>
  );
}

function CardSkeleton() {
  return (
    <CardShell busy>
      <div className="h-3 w-24 animate-pulse rounded-full bg-[var(--color-border)]/70" />
      <div className="mt-3 h-7 w-4/5 max-w-sm animate-pulse rounded-lg bg-[var(--color-border)]/60" />
      <div className="mt-3 h-4 w-full max-w-md animate-pulse rounded bg-[var(--color-border)]/50" />
      <div className="mt-5 h-11 w-40 animate-pulse rounded-xl bg-[var(--color-border)]/60" />
    </CardShell>
  );
}

async function postJson(url: string, body?: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body ?? {}),
    cache: "no-store",
  });
  const data = (await res.json().catch(() => ({}))) as { error?: string };
  if (!res.ok) throw new Error(data.error || "Something went wrong.");
  return data;
}

export function ReadinessDashboardCard({
  examSlug,
  examName,
  initial = null,
}: {
  examSlug: ExamSlug;
  examName: string;
  /** Fixture for the dev preview. Production leaves this empty and fetches. */
  initial?: CardPayload | null;
}) {
  const router = useRouter();
  const [card, setCard] = useState<CardPayload | null>(initial);
  const [failed, setFailed] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (initial) return;
    const controller = new AbortController();
    setCard(null);
    setFailed(false);
    fetch("/api/readiness", { cache: "no-store", signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error("unavailable");
        return (await res.json()) as CardPayload;
      })
      .then((payload) => {
        if (!controller.signal.aborted) setCard(payload);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        if (!controller.signal.aborted) setFailed(true);
      });
    return () => controller.abort();
  }, [examSlug, initial]);

  async function start(restart = false) {
    setPending(true);
    try {
      await postJson("/api/readiness/check", { restart });
      router.push(`${ROUTES.readiness}/check`);
    } catch (error) {
      setPending(false);
      setFailed(true);
      console.warn("[readiness] start", error);
    }
  }

  async function skip() {
    setPending(true);
    try {
      await postJson("/api/readiness/skip");
      setCard((current) => (current ? { ...current, mode: "quiet" } : current));
    } finally {
      setPending(false);
    }
  }

  async function saveOutcome(result: OutcomeChoice, examDate: string | null) {
    await postJson("/api/readiness/outcome", { result, examDate });
    if (result === "not_yet") {
      router.push(ROUTES.readiness);
      return;
    }
    router.refresh();
    const res = await fetch("/api/readiness", { cache: "no-store" });
    if (res.ok) setCard((await res.json()) as CardPayload);
  }

  if (failed) {
    return (
      <CardShell>
        <p className={dbUi.eyebrow}>Readiness</p>
        <p className="mt-2 text-[15px] text-[var(--color-ink-muted)]">
          Readiness couldn&apos;t load just now. The rest of your day is ready.
        </p>
      </CardShell>
    );
  }

  if (!card) return <CardSkeleton />;

  if (card.mode === "outcome") {
    return (
      <CardShell>
        <ExamOutcomeForm examName={examName} examDate={card.examDate} compact onSubmit={saveOutcome} />
      </CardShell>
    );
  }

  if (card.mode === "resume" && card.resume) {
    return (
      <CardShell>
        <p className={dbUi.eyebrow}>Readiness check</p>
        <h2 className="mt-1 text-[22px] font-semibold tracking-[-0.03em] text-[var(--color-ink)]">
          Pick up where you left off
        </h2>
        <p className="mt-1 text-[15px] text-[var(--color-ink-muted)]">
          {card.resume.answered} of {card.resume.total} answered
        </p>
        <button type="button" className={cn(dbUi.primaryBtn, "mt-4 min-h-11")} disabled={pending} onClick={() => void start(false)}>
          {pending ? "Opening…" : "Continue"}
        </button>
      </CardShell>
    );
  }

  if (card.mode === "result" && card.result) {
    const retakeLabel = card.result.retakeDue
      ? "Retake check"
      : "Retake now";
    const retakeHint = card.result.retakeDue
      ? "It's been about two weeks. A new check shows what moved."
      : card.result.daysUntilSuggest
        ? `A new check is most useful in ${card.result.daysUntilSuggest} ${card.result.daysUntilSuggest === 1 ? "day" : "days"}. You can retake sooner.`
        : "You can retake whenever you want a fresh read.";
    return (
      <CardShell>
        <div className="flex flex-wrap items-center gap-2">
          <p className={dbUi.eyebrow}>Readiness</p>
          {card.result.overallLabel ? (
            <span className="rounded-full bg-[var(--color-accent)]/10 px-2.5 py-1 text-[11px] font-semibold text-[var(--color-accent)]">
              {card.result.overallLabel}
            </span>
          ) : null}
        </div>
        <h2 className="mt-2 text-[22px] font-semibold leading-snug tracking-[-0.03em] text-[var(--color-ink)] sm:text-[26px]">
          {card.result.summaryLine ?? "Your latest check is ready."}
        </h2>
        {card.outcome?.result === "not_yet" ? (
          <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-ink-muted)]">
            Didn&apos;t pass yet is a starting point. Your areas and a new check are on the readiness page.
          </p>
        ) : (
          <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-ink-muted)]">{retakeHint}</p>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Link href={ROUTES.readiness} className={cn(dbUi.primaryBtn, "min-h-11")}>
            See progress
          </Link>
          {card.hasStudyAccess ? (
            <button type="button" className={cn(dbUi.ghostBtn, "min-h-11")} disabled={pending} onClick={() => void start(false)}>
              {pending ? "Starting…" : retakeLabel}
            </button>
          ) : (
            <Link href={ROUTES.pricing} className={cn(dbUi.ghostBtn, "min-h-11")}>
              Study access to retake
            </Link>
          )}
        </div>
      </CardShell>
    );
  }

  if (card.mode === "quiet") {
    return (
      <CardShell>
        <div className="flex min-h-[128px] flex-wrap items-center justify-between gap-3">
          <div>
            <p className={dbUi.eyebrow}>Readiness</p>
            <p className="mt-1 text-[17px] font-semibold tracking-tight text-[var(--color-ink)]">
              Baseline check, whenever you want it
            </p>
          </div>
          {card.hasStudyAccess ? (
            <button type="button" className={cn(dbUi.ghostBtn, "min-h-11")} disabled={pending} onClick={() => void start(false)}>
              {pending ? "Starting…" : "Start"}
            </button>
          ) : (
            <Link href={ROUTES.pricing} className={cn(dbUi.ghostBtn, "min-h-11")}>
              View plans
            </Link>
          )}
        </div>
      </CardShell>
    );
  }

  return (
    <CardShell>
      <p className={dbUi.eyebrow}>Readiness</p>
      <h2 className="mt-1 text-[26px] font-semibold tracking-[-0.035em] text-[var(--color-ink)] sm:text-[30px]">
        See where you stand
      </h2>
      <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-[var(--color-ink-muted)]">
        {card.length} questions across this board, once at the start. You&apos;ll get a plain level for each area. It&apos;s a baseline, not a prediction of passing.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {card.hasStudyAccess ? (
          <button type="button" className={cn(dbUi.primaryBtn, "min-h-11")} disabled={pending} onClick={() => void start(false)}>
            {pending ? "Building your check…" : "Start baseline"}
          </button>
        ) : (
          <Link href={ROUTES.pricing} className={cn(dbUi.primaryBtn, "min-h-11")}>
            View plans
          </Link>
        )}
        <button type="button" className={cn(dbUi.ghostBtn, "min-h-11")} disabled={pending} onClick={() => void skip()}>
          Not now
        </button>
      </div>
    </CardShell>
  );
}
