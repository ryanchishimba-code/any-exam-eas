"use client";

import { useCallback, useEffect, useState } from "react";
import { X, Plus, Trash2, Pencil, History, AlertTriangle, Eye, EyeOff } from "lucide-react";
import { InlineError } from "@/components/ui/StatusMessage";
import { QuestionStudentPreview } from "@/components/admin/questions/QuestionStudentPreview";
import type { AdminQuestionDetail } from "@/lib/admin/question-bank-admin";

const STATUS_BADGE: Record<string, string> = {
  approved: "bg-green-50 text-green-700 border-green-200",
  pending: "bg-amber-50 text-amber-800 border-amber-200",
  flagged: "bg-orange-50 text-orange-800 border-orange-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
};

export function QuestionDetailDrawer({
  id,
  canEdit,
  canPublish,
  onClose,
  onSaved,
}: {
  id: string;
  canEdit: boolean;
  canPublish: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [detail, setDetail] = useState<AdminQuestionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // editable draft state
  const [question, setQuestion] = useState("");
  const [scenario, setScenario] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [explanation, setExplanation] = useState("");
  const [difficulty, setDifficulty] = useState<number | "">("");
  const [blueprintDomain, setBlueprintDomain] = useState("");
  const [blueprintTopic, setBlueprintTopic] = useState("");
  const [tags, setTags] = useState("");
  const [note, setNote] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);

  const seedEditState = useCallback((d: AdminQuestionDetail) => {
    setQuestion(d.question);
    setScenario(d.scenario ?? "");
    setOptions(d.options.length ? d.options : ["", ""]);
    const idx = d.options.findIndex(
      (o) => o.toLowerCase() === d.correctAnswer.toLowerCase()
    );
    setCorrectIndex(idx >= 0 ? idx : 0);
    setExplanation(d.explanation);
    setDifficulty(d.difficulty ?? "");
    setBlueprintDomain(d.blueprintDomain ?? "");
    setBlueprintTopic(d.blueprintTopic ?? "");
    setTags(d.tags.join(", "));
    setNote("");
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/internal/questions/bank/${id}`, {
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      setDetail(data as AdminQuestionDetail);
      seedEditState(data as AdminQuestionDetail);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [id, seedEditState]);

  useEffect(() => {
    void load();
  }, [load]);

  async function patch(body: Record<string, unknown>, successMsg = "Saved.") {
    setSaving(true);
    setActionMsg(null);
    try {
      const res = await fetch(`/api/internal/questions/bank/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      setDetail(data.question as AdminQuestionDetail);
      seedEditState(data.question as AdminQuestionDetail);
      setEditing(false);
      setActionMsg(successMsg);
      onSaved();
    } catch (e) {
      setActionMsg(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  }

  function saveEdits() {
    const cleaned = options.map((o) => o.trim()).filter(Boolean);
    const correctAnswer = (options[correctIndex] ?? "").trim();
    void patch({
      question,
      scenario: scenario.trim() || null,
      options: cleaned,
      correctAnswer,
      explanation,
      difficulty: difficulty === "" ? null : Number(difficulty),
      blueprintDomain: blueprintDomain.trim() || null,
      blueprintTopic: blueprintTopic.trim() || null,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      note: note.trim() || undefined,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-black/30"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="relative z-10 flex h-full w-full max-w-2xl flex-col overflow-y-auto bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-black/[0.08] bg-white px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold">Question detail</h2>
            {detail ? (
              <p className="text-xs text-black/50">
                {detail.examName} · {detail.subjectId} · {detail.itemType}
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            {detail && canEdit && !editing ? (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="inline-flex items-center gap-1 rounded-full border border-black/[0.1] px-3 py-1.5 text-sm font-medium"
              >
                <Pencil size={14} /> Edit
              </button>
            ) : null}
            <button type="button" onClick={onClose} className="rounded-lg p-1.5 hover:bg-black/[0.05]">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-6 px-6 py-5">
          {loading ? <p className="text-sm text-black/50">Loading…</p> : null}
          {error ? <InlineError>{error}</InlineError> : null}

          {detail && !loading ? (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                    STATUS_BADGE[detail.reviewStatus ?? "pending"] ??
                    "border-black/10 bg-black/[0.04] text-black/60"
                  }`}
                >
                  {detail.reviewStatus ?? "unreviewed"}
                </span>
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                    detail.qaPassed
                      ? "border-green-200 bg-green-50 text-green-700"
                      : "border-black/10 bg-black/[0.04] text-black/60"
                  }`}
                >
                  {detail.qaPassed ? "QA passed" : "QA not passed"}
                </span>
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                    detail.active
                      ? "border-blue-200 bg-blue-50 text-blue-700"
                      : "border-black/10 bg-black/[0.04] text-black/60"
                  }`}
                >
                  {detail.active ? "Active" : "Archived"}
                </span>
                {detail.qualityScore != null ? (
                  <span className="rounded-full border border-purple-200 bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-700">
                    Quality {detail.qualityScore}
                  </span>
                ) : null}
                {detail.reports.some((r) => r.status === "open") ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700">
                    <AlertTriangle size={12} />
                    {detail.reports.filter((r) => r.status === "open").length} open report(s)
                  </span>
                ) : null}
              </div>

              {editing ? (
                <EditFields
                  question={question}
                  setQuestion={setQuestion}
                  scenario={scenario}
                  setScenario={setScenario}
                  options={options}
                  setOptions={setOptions}
                  correctIndex={correctIndex}
                  setCorrectIndex={setCorrectIndex}
                  explanation={explanation}
                  setExplanation={setExplanation}
                  difficulty={difficulty}
                  setDifficulty={setDifficulty}
                  blueprintDomain={blueprintDomain}
                  setBlueprintDomain={setBlueprintDomain}
                  blueprintTopic={blueprintTopic}
                  setBlueprintTopic={setBlueprintTopic}
                  tags={tags}
                  setTags={setTags}
                  note={note}
                  setNote={setNote}
                />
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wide text-black/45">
                      Student preview
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowAnswer((v) => !v)}
                      className="inline-flex items-center gap-1 text-xs font-medium text-[var(--color-accent)]"
                    >
                      {showAnswer ? <EyeOff size={14} /> : <Eye size={14} />}
                      {showAnswer ? "Hide answer" : "Show answer"}
                    </button>
                  </div>
                  <QuestionStudentPreview
                    scenario={detail.scenario ?? undefined}
                    stem={detail.question}
                    options={detail.options}
                    correctAnswer={detail.correctAnswer}
                    explanation={detail.explanation}
                    diagramUrl={diagramFromMeta(detail.generationMeta)}
                    examLabel={detail.examName}
                    revealed={showAnswer}
                  />
                  <ReadView detail={detail} />
                </>
              )}

              {actionMsg ? (
                <p className="text-sm text-[var(--color-ink-muted)]">{actionMsg}</p>
              ) : null}

              {!editing ? (
                <>
                  <ReportsSection detail={detail} />
                  <HistorySection detail={detail} />
                </>
              ) : null}
            </>
          ) : null}
        </div>

        {detail && !loading ? (
          <div className="sticky bottom-0 z-10 flex flex-wrap justify-end gap-2 border-t border-black/[0.08] bg-white px-6 py-4">
            {editing ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    seedEditState(detail);
                  }}
                  className="rounded-full border border-black/[0.1] px-4 py-2 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={saveEdits}
                  className="rounded-full bg-[var(--color-accent)] px-5 py-2 text-sm font-medium text-white disabled:opacity-60"
                >
                  {saving ? "Saving…" : "Save changes"}
                </button>
              </>
            ) : canPublish ? (
              <>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => void patch({ reviewStatus: "approved", active: true }, "Approved.")}
                  className="rounded-full bg-green-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
                >
                  Approve
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => void patch({ reviewStatus: "flagged" }, "Flagged.")}
                  className="rounded-full border border-orange-300 bg-orange-50 px-4 py-2 text-sm font-medium text-orange-800 disabled:opacity-60"
                >
                  Flag
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => void patch({ reviewStatus: "rejected", active: false }, "Rejected.")}
                  className="rounded-full border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 disabled:opacity-60"
                >
                  Reject
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() =>
                    void patch({ active: !detail.active }, detail.active ? "Archived." : "Restored.")
                  }
                  className="rounded-full border border-black/[0.1] px-4 py-2 text-sm font-medium disabled:opacity-60"
                >
                  {detail.active ? "Archive" : "Restore"}
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() =>
                    void patch(
                      { qaPassed: !detail.qaPassed },
                      detail.qaPassed ? "QA flag removed." : "Marked QA passed."
                    )
                  }
                  className="rounded-full border border-black/[0.1] px-4 py-2 text-sm font-medium disabled:opacity-60"
                >
                  {detail.qaPassed ? "Unmark QA" : "Mark QA passed"}
                </button>
              </>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function diagramFromMeta(meta: Record<string, unknown> | null): string | null {
  if (!meta || typeof meta.diagramUrl !== "string") return null;
  return meta.diagramUrl;
}

function ReadView({ detail }: { detail: AdminQuestionDetail }) {
  return (
    <div className="space-y-4">
      {detail.scenario ? (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-black/45">Scenario</p>
          <p className="mt-1 whitespace-pre-wrap text-sm">{detail.scenario}</p>
        </div>
      ) : null}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-black/45">Stem</p>
        <p className="mt-1 whitespace-pre-wrap text-sm font-medium">{detail.question}</p>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-black/45">Options</p>
        <ul className="mt-2 space-y-1.5">
          {detail.options.map((o) => {
            const correct = o.toLowerCase() === detail.correctAnswer.toLowerCase();
            return (
              <li
                key={o}
                className={`rounded-lg border px-3 py-2 text-sm ${
                  correct
                    ? "border-green-300 bg-green-50 font-medium text-green-800"
                    : "border-black/[0.08]"
                }`}
              >
                {o}
                {correct ? " ✓" : ""}
              </li>
            );
          })}
        </ul>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-black/45">Rationale</p>
        <p className="mt-1 whitespace-pre-wrap text-sm">{detail.explanation}</p>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <Meta label="Difficulty" value={detail.difficulty?.toString() ?? "—"} />
        <Meta label="Source" value={detail.source} />
        <Meta label="Blueprint" value={detail.blueprintDomain ?? "—"} />
        <Meta label="Topic" value={detail.blueprintTopic ?? "—"} />
        {detail.taskCategory ? <Meta label="Task" value={detail.taskCategory} /> : null}
        {detail.patientAgeGroup ? <Meta label="Age group" value={detail.patientAgeGroup} /> : null}
      </div>
      {detail.tags.length ? (
        <div className="flex flex-wrap gap-1.5">
          {detail.tags.map((t) => (
            <span key={t} className="rounded-full bg-black/[0.05] px-2 py-0.5 text-xs text-black/60">
              {t}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-black/45">{label}</p>
      <p className="mt-0.5">{value}</p>
    </div>
  );
}

function ReportsSection({ detail }: { detail: AdminQuestionDetail }) {
  if (!detail.reports.length) return null;
  return (
    <div className="rounded-xl border border-black/[0.08] p-4">
      <p className="flex items-center gap-1.5 text-sm font-semibold">
        <AlertTriangle size={14} className="text-orange-600" /> Reports ({detail.reports.length})
      </p>
      <ul className="mt-3 space-y-2">
        {detail.reports.map((r) => (
          <li key={r.id} className="rounded-lg bg-black/[0.02] px-3 py-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-medium">{r.reason}</span>
              <span className="uppercase text-black/45">{r.status}</span>
            </div>
            {r.message ? <p className="mt-1 text-black/60">{r.message}</p> : null}
            {r.issueSummary ? (
              <p className="mt-1 italic text-black/50">{r.issueSummary}</p>
            ) : null}
            <p className="mt-1 text-black/40">{new Date(r.createdAt).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function HistorySection({ detail }: { detail: AdminQuestionDetail }) {
  if (!detail.history.length) return null;
  return (
    <div className="rounded-xl border border-black/[0.08] p-4">
      <p className="flex items-center gap-1.5 text-sm font-semibold">
        <History size={14} /> Edit history ({detail.history.length})
      </p>
      <ul className="mt-3 space-y-3">
        {detail.history.map((h) => (
          <li key={h.id} className="text-xs">
            <div className="flex items-center justify-between">
              <span className="font-medium">{h.action.replace(/_/g, " ").toLowerCase()}</span>
              <span className="text-black/40">{new Date(h.createdAt).toLocaleString()}</span>
            </div>
            <p className="text-black/50">{h.actorName ?? h.actorEmail ?? "system"}</p>
            {h.note ? <p className="mt-0.5 italic text-black/50">“{h.note}”</p> : null}
            {h.changes ? (
              <ul className="mt-1 space-y-1">
                {Object.entries(h.changes).map(([field, diff]) => (
                  <li
                    key={field}
                    className="rounded-md border border-black/[0.06] bg-black/[0.02] px-2 py-1"
                  >
                    <span className="font-medium">{field}</span>
                    <div className="mt-0.5 grid gap-0.5">
                      <span className="text-red-600 line-through">{formatDiff(diff.before)}</span>
                      <span className="text-green-700">{formatDiff(diff.after)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

function formatDiff(value: unknown): string {
  if (value == null) return "—";
  if (Array.isArray(value)) return value.join(" | ");
  const s = String(value);
  return s.length > 160 ? `${s.slice(0, 160)}…` : s;
}

function EditFields(props: {
  question: string;
  setQuestion: (v: string) => void;
  scenario: string;
  setScenario: (v: string) => void;
  options: string[];
  setOptions: (v: string[]) => void;
  correctIndex: number;
  setCorrectIndex: (v: number) => void;
  explanation: string;
  setExplanation: (v: string) => void;
  difficulty: number | "";
  setDifficulty: (v: number | "") => void;
  blueprintDomain: string;
  setBlueprintDomain: (v: string) => void;
  blueprintTopic: string;
  setBlueprintTopic: (v: string) => void;
  tags: string;
  setTags: (v: string) => void;
  note: string;
  setNote: (v: string) => void;
}) {
  const {
    question,
    setQuestion,
    scenario,
    setScenario,
    options,
    setOptions,
    correctIndex,
    setCorrectIndex,
    explanation,
    setExplanation,
    difficulty,
    setDifficulty,
    blueprintDomain,
    setBlueprintDomain,
    blueprintTopic,
    setBlueprintTopic,
    tags,
    setTags,
    note,
    setNote,
  } = props;

  function setOption(i: number, value: string) {
    setOptions(options.map((o, idx) => (idx === i ? value : o)));
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm">
        <span className="mb-1 block font-medium">Scenario / vignette</span>
        <textarea
          value={scenario}
          onChange={(e) => setScenario(e.target.value)}
          rows={2}
          className="apple-input w-full"
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium">Stem</span>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={3}
          className="apple-input w-full"
        />
      </label>
      <div className="text-sm">
        <span className="mb-1 block font-medium">Options · select correct</span>
        <div className="space-y-2">
          {options.map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="radio"
                name="edit-correct"
                checked={correctIndex === i}
                onChange={() => setCorrectIndex(i)}
                className="h-4 w-4 shrink-0"
              />
              <input
                value={opt}
                onChange={(e) => setOption(i, e.target.value)}
                className="apple-input w-full"
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => {
                    setOptions(options.filter((_, idx) => idx !== i));
                    if (correctIndex === i) setCorrectIndex(0);
                  }}
                  className="rounded-lg p-1.5 text-black/40 hover:bg-black/[0.05] hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setOptions([...options, ""])}
          className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[var(--color-accent)]"
        >
          <Plus size={14} /> Add option
        </button>
      </div>
      <label className="block text-sm">
        <span className="mb-1 block font-medium">Rationale</span>
        <textarea
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          rows={4}
          className="apple-input w-full"
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Difficulty</span>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value === "" ? "" : Number(e.target.value))}
            className="apple-input w-full"
          >
            <option value="">—</option>
            {[1, 2, 3, 4, 5].map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="mb-1 block font-medium">Tags (comma separated)</span>
          <input value={tags} onChange={(e) => setTags(e.target.value)} className="apple-input w-full" />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Blueprint category</span>
          <input
            value={blueprintDomain}
            onChange={(e) => setBlueprintDomain(e.target.value)}
            className="apple-input w-full"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Blueprint topic</span>
          <input
            value={blueprintTopic}
            onChange={(e) => setBlueprintTopic(e.target.value)}
            className="apple-input w-full"
          />
        </label>
      </div>
      <label className="block text-sm">
        <span className="mb-1 block font-medium">Edit note (optional, logged)</span>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="apple-input w-full"
          placeholder="Why are you making this change?"
        />
      </label>
    </div>
  );
}
