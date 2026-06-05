"use client";

import { useCallback, useEffect, useState } from "react";
import { Flag, Share2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ShareModal } from "@/components/share/ShareModal";
import { EndExamControl } from "@/components/study/EndExamControl";
import type { ActivitySessionSummary } from "@/lib/client/exam-session-summary";
import {
  buildWeakAreasFromField,
  calculateExamScorePercent,
  mergeExamAnswers,
} from "@/lib/exam-sessions/scoring";
import type { ExamAnswerRecord } from "@/lib/exam-sessions/service";

type Question = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
};

type TimedPracticeExamProps = {
  sessionId: string;
  examType: string;
  fieldId: string;
  subjectId: string;
};

export function TimedPracticeExam({
  sessionId,
  examType,
  fieldId,
  subjectId,
}: TimedPracticeExamProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [review, setReview] = useState(false);
  const [finished, setFinished] = useState(false);
  const [answerLog, setAnswerLog] = useState<ExamAnswerRecord[]>([]);
  const [secondsLeft, setSecondsLeft] = useState(3600);
  const [shareOpen, setShareOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!subjectId) {
      setLoading(false);
      return;
    }
    fetch(`/api/questions?field=${fieldId}&subjectId=${subjectId}&limit=40`)
      .then((r) => r.json())
      .then((d) => {
        const bankIds: string[] = d.bankItemIds ?? [];
        const items = (d.questions ?? []).map(
          (
            q: {
              id: number;
              question: string;
              options: string[];
              correctAnswer: string;
              explanation: string;
            },
            i: number
          ) => ({
            id: bankIds[i] ?? String(q.id),
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
          })
        );
        setQuestions(items);
      })
      .finally(() => setLoading(false));
  }, [fieldId, subjectId]);

  useEffect(() => {
    if (finished || loading) return;
    const t = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [finished, loading]);

  const persistAnswer = useCallback(
    async (correct: boolean, choice: string) => {
      await fetch(`/api/exam-sessions/${sessionId}/answer`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionIndex: index,
          questionId: questions[index]?.id,
          selected: choice,
          correct,
          flagged: flagged.has(index),
        }),
      });
    },
    [sessionId, index, questions, flagged]
  );

  async function finishExam(finalScore: number, endedEarly = false) {
    const log = endedEarly ? answersForScore() : answerLog;
    const weakAreas = buildWeakAreasFromField(fieldId, log);
    const res = await fetch(`/api/exam-sessions/${sessionId}/answer`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        complete: true,
        endedEarly,
        score: finalScore,
        weakAreas,
        analysis: endedEarly
          ? {
              summary: "Session ended early. Progress saved.",
              answered: log.length,
              total: questions.length,
            }
          : { summary: "Practice session complete. Review flagged items." },
      }),
    });
    if (!res.ok) {
      throw new Error("Could not save exam progress.");
    }
    if (!endedEarly) {
      setFinished(true);
      setReview(true);
    }
  }

  async function exitExamEarly(): Promise<ActivitySessionSummary> {
    const log = answersForScore();
    setAnswerLog(log);
    const pct = calculateExamScorePercent(log, questions.length);
    const correct = log.filter((a) => a.correct).length;
    await finishExam(pct, true);
    return {
      title: `${examType.toUpperCase()} timed practice`,
      activityType: "exam",
      examType,
      answered: log.length,
      total: questions.length,
      correct,
      accuracy: pct,
      endedEarly: true,
      timed: true,
      timeRemainingSec: secondsLeft,
      flaggedCount: flagged.size,
    };
  }

  function submitChoice(choice: string) {
    setSelected(choice);
    const correct = choice === questions[index]?.correctAnswer;
    const record: ExamAnswerRecord = {
      questionIndex: index,
      questionId: questions[index]?.id,
      selected: choice,
      correct,
      flagged: flagged.has(index),
      answeredAt: new Date().toISOString(),
    };
    setAnswerLog((prev) => mergeExamAnswers(prev, record));
    void persistAnswer(correct, choice);
  }

  function answersForScore(): ExamAnswerRecord[] {
    if (!selected) return answerLog;
    const correct = selected === questions[index]?.correctAnswer;
    return mergeExamAnswers(answerLog, {
      questionIndex: index,
      questionId: questions[index]?.id,
      selected,
      correct,
      flagged: flagged.has(index),
      answeredAt: new Date().toISOString(),
    });
  }

  function next() {
    if (index + 1 >= questions.length) {
      const log = answersForScore();
      const pct = calculateExamScorePercent(log, questions.length);
      setAnswerLog(log);
      void finishExam(pct);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
  }

  if (loading) {
    return <p className="py-20 text-center text-slate-500">Loading exam…</p>;
  }

  if (!questions.length) {
    return (
      <p className="py-20 text-center text-slate-500">
        No questions available for this exam yet.
      </p>
    );
  }

  const q = questions[index];
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-slate-950/95 px-4 py-3 backdrop-blur">
        <span className="font-mono text-sm tabular-nums">
          {mins}:{secs.toString().padStart(2, "0")}
        </span>
        <span className="text-sm text-slate-400">
          {index + 1} / {questions.length}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-lg p-2 hover:bg-white/10"
            onClick={() =>
              setFlagged((f) => {
                const n = new Set(f);
                if (n.has(index)) n.delete(index);
                else n.add(index);
                return n;
              })
            }
            aria-label="Flag for review"
          >
            <Flag className={flagged.has(index) ? "fill-amber-400 text-amber-400" : ""} />
          </button>
          <button
            type="button"
            className="rounded-lg p-2 hover:bg-white/10"
            onClick={() => setShareOpen(true)}
            aria-label="Share"
          >
            <Share2 className="h-4 w-4" />
          </button>
          {!finished && <EndExamControl variant="dark" onConfirm={exitExamEarly} />}
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8">
        {review && finished ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Exam complete</h2>
            <p className="text-slate-300">
              Score: {calculateExamScorePercent(answersForScore(), questions.length)}% (
              {answersForScore().filter((a) => a.correct).length}/{questions.length}{" "}
              correct)
            </p>
            <div className="space-y-4 rounded-xl bg-white/5 p-4">
              <p className="font-medium">{q.question}</p>
              <p className="text-sm text-emerald-400">Answer: {q.correctAnswer}</p>
              <p className="text-sm text-slate-400">{q.explanation}</p>
            </div>
            <Button href={`/prep/${examType}`} variant="secondary">
              Back to hub
            </Button>
          </div>
        ) : (
          <>
            <p className="whitespace-pre-wrap text-lg leading-relaxed">{q.question}</p>
            <ul className="mt-8 space-y-3">
              {q.options.map((opt) => (
                <li key={opt}>
                  <button
                    type="button"
                    disabled={Boolean(selected)}
                    onClick={() => submitChoice(opt)}
                    className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
                      selected === opt
                        ? opt === q.correctAnswer
                          ? "border-emerald-500 bg-emerald-500/20"
                          : "border-red-500 bg-red-500/20"
                        : "border-white/15 hover:border-sky-400/50 hover:bg-white/5"
                    }`}
                  >
                    {opt}
                  </button>
                </li>
              ))}
            </ul>
            {selected && (
              <div className="mt-6">
                <p className="text-sm text-slate-400">{q.explanation}</p>
                <Button className="mt-4" onClick={next}>
                  {index + 1 >= questions.length ? "Finish exam" : "Next question"}
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        examLabel={examType.toUpperCase()}
      />
    </div>
  );
}
