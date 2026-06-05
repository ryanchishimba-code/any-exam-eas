"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Clock,
  Wand2,
  Upload,
  PenLine,
  Loader2,
} from "lucide-react";
import type { GeneratedExam } from "@/lib/ai";
import { FIELD_LABELS, DEFAULT_STUDY_FIELD_LABEL, getFieldMeta } from "@/lib/fields";
import { getSubjectsForField, buildScopedTopic } from "@/lib/field-subjects";
import {
  formatExamLengthLabel,
  getTimedExamQuestionCount,
} from "@/lib/exam/exam-lengths";
import { getFieldMetaById } from "@/lib/fields";
import { ExamQuiz } from "@/components/ExamQuiz";
import { FileDropzone } from "@/components/generate/FileDropzone";
import { QuestionPreview } from "@/components/generate/QuestionPreview";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { InlineError } from "@/components/ui/StatusMessage";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/Button";

type TabId = "topic" | "upload" | "custom";
type StudyMode = "practice" | "timed";

const PROGRESS_STEPS = [
  { at: 15, label: "Scanning sources & OER textbooks…" },
  { at: 45, label: "Synthesizing research brief…" },
  { at: 70, label: "Writing exam-quality questions…" },
  { at: 90, label: "Validating & deduplicating…" },
];

