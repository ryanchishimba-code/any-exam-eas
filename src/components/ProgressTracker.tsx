"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChartLine, Layers, BookOpen, CheckCircle2 } from "lucide-react";
import { InlineError } from "@/components/ui/StatusMessage";

type ProgressSummary = {
  totalEvents: number;
  examsCompleted: number;
  quiltSessions: number;
  avgScorePercent: number | null;
};

type ProgressEvent = {
  id: string;
  entityType: string;
  entityId: string;
  score: number | null;
  completed: boolean;
  metadata: { action?: string; title?: string; field?: string } | null;
  createdAt: string;
};

type ProgressData = {
  summary: ProgressSummary;
  recent: ProgressEvent[];
  exams: { id: string; title: string; field: string; topic: string; questionCount: number; createdAt: string }[];
  quilts: { id: string; title: string; field: string; topic: string; preferredMode: string; createdAt: string }[];
};

export function ProgressTracker({ embedded = false }: { embedded?: boolean }) {
  const [data, setData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/progress")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setData(d);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <p className={`text-sm text-[var(--color-ink-muted)] ${embedded ? "mt-6" : "mt-10"}`}>
        Loading progress…
      </p>
    );
  }

  if (error) {
    return (
      <InlineError className={embedded ? "mt-6" : "mt-10"}>
        {error}. <Link href="/login" className="underline">Sign in</Link> to track progress.
      </InlineError>
    );
  }

  if (!data) return null;

  const { summary, recent, exams, quilts } = data;

  return (
    <div className={embedded ? "mt-6 space-y-8" : "mt-10 space-y-10"}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={ChartLine}
          label="Study events"
          value={String(summary.totalEvents)}
        />
        <StatCard
          icon={BookOpen}
          label="Exams completed"
          value={String(summary.examsCompleted)}
        />
        <StatCard icon={Layers} label="Quilt sessions" value={String(summary.quiltSessions)} />
        <StatCard
          icon={ChartLine}
          label="Average score"
          value={summary.avgScorePercent != null ? `${summary.avgScorePercent}%` : "—"}
        />
      </div>

      {!embedded && (
        <div className="flex flex-wrap gap-3">
          <Link
            href="/learn"
            className="rounded-full bg-[var(--color-accent)] px-5 py-2 text-sm font-medium text-white"
          >
            Study flashcards
          </Link>
          <Link
            href="/study/practice?mode=timed"
            className="rounded-full border border-black/[0.08] bg-white px-5 py-2 text-sm font-medium text-[var(--color-ink)]"
          >
            Timed exam
          </Link>
        </div>
      )}

      <section className="apple-card p-8">
        <h2 className="text-xl font-semibold tracking-tight">Recent activity</h2>
        {recent.length === 0 ? (
          <p className="mt-4 text-sm text-[var(--color-ink-muted)]">
            No activity yet.{" "}
            <Link href="/study" className="text-[var(--color-accent)]">
              Start studying
            </Link>{" "}
            to build your tracker.
          </p>
        ) : (
          <ul className="mt-6 divide-y divide-black/5">
            {recent.map((e) => (
              <li key={e.id} className="flex flex-wrap items-center justify-between gap-2 py-4">
                <div>
                  <p className="font-medium capitalize">
                    {eventLabel(e)}
                  </p>
                  <p className="text-xs text-[var(--color-ink-muted)]">
                    {new Date(e.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="text-right text-sm">
                  {e.score != null && (
                    <span className="font-semibold text-[var(--color-accent)]">
                      {Math.round(e.score)}%
                    </span>
                  )}
                  {e.completed && (
                    <span className="ml-2 inline-flex items-center gap-1 font-medium text-[var(--a11y-correct-fg)]">
                      <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                      Complete
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="apple-card p-8">
          <h2 className="text-lg font-semibold">Saved exams</h2>
          {exams.length === 0 ? (
            <p className="mt-3 text-sm text-[var(--color-ink-muted)]">
              <Link href="/study/practice?mode=bank" className="text-[var(--color-accent)]">
                Open question bank
              </Link>
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {exams.map((ex) => (
                <li key={ex.id} className="text-sm">
                  <p className="font-medium">{ex.title}</p>
                  <p className="text-[var(--color-ink-muted)]">
                    {ex.field} · {ex.questionCount} questions
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="apple-card p-8">
          <h2 className="text-lg font-semibold">Learning quilts</h2>
          {quilts.length === 0 ? (
            <p className="mt-3 text-sm text-[var(--color-ink-muted)]">
              <Link href="/learn" className="text-[var(--color-accent)]">
                Build a quilt
              </Link>
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {quilts.map((q) => (
                <li key={q.id} className="text-sm">
                  <p className="font-medium">{q.title}</p>
                  <p className="text-[var(--color-ink-muted)]">
                    {q.field} · {q.preferredMode}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof ChartLine;
  label: string;
  value: string;
}) {
  return (
    <div className="apple-card p-5">
      <Icon className="text-[var(--color-accent)]" size={20} strokeWidth={1.5} />
      <p className="mt-3 text-2xl font-semibold tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-[var(--color-ink-muted)]">{label}</p>
    </div>
  );
}

function eventLabel(e: ProgressEvent): string {
  const meta = e.metadata;
  if (meta?.action === "completed" && meta.title) {
    return `Completed exam: ${meta.title}`;
  }
  if (meta?.action === "generated") {
    return `Generated exam${meta.title ? `: ${meta.title}` : ""}`;
  }
  if (e.entityType === "quilt") {
    if (meta?.action === "tile_mastered") {
      return `Mastered quilt tile${meta.field ? ` · ${meta.field}` : ""}`;
    }
    if (meta?.action === "session") {
      return `Flashcard session${meta.title ? `: ${meta.title}` : ""}`;
    }
    return "Learning quilt progress";
  }
  return `${e.entityType} ${meta?.action ?? "update"}`;
}
