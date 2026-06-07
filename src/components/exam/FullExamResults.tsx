"use client";

import { useState } from "react";
import Link from "next/link";
import { Award, Clock, RotateCcw, ChevronDown, ChevronUp, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import { formatMmSs } from "@/lib/full-exam/config";
import { fullExamHref, ROUTES } from "@/lib/routes";
import type { ExamSlug } from "@/types/edtech";
import type { FullExamQuestion, FullExamResultsAnalysis } from "@/types/full-exam";
import type { ExamAnswerRecord } from "@/lib/exam-sessions/service";
import { cn } from "@/lib/utils";

type Props = {
  examSlug: ExamSlug;
  sessionId: string;
  score: number;
  analysis: FullExamResultsAnalysis;
  answers: ExamAnswerRecord[];
  questions: FullExamQuestion[];
};

export function FullExamResults({
  examSlug,
  sessionId,
  score,
  analysis,
  answers,
  questions,
}: Props) {
  const exam = EXAM_CATALOG[examSlug];
  const correct = answers.filter((a) => a.correct).length;
  const [reviewOpen, setReviewOpen] = useState(false);
  const [expandedQ, setExpandedQ] = useState<number | null>(null);

  const scoreColor =
    score >= 80 ? "text-teal-600" : score >= 65 ? "text-amber-600" : "text-rose-600";

  return (
    <div className="space-y-8">
      <header className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50">
          <Award className="h-8 w-8 text-teal-600" aria-hidden />
        </div>
        <h1 className="mt-4 text-3xl font-semibold text-slate-900">Exam complete</h1>
        <p className="mt-2 text-slate-600">{analysis.summary}</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Score" value={`${score}%`} valueClass={scoreColor} />
        <StatCard
          label="Correct"
          value={`${correct} / ${questions.length}`}
        />
        <StatCard
          label="Time used"
          value={formatMmSs(analysis.timeUsedSec)}
          icon={Clock}
        />
      </div>

      {analysis.topicBreakdown.length > 0 ? (
        <Card className="border-slate-200/80">
          <CardHeader>
            <CardTitle className="text-lg">Topic breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analysis.topicBreakdown.map((t) => (
              <div key={t.topic}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-medium text-slate-800">{t.topic}</span>
                  <span className="text-slate-500">
                    {t.correct}/{t.total} ({t.pct}%)
                  </span>
                </div>
                <Progress value={t.pct} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href={fullExamHref(examSlug)}
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-95"
        >
          <RotateCcw className="h-4 w-4" /> New simulation
        </Link>
        <Link
          href={ROUTES.dashboard}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
        >
          Back to Dashboard
        </Link>
        <button
          type="button"
          onClick={() => setReviewOpen((v) => !v)}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
        >
          {reviewOpen ? (
            <>
              <ChevronUp className="h-4 w-4" /> Hide review
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" /> Review all with rationales
            </>
          )}
        </button>
      </div>

      {reviewOpen ? (
        <div className="space-y-3">
          {questions.map((q, i) => {
            const ans = answers.find((a) => a.questionIndex === i);
            const isCorrect = ans?.correct ?? false;
            const expanded = expandedQ === i;

            return (
              <Card key={q.id} className="border-slate-200/80">
                <button
                  type="button"
                  className="flex w-full items-start gap-3 p-4 text-left"
                  onClick={() => setExpandedQ(expanded ? null : i)}
                >
                  {isCorrect ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal-600" />
                  ) : (
                    <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase text-slate-400">
                      Question {i + 1}
                      {ans?.flagged ? " · Flagged" : ""}
                    </p>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-800">{q.question}</p>
                  </div>
                  {expanded ? (
                    <ChevronUp className="h-4 w-4 shrink-0 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
                  )}
                </button>
                {expanded ? (
                  <CardContent className="border-t border-slate-100 pt-0">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                      {q.question}
                    </p>
                    <p className="mt-4 text-sm">
                      <span className="font-semibold text-slate-600">Your answer: </span>
                      <span className={isCorrect ? "text-teal-700" : "text-rose-700"}>
                        {ans?.selected ?? "—"}
                      </span>
                    </p>
                    <p className="mt-2 text-sm">
                      <span className="font-semibold text-slate-600">Correct: </span>
                      <span className="text-teal-800">{q.correctAnswer}</span>
                    </p>
                    <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Rationale
                      </p>
                      {q.explanation}
                    </div>
                  </CardContent>
                ) : null}
              </Card>
            );
          })}
        </div>
      ) : null}

      <p className="text-center text-xs text-slate-400">
        Session {sessionId.slice(0, 8)}… · {exam.name}
      </p>
    </div>
  );
}

function StatCard({
  label,
  value,
  valueClass,
  icon: Icon,
}: {
  label: string;
  value: string;
  valueClass?: string;
  icon?: typeof Clock;
}) {
  return (
    <Card className="border-slate-200/80 text-center">
      <CardContent className="pt-6">
        {Icon ? <Icon className="mx-auto mb-2 h-5 w-5 text-slate-400" /> : null}
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
        <p className={cn("mt-1 text-3xl font-bold tabular-nums", valueClass ?? "text-slate-900")}>
          {value}
        </p>
      </CardContent>
    </Card>
  );
}