export function TestGenerator() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<TabId>("topic");
  const [field, setField] = useState(DEFAULT_STUDY_FIELD_LABEL);
  const [subjectId, setSubjectId] = useState("");
  const [topic, setTopic] = useState("");
  const [uploadNotes, setUploadNotes] = useState("");
  const [customOutline, setCustomOutline] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [timed, setTimed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [exam, setExam] = useState<GeneratedExam | null>(null);
  const [examId, setExamId] = useState<string | null>(null);
  const [sourcesReviewed, setSourcesReviewed] = useState<number | null>(null);
  const [previewDone, setPreviewDone] = useState(false);

  const fieldMeta = getFieldMeta(field);
  const subjects = useMemo(() => getSubjectsForField(field), [field]);
  const selectedSubject = subjects.find((s) => s.id === subjectId);
  const studyMode: StudyMode = timed ? "timed" : "practice";
  const questionCount = useMemo(() => getTimedExamQuestionCount(field), [field]);
  const lengthLabel = useMemo(() => formatExamLengthLabel(field), [field]);

  useEffect(() => {
    const fieldParam = searchParams.get("field");
    if (fieldParam) {
      const meta = getFieldMetaById(fieldParam);
      if (meta) setField(meta.label);
    }
  }, [searchParams]);

  useEffect(() => {
    const list = getSubjectsForField(field);
    if (list.length > 0) setSubjectId(list[0].id);
    else setSubjectId("");
  }, [field]);

  useEffect(() => {
    if (!loading) return;
    setProgress(5);
    const interval = setInterval(() => {
      setProgress((p) => {
        const next = p + 2 + Math.random() * 4;
        const step = [...PROGRESS_STEPS].reverse().find((s) => next >= s.at);
        if (step) setStatus(step.label);
        return Math.min(next, 92);
      });
    }, 800);
    return () => clearInterval(interval);
  }, [loading]);

  function resolveTopic(): string {
    if (!subjectId) return topic.trim();
    return buildScopedTopic(field, subjectId, topic);
  }

  function userNotesPayload(): string | undefined {
    if (tab === "upload") {
      const combined = uploadNotes.trim();
      return combined.length > 0 ? combined.slice(0, 50_000) : undefined;
    }
    if (tab === "custom") {
      return customOutline.trim().slice(0, 50_000) || undefined;
    }
    return undefined;
  }

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!subjectId) {
      setError("Select a subject for your test.");
      return;
    }
    if (tab === "upload" && !uploadNotes.trim()) {
      setError("Upload a file or paste notes to generate from.");
      return;
    }
    if (tab === "custom" && !customOutline.trim()) {
      setError("Add a custom outline or learning objectives.");
      return;
    }

    setLoading(true);
    setError("");
    setExam(null);
    setExamId(null);
    setPreviewDone(false);
    setSourcesReviewed(null);
    setStatus(PROGRESS_STEPS[0].label);

    try {
      const res = await fetch("/api/exams/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          field,
          topic: resolveTopic(),
          subjectId,
          difficulty,
          questionCount,
          userNotes: userNotesPayload(),
          generatorMode: tab,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.code === "SUBSCRIPTION_REQUIRED") {
          throw new Error("Subscribe or start a trial to generate tests.");
        }
        throw new Error(data.error ?? "Generation failed");
      }
      setProgress(100);
      setStatus("Done!");
      setExam(data.exam);
      setExamId(data.examId ?? null);
      setSourcesReviewed(data.sourcesReviewed ?? data.sources?.length ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-8">
      <Card className="overflow-hidden p-0">
        <div className="border-b border-black/[0.06] bg-gradient-to-b from-[var(--color-surface)] to-white px-6 py-6 md:px-8">
          <h2 className="text-xl font-semibold tracking-tight text-[var(--color-ink)]">
            Research exam
          </h2>
          <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
            {lengthLabel} — synthesized from OER textbooks, web sources, and your notes.
          </p>
        </div>

        <div className="p-6 md:p-8">
          <Tabs value={tab} onValueChange={(v) => setTab(v as TabId)}>
            <TabsList>
              <TabsTrigger value="topic">
                <BookOpen className="h-4 w-4" />
                From topic
              </TabsTrigger>
              <TabsTrigger value="upload">
                <Upload className="h-4 w-4" />
                Upload notes
              </TabsTrigger>
              <TabsTrigger value="custom">
                <PenLine className="h-4 w-4" />
                Custom builder
              </TabsTrigger>
            </TabsList>

            <form onSubmit={handleGenerate} className="mt-6 space-y-6">
              <TabsContent value="topic">
                <Card className="shadow-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Topic focus</CardTitle>
                    <CardDescription>
                      OER-backed research for {selectedSubject?.label ?? field}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Label htmlFor="topic-focus">Optional focus</Label>
                    <Input
                      id="topic-focus"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder={
                        selectedSubject?.focusPlaceholder ?? "e.g. Cardiac arrhythmias"
                      }
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="upload">
                <Card className="shadow-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Your materials</CardTitle>
                    <CardDescription>
                      Questions will be grounded in what you upload or paste
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FileDropzone
                      disabled={loading}
                      onText={(text) => setUploadNotes(text)}
                    />
                    <div>
                      <Label htmlFor="paste-notes">Or paste notes</Label>
                      <Textarea
                        id="paste-notes"
                        value={uploadNotes}
                        onChange={(e) => setUploadNotes(e.target.value)}
                        placeholder="Paste lecture notes, textbook excerpts, or study guides…"
                        rows={6}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="custom">
                <Card className="shadow-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Custom blueprint</CardTitle>
                    <CardDescription>
                      Learning objectives, must-cover concepts, or question style
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={customOutline}
                      onChange={(e) => setCustomOutline(e.target.value)}
                      placeholder={`Example:\n- 5 questions on pharmacokinetics (apply/analyze)\n- 5 on drug interactions\n- Emphasize calculation items`}
                      rows={8}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <Card className="shadow-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Exam settings</CardTitle>
                  <CardDescription>Applies to all generation modes</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="field">Subject / field</Label>
                    <select
                      id="field"
                      value={field}
                      onChange={(e) => setField(e.target.value)}
                      className="apple-select"
                    >
                      {FIELD_LABELS.map((f) => (
                        <option key={f}>{f}</option>
                      ))}
                    </select>
                    {fieldMeta && (
                      <p className="text-xs text-[var(--color-ink-muted)]">
                        <span className="font-medium text-[var(--color-accent)]">
                          {fieldMeta.boardExam}
                        </span>
                        {" · "}
                        {fieldMeta.examFocus}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="subject">Topic area</Label>
                    <select
                      id="subject"
                      required
                      value={subjectId}
                      onChange={(e) => setSubjectId(e.target.value)}
                      className="apple-select"
                    >
                      {subjects.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <select
                      id="difficulty"
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="apple-select"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <Label>Exam length</Label>
                    <p className="rounded-xl border border-black/[0.06] bg-[var(--color-surface)] px-4 py-3 text-sm font-medium text-[var(--color-ink)]">
                      {lengthLabel}
                    </p>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-black/[0.06] bg-[var(--color-surface)] px-4 py-3 sm:col-span-2">
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-[var(--color-ink-muted)]" />
                      <div>
                        <p className="text-sm font-medium text-[var(--color-ink)]">Timed exam</p>
                        <p className="text-xs text-[var(--color-ink-muted)]">
                          45 seconds per question
                        </p>
                      </div>
                    </div>
                    <Switch checked={timed} onCheckedChange={setTimed} id="timed" />
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <Button
                  type="submit"
                  disabled={loading || !subjectId}
                  className="w-full !rounded-xl !py-3.5"
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating…
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      <Wand2 className="h-4 w-4" />
                      Generate research exam
                    </span>
                  )}
                </Button>

                <AnimatePresence>
                  {loading && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden rounded-xl border border-black/[0.06] bg-[var(--color-surface)] p-4"
                    >
                      <Progress value={progress} className="mb-2" />
                      <p className="text-center text-xs text-[var(--color-ink-muted)]">{status}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {error && (
                  <InlineError className="text-center">{error}</InlineError>
                )}
              </div>
            </form>
          </Tabs>

          <AnimatePresence>
            {exam && !previewDone && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <QuestionPreview
                  exam={exam}
                  sourcesReviewed={sourcesReviewed}
                  timed={timed}
                  onStart={() => setPreviewDone(true)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {exam && previewDone && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <Badge className="border-[var(--color-accent)]/20 bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                  Live session
                </Badge>
                {timed && <Badge>Timed · 45s/Q</Badge>}
              </div>
              <ExamQuiz
                key={`${exam.title}-${exam.questions.length}-${studyMode}`}
                exam={exam}
                examId={examId ?? undefined}
                mode={studyMode}
              />
            </motion.div>
          )}
        </div>
      </Card>
    </div>
  );
}
