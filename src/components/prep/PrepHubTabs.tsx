"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ExamHubMeta } from "@/lib/exams/catalog";
import {
  formatExamLengthLabel,
  getExamQuestionCountBySlug,
} from "@/lib/exam/exam-lengths";
import { timedExamHref, questionBankHref } from "@/lib/study-hub/config";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

const TABS = [
  { id: "bank", label: "Question Bank" },
  { id: "flashcards", label: "Flashcards" },
  { id: "topics", label: "Topics" },
  { id: "practice", label: "Timed Exam" },
  { id: "progress", label: "Progress" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function PrepHubTabs({
  exam,
  topics,
}: {
  exam: ExamHubMeta;
  topics: { slug: string; label: string; description?: string | null }[];
}) {
  const [tab, setTab] = useState<TabId>("bank");
  const router = useRouter();
  const [starting, setStarting] = useState(false);
  const [startError, setStartError] = useState("");

  async function startTimedExam() {
    if (starting) return;
    if (exam.slug === "top500") {
      router.push("/study/drugs300");
      return;
    }
    setStartError("");
    setStarting(true);
    try {
      const res = await fetch("/api/exam-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examType: exam.slug,
          questionCount: getExamQuestionCountBySlug(exam.slug),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        redirectUrl?: string;
        error?: string;
      };
      if (!res.ok) {
        setStartError(data.error ?? "Could not start timed exam");
        return;
      }
      if (data.redirectUrl) {
        router.push(data.redirectUrl);
        return;
      }
      setStartError("Session was not created. Please try again.");
    } catch (e) {
      setStartError(e instanceof Error ? e.message : "Could not start timed exam");
    } finally {
      setStarting(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition",
              tab === t.id
                ? "bg-[var(--color-accent)] text-white"
                : "text-slate-600 hover:bg-slate-100"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "bank" && (
          <div className="space-y-4">
            {exam.slug === "top500" ? (
              <>
                <p className="text-sm text-slate-600">
                  Top 500 uses spaced-repetition drug flashcards — generic, brand, class, and
                  indications.
                </p>
                <Button href="/study/drugs300">Open flashcard deck</Button>
              </>
            ) : (
              <>
                <p className="text-sm text-slate-600">
                  Choose topics, question count, and timed or untimed practice for {exam.title}.
                </p>
                <Button href={questionBankHref(exam.fieldId)}>Open question bank</Button>
              </>
            )}
          </div>
        )}
        {tab === "flashcards" && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">Spaced-repetition decks by topic.</p>
            <Button
              href={exam.slug === "top500" ? "/study/drugs300" : `/prep/${exam.slug}?tab=flashcards`}
              variant="secondary"
            >
              Study flashcards
            </Button>
          </div>
        )}
        {tab === "topics" && (
          <ul className="grid gap-3 sm:grid-cols-2">
            {topics.map((topic) => (
              <li
                key={topic.slug}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <p className="font-medium text-slate-900">{topic.label}</p>
                {topic.description && (
                  <p className="mt-1 text-xs text-slate-500">{topic.description}</p>
                )}
              </li>
            ))}
          </ul>
        )}
        {tab === "practice" && (
          <div className="rounded-2xl border border-sky-200/60 bg-gradient-to-br from-sky-50 to-white p-8 text-center">
            <h3 className="text-lg font-semibold">Timed exam</h3>
            <p className="mt-2 text-sm text-slate-600">
              {formatExamLengthLabel(exam.fieldId)} · mixed topics · auto-saved answers
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              {startError ? (
                <p className="w-full text-sm text-rose-600" role="alert">
                  {startError}
                </p>
              ) : null}
              <Button type="button" onClick={() => void startTimedExam()} disabled={starting}>
                {starting ? "Starting…" : "Start timed exam"}
              </Button>
              <Button href={timedExamHref(exam.fieldId)} variant="secondary">
                Question bank flow
              </Button>
            </div>
          </div>
        )}
        {tab === "progress" && (
          <div className="space-y-3">
            <Button href="/study-hub" variant="secondary">
              Back to Study Hub
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
