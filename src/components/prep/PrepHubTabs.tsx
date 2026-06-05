"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ExamHubMeta } from "@/lib/exams/catalog";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

const TABS = [
  { id: "bank", label: "Question Bank" },
  { id: "flashcards", label: "Flashcards" },
  { id: "topics", label: "Topics" },
  { id: "practice", label: "Practice Exam" },
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

  async function startPractice() {
    if (exam.slug === "top500") {
      router.push("/study/drugs300");
      return;
    }
    setStarting(true);
    try {
      const res = await fetch("/api/exam-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ examType: exam.slug, questionCount: 40 }),
      });
      const data = await res.json();
      if (data.redirectUrl) router.push(data.redirectUrl);
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
                  Search and filter thousands of board-style items for {exam.title}.
                </p>
                <Button href={`/study/practice?field=${exam.fieldId}`}>
                  Open question bank
                </Button>
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
            <h3 className="text-lg font-semibold">Timed practice exam</h3>
            <p className="mt-2 text-sm text-slate-600">
              40 questions · realistic interface · auto-saved answers
            </p>
            <Button className="mt-6" onClick={startPractice} disabled={starting}>
              {starting ? "Starting…" : "Start new exam"}
            </Button>
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
